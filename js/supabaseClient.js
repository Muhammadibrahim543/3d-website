/**
 * KIRA'S CREATION SOFT-3D STUDIO - DATA ACCESS LAYER (SUPABASE & FALLBACK)
 * Unified interface for Authentication, Database, and 3D File Storage.
 */

(function() {
    let supabase = null;

    // Initialize Supabase if SDK & config are present
    if (window.KIRA_CONFIG && window.KIRA_CONFIG.isSupabaseReady && window.supabase) {
        try {
            supabase = window.supabase.createClient(
                window.KIRA_CONFIG.SUPABASE_URL,
                window.KIRA_CONFIG.SUPABASE_ANON_KEY
            );
            console.log("⚡ [KiraDB] Connected to Supabase Cloud Backend.");
        } catch (e) {
            console.warn("⚠️ [KiraDB] Failed to initialize Supabase client, cloud operations unavailable:", e);
            supabase = null;
        }
    } else {
        console.log("ℹ️ [KiraDB] Cloud operations unavailable (Supabase SDK or configuration missing).");
    }

    function rememberUser(user) {
        try {
            const previous = JSON.parse(localStorage.getItem('kiras_active_user') || 'null');
            if (previous && (previous.id === user.id || previous.email === user.email)) user.presets = previous.presets || [];
            localStorage.setItem('kiras_active_user', JSON.stringify(user));
        } catch (error) { console.warn('Profile cache unavailable:', error); }
        return user;
    }
    const KiraDB = {
        isCloudEnabled: () => Boolean(supabase),

        // ==========================================
        // AUTHENTICATION
        // ==========================================
        auth: {
            async signUp(email, password, fullName = '', phone = '', address = '') {
                if (supabase) {
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: { full_name: fullName, phone, address }
                        }
                    });
                    if (error) throw error;
                    return { user: data.user, needsConfirmation: !data.session };
                } else {
                    throw new Error('Sign up unavailable. Please retry / নিবন্ধনের সংযোগ নেই। আবার চেষ্টা করুন।');
                }
            },

            async signIn(email, password) {
                if (supabase) {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password
                    });
                    if (error) throw error;
                    
                    // Fetch profile to get role & metadata
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', data.user.id)
                        .single();

                    const mergedUser = {
                        ...data.user,
                        name: profile?.full_name || data.user.user_metadata?.full_name || email.split('@')[0],
                        role: profile?.role || 'customer',
                        avatar: profile?.avatar_id || 'av_robo',
                        phone: profile?.phone || data.user.user_metadata?.phone || '',
                        address: data.user.user_metadata?.address || ''
                    };
                    return rememberUser(mergedUser);
                } else {
                    throw new Error('Sign in unavailable. Please retry / লগইনের সংযোগ নেই। আবার চেষ্টা করুন।');
                }
            },

            async signOut() {
                localStorage.removeItem('kiras_active_user');
                if (supabase) {
                    await supabase.auth.signOut();
                }
            },

            async getCurrentUser() {
                if (supabase) {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session || !session.user) {
                        localStorage.removeItem('kiras_active_user');
                        return null;
                    }
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    const user = {
                        ...session.user,
                        name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email.split('@')[0],
                        role: profile?.role || 'customer',
                        avatar: profile?.avatar_id || 'av_robo',
                        phone: profile?.phone || session.user.user_metadata?.phone || '',
                        address: session.user.user_metadata?.address || ''
                    };
                    return rememberUser(user);
                } else {
                    return null;
                }
            },

            async updateProfile(updates) {
                const user = await KiraDB.auth.getCurrentUser();
                if (!user) throw new Error('No active user logged in.');

                if (supabase) {
                    const dbUpdates = {};
                    if (updates.name !== undefined) dbUpdates.full_name = updates.name;
                    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
                    if (updates.avatar !== undefined) dbUpdates.avatar_id = updates.avatar;
                    dbUpdates.updated_at = new Date().toISOString();

                    const { data: savedProfiles, error } = await supabase
                        .from('profiles')
                        .update(dbUpdates)
                        .eq('id', user.id).select('id');
                    if (error) throw error;
                    if (!savedProfiles?.length) throw new Error('Profile was not saved / প্রোফাইল সেভ হয়নি');
                    if (updates.address !== undefined) {
                        const { error: metadataError } = await supabase.auth.updateUser({ data: { address: updates.address } });
                        if (metadataError) throw metadataError;
                    }
                    return await KiraDB.auth.getCurrentUser();
                }
            }
        },

        // Cloud records are authoritative; localStorage is a confirmed cache only.
        money: {
            parse(value) {
                if (typeof value === 'number' && Number.isFinite(value) && value >= 0) return value;
                const raw = String(value ?? '').trim().replace(/[০-৯]/g, n => '০১২৩৪৫৬৭৮৯'.indexOf(n))
                    .replace(/^(?:৳|BDT|Tk\.?|টাকা)\s*/i, '').replace(/,/g, '');
                if (!/^\d+(?:\.\d{1,2})?$/.test(raw)) throw new Error('Invalid amount / সঠিক টাকার অঙ্ক দিন');
                return Number(raw);
            },
            format(value) { return '৳' + KiraDB.money.parse(value).toLocaleString('en-US', { maximumFractionDigits: 2 }); }
        },
        escapeHtml(value) {
            return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
        },
        formatSpecs(specs) {
            if (typeof specs === 'string') return specs;
            if (Array.isArray(specs)) return specs.map(s => s.text || s).join(' • ');
            return Object.values(specs || {}).filter(v => typeof v === 'string' || typeof v === 'number').join(' • ');
        },
        // Require a functioning backend before reporting a successful write.
        requireCloud() {
            if (!supabase) throw new Error('Connection unavailable. Please retry / সংযোগ নেই। আবার চেষ্টা করুন।');
            return supabase;
        },
        async requireAdmin() {
            KiraDB.requireCloud();
            const user = await KiraDB.auth.getCurrentUser();
            if (!user || user.role !== 'admin') throw new Error('Sign in with your admin account / অ্যাডমিন অ্যাকাউন্টে লগইন করুন');
            return user;
        },
        cache(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.warn('Cache unavailable:', e); } },
        users: {
            async getAll() {
                await KiraDB.requireAdmin();
                const { data, error } = await supabase.from('profiles').select('id,email,full_name,phone,role').order('created_at', { ascending: false });
                if (error) throw error;
                return data || [];
            }
        },
        products: {
            getCached() {
                try {
                    const value = localStorage.getItem('kiras_products');
                    if (value !== null) return JSON.parse(value);
                } catch (error) {}
                return typeof defaultProducts === 'undefined' ? [] : defaultProducts;
            },
            normalize(p) {
                let meta = {};
                try { meta = JSON.parse(p.specs || '{}').product || {}; } catch (e) {}
                return {
                    ...meta, id: p.id, name: p.title_en, nameBn: p.title_bn || p.title_en,
                    category: p.category, categoryLabel: meta.categoryLabel || p.category,
                    price: meta.quoteRequired ? 'Contact for Quote' : KiraDB.money.format(Number(p.price)),
                    desc: p.description_en || '', descBn: p.description_bn || p.description_en || '',
                    image: p.image_url || '', specs: Array.isArray(meta.specs) ? meta.specs : []
                };
            },
            async getAll() {
                const db = KiraDB.requireCloud();
                const { data, error } = await db.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false });
                if (error) throw error;
                const products = (data || []).map(KiraDB.products.normalize);
                KiraDB.cache('kiras_products', products);
                return products; // Empty is intentional, never resurrect default products.
            },
            async save(product) {
                await KiraDB.requireAdmin();
                const quoteRequired = !product.price || /quote|কোটেশন/i.test(String(product.price));
                const row = {
                    id: product.id, title_en: product.name || '', title_bn: product.nameBn || '',
                    category: product.category || 'general', price: quoteRequired ? 0 : KiraDB.money.parse(product.price),
                    description_en: product.desc || '', description_bn: product.descBn || '',
                    image_url: product.image || '', specs: JSON.stringify({ product: { ...product, quoteRequired } }), is_active: true
                };
                const { data, error } = await supabase.from('products').upsert(row).select('id');
                if (error) throw error;
                if (!data?.length) throw new Error('Product was not saved / পণ্য সেভ হয়নি');
            },
            async remove(id) {
                await KiraDB.requireAdmin();
                const { data, error } = await supabase.from('products').delete().eq('id', id).select('id');
                if (error) throw error;
                if (!data?.length) throw new Error('Product was not deleted / পণ্য মুছে যায়নি');
            },
            async saveAll(productsList) {
                await KiraDB.requireAdmin();
                for (const product of productsList) await KiraDB.products.save(product);
                return await KiraDB.products.getAll();
            }
        },
        orders: {
            async create(payload) {
                const db = KiraDB.requireCloud();
                const name = String(payload.name || '').trim();
                const phone = String(payload.phone || '').trim().replace(/[০-৯]/g, n => '০১২৩৪৫৬৭৮৯'.indexOf(n));
                const address = String(payload.address || '').trim();
                if (!name || !/^(?:\+?88)?01[3-9]\d{8}$/.test(phone.replace(/[\s()-]/g, '')) || !address) {
                    throw new Error('Enter your name, valid mobile number and address / নাম, সঠিক মোবাইল ও ঠিকানা দিন');
                }
                const subtotal = KiraDB.money.parse(payload.subtotal ?? payload.totalAmount ?? 0);
                const deliveryFee = KiraDB.money.parse(payload.deliveryFee ?? 0);
                const row = {
                    id: payload.id || 'KC-' + crypto.randomUUID(), customer_name: name,
                    customer_email: String(payload.email || '').trim(), customer_phone: phone, shipping_address: address,
                    notes: payload.notes || '', items: payload.items || [],
                    custom_3d_specs: payload.customSpecs || null,
                    model_file_url: payload.modelFileUrl || payload.customSpecs?.modelFileUrl || null,
                    subtotal, delivery_fee: deliveryFee, total_amount: Math.round((subtotal + deliveryFee) * 100) / 100,
                    status: 'pending', payment_method: payload.paymentMethod || 'cod', payment_status: 'unpaid'
                };
                if (row.items.some(i => i.customData && !i.customData.modelFileUrl)) throw new Error('Custom model file missing / কাস্টম মডেলের ফাইল নেই');
                const user = await KiraDB.auth.getCurrentUser();
                if (user?.id) row.user_id = user.id;
                // No SELECT: guest INSERT is allowed while guest order reads remain private.
                const { error } = await db.from('orders').insert(row);
                if (error) throw error;
                const confirmed = { ...row, created_at: new Date().toISOString() };
                let orders = [];
                try { orders = JSON.parse(localStorage.getItem('kiras_orders') || '[]'); } catch (e) {}
                KiraDB.cache('kiras_orders', [confirmed, ...orders.filter(o => o.id !== row.id)]);
                return confirmed;
            },
            async getAll() {
                await KiraDB.requireAdmin();
                const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                return data || [];
            },
            async getForUser(userId) {
                const db = KiraDB.requireCloud();
                const { data, error } = await db.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
                if (error) throw error;
                return data || [];
            },
            async updateStatus(id, status, paymentStatus) {
                await KiraDB.requireAdmin();
                const updates = { updated_at: new Date().toISOString() };
                if (status) updates.status = status === 'completed' ? 'delivered' : status;
                if (paymentStatus) updates.payment_status = paymentStatus;
                const { data, error } = await supabase.from('orders').update(updates).eq('id', id).select('id');
                if (error) throw error;
                if (!data?.length) throw new Error('Order was not updated / অর্ডার আপডেট হয়নি');
                return true;
            },
            async remove(id) {
                // Keep the order receipt/history while synchronising cancellation.
                return await KiraDB.orders.updateStatus(id, 'cancelled');
            }
        },
        storage: {
            validate(file, name) {
                const ext = name.split('.').pop().toLowerCase();
                const types = { stl: 'application/sla', obj: 'text/plain', step: 'application/step', stp: 'application/step',
                    '3mf': 'model/3mf', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
                if (!types[ext]) throw new Error('Choose STL, OBJ, STEP, 3MF, JPG, PNG or WebP / সমর্থিত মডেল বা ছবির ফাইল দিন');
                if (!file || !file.size || file.size > 25 * 1024 * 1024) throw new Error('File must be between 1 byte and 25 MB / সর্বোচ্চ ২৫ MB ফাইল দিন');
                return types[ext];
            },
            async uploadModel(file, name) {
                const db = KiraDB.requireCloud();
                const contentType = KiraDB.storage.validate(file, name);
                const bucket = window.KIRA_CONFIG.STORAGE_BUCKET || 'custom-3d-models';
                const safeName = name.replace(/[^a-zA-Z0-9._-]/g, '_');
                const objectPath = crypto.randomUUID() + '_' + safeName;
                const { error } = await db.storage.from(bucket).upload(objectPath, file, { contentType, upsert: false });
                if (error) throw error;
                const { data } = db.storage.from(bucket).getPublicUrl(objectPath);
                if (!data?.publicUrl) throw new Error('Upload URL unavailable / আপলোডের লিংক পাওয়া যায়নি');
                return data.publicUrl;
            }
        }
    };
    window.KiraDB = KiraDB;
})();
