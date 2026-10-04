document.addEventListener('DOMContentLoaded', () => {
    const pinOverlay = document.getElementById('pin-modal-overlay');
    const adminMain = document.getElementById('admin-main-content');
    const pinError = document.getElementById('pin-error');
    const pinForm = document.getElementById('pin-form');
    if (pinForm) pinForm.addEventListener('submit', e => { e.preventDefault(); KiraAuth.openModal('login'); });
    let checkingAuth = false;
    async function checkAuth() {
        if (checkingAuth) return;
        checkingAuth = true;
        try {
            await KiraDB.requireAdmin();
            pinOverlay.style.display = 'none';
            adminMain.style.display = 'block';
            loadOrders();
            await refreshProducts();
        } catch (error) {
            adminMain.style.display = 'none'; pinOverlay.style.display = 'flex';
            pinError.textContent = error.message;
        } finally { checkingAuth = false; }
    }
    window.addEventListener('kira-auth-change', checkAuth);

    function getOrders() {
        try { return JSON.parse(localStorage.getItem('kiras_orders') || '[]'); } catch (e) { return []; }
    }
    function normalizeOrder(o) {
        const statuses = { pending: 'Pending', printing: 'Printing', delivered: 'Completed', processing: 'Processing', shipped: 'Shipped', cancelled: 'Cancelled' };
        return { id: o.id, date: new Date(o.created_at).toLocaleDateString(), time: new Date(o.created_at).toLocaleTimeString(),
            name: o.customer_name, email: o.customer_email, phone: o.customer_phone, address: o.shipping_address,
            material: o.custom_3d_specs?.model || '3D Print Request', details: o.notes, status: statuses[o.status] || o.status,
            estimatedPrice: KiraDB.money.format(o.total_amount), snapshot: o.custom_3d_specs?.snapshot || o.items?.[0]?.image,
            modelFileUrl: o.model_file_url, items: o.items || [] };
    }

    async function fetchCloudOrders() {
        try {
            const orders = await KiraDB.orders.getAll();
            KiraDB.cache('kiras_orders', orders.map(normalizeOrder));
            localStorage.setItem('kiras_last_sync_orders', new Date().toLocaleString());
            updateLastSyncUI(); renderOrders();
        } catch (error) { showToast('Sync failed / সিঙ্ক হয়নি: ' + error.message); }
    }

    function updateLastSyncUI() {
        const span = document.getElementById('last-sync-time');
        if (span) {
            const last = localStorage.getItem('kiras_last_sync_orders');
            span.textContent = 'Last Synced: ' + (last ? last : 'Never');
        }
    }

    function saveOrders(orders) {
        localStorage.setItem('kiras_orders', JSON.stringify(orders));
        renderOrders();
    }

    let activeFilter = 'All';

    function loadOrders() {
        renderOrders();
        updateLastSyncUI();
        fetchCloudOrders();
    }

    function renderOrders() {
        const orders = getOrders();
        const tbody = document.getElementById('admin-orders-tbody');
        const statTotal = document.getElementById('stat-total-orders');
        const statPending = document.getElementById('stat-pending');
        const statPrinting = document.getElementById('stat-printing');
        const statRevenue = document.getElementById('stat-revenue');

        if (!tbody) return;

        // Compute Stats
        const pendingCount = orders.filter(o => o.status === 'Pending').length;
        const printingCount = orders.filter(o => o.status === 'Printing').length;
        let revSum = 0;
        orders.forEach(o => {
            const val = parseFloat(String(o.estimatedPrice || '$0').replace(/[^0-9.]/g, '')) || 0;
            revSum += val;
        });

        if (statTotal) statTotal.textContent = orders.length;
        if (statPending) statPending.textContent = pendingCount;
        if (statPrinting) statPrinting.textContent = printingCount;
        if (statRevenue) statRevenue.textContent = '৳' + revSum.toLocaleString('en-US');

        // Filter Orders
        const filtered = orders.filter(o => {
            if (activeFilter === 'All') return true;
            return o.status === activeFilter;
        });

        tbody.innerHTML = '';

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--c-text-muted);">No ${activeFilter !== 'All' ? activeFilter : ''} orders found.</td></tr>`;
            return;
        }

        filtered.forEach(order => {
            const tr = document.createElement('tr');
            
            let statusBadgeClass = 'pending';
            if (order.status === 'Printing') statusBadgeClass = 'printing';
            if (order.status === 'Completed') statusBadgeClass = 'completed';

            const hasSnapshot = order.snapshot && order.snapshot.startsWith('data:image/');

            tr.innerHTML = `
                <td><strong style="color:var(--c-primary);">${escapeHtml(order.id)}</strong></td>
                <td style="font-size:0.9rem;">${escapeHtml(order.date)}<br><small style="color:var(--c-text-muted);">${escapeHtml(order.time || '')}</small></td>
                <td><strong>${escapeHtml(order.name)}</strong><br><small style="color:var(--c-text-muted);">${escapeHtml(order.email)}</small><br><small>${escapeHtml(order.phone)}<br>${escapeHtml(order.address)}</small></td>
                <td>
                    <span style="font-weight:600;">${escapeHtml(order.material)}</span><br>
                    <small style="color:var(--c-text-muted);">${escapeHtml((order.details || '').substring(0, 35))}${(order.details || '').length > 35 ? '...' : ''}</small>
                    ${hasSnapshot ? `<br><button class="clay-btn btn-sm btn-view-design" data-id="${escapeHtml(order.id)}" style="margin-top:0.4rem; padding:0.25rem 0.6rem; font-size:0.75rem; background:var(--c-primary); color:#FFF;">🎨 View Custom Design</button>` : ''}
                    ${order.modelFileUrl ? `<br><a href="${order.modelFileUrl}" target="_blank" class="clay-btn btn-sm" style="margin-top:0.4rem; padding:0.25rem 0.6rem; font-size:0.75rem; background:#10B981; color:#FFF; display:inline-block; text-decoration:none;">⬇️ Download 3D Print File</a>` : ''}
                    ${(order.items || []).filter(i => i.customData?.modelFileUrl).map(i => `<br><a href="${escapeHtml(i.customData.modelFileUrl)}" target="_blank" rel="noopener noreferrer">⬇️ ${escapeHtml(i.title)}</a>`).join('')}
                </td>
                <td><strong>${escapeHtml(order.estimatedPrice || '৳0')}</strong></td>
                <td>
                    <select class="clay-select status-switcher" data-id="${escapeHtml(order.id)}" style="padding:0.3rem 0.6rem; font-size:0.85rem; width:auto;">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>⏳ Pending</option>
                        <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        <option value="Printing" ${order.status === 'Printing' ? 'selected' : ''}>⚙️ Printing</option>
                        <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>✅ Completed</option>
                    </select>
                </td>
                <td>
                    <button class="clay-btn btn-sm btn-delete-order" data-id="${escapeHtml(order.id)}" style="padding:0.3rem 0.6rem; background:#FF5E5E; color:#FFF; font-size:0.8rem;">Cancel</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // Attach View Design Listeners
        tbody.querySelectorAll('.btn-view-design').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const allOrders = getOrders();
                const targetOrder = allOrders.find(o => o.id === id);
                if (targetOrder && targetOrder.snapshot) {
                    const modal = document.getElementById('design-preview-modal');
                    const modalTitle = document.getElementById('design-modal-title');
                    const modalBody = document.getElementById('design-modal-body');

                    if (modal && modalBody) {
                        modalTitle.textContent = `Design Preview (Order ${targetOrder.id})`;
                        modalBody.innerHTML = `
                            <div style="background:#121019; padding:1rem; border-radius:18px; margin-bottom:1rem;">
                                <img src="${targetOrder.snapshot}" alt="Customer Custom Design" style="max-width:100%; height:auto; border-radius:12px; display:block; margin:0 auto;">
                            </div>
                            <div style="text-align:left; background:rgba(255,255,255,0.05); padding:1rem; border-radius:14px; font-size:0.9rem; line-height:1.6;">
                                <strong>Customer:</strong> ${escapeHtml(targetOrder.name)} (${escapeHtml(targetOrder.email)})<br>
                                <strong>Quote:</strong> ${escapeHtml(targetOrder.estimatedPrice)}<br>
                                <strong>Details:</strong><br>
                                <pre style="white-space:pre-wrap; font-family:inherit; margin-top:0.3rem; color:var(--c-text-muted);">${escapeHtml(targetOrder.details)}</pre>
                            </div>
                        `;
                        modal.classList.add('open');
                        modal.style.display = 'flex';
                    }
                }
            });
        });

        // Close Design Modal
        const btnCloseDesign = document.getElementById('btn-close-design-modal');
        const designModal = document.getElementById('design-preview-modal');
        if (btnCloseDesign && designModal) {
            btnCloseDesign.addEventListener('click', () => {
                designModal.classList.remove('open');
                designModal.style.display = 'none';
            });
        }

        tbody.querySelectorAll('.status-switcher').forEach(select => {
            select.addEventListener('change', async event => {
                const id = event.target.dataset.id; select.disabled = true;
                try { await KiraDB.orders.updateStatus(id, select.value.toLowerCase()); await fetchCloudOrders(); showToast('Order updated / অর্ডার আপডেট হয়েছে'); }
                catch (error) { showToast(error.message); renderOrders(); }
                finally { select.disabled = false; }
            });
        });
        tbody.querySelectorAll('.btn-delete-order').forEach(button => {
            button.addEventListener('click', async () => {
                if (!confirm('Cancel this order? / অর্ডার বাতিল করবেন?')) return;
                button.disabled = true;
                try { await KiraDB.orders.remove(button.dataset.id); await fetchCloudOrders(); showToast('Order cancelled / অর্ডার বাতিল হয়েছে'); }
                catch (error) { showToast(error.message); button.disabled = false; }
            });
        });
    }

    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str).replace(/[&<>"']/g, function(m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
        });
    }

    // Filter Buttons
    document.querySelectorAll('.admin-filter-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            document.querySelectorAll('.admin-filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeFilter = pill.getAttribute('data-filter');
            renderOrders();
        });
    });

    // CSV Export
    const btnExportCSV = document.getElementById('btn-export-csv');
    if (btnExportCSV) {
        btnExportCSV.addEventListener('click', () => {
            const orders = getOrders();
            let csv = 'Order ID,Date,Name,Email,Material,Details,Price,Status\n';
            orders.forEach(o => {
                csv += `"${o.id}","${o.date}","${o.name}","${o.email}","${o.material}","${o.details.replace(/"/g, '""')}","${o.estimatedPrice}","${o.status}"\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `Kiras_Creation_Orders_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('✓ Exported orders to CSV file!');
        });
    }

    const btnSyncSheets = document.getElementById('btn-sync-sheets');
    if (btnSyncSheets) btnSyncSheets.addEventListener('click', async () => {
        btnSyncSheets.disabled = true;
        try { await fetchCloudOrders(); await refreshProducts(); }
        catch (error) { showToast(error.message); }
        finally { btnSyncSheets.disabled = false; }
    });

    function showToast(msg) {
        let toast = document.getElementById('admin-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'admin-toast';
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }

    // Tabs Logic
    const tabOrders = document.getElementById('tab-orders');
    const tabProducts = document.getElementById('tab-products');
    const tabUsers = document.getElementById('tab-users');
    const tabWalkthrough = document.getElementById('tab-walkthrough');
    const viewOrders = document.getElementById('view-orders');
    const viewProducts = document.getElementById('view-products');
    const viewUsers = document.getElementById('view-users');
    const viewWalkthrough = document.getElementById('view-walkthrough');

    function resetTabs() {
        if(tabOrders) { tabOrders.style.background = 'transparent'; tabOrders.style.color = 'var(--c-text)'; }
        if(tabProducts) { tabProducts.style.background = 'transparent'; tabProducts.style.color = 'var(--c-text)'; }
        if(tabUsers) { tabUsers.style.background = 'transparent'; tabUsers.style.color = 'var(--c-text)'; }
        if(tabWalkthrough) { tabWalkthrough.style.background = 'transparent'; tabWalkthrough.style.color = 'var(--c-text)'; }
        if(viewOrders) viewOrders.style.display = 'none';
        if(viewProducts) viewProducts.style.display = 'none';
        if(viewUsers) viewUsers.style.display = 'none';
        if(viewWalkthrough) viewWalkthrough.style.display = 'none';
    }

    if (tabOrders) {
        tabOrders.addEventListener('click', () => {
            resetTabs();
            tabOrders.style.background = 'var(--c-primary)';
            tabOrders.style.color = 'white';
            viewOrders.style.display = 'block';
        });
    }

    if (tabProducts) {
        tabProducts.addEventListener('click', () => {
            resetTabs();
            tabProducts.style.background = 'var(--c-primary)';
            tabProducts.style.color = 'white';
            viewProducts.style.display = 'block';
            refreshProducts().catch(error => showToast(error.message));
        });
    }

    if (tabUsers) {
        tabUsers.addEventListener('click', () => {
            resetTabs();
            tabUsers.style.background = 'var(--c-primary)';
            tabUsers.style.color = 'white';
            viewUsers.style.display = 'block';
            loadUsers();
        });
    }

    if (tabWalkthrough) {
        tabWalkthrough.addEventListener('click', () => {
            resetTabs();
            tabWalkthrough.style.background = 'var(--c-primary)';
            tabWalkthrough.style.color = 'white';
            viewWalkthrough.style.display = 'block';
        });
    }

    async function loadUsers() {
        const tbody = document.getElementById('admin-users-tbody');
        try {
            await KiraDB.requireAdmin();
            const users = await KiraDB.users.getAll();
            tbody.innerHTML = users.map(u => `<tr><td>${escapeHtml(u.id)}</td><td>${escapeHtml(u.full_name)}</td><td>${escapeHtml(u.email)}</td><td>${escapeHtml(u.phone)}</td><td>${escapeHtml(u.role)}</td></tr>`).join('') || '<tr><td colspan="5">No users / ব্যবহারকারী নেই</td></tr>';
        } catch (error) { tbody.textContent = error.message; }
    }

    // --- Products Logic ---
    let cloudProducts = [];
    function getProducts() { return cloudProducts.map(p => ({ ...p })); }
    let adminCurrentPage = 1;
    const adminItemsPerPage = 8;
    async function refreshProducts() {
        cloudProducts = await KiraDB.products.getAll();
        loadProducts();
        let seed = document.getElementById('seed-catalogue');
        if (!seed) {
            seed = document.createElement('button'); seed.id = 'seed-catalogue'; seed.className = 'clay-btn btn-coral';
            seed.textContent = 'Publish existing catalogue / বর্তমান পণ্যগুলো প্রকাশ করুন';
            document.getElementById('admin-products-tbody').closest('table').before(seed);
            seed.addEventListener('click', async () => {
                seed.disabled = true;
                try { await KiraDB.products.saveAll(typeof defaultProducts === 'undefined' ? [] : defaultProducts); await refreshProducts(); showToast('Catalogue published / পণ্যগুলো প্রকাশ হয়েছে'); }
                catch (error) { showToast(error.message); }
                finally { seed.disabled = false; }
            });
        }
        seed.hidden = cloudProducts.length > 0;
    }
    async function saveProducts(products) {
        const old = cloudProducts;
        // Only write changed records; an unrelated edit never overwrites the entire catalogue.
        for (const product of products) {
            const previous = old.find(p => p.id === product.id);
            if (!previous || JSON.stringify(previous) !== JSON.stringify(product)) await KiraDB.products.save(product);
        }
        for (const previous of old) if (!products.some(p => p.id === previous.id)) await KiraDB.products.remove(previous.id);
        await refreshProducts();
    }

    function loadProducts() {
        const tbody = document.getElementById('admin-products-tbody');
        const paginationContainer = document.getElementById('admin-products-pagination');
        if (!tbody) return;

        const allProducts = getProducts();
        const searchInput = document.getElementById('admin-prod-search');
        const filterSelect = document.getElementById('admin-prod-filter');

        const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const categoryFilter = filterSelect ? filterSelect.value : 'all';

        if (searchInput && !searchInput.dataset.hasListener) {
            searchInput.dataset.hasListener = 'true';
            searchInput.addEventListener('input', () => {
                adminCurrentPage = 1;
                loadProducts();
            });
        }
        if (filterSelect && !filterSelect.dataset.hasListener) {
            filterSelect.dataset.hasListener = 'true';
            filterSelect.addEventListener('change', () => {
                adminCurrentPage = 1;
                loadProducts();
            });
        }

        const filteredProducts = allProducts.map((p, originalIndex) => ({ ...p, originalIndex }))
            .filter(p => {
                const matchesSearch = !searchQuery || (p.name && p.name.toLowerCase().includes(searchQuery)) || (p.desc && p.desc.toLowerCase().includes(searchQuery));
                const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
                return matchesSearch && matchesCategory;
            });

        tbody.innerHTML = '';

        if (filteredProducts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2.5rem; color:var(--c-text-muted);">No products found matching your filter.</td></tr>';
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        const totalItems = filteredProducts.length;
        const totalPages = Math.ceil(totalItems / adminItemsPerPage);

        if (adminCurrentPage > totalPages) adminCurrentPage = totalPages;
        if (adminCurrentPage < 1) adminCurrentPage = 1;

        const startIndex = (adminCurrentPage - 1) * adminItemsPerPage;
        const endIndex = Math.min(startIndex + adminItemsPerPage, totalItems);
        const pageItems = filteredProducts.slice(startIndex, endIndex);

        pageItems.forEach((p) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${escapeHtml(p.image || 'images/placeholder.webp')}" alt="product" style="width: 48px; height: 48px; border-radius: 10px; object-fit: cover;"></td>
                <td style="font-weight:700;">${escapeHtml(p.name)}</td>
                <td><span style="background: rgba(142, 132, 120, 0.12); padding: 0.25rem 0.6rem; border-radius: 8px; font-size: 0.8rem; font-weight:600;">${escapeHtml(p.categoryLabel || p.category)}</span></td>
                <td style="color:var(--c-primary); font-weight:700;">${escapeHtml(p.price || 'Contact for Quote')}</td>
                <td>${escapeHtml(p.delivery || '3-5 Days')}</td>
                <td>
                    <button class="clay-btn btn-sm btn-edit-product" data-index="${p.originalIndex}" style="padding:0.35rem 0.75rem; background:#FFA500; color:#FFF; font-size:0.8rem; margin-right: 0.4rem; border-radius:10px;">✏️ Edit</button>
                    <button class="clay-btn btn-sm btn-delete-product" data-index="${p.originalIndex}" style="padding:0.35rem 0.75rem; background:#FF5E5E; color:#FFF; font-size:0.8rem; border-radius:10px;">🗑️ Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-delete-product').forEach(btn => {
            btn.addEventListener('click', async () => {
                const index = btn.getAttribute('data-index');
                if (confirm('Delete this product?')) {
                    const allP = getProducts();
                    allP.splice(index, 1);
                    btn.disabled = true;
                    try { await saveProducts(allP); showToast('Product deleted successfully'); }
                    catch (error) { showToast(error.message); btn.disabled = false; }
                }
            });
        });

        tbody.querySelectorAll('.btn-edit-product').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.getAttribute('data-index');
                const products = getProducts();
                const p = products[index];
                if (!p) return;
                
                document.getElementById('edit-prod-id').value = index;
                document.getElementById('edit-prod-name').value = p.name || '';
                document.getElementById('edit-prod-price').value = p.price || '';
                document.getElementById('edit-prod-delivery').value = p.delivery || '';
                document.getElementById('edit-prod-category').value = p.category || 'lamps';
                document.getElementById('edit-prod-image').value = p.image || '';
                document.getElementById('edit-prod-badge').value = p.badge || '';
                document.getElementById('edit-prod-desc').value = p.desc || '';
                
                document.getElementById('edit-prod-spec1').value = (p.specs && p.specs.length > 0) ? p.specs[0].text : '';
                document.getElementById('edit-prod-spec2').value = (p.specs && p.specs.length > 1) ? p.specs[1].text : '';
                document.getElementById('edit-prod-spec3').value = (p.specs && p.specs.length > 2) ? p.specs[2].text : '';
                
                const modal = document.getElementById('editProductModal');
                if (modal) modal.classList.add('open');
            });
        });

        if (paginationContainer) {
            let paginationHtml = `
                <div style="font-size: 0.88rem; color: var(--c-text-muted); font-weight: 600;">
                    Showing ${startIndex + 1}–${endIndex} of ${totalItems} Products
                </div>
                <div class="admin-pagination-controls">
                    <button class="page-btn btn-prev" ${adminCurrentPage === 1 ? 'disabled' : ''}>← Prev</button>
            `;

            for (let i = 1; i <= totalPages; i++) {
                paginationHtml += `<button class="page-btn page-num ${i === adminCurrentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }

            paginationHtml += `
                    <button class="page-btn btn-next" ${adminCurrentPage === totalPages ? 'disabled' : ''}>Next →</button>
                </div>
            `;

            paginationContainer.innerHTML = paginationHtml;

            paginationContainer.querySelector('.btn-prev')?.addEventListener('click', () => {
                if (adminCurrentPage > 1) {
                    adminCurrentPage--;
                    loadProducts();
                }
            });

            paginationContainer.querySelector('.btn-next')?.addEventListener('click', () => {
                if (adminCurrentPage < totalPages) {
                    adminCurrentPage++;
                    loadProducts();
                }
            });

            paginationContainer.querySelectorAll('.page-num').forEach(btn => {
                btn.addEventListener('click', () => {
                    adminCurrentPage = parseInt(btn.getAttribute('data-page'));
                    loadProducts();
                });
            });
        }
    }

    const editProductModal = document.getElementById('editProductModal');
    if (editProductModal) {
        editProductModal.addEventListener('click', (e) => {
            if (e.target === editProductModal) {
                editProductModal.classList.remove('open');
            }
        });
    }

    const editProductClose = document.getElementById('editProductClose');
    if (editProductClose) {
        editProductClose.addEventListener('click', () => {
            document.getElementById('editProductModal').classList.remove('open');
        });
    }

    const editProductForm = document.getElementById('edit-product-form');
    if (editProductForm) {
        editProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const index = document.getElementById('edit-prod-id').value;
            const allP = getProducts();
            
            let specs = [];
            if (document.getElementById('edit-prod-spec1').value) specs.push({ text: document.getElementById('edit-prod-spec1').value });
            if (document.getElementById('edit-prod-spec2').value) specs.push({ text: document.getElementById('edit-prod-spec2').value });
            if (document.getElementById('edit-prod-spec3').value) specs.push({ text: document.getElementById('edit-prod-spec3').value });

            const category = document.getElementById('edit-prod-category').value;
            let catLabel = category;
            if(category === 'lamps') catLabel = 'Lighting & Lamps';
            else if(category === 'art') catLabel = 'Artistic & Decor';
            else if(category === 'custom') catLabel = 'Custom & Keychains';
            else if(category === 'functional') catLabel = 'Functional & Accessories';

            allP[index] = {
                ...allP[index], titleI18n: '', descKey: '', badgeI18n: '', categoryI18n: '', nameBn: '', descBn: '',
                name: document.getElementById('edit-prod-name').value.trim(),
                price: document.getElementById('edit-prod-price').value.trim(),
                delivery: document.getElementById('edit-prod-delivery').value.trim(),
                category: category,
                categoryLabel: catLabel,
                image: document.getElementById('edit-prod-image').value.trim(),
                badge: document.getElementById('edit-prod-badge').value.trim(),
                desc: document.getElementById('edit-prod-desc').value.trim(),
                specs: specs
            };
            
            const button = editProductForm.querySelector('[type=submit]'); button.disabled = true;
            try { await saveProducts(allP); showToast('Product updated successfully!'); document.getElementById('editProductModal').classList.remove('open'); }
            catch (error) { showToast(error.message); }
            finally { button.disabled = false; }
        });
    }

    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            let specs = [];
            if (document.getElementById('prod-spec1').value) specs.push({ text: document.getElementById('prod-spec1').value });
            if (document.getElementById('prod-spec2').value) specs.push({ text: document.getElementById('prod-spec2').value });
            if (document.getElementById('prod-spec3').value) specs.push({ text: document.getElementById('prod-spec3').value });

            const category = document.getElementById('prod-category').value;
            let catLabel = category;
            if(category === 'lamps') catLabel = 'Lighting & Lamps';
            else if(category === 'art') catLabel = 'Artistic & Decor';
            else if(category === 'custom') catLabel = 'Custom & Keychains';
            else if(category === 'functional') catLabel = 'Functional & Accessories';

            const name = document.getElementById('prod-name').value.trim();
            
            if (!name || !category) return;

            const allP = getProducts();
            allP.unshift({ // Add to top
                id: 'PROD-NEW-' + Date.now(),
                name,
                price: document.getElementById('prod-price').value.trim() || 'Contact for Quote',
                delivery: document.getElementById('prod-delivery').value.trim() || '3-5 Days',
                category: category,
                categoryLabel: catLabel,
                image: document.getElementById('prod-image').value.trim(),
                badge: document.getElementById('prod-badge').value.trim(),
                desc: document.getElementById('prod-desc').value.trim(),
                specs: specs
            });
            const button = addProductForm.querySelector('[type=submit]'); button.disabled = true;
            try { await saveProducts(allP); showToast('Product added successfully!'); addProductForm.reset(); }
            catch (error) { showToast(error.message); }
            finally { button.disabled = false; }
        });
    }

    checkAuth();
});