/**
 * KIRA'S CREATION SOFT-3D STUDIO - CONFIGURATION
 * 
 * Connected to live Supabase Cloud Backend (100% Zero-Cost Tier)
 */

window.KIRA_CONFIG = {
    // Your Supabase Project URL
    SUPABASE_URL: 'https://yfnhinmjkqnsjejpzehk.supabase.co',

    // Your Supabase Anonymous Public API Key
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlmbmhpbm1qa3Fuc2planB6ZWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NzA2NTcsImV4cCI6MjEwNTE0NjY1N30.ARC1islViW9e1y9ga-n10vl9JKaWjNOY-IeOKAv9ejc',

    // Supabase Storage Bucket for custom 3D models (.3mf / .stl)
    STORAGE_BUCKET: 'custom-3d-models',

    // Helper to check if Supabase is active
    get isSupabaseReady() {
        return Boolean(
            this.SUPABASE_URL && 
            this.SUPABASE_ANON_KEY && 
            this.SUPABASE_URL.startsWith('http') && 
            !this.SUPABASE_URL.includes('YOUR_')
        );
    }
};
