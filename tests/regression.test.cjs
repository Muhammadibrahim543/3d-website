// Offline tests only: VM has no fetch/network and Supabase is an in-memory stub.
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const { webcrypto } = require('node:crypto');
const root = path.join(__dirname, '..');
function setup({ cloud = true, role = 'customer', failure = false, signedIn = true } = {}) {
    const cache = new Map(), writes = [], uploads = [];
    const user = { id: 'offline-user', email: 'test@example.invalid', user_metadata: { full_name: 'Test User' } };
    const state = { failure, role, products: [], orders: [] };
    const sdk = {
        auth: { getSession: async () => ({ data: { session: signedIn ? { user } : null } }) },
        from(table) {
            let operation = 'read', row, field, value, returning = false;
            const query = {
                select() { returning = true; return query; }, eq(k, v) { field = k; value = v; return query; }, order() { return query; },
                single() { return query; }, insert(r) { operation = 'insert'; row = r; return query; },
                upsert(r) { operation = 'upsert'; row = r; return query; }, delete() { operation = 'delete'; return query; },
                update(r) { operation = 'update'; row = r; return query; },
                then(resolve, reject) {
                    return Promise.resolve().then(() => {
                        if (table === 'profiles') {
                            if (operation === 'update') return { data: state.profileMissing ? [] : [{ id: user.id }], error: state.failure ? new Error('Simulated backend failure') : null };
                            return { data: { full_name: 'Test User', role: state.role }, error: null };
                        }
                        if (state.failure) return { data: null, error: new Error('Simulated backend failure') };
                        if (operation === 'read') return { data: state[table].filter(r => !field || r[field] === value), error: null };
                        writes.push({ table, operation, row, returning });
                        if (operation === 'insert') state[table].push(row);
                        if (operation === 'upsert') { state[table] = state[table].filter(p => p.id !== row.id); state[table].push(row); }
                        if (operation === 'delete') state[table] = state[table].filter(p => p[field] !== value);
                        return { data: returning ? [{ id: row?.id || value }] : null, error: null };
                    }).then(resolve, reject);
                }
            }; return query;
        },
        storage: { from: () => ({
            upload: async (name, file, options) => { uploads.push({ name, size: file.size, options }); return { error: state.failure ? new Error('Simulated upload failure') : null }; },
            getPublicUrl: name => ({ data: { publicUrl: 'https://example.invalid/' + name } })
        }) }
    };
    const document = { addEventListener() {}, querySelectorAll: () => [], getElementById: () => null };
    const context = { window: { KIRA_CONFIG: { isSupabaseReady: cloud, SUPABASE_URL: 'https://example.invalid', SUPABASE_ANON_KEY: 'offline-only', STORAGE_BUCKET: 'test' }, supabase: { createClient: () => sdk } },
        localStorage: { getItem: k => cache.get(k) ?? null, setItem: (k, v) => cache.set(k, v), removeItem: k => cache.delete(k) },
        document, crypto: webcrypto, console: { log() {}, warn() {} }, Blob, URL, setTimeout };
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(path.join(root, 'js/supabaseClient.js'), 'utf8'), context);
    context.KiraDB = context.window.KiraDB;
    vm.runInContext(fs.readFileSync(path.join(root, 'js/cart.js'), 'utf8'), context);
    context.KiraCart = context.window.KiraCart;
    context.KiraCart.updateUI = () => {}; context.KiraCart.openDrawer = () => {}; context.KiraCart.closeDrawer = () => {};
    return { ...context, db: context.KiraDB, cart: context.KiraCart, cache, state, writes, uploads };
}
const payload = { name: 'Offline Test', email: 'test@example.invalid', phone: '01712345678', address: 'Test address', subtotal: '৳1,234.50' };
test('profile update requires an acknowledged database row', async () => {
    const { db, state } = setup();
    await db.auth.updateProfile({ phone: '01712345678' });
    state.profileMissing = true;
    await assert.rejects(db.auth.updateProfile({ phone: '01712345678' }), /Profile was not saved/);
    state.failure = true;
    await assert.rejects(db.auth.updateProfile({ phone: '01712345678' }), /Simulated backend failure/);
});
test('all first-party JS and inline HTML scripts parse', () => {
    for (const file of fs.readdirSync(path.join(root, 'js')).filter(f => f.endsWith('.js'))) new vm.Script(fs.readFileSync(path.join(root, 'js', file), 'utf8'), { filename: file });
    for (const file of fs.readdirSync(root).filter(f => f.endsWith('.html'))) {
        for (const match of fs.readFileSync(path.join(root, file), 'utf8').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) if (match[1].trim()) new vm.Script(match[1], { filename: file });
    }
});
test('money accepts currency, commas, Bengali digits and rejects invalid or negative values', () => {
    const { db } = setup();
    assert.equal(db.money.parse('৳1,234.50'), 1234.5); assert.equal(db.money.parse('৳৮০'), 80);
    for (const value of ['Quote Required', 'NaN', -1, Infinity, '12abc', '-5']) assert.throws(() => db.money.parse(value));
});
test('ten-unit discounted cart is 723, not 7230, and survives reload', () => {
    const { cart } = setup(); cart.addItem({ title: 'Estimate', price: 723 / 10, numPrice: 723 / 10, quantity: 10 });
    assert.equal(cart.getTotalPrice(), 723); assert.equal(cart.getItems()[0].quantity, 10);
});
test('old calculator cart is migrated exactly once', () => {
    const { cart, cache } = setup(); cache.set('kiras_cart', JSON.stringify([{ title: 'Custom 3D Print (PLA)', specs: '10 Unit(s)', price: 723, numPrice: 723, quantity: 10 }]));
    assert.equal(cart.getTotalPrice(), 723); assert.equal(cart.getTotalPrice(), 723);
});
test('guest insert uses numeric amounts and no SELECT', async () => {
    const { db, writes, cache } = setup({ signedIn: false }); const record = await db.orders.create(payload);
    assert.equal(record.total_amount, 1234.5); assert.equal(record.customer_phone, payload.phone); assert.equal(record.shipping_address, payload.address);
    assert.equal(writes[0].returning, false); assert.equal(record.user_id, undefined); assert.equal(JSON.parse(cache.get('kiras_orders')).length, 1);
});
test('backend failure or missing SDK never creates a success cache', async () => {
    for (const options of [{ failure: true }, { cloud: false }]) {
        const { db, cache } = setup(options); await assert.rejects(db.orders.create(payload)); assert.equal(cache.has('kiras_orders'), false);
    }
});
test('missing phone and address stop an order before insertion', async () => {
    const { db, writes } = setup(); await assert.rejects(db.orders.create({ ...payload, phone: '' })); await assert.rejects(db.orders.create({ ...payload, address: '' })); assert.equal(writes.length, 0);
});
test('custom model URL reaches its dedicated order column', async () => {
    const { db } = setup(); const url = 'https://example.invalid/model.3mf'; const record = await db.orders.create({ ...payload, customSpecs: { modelFileUrl: url, designConfig: { template: 'lego' } } }); assert.equal(record.model_file_url, url);
});
test('product metadata survives another device and empty catalogue remains empty', async () => {
    const { db, state } = setup({ role: 'admin' }); await db.products.save({ id: 'P1', name: 'Edited', price: '৳80', specs: [{ text: 'Red' }], delivery: '2 Days', image: 'images/x.webp' });
    const rows = await db.products.getAll(); assert.equal(rows[0].name, 'Edited'); assert.equal(rows[0].price, '৳80'); assert.equal(rows[0].specs[0].text, 'Red'); assert.equal(rows[0].delivery, '2 Days');
    await db.products.remove('P1'); assert.equal((await db.products.getAll()).length, 0); assert.equal(state.products.length, 0);
});
test('failed product mutation never replaces the cache, and customers cannot mutate', async () => {
    const { db, cache } = setup({ role: 'admin', failure: true }); cache.set('kiras_products', '[{"id":"keep"}]');
    await assert.rejects(db.products.save({ id: 'P2', name: 'New', price: 80 })); assert.equal(cache.get('kiras_products'), '[{"id":"keep"}]');
    const customer = setup(); await assert.rejects(customer.db.products.save({ id: 'P3', name: 'No', price: 80 })); assert.equal(customer.writes.length, 0);
});
test('upload validates type and size and reports failure', async () => {
    const { db, uploads, state } = setup(); await assert.rejects(db.storage.uploadModel(new Blob(['x']), 'x.svg')); assert.equal(uploads.length, 0);
    const result = await db.storage.uploadModel(new Blob(['PK-test']), 'model.3mf'); assert.match(result, /model\.3mf$/); assert.equal(uploads[0].options.upsert, false);
    state.failure = true; await assert.rejects(db.storage.uploadModel(new Blob(['x']), 'x.stl'));
});
