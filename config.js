// Pricing and Configuration
export const config = {
  // Supabase configuration
  supabase: {
    url: 'https://qjaaroailyblgntedppj.supabase.co',
    anonKey: 'sb_publishable_rnEgmJXPOA0HnhgGXiPCBA_aLc-HqWE'
  },
  
  // Vehicle configuration with Supabase car IDs
  vehicles: {
    model3: {
      id: 1, // Matches Supabase cars table
      name: 'Tesla Model 3',
      dailyRate: 12000,
      insuranceFee: 1500,
      minDays: 1
    },
    modelY: {
      id: 2, // Matches Supabase cars table
      name: 'Tesla Model Y',
      dailyRate: 15000,
      insuranceFee: 2000,
      minDays: 1
    }
  },
  
  pricing: {
    model3: {
      name: 'Tesla Model 3',
      basePrice: {
        weekday: 12000,
        weekend: 15000,
        peak: 18000
      },
      minDays: 1
    },
    modelY: {
      name: 'Tesla Model Y',
      basePrice: {
        weekday: 15000,
        weekend: 18000,
        peak: 22000
      },
      minDays: 1
    }
  },
  
  addons: {
    etc: { name: 'ETC Card', price: 500 },
    childSeat: { name: 'Child Seat', price: 1000 },
    insurance: { name: 'Additional Insurance', price: 2000 }
  },
  
  fees: {
    lateReturn: { name: 'Late Return (per hour)', price: 2000 },
    overnight: { name: 'Overnight Fee (11PM-6AM)', price: 3000 },
    cleaning: { name: 'Cleaning Fee', price: 5000 },
    lowCharge: { name: 'Low Battery Return (<20%)', price: 3000 }
  },
  
  location: {
    name: 'Nippori Station',
    address: '〒116-0013 Tokyo, Arakawa, Nishi-Nippori, 2-chome',
    coordinates: { lat: 35.7318, lng: 139.7671 }
  },
  
  contact: {
    email: 'booking@tokyoevrental.com',
    phone: '+81-3-1234-5678',
    line: '@tokyoev',
    hours: '9:00 - 18:00 (JST)'
  },
  
  branding: {
    name: 'Tokyo EV Rental',
    tagline: 'Premium Electric Vehicles for Your Tokyo Journey',
    colors: {
      primary: '#2563eb',
      secondary: '#10b981',
      accent: '#f59e0b',
      dark: '#1f2937',
      light: '#f9fafb'
    }
  }
};

export function calculatePrice(vehicle, startDate, endDate, addons = []) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
  if (days < 1) return null;
  
  const vehicleConfig = config.pricing[vehicle];
  if (!vehicleConfig) return null;
  
  // Simple weekday/weekend calculation (can be enhanced)
  const dayOfWeek = start.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const dailyRate = isWeekend ? vehicleConfig.basePrice.weekend : vehicleConfig.basePrice.weekday;
  
  const rentalCost = dailyRate * days;
  
  let addonsCost = 0;
  const addonsBreakdown = [];
  
  addons.forEach(addonKey => {
    if (config.addons[addonKey]) {
      const addon = config.addons[addonKey];
      const cost = addon.price * days;
      addonsCost += cost;
      addonsBreakdown.push({
        name: addon.name,
        unitPrice: addon.price,
        quantity: days,
        total: cost
      });
    }
  });
  
  const total = rentalCost + addonsCost;
  
  return {
    vehicle: vehicleConfig.name,
    days,
    dailyRate,
    rentalCost,
    addons: addonsBreakdown,
    addonsCost,
    total,
    breakdown: {
      'Vehicle Rental': rentalCost,
      'Add-ons': addonsCost,
      'Total': total
    }
  };
}

export function generateBookingId() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `NYR-${dateStr}-${random}`;
}
