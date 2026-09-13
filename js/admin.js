document.addEventListener('DOMContentLoaded', () => {
    const DEFAULT_PIN = '1234';

    // PIN Authentication Elements
    const pinOverlay = document.getElementById('pin-modal-overlay');
    const pinForm = document.getElementById('pin-form');
    const pinInput = document.getElementById('pin-input');
    const pinError = document.getElementById('pin-error');
    const adminMain = document.getElementById('admin-main-content');

    // Check PIN unlock status
    function checkAuth() {
        if (sessionStorage.getItem('kiras_admin_unlocked') === 'true') {
            if (pinOverlay) {
                pinOverlay.classList.remove('open');
                pinOverlay.style.display = 'none';
            }
            if (adminMain) adminMain.style.display = 'block';
            loadOrders();
        } else {
            if (pinOverlay) {
                pinOverlay.classList.add('open');
                pinOverlay.style.display = 'flex';
            }
            if (adminMain) adminMain.style.display = 'none';
        }
    }

    if (pinForm) {
        pinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = pinInput.value.trim();
            if (val !== '' && val === DEFAULT_PIN) {
                sessionStorage.setItem('kiras_admin_unlocked', 'true');
                if (pinOverlay) {
                    pinOverlay.classList.remove('open');
                    pinOverlay.style.display = 'none';
                }
                if (adminMain) adminMain.style.display = 'block';
                loadOrders();
            } else {
                pinError.textContent = 'Incorrect Security PIN!';
                pinInput.value = '';
            }
        });
    }

    // Default Demo Orders
    const initialDemoOrders = [
        {
            id: 'KC-4091',
            date: 'Jul 22, 2026',
            time: '10:30 AM',
            name: 'Md. Ibrahim',
            email: 'sidratuluae@gmail.com',
            material: 'Friendly PLA+ (Bio-Starch)',
            details: 'Custom Drone Chassis Frame & Arm Brackets',
            status: 'Printing',
            estimatedPrice: '৳5,200'
        },
        {
            id: 'KC-8812',
            date: 'Jul 21, 2026',
            time: '04:15 PM',
            name: 'Nabila Rahman',
            email: 'nabila@designhub.bd',
            material: 'Flex Resin (Smooth Rubber)',
            details: 'Backlit 3D Lithophane Photo Gift Box',
            status: 'Completed',
            estimatedPrice: '৳3,800'
        },
        {
            id: 'KC-1049',
            date: 'Jul 20, 2026',
            time: '02:00 PM',
            name: 'Tanvir Ahmed',
            email: 'tanvir@robotics.org',
            material: 'Tough ABS (Impact-Resistant)',
            details: 'High Torque Servo Gear Box Casing',
            status: 'Pending',
            estimatedPrice: '৳7,500'
        }
    ];

    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxlT_uFe-8zMu_LFpMZsGRQPaQuzcIxFZfmFa195FMp1b0IFJP-blzHYoFSv-nj_cs/exec';

    function getOrders() {
        let stored = localStorage.getItem('kiras_orders');
        if (!stored) {
            localStorage.setItem('kiras_orders', JSON.stringify(initialDemoOrders));
            return initialDemoOrders;
        }
        try {
            const parsed = JSON.parse(stored);
            // If empty array in storage, restore demo orders
            if (Array.isArray(parsed) && parsed.length === 0) {
                localStorage.setItem('kiras_orders', JSON.stringify(initialDemoOrders));
                return initialDemoOrders;
            }
            return parsed;
        } catch(e) {
            localStorage.setItem('kiras_orders', JSON.stringify(initialDemoOrders));
            return initialDemoOrders;
        }
    }

    async function fetchCloudOrders() {
        const tbody = document.getElementById('admin-orders-tbody');
        if (tbody) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="7" style="text-align:center; padding: 1rem; color:var(--c-primary); font-weight:600;">⏳ Loading latest orders from cloud...</td>';
            tbody.insertBefore(tr, tbody.firstChild);
        }
        try {
            const res = await fetch(GOOGLE_SHEET_URL + '?action=getOrders');
            const text = await res.text();
            // Only parse if it looks like a JSON array
            if (!text.trim().startsWith('[')) {
                console.log('Cloud orders: unexpected response, keeping local data.');
                renderOrders(); // Re-render to clear the loading row
                return;
            }
            const cloudOrders = JSON.parse(text);
            if (Array.isArray(cloudOrders) && cloudOrders.length > 0) {
                const localOrders = getOrders();
                const map = new Map();
                // Local orders are master, cloud adds new ones
                localOrders.forEach(o => map.set(o.id, o));
                cloudOrders.forEach(o => {
                    if (!map.has(o.id) && o.id) map.set(o.id, o);
                });
                const merged = Array.from(map.values());
                localStorage.setItem('kiras_orders', JSON.stringify(merged));
                
                // Update Last Sync
                localStorage.setItem('kiras_last_sync_orders', new Date().toLocaleString('en-US'));
                updateLastSyncUI();
                
                renderOrders();
            } else {
                renderOrders(); // clear loading row if no orders
            }
        } catch(err) {
            console.log('Cloud sync notice:', err);
            renderOrders(); // clear loading row on error
        }
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
                <td><strong>${escapeHtml(order.name)}</strong><br><small style="color:var(--c-text-muted);">${escapeHtml(order.email)}</small></td>
                <td>
                    <span style="font-weight:600;">${escapeHtml(order.material)}</span><br>
                    <small style="color:var(--c-text-muted);">${escapeHtml((order.details || '').substring(0, 35))}${(order.details || '').length > 35 ? '...' : ''}</small>
                    ${hasSnapshot ? `<br><button class="clay-btn btn-sm btn-view-design" data-id="${escapeHtml(order.id)}" style="margin-top:0.4rem; padding:0.25rem 0.6rem; font-size:0.75rem; background:var(--c-primary); color:#FFF;">🎨 View Custom Design</button>` : ''}
                </td>
                <td><strong>${escapeHtml(order.estimatedPrice || '৳0')}</strong></td>
                <td>
                    <select class="clay-select status-switcher" data-id="${escapeHtml(order.id)}" style="padding:0.3rem 0.6rem; font-size:0.85rem; width:auto;">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>⏳ Pending</option>
                        <option value="Printing" ${order.status === 'Printing' ? 'selected' : ''}>⚙️ Printing</option>
                        <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>✅ Completed</option>
                    </select>
                </td>
                <td>
                    <button class="clay-btn btn-sm btn-delete-order" data-id="${escapeHtml(order.id)}" style="padding:0.3rem 0.6rem; background:#FF5E5E; color:#FFF; font-size:0.8rem;">Delete</button>
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

        // Attach Status Change Listeners
        tbody.querySelectorAll('.status-switcher').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                const newStatus = e.target.value;
                const allOrders = getOrders();
                const targetOrder = allOrders.find(o => o.id === id);
                if (targetOrder) {
                    targetOrder.status = newStatus;
                    saveOrders(allOrders);
                    showToast(`Order ${id} status updated to ${newStatus}`);
                    
                    // Sync this specific update to Google Sheets
                    const params = new URLSearchParams({
                        id: targetOrder.id || '',
                        date: targetOrder.date || '',
                        name: targetOrder.name || '',
                        email: targetOrder.email || '',
                        material: targetOrder.material || '',
                        details: targetOrder.details || '',
                        estimatedPrice: targetOrder.estimatedPrice || '',
                        status: targetOrder.status || 'Pending'
                    });
                    try {
                        fetch(GOOGLE_SHEET_URL + '?' + params.toString(), { mode: 'no-cors' });
                    } catch(err) {}
                }
            });
        });

        // Attach Delete Listeners
        tbody.querySelectorAll('.btn-delete-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm(`Are you sure you want to delete order ${id}?`)) {
                    let allOrders = getOrders();
                    allOrders = allOrders.filter(o => o.id !== id);
                    saveOrders(allOrders);
                    showToast(`Order ${id} deleted`);
                }
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

    // Google Sheets Sync
    const btnSyncSheets = document.getElementById('btn-sync-sheets');
    if (btnSyncSheets) {
        btnSyncSheets.addEventListener('click', () => {
            // First fetch the latest from cloud
            fetchCloudOrders();
            
            // Then sync local status updates to cloud (only pushing, Apps Script handles Upsert)
            const orders = getOrders();
            orders.forEach(order => {
                const params = new URLSearchParams({
                    id: order.id || '',
                    date: order.date || '',
                    name: order.name || '',
                    email: order.email || '',
                    material: order.material || '',
                    details: order.details || '',
                    estimatedPrice: order.estimatedPrice || '',
                    status: order.status || 'Pending'
                });
                try {
                    fetch(GOOGLE_SHEET_URL + '?' + params.toString(), { mode: 'no-cors' });
                } catch(e) {}
            });
            showToast(`✓ Synced cloud data successfully!`);
        });
    }

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
    const viewOrders = document.getElementById('view-orders');
    const viewProducts = document.getElementById('view-products');
    const viewUsers = document.getElementById('view-users');

    function resetTabs() {
        if(tabOrders) { tabOrders.style.background = 'transparent'; tabOrders.style.color = 'var(--c-text)'; }
        if(tabProducts) { tabProducts.style.background = 'transparent'; tabProducts.style.color = 'var(--c-text)'; }
        if(tabUsers) { tabUsers.style.background = 'transparent'; tabUsers.style.color = 'var(--c-text)'; }
        if(viewOrders) viewOrders.style.display = 'none';
        if(viewProducts) viewProducts.style.display = 'none';
        if(viewUsers) viewUsers.style.display = 'none';
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
            loadProducts();
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

    async function loadUsers() {
        const tbody = document.getElementById('admin-users-tbody');
        if (!tbody) return;
        
        let users = JSON.parse(localStorage.getItem('kiras_users')) || [];
        
        // Try fetching from Google Sheet
        try {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem;">Loading users from cloud...</td></tr>';
            const res = await fetch(GOOGLE_SHEET_URL + '?action=getUsers');
            const cloudUsers = await res.json();
            if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
                const map = new Map();
                // We reverse the cloud users to keep newest at the top, if sheet appends to bottom
                cloudUsers.reverse().forEach(u => map.set(u.email, u));
                users.forEach(u => {
                    if (!map.has(u.email)) map.set(u.email, u);
                });
                users = Array.from(map.values());
                localStorage.setItem('kiras_users', JSON.stringify(users));
            }
        } catch (err) {
            console.log('User cloud sync notice:', err);
        }

        tbody.innerHTML = '';
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem;">No registered users found.</td></tr>';
            return;
        }

        users.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:700; color:var(--c-primary);">${u.id || '-'}</td>
                <td style="font-weight:600;">${u.name}</td>
                <td>${u.email}</td>
                <td>${u.phone || '-'}</td>
                <td>
                    <span class="masked-pwd" data-pwd="${u.password}">••••••••</span>
                    <button class="clay-btn btn-sm" onclick="this.previousElementSibling.textContent = this.previousElementSibling.textContent === '••••••••' ? this.previousElementSibling.dataset.pwd : '••••••••'" style="padding: 0.2rem 0.5rem; margin-left: 0.5rem; font-size: 0.7rem; background: rgba(0,0,0,0.05); color: var(--c-text);">👁️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // --- Products Logic ---
    function getProducts() {
        let products = JSON.parse(localStorage.getItem('kiras_products'));
        let needsSave = false;
        if (!products || products.length === 0) {
            products = (typeof defaultProducts !== 'undefined') ? defaultProducts : [];
            needsSave = true;
        } else if (typeof defaultProducts !== 'undefined') {
            products.forEach(dp => {
                const defP = defaultProducts.find(x => x.id === dp.id);
                if (defP) {
                    if (defP.price && dp.price !== defP.price) {
                        dp.price = defP.price;
                        needsSave = true;
                    }
                    if (!dp.descKey && defP.descKey) {
                        dp.descKey = defP.descKey;
                        needsSave = true;
                    }
                    if (!dp.badgeI18n && defP.badgeI18n) {
                        dp.badgeI18n = defP.badgeI18n;
                        needsSave = true;
                    }
                }
            });
            defaultProducts.forEach(defP => {
                if (!products.some(dp => dp.id === defP.id)) {
                    products.push(defP);
                    needsSave = true;
                }
            });
        }
        if (needsSave) {
            localStorage.setItem('kiras_products', JSON.stringify(products));
        }
        return products;
    }

    let adminCurrentPage = 1;
    const adminItemsPerPage = 8;

    function saveProducts(products) {
        localStorage.setItem('kiras_products', JSON.stringify(products));
        loadProducts();
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
            btn.addEventListener('click', () => {
                const index = btn.getAttribute('data-index');
                if (confirm('Delete this product?')) {
                    const allP = getProducts();
                    allP.splice(index, 1);
                    saveProducts(allP);
                    showToast('Product deleted successfully');
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
        editProductForm.addEventListener('submit', (e) => {
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
                ...allP[index],
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
            
            saveProducts(allP);
            showToast('Product updated successfully!');
            document.getElementById('editProductModal').classList.remove('open');
        });
    }

    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
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
            saveProducts(allP);
            showToast('Product added successfully!');
            addProductForm.reset();
        });
    }

    checkAuth();
});