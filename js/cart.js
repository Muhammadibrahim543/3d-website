/* ==========================================================================
   KIRA'S CREATION - SHOPPING CART & DRAWER MANAGER (js/cart.js)
   ========================================================================== */

(function() {
    window.KiraCart = {
        getItems: function() {
            try {
                return JSON.parse(localStorage.getItem('kiras_cart')) || [];
            } catch(e) {
                return [];
            }
        },

        setItems: function(items) {
            localStorage.setItem('kiras_cart', JSON.stringify(items));
            this.updateUI();
        },

        addItem: function(item) {
            let items = this.getItems();
            // Check if identical item already exists (by title and specs)
            const idx = items.findIndex(i => i.title === item.title && i.specs === item.specs);
            if (idx !== -1) {
                items[idx].quantity += (item.quantity || 1);
            } else {
                items.push({
                    id: 'cart_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2,4),
                    title: item.title,
                    specs: item.specs || '',
                    price: item.price, // string format e.g. "৳484"
                    numPrice: item.numPrice || parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0,
                    quantity: item.quantity || 1,
                    image: item.image || 'images/torii_gate_lamp.webp',
                    customData: item.customData || null
                });
            }

            this.setItems(items);
            if (window.showToast) {
                showToast(`🛒 ${item.title} added to cart!`);
            }
            this.openDrawer();
        },

        removeItem: function(id) {
            let items = this.getItems();
            items = items.filter(i => i.id !== id);
            this.setItems(items);
        },

        updateQty: function(id, delta) {
            let items = this.getItems();
            const item = items.find(i => i.id === id);
            if (item) {
                item.quantity += delta;
                if (item.quantity <= 0) {
                    items = items.filter(i => i.id !== id);
                }
            }
            this.setItems(items);
        },

        clear: function() {
            this.setItems([]);
        },

        getTotalCount: function() {
            const items = this.getItems();
            return items.reduce((sum, item) => sum + item.quantity, 0);
        },

        getTotalPrice: function() {
            const items = this.getItems();
            return items.reduce((sum, item) => sum + (item.numPrice * item.quantity), 0);
        },

        openDrawer: function() {
            let drawer = document.getElementById('cart-drawer-overlay');
            if (!drawer) {
                this.injectCartDrawer();
                drawer = document.getElementById('cart-drawer-overlay');
            }
            drawer.classList.add('open');
            this.updateUI();
        },

        closeDrawer: function() {
            const drawer = document.getElementById('cart-drawer-overlay');
            if (drawer) drawer.classList.remove('open');
        },

        injectCartDrawer: function() {
            if (document.getElementById('cart-drawer-overlay')) return;
            const lang = localStorage.getItem('shapey_lang') || 'en';

            const drawerHTML = `
                <div id="cart-drawer-overlay" class="cart-drawer-overlay" onclick="if(event.target===this) KiraCart.closeDrawer()">
                    <div class="cart-drawer">
                        <div class="cart-drawer-header">
                            <div class="cart-drawer-title" data-i18n="cart_title">
                                🛒 ${lang === 'en' ? 'Your Shopping Cart' : 'আপনার শপিং কার্ট'}
                            </div>
                            <button class="cart-close-btn" onclick="KiraCart.closeDrawer()">✕</button>
                        </div>

                        <div id="cart-items-list" class="cart-items-list">
                            <!-- Cart items rendered dynamically -->
                        </div>

                        <div class="cart-drawer-footer">
                            <div class="cart-subtotal-row">
                                <span data-i18n="cart_subtotal">${lang === 'en' ? 'Subtotal:' : 'মোট মূল্য:'}</span>
                                <span id="cart-total-price" style="color:var(--c-primary);">৳0</span>
                            </div>
                            <button class="clay-btn btn-coral btn-block btn-lg" onclick="KiraCart.checkout()" data-i18n="cart_checkout">
                                ${lang === 'en' ? 'Complete Checkout' : 'অর্ডার সম্পন্ন করুন'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', drawerHTML);
        },

        updateUI: function() {
            const count = this.getTotalCount();
            const total = this.getTotalPrice();
            const lang = localStorage.getItem('shapey_lang') || 'en';

            // Update header cart triggers & count badges
            document.querySelectorAll('.cart-count-badge').forEach(badge => {
                badge.textContent = count;
                badge.style.display = count > 0 ? 'inline-flex' : 'none';
            });

            // Update drawer list
            const listEl = document.getElementById('cart-items-list');
            const totalEl = document.getElementById('cart-total-price');

            if (totalEl) {
                totalEl.textContent = '৳' + total.toLocaleString('en-US');
            }

            if (listEl) {
                const items = this.getItems();
                if (items.length === 0) {
                    listEl.innerHTML = `
                        <div style="text-align:center; padding:3rem 1rem; color:var(--c-text-muted);">
                            <div style="font-size:3rem; margin-bottom:0.8rem;">🛒</div>
                            <p data-i18n="cart_empty">${lang === 'en' ? 'Your shopping cart is currently empty.' : 'আপনার শপিং কার্ট বর্তমানে খালি রয়েছে।'}</p>
                            <a href="customize.html" onclick="KiraCart.closeDrawer()" class="clay-btn btn-cream btn-sm" style="margin-top:1rem; display:inline-flex;">
                                🎨 Create 3D Print
                            </a>
                        </div>
                    `;
                } else {
                    listEl.innerHTML = items.map(item => `
                        <div class="cart-item-row">
                            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                            <div class="cart-item-info">
                                <div class="cart-item-title">${item.title}</div>
                                <div class="cart-item-meta">${item.specs}</div>
                                <div class="cart-item-price">৳${(item.numPrice * item.quantity).toLocaleString('en-US')}</div>
                            </div>
                            <div class="cart-qty-controls">
                                <button class="cart-qty-btn" onclick="KiraCart.updateQty('${item.id}', -1)">-</button>
                                <span style="font-weight:700; font-size:0.9rem; padding:0 4px;">${item.quantity}</span>
                                <button class="cart-qty-btn" onclick="KiraCart.updateQty('${item.id}', 1)">+</button>
                            </div>
                        </div>
                    `).join('');
                }
            }
        },

        checkout: async function() {
            const items = this.getItems();
            if (items.length === 0) {
                if (window.showToast) showToast('Your cart is empty!');
                return;
            }

            const user = window.KiraAuth ? KiraAuth.getCurrentUser() : null;
            const userEmail = user ? user.email : 'guest@kira.com';
            const userName = user ? user.name : 'Valued Customer';

            const orderId = 'KC-' + Date.now().toString(36).toUpperCase();
            const orderDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const orderTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const totalPrice = '৳' + this.getTotalPrice().toLocaleString('en-US');

            const newOrder = {
                id: orderId,
                date: orderDate,
                time: orderTime,
                name: userName,
                email: userEmail,
                items: items,
                details: items.map(i => `${i.quantity}x ${i.title} (${i.specs}) - ৳${(i.numPrice * i.quantity).toLocaleString('en-US')}`).join('\n'),
                status: 'Pending',
                estimatedPrice: totalPrice,
                snapshot: items[0] ? items[0].image : null
            };

            // Save to kiras_orders in localStorage
            let orders = [];
            try {
                orders = JSON.parse(localStorage.getItem('kiras_orders')) || [];
            } catch(e) {}
            orders.unshift(newOrder);
            localStorage.setItem('kiras_orders', JSON.stringify(orders));

            // Send to Google Sheets Cloud
            const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxlT_uFe-8zMu_LFpMZsGRQPaQuzcIxFZfmFa195FMp1b0IFJP-blzHYoFSv-nj_cs/exec';
            const params = new URLSearchParams({
                id: newOrder.id,
                date: newOrder.date,
                name: newOrder.name,
                email: newOrder.email,
                material: 'Custom 3D Product Cart',
                details: newOrder.details,
                estimatedPrice: newOrder.estimatedPrice,
                status: newOrder.status
            });
            try {
                // await the fetch so the browser doesn't cancel it during redirect
                await fetch(GOOGLE_SHEET_URL + '?' + params.toString(), { mode: 'no-cors' });
            } catch (err) {
                const beacon = new Image();
                beacon.src = GOOGLE_SHEET_URL + '?' + params.toString();
            }

            // Clear cart
            this.clear();
            this.closeDrawer();

            if (window.showToast) {
                showToast(`🎉 Order ${orderId} placed successfully!`);
            }

            // Redirect to account page or WhatsApp confirmation
            const waItemsText = items.map(i => `• ${i.quantity}x ${i.title} (${i.specs}) - ৳${(i.numPrice * i.quantity).toLocaleString('en-US')}`).join('\n');
            const waMsg = `Hi Studio Kira's Creation! I have placed an order (${orderId}):\n\nCustomer: ${userName} (${userEmail})\n\nOrder Items:\n${waItemsText}\n\nTotal Price: ${totalPrice}\n\nPlease confirm my order status!`;
            
            setTimeout(() => {
                window.location.href = `account.html#orders`;
                window.open(`https://wa.me/8801793500131?text=${encodeURIComponent(waMsg)}`, '_blank');
            }, 1000);
        }
    };

    // Init on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        KiraCart.injectCartDrawer();
        KiraCart.updateUI();
    });
})();
