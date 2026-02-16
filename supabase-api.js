// Supabase API Functions
// Tokyo EV Rental - Database Operations

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(
  'https://qjaaroailyblgntedppj.supabase.co',
  'sb_publishable_rnEgmJXPOA0HnhgGXiPCBA_aLc-HqWE'
);

// ====================
// CARS / FLEET FUNCTIONS
// ====================

/**
 * Fetch all active cars from the database
 * @returns {Promise<Array>} Array of car objects
 */
async function getAllCars() {
  try {
    const { data, error } = await supabaseClient
      .from('cars')
      .select('*')
      .eq('is_active', true)
      .order('model', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}

/**
 * Get a specific car by ID
 * @param {string} carId - The car ID
 * @returns {Promise<Object>} Car object
 */
async function getCarById(carId) {
  try {
    const { data, error } = await supabaseClient
      .from('cars')
      .select('*')
      .eq('id', carId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching car:', error);
    return null;
  }
}

/**
 * Check car availability for specific dates
 * @param {string} carId - The car ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<boolean>} True if available, false if booked
 */
async function checkCarAvailability(carId, startDate, endDate) {
  try {
    // Check if there are any bookings that overlap with requested dates
    const { data, error } = await supabaseClient
      .from('bookings')
      .select('id')
      .eq('car_id', carId)
      .in('status', ['confirmed', 'pending'])
      .or(`and(pickup_date.lte.${endDate},return_date.gte.${startDate})`);
    
    if (error) throw error;
    return data.length === 0; // Available if no overlapping bookings
  } catch (error) {
    console.error('Error checking availability:', error);
    return false;
  }
}

// ====================
// BOOKING REQUEST FUNCTIONS
// ====================

/**
 * Create a new booking request (pending approval)
 * @param {Object} bookingData - Booking information
 * @returns {Promise<Object>} Created booking request
 */
async function createBookingRequest(bookingData) {
  try {
    const bookingRequest = {
      booking_id: bookingData.booking_id,
      car_id: bookingData.car_id,
      customer_name: bookingData.customer_name,
      customer_email: bookingData.customer_email,
      customer_phone: bookingData.customer_phone,
      customer_address: bookingData.customer_address,
      pickup_date: bookingData.pickup_date,
      return_date: bookingData.return_date,
      total_days: bookingData.total_days,
      base_price: bookingData.base_price,
      insurance_cost: bookingData.insurance_cost,
      optional_insurance: bookingData.optional_insurance || false,
      baby_seat: bookingData.baby_seat || false,
      baby_seat_cost: bookingData.baby_seat_cost || 0,
      wifi: bookingData.wifi || false,
      wifi_cost: bookingData.wifi_cost || 0,
      etc_card: bookingData.etc_card || false,
      etc_card_cost: bookingData.etc_card_cost || 0,
      total_cost: bookingData.total_cost,
      special_requests: bookingData.special_requests || null,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabaseClient
      .from('booking_requests')
      .insert([bookingRequest])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating booking request:', error);
    throw error;
  }
}

/**
 * Get all booking requests (for admin)
 * @param {string} status - Filter by status (optional)
 * @returns {Promise<Array>} Array of booking requests
 */
async function getBookingRequests(status = null) {
  try {
    let query = supabaseClient
      .from('booking_requests')
      .select('*, cars(model, year)');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching booking requests:', error);
    return [];
  }
}

/**
 * Update booking request status
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status (pending, approved, rejected)
 * @returns {Promise<Object>} Updated booking request
 */
async function updateBookingRequestStatus(bookingId, status) {
  try {
    const { data, error } = await supabaseClient
      .from('booking_requests')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating booking request:', error);
    throw error;
  }
}

// ====================
// CONFIRMED BOOKINGS FUNCTIONS
// ====================

/**
 * Create a confirmed booking (after approval)
 * @param {Object} bookingData - Booking information
 * @returns {Promise<Object>} Created booking
 */
async function createConfirmedBooking(bookingData) {
  try {
    const booking = {
      booking_id: bookingData.booking_id,
      car_id: bookingData.car_id,
      customer_name: bookingData.customer_name,
      customer_email: bookingData.customer_email,
      customer_phone: bookingData.customer_phone,
      customer_address: bookingData.customer_address,
      pickup_date: bookingData.pickup_date,
      return_date: bookingData.return_date,
      total_days: bookingData.total_days,
      base_price: bookingData.base_price,
      insurance_cost: bookingData.insurance_cost,
      optional_insurance: bookingData.optional_insurance || false,
      baby_seat: bookingData.baby_seat || false,
      baby_seat_cost: bookingData.baby_seat_cost || 0,
      wifi: bookingData.wifi || false,
      wifi_cost: bookingData.wifi_cost || 0,
      etc_card: bookingData.etc_card || false,
      etc_card_cost: bookingData.etc_card_cost || 0,
      total_cost: bookingData.total_cost,
      special_requests: bookingData.special_requests || null,
      status: 'confirmed',
      payment_status: 'pending',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabaseClient
      .from('bookings')
      .insert([booking])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating confirmed booking:', error);
    throw error;
  }
}

/**
 * Get all confirmed bookings (for admin)
 * @param {string} status - Filter by status (optional)
 * @returns {Promise<Array>} Array of bookings
 */
async function getConfirmedBookings(status = null) {
  try {
    let query = supabaseClient
      .from('bookings')
      .select('*, cars(model, year, license_plate)');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query.order('pickup_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching confirmed bookings:', error);
    return [];
  }
}

/**
 * Get a specific booking by booking ID
 * @param {string} bookingId - The booking ID
 * @returns {Promise<Object>} Booking object
 */
async function getBookingById(bookingId) {
  try {
    const { data, error } = await supabaseClient
      .from('bookings')
      .select('*, cars(model, year, license_plate)')
      .eq('booking_id', bookingId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
}

/**
 * Update booking status
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status (confirmed, completed, cancelled)
 * @returns {Promise<Object>} Updated booking
 */
async function updateBookingStatus(bookingId, status) {
  try {
    const { data, error } = await supabaseClient
      .from('bookings')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}

/**
 * Update payment status
 * @param {string} bookingId - Booking ID
 * @param {string} paymentStatus - New payment status (pending, paid, refunded)
 * @returns {Promise<Object>} Updated booking
 */
async function updatePaymentStatus(bookingId, paymentStatus) {
  try {
    const { data, error } = await supabaseClient
      .from('bookings')
      .update({ 
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
}

// ====================
// HELPER FUNCTIONS
// ====================

/**
 * Generate a unique booking ID
 * @returns {string} Booking ID in format TEV-YYYYMMDD-XXXX
 */
function generateBookingId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 9000) + 1000;
  
  return `TEV-${year}${month}${day}-${random}`;
}

/**
 * Calculate total rental cost
 * @param {Object} params - Calculation parameters
 * @returns {Object} Cost breakdown
 */
function calculateRentalCost(params) {
  const {
    dailyRate,
    totalDays,
    insuranceFee,
    optionalInsurance = false,
    babySeat = false,
    wifi = false,
    etcCard = false
  } = params;

  const basePrice = dailyRate * totalDays;
  const insuranceCost = insuranceFee * totalDays;
  const optionalInsuranceCost = optionalInsurance ? 1500 * totalDays : 0;
  const babySeatCost = babySeat ? 500 * totalDays : 0;
  const wifiCost = wifi ? 500 * totalDays : 0;
  const etcCardCost = etcCard ? 330 * totalDays : 0;

  const totalCost = basePrice + insuranceCost + optionalInsuranceCost + 
                    babySeatCost + wifiCost + etcCardCost;

  return {
    base_price: basePrice,
    insurance_cost: insuranceCost,
    optional_insurance_cost: optionalInsuranceCost,
    baby_seat_cost: babySeatCost,
    wifi_cost: wifiCost,
    etc_card_cost: etcCardCost,
    total_cost: totalCost
  };
}

// Export functions for use in app
window.SupabaseAPI = {
  // Cars
  getAllCars,
  getCarById,
  checkCarAvailability,
  
  // Booking Requests
  createBookingRequest,
  getBookingRequests,
  updateBookingRequestStatus,
  
  // Confirmed Bookings
  createConfirmedBooking,
  getConfirmedBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus,
  
  // Helpers
  generateBookingId,
  calculateRentalCost
};
