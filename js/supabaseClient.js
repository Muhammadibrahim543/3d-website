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
            console.warn("⚠️ [KiraDB] Failed to initialize Supabase client, falling back to LocalStorage:", e);
            supabase = null;
        }
    } else {
        console.log("ℹ️ [KiraDB] Running in LocalStorage mode (Supabase credentials not set or SDK not loaded).");
    }

    const KiraDB = {
        isCloudEnabled: () => Boolean(supabase),

        // ==========================================
        // AUTHENTICATION
        // ==========================================
        auth: {
            async signUp(email, password, fullName = '') {
                if (supabase) {
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: { full_name: fullName, role: 'customer' }
                        }
                    });
                    if (error) throw error;
                    return data.user;
                } else {
                    // Local fallback
                    const users = JSON.parse(localStorage.getItem('kiras_users') || '[]');
                    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
                        throw new Error('User with this email already exists.');
                    }
                    const newUser = {
                        id: 'usr_' + Date.now(),
                        email,
                        password, // Stored locally only in fallback
                        name: fullName || email.split('@')[0],
                        avatar: 'av_robo',
                        role: 'customer',
                        phone: '',
                        createdAt: new Date().toISOString()
                    };
                    users.push(newUser);
                    localStorage.setItem('kiras_users', JSON.stringify(users));
                    localStorage.setItem('kiras_active_user', JSON.stringify(newUser));
                    return newUser;
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
                        phone: profile?.phone || ''
                    };
                    localStorage.setItem('kiras_active_user', JSON.stringify(mergedUser));
                    return mergedUser;
                } else {
                    // Local fallback
                    const users = JSON.parse(localStorage.getItem('kiras_users') || '[]');
                    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
                    if (!user) {
                        throw new Error('Invalid email or password.');
                    }
                    localStorage.setItem('kiras_active_user', JSON.stringify(user));
                    return user;
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
                        phone: profile?.phone || ''
                    };
                    localStorage.setItem('kiras_active_user', JSON.stringify(user));
                    return user;
                } else {
                    return JSON.parse(localStorage.getItem('kiras_active_user'));
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

                    const { error } = await supabase
                        .from('profiles')
                        .update(dbUpdates)
                        .eq('id', user.id);
                    if (error) throw error;
                    return await KiraDB.auth.getCurrentUser();
                } else {
                    let users = JSON.parse(localStorage.getItem('kiras_users') || '[]');
                    const idx = users.findIndex(u => u.id === user.id || u.email === user.email);
                    const updated = { ...user, ...updates };
                    if (idx !== -1) users[idx] = updated;
                    localStorage.setItem('kiras_users', JSON.stringify(users));
                    localStorage.setItem('kiras_active_user', JSON.stringify(updated));
                    return updated;
                }
            }
        },

        // ==========================================
        // PRODUCTS
        // ==========================================
        products: {
            async getAll() {
                if (supabase) {
                    const { data, error } = await supabase
                        .from('products')
                        .select('*')
                        .eq('is_active', true)
                        .order('created_at', { ascending: false });
                    if (error) {
                        console.warn("[KiraDB] Failed to fetch products from Supabase, using local defaults:", error);
                        return window.defaultProducts || [];
                    }
                    if (data && data.length > 0) {
                        // Normalize format for existing UI
                        return data.map(p => ({
                            id: p.id,
                            title: { en: p.title_en, bn: p.title_bn || p.title_en },
                            category: p.category,
                            price: Number(p.price),
                            oldPrice: p.old_price ? Number(p.old_price) : null,
                            specs: p.specs,
                            description: { en: p.description_en, bn: p.description_bn || p.description_en },
                            image: p.image_url
                        }));
                    }
                }
                
                // Fallback
                const local = localStorage.getItem('kiras_products');
                if (local) {
                    try { return JSON.parse(local); } catch(e) {}
                }
                return window.defaultProducts || [];
            },

            async saveAll(productsList) {
                localStorage.setItem('kiras_products', JSON.stringify(productsList));
                if (supabase) {
                    // Optional sync of bulk products to cloud
                    for (const p of productsList) {
                        await supabase.from('products').upsert({
                            id: p.id,
                            title_en: p.title?.en || p.title || '',
                            title_bn: p.title?.bn || '',
                            category: p.category || 'general',
                            price: p.price,
                            old_price: p.oldPrice || null,
                            specs: p.specs || '',
                            description_en: p.description?.en || '',
                            description_bn: p.description?.bn || '',
                            image_url: p.image || '',
                            is_active: true
                        });
                    }
                }
            }
        },

        // ==========================================
        // ORDERS
        // ==========================================
        orders: {
            async create(orderPayload) {
                const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
                const orderData = {
                    id: orderPayload.id || orderId,
                    customer_name: orderPayload.name || orderPayload.customer_name,
                    customer_email: orderPayload.email || orderPayload.customer_email || '',
                    customer_phone: orderPayload.phone || orderPayload.customer_phone,
                    shipping_address: orderPayload.address || orderPayload.shipping_address || '',
                    notes: orderPayload.notes || '',
                    items: orderPayload.items || [],
                    custom_3d_specs: orderPayload.customSpecs || orderPayload.custom_3d_specs || null,
                    model_file_url: orderPayload.modelFileUrl || null,
                    subtotal: Number(orderPayload.subtotal || orderPayload.totalAmount || 0),
                    delivery_fee: Number(orderPayload.deliveryFee || 0),
                    total_amount: Number(orderPayload.totalAmount || orderPayload.total || 0),
                    status: 'pending',
                    payment_method: orderPayload.paymentMethod || 'cod',
                    payment_status: 'unpaid',
                    created_at: new Date().toISOString()
                };

                // LocalStorage mirror
                let localOrders = JSON.parse(localStorage.getItem('kiras_orders') || '[]');
                localOrders.unshift(orderData);
                localStorage.setItem('kiras_orders', JSON.stringify(localOrders));

                if (supabase) {
                    try {
                        const user = await KiraDB.auth.getCurrentUser();
                        if (user && user.id) {
                            orderData.user_id = user.id;
                        }
                        const { data, error } = await supabase.from('orders').insert([orderData]).select().single();
                        if (error) {
                            console.warn("[KiraDB] Supabase order insert error:", error);
                        } else {
                            return data;
                        }
                    } catch (err) {
                        console.error("[KiraDB] Failed to insert into Supabase:", err);
                    }
                }
                return orderData;
            },

            async getAll() {
                if (supabase) {
                    const { data, error } = await supabase
                        .from('orders')
                        .select('*')
                        .order('created_at', { ascending: false });
                    if (!error && data) return data;
                }
                return JSON.parse(localStorage.getItem('kiras_orders') || '[]');
            },

            async getForUser(userId) {
                if (supabase && userId) {
                    const { data, error } = await supabase
                        .from('orders')
                        .select('*')
                        .eq('user_id', userId)
                        .order('created_at', { ascending: false });
                    if (!error && data) return data;
                }
                const local = JSON.parse(localStorage.getItem('kiras_orders') || '[]');
                return local.filter(o => o.user_id === userId || o.customer_email === userId);
            },

            async updateStatus(orderId, status, paymentStatus) {
                // Update local mirror
                let orders = JSON.parse(localStorage.getItem('kiras_orders') || '[]');
                const idx = orders.findIndex(o => o.id === orderId);
                if (idx !== -1) {
                    if (status) orders[idx].status = status;
                    if (paymentStatus) orders[idx].payment_status = paymentStatus;
                    localStorage.setItem('kiras_orders', JSON.stringify(orders));
                }

                if (supabase) {
                    const updates = { updated_at: new Date().toISOString() };
                    if (status) updates.status = status;
                    if (paymentStatus) updates.payment_status = paymentStatus;
                    await supabase.from('orders').update(updates).eq('id', orderId);
                }
                return true;
            }
        },

        // ==========================================
        // 3D MODEL FILE CLOUD STORAGE
        // ==========================================
        storage: {
            async uploadModel(blobOrFile, fileName) {
                if (!supabase) {
                    console.log("[KiraDB] Storage upload skipped in LocalStorage mode.");
                    return null;
                }
                try {
                    const cleanName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
                    const bucket = window.KIRA_CONFIG.STORAGE_BUCKET || 'custom-3d-models';
                    const { data, error } = await supabase.storage
                        .from(bucket)
                        .upload(cleanName, blobOrFile, {
                            contentType: fileName.endsWith('.3mf') ? 'application/vnd.ms-package.3dmanufacturing-3dmodel+xml' : 'application/sla',
                            upsert: true
                        });
                    if (error) {
                        console.warn("[KiraDB] Upload to Supabase Storage failed:", error);
                        return null;
                    }
                    const { data: publicUrlData } = supabase.storage
                        .from(bucket)
                        .getPublicUrl(cleanName);
                    return publicUrlData?.publicUrl || null;
                } catch (e) {
                    console.error("[KiraDB] File upload exception:", e);
                    return null;
                }
            }
        }
    };

    window.KiraDB = KiraDB;
})();
