// Supabase Configuration
// Tokyo EV Rental - Database Connection

const SUPABASE_CONFIG = {
  url: 'https://qjaaroailyblgntedppj.supabase.co',
  anonKey: 'sb_publishable_rnEgmJXPOA0HnhgGXiPCBA_aLc-HqWE',
  
  // Table names
  tables: {
    cars: 'cars',
    bookings: 'bookings',
    bookingRequests: 'booking_requests',
    admins: 'admins'
  }
};

// Initialize Supabase client
const supabase = supabase.createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);
