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
            return JSON.parse(stored);
        } catch(e) {
            return initialDemoOrders;
        }
    }

    async function fetchCloudOrders() {
        try {
            const res = await fetch(GOOGLE_SHEET_URL + '?action=getOrders');
            const cloudOrders = await res.json();
            if (Array.isArray(cloudOrders) && cloudOrders.length > 0) {
                const localOrders = getOrders();
                const map = new Map();
                // Cloud orders first
                cloudOrders.reverse().forEach(o => map.set(o.id, o));
                localOrders.forEach(o => {
                    if (!map.has(o.id)) map.set(o.id, o);
                });
                const merged = Array.from(map.values());
                localStorage.setItem('kiras_orders', JSON.stringify(merged));
                renderOrders();
            }
        } catch(err) {
            console.log('Cloud sync notice:', err);
        }
    }

    function saveOrders(orders) {
        localStorage.setItem('kiras_orders', JSON.stringify(orders));
        renderOrders();
    }

    let activeFilter = 'All';

    function loadOrders() {
        renderOrders();
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
            const val = parseFloat((o.estimatedPrice || '$0').replace(/[^0-9.]/g, '')) || 0;
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

            tr.innerHTML = `
                <td><strong style="color:var(--c-primary);">${escapeHtml(order.id)}</strong></td>
                <td style="font-size:0.9rem;">${escapeHtml(order.date)}<br><small style="color:var(--c-text-muted);">${escapeHtml(order.time || '')}</small></td>
                <td><strong>${escapeHtml(order.name)}</strong><br><small style="color:var(--c-text-muted);">${escapeHtml(order.email)}</small></td>
                <td><span style="font-weight:600;">${escapeHtml(order.material)}</span><br><small style="color:var(--c-text-muted);">${escapeHtml((order.details || '').substring(0, 35))}${(order.details || '').length > 35 ? '...' : ''}</small></td>
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
        if (!str) return '';
        return str.replace(/[&<>"']/g, function(m) {
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

                const getUrl = GOOGLE_SHEET_URL + '?' + params.toString();
                
                try {
                    fetch(getUrl, { mode: 'no-cors' });
                } catch(e) {
                    const b = new Image();
                    b.src = getUrl;
                }
            });
            showToast(`✓ Synced ${orders.length} order records live to Google Sheets!`);
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

    checkAuth();
});
