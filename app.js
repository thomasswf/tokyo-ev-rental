import { config, calculatePrice, generateBookingId } from './config.js';

// State management
const state = {
  currentPage: 'home',
  bookingData: {
    step: 1,
    vehicle: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    addons: [],
    pricing: null,
    customer: {}
  }
};

// Pages content
const pages = {
  home: () => `
    <section class="hero">
      <div class="container">
        <h1>Premium Tesla Rentals in Tokyo</h1>
        <p>Experience the future of driving with Model 3 & Model Y. Easy pickup at Nippori Station.</p>
        <a href="#book" class="btn btn-primary">Book Your Tesla Now</a>
      </div>
    </section>

    <section class="container">
      <h2 class="text-center">How It Works</h2>
      <div class="steps">
        <div class="step-card">
          <div class="step-number">1</div>
          <h3>Choose Your Tesla</h3>
          <p>Select Model 3 or Model Y and pick your dates</p>
        </div>
        <div class="step-card">
          <div class="step-number">2</div>
          <h3>See Total Price</h3>
          <p>Transparent pricing with detailed breakdown</p>
        </div>
        <div class="step-card">
          <div class="step-number">3</div>
          <h3>Confirm & Receive Email</h3>
          <p>Submit your details and get instant confirmation</p>
        </div>
      </div>
    </section>

    <section class="container">
      <h2 class="text-center">Our Fleet</h2>
      <div class="vehicle-grid">
        <div class="vehicle-card">
          <div class="vehicle-image">🚗</div>
          <div class="vehicle-info">
            <h3>Tesla Model 3</h3>
            <p>Sleek, efficient, and perfect for city driving</p>
            <div class="vehicle-specs">
              <span>👥 5 Seats</span>
              <span>🧳 2 Bags</span>
              <span>⚡ Long Range</span>
            </div>
            <div class="price">From ¥12,000/day</div>
            <a href="#book?vehicle=model3" class="btn btn-primary" style="width: 100%">Book Model 3</a>
          </div>
        </div>
        <div class="vehicle-card">
          <div class="vehicle-image">🚙</div>
          <div class="vehicle-info">
            <h3>Tesla Model Y</h3>
            <p>Spacious SUV for families and groups</p>
            <div class="vehicle-specs">
              <span>👥 7 Seats</span>
              <span>🧳 4 Bags</span>
              <span>⚡ All-Wheel Drive</span>
            </div>
            <div class="price">From ¥15,000/day</div>
            <a href="#book?vehicle=modelY" class="btn btn-primary" style="width: 100%">Book Model Y</a>
          </div>
        </div>
      </div>
    </section>

    <section class="container" style="background: var(--light); padding: 3rem 1.5rem; border-radius: 1rem; margin: 3rem auto;">
      <h2 class="text-center">Why Choose Tokyo EV?</h2>
      <div class="steps">
        <div class="step-card">
          <div style="font-size: 3rem; margin-bottom: 1rem;">✓</div>
          <h3>Transparent Pricing</h3>
          <p>No hidden fees. See complete breakdown before booking.</p>
        </div>
        <div class="step-card">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🛡️</div>
          <h3>Full Insurance</h3>
          <p>Comprehensive coverage included. Optional CDW available.</p>
        </div>
        <div class="step-card">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🌏</div>
          <h3>Tourist Friendly</h3>
          <p>International licenses accepted with IDP or translation.</p>
        </div>
      </div>
    </section>

    <section class="container">
      <h2 class="text-center">Frequently Asked Questions</h2>
      <div style="max-width: 800px; margin: 2rem auto;">
        ${renderFAQPreview()}
      </div>
      <div class="text-center mt-2">
        <a href="#faq" class="btn btn-outline">View All FAQs</a>
      </div>
    </section>
  `,

  fleet: () => `
    <section class="container">
      <h1 class="text-center">Our Tesla Fleet</h1>
      <p class="text-center" style="max-width: 600px; margin: 1rem auto 3rem; color: var(--gray);">
        Choose from our premium selection of Tesla vehicles. All cars are well-maintained, fully charged, and ready for your Tokyo adventure.
      </p>

      <div class="vehicle-grid">
        <div class="vehicle-card">
          <div class="vehicle-image">🚗</div>
          <div class="vehicle-info">
            <h3>Tesla Model 3</h3>
            <p>The perfect balance of performance, range, and efficiency. Ideal for couples and small families exploring Tokyo.</p>
            <div class="vehicle-specs">
              <span>👥 5 Seats</span>
              <span>🧳 2 Large Bags</span>
              <span>⚡ 500km Range</span>
              <span>🚀 0-100: 4.4s</span>
            </div>
            <h4 style="margin-top: 1.5rem;">Features:</h4>
            <ul style="color: var(--gray); margin: 0.5rem 0;">
              <li>Autopilot included</li>
              <li>Premium sound system</li>
              <li>Glass roof</li>
              <li>Wireless charging</li>
            </ul>
            <div class="price">¥12,000 - ¥18,000/day</div>
            <p style="font-size: 0.9rem; color: var(--gray);">Weekday / Weekend / Peak</p>
            <a href="#book?vehicle=model3" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Book Model 3</a>
          </div>
        </div>

        <div class="vehicle-card">
          <div class="vehicle-image">🚙</div>
          <div class="vehicle-info">
            <h3>Tesla Model Y</h3>
            <p>Spacious SUV with optional 7-seat configuration. Perfect for families and group trips with plenty of cargo space.</p>
            <div class="vehicle-specs">
              <span>👥 5-7 Seats</span>
              <span>🧳 4 Large Bags</span>
              <span>⚡ 480km Range</span>
              <span>🚀 0-100: 5.0s</span>
            </div>
            <h4 style="margin-top: 1.5rem;">Features:</h4>
            <ul style="color: var(--gray); margin: 0.5rem 0;">
              <li>All-Wheel Drive</li>
              <li>Power liftgate</li>
              <li>Panoramic glass roof</li>
              <li>Premium interior</li>
            </ul>
            <div class="price">¥15,000 - ¥22,000/day</div>
            <p style="font-size: 0.9rem; color: var(--gray);">Weekday / Weekend / Peak</p>
            <a href="#book?vehicle=modelY" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Book Model Y</a>
          </div>
        </div>
      </div>

      <div class="alert alert-info" style="max-width: 800px; margin: 3rem auto;">
        <strong>All vehicles include:</strong> Full insurance coverage, unlimited mileage, 24/7 roadside assistance, and complimentary charging at pickup location.
      </div>
    </section>
  `,

  pricing: () => `
    <section class="container">
      <h1 class="text-center">Transparent Pricing</h1>
      <p class="text-center" style="max-width: 600px; margin: 1rem auto 3rem; color: var(--gray);">
        No hidden fees. No surprises. See exactly what you'll pay before you book.
      </p>

      <div style="display: grid; gap: 2rem; max-width: 900px; margin: 0 auto;">
        <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2>Daily Rental Rates</h2>
          <table style="width: 100%; margin-top: 1rem; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border);">
                <th style="text-align: left; padding: 1rem;">Vehicle</th>
                <th style="padding: 1rem;">Weekday</th>
                <th style="padding: 1rem;">Weekend</th>
                <th style="padding: 1rem;">Peak Season</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 1rem; font-weight: 600;">Model 3</td>
                <td style="padding: 1rem; text-align: center;">¥12,000</td>
                <td style="padding: 1rem; text-align: center;">¥15,000</td>
                <td style="padding: 1rem; text-align: center;">¥18,000</td>
              </tr>
              <tr>
                <td style="padding: 1rem; font-weight: 600;">Model Y</td>
                <td style="padding: 1rem; text-align: center;">¥15,000</td>
                <td style="padding: 1rem; text-align: center;">¥18,000</td>
                <td style="padding: 1rem; text-align: center;">¥22,000</td>
              </tr>
            </tbody>
          </table>
          <p style="font-size: 0.9rem; color: var(--gray); margin-top: 1rem;">
            * Peak season: Golden Week, Obon, New Year holidays<br>
            * Weekend: Saturday & Sunday<br>
            * Minimum rental: 1 day (24 hours)
          </p>
        </div>

        <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2>Add-ons (Optional)</h2>
          <div style="margin-top: 1rem;">
            <div class="price-row">
              <span>ETC Card (per day)</span>
              <span>¥500</span>
            </div>
            <div class="price-row">
              <span>Child Seat (per day)</span>
              <span>¥1,000</span>
            </div>
            <div class="price-row">
              <span>Additional Insurance (CDW)</span>
              <span>¥2,000</span>
            </div>
          </div>
        </div>

        <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2>Additional Fees (if applicable)</h2>
          <div style="margin-top: 1rem;">
            <div class="price-row">
              <span>Late Return (per hour)</span>
              <span>¥2,000</span>
            </div>
            <div class="price-row">
              <span>Overnight Fee (11PM-6AM)</span>
              <span>¥3,000</span>
            </div>
            <div class="price-row">
              <span>Low Battery Return (&lt;20%)</span>
              <span>¥3,000</span>
            </div>
            <div class="price-row">
              <span>Excessive Cleaning</span>
              <span>¥5,000</span>
            </div>
          </div>
          <p style="font-size: 0.9rem; color: var(--gray); margin-top: 1rem;">
            These fees are only charged if applicable. Return on time with proper charge level to avoid fees.
          </p>
        </div>

        <div class="alert alert-info">
          <strong>What's Included:</strong> Basic insurance coverage, unlimited mileage, 24/7 roadside assistance, complimentary charging at pickup.
        </div>
      </div>

      <div class="text-center mt-2">
        <a href="#book" class="btn btn-primary" style="font-size: 1.2rem; padding: 1rem 2rem;">Book Your Tesla Now</a>
      </div>
    </section>
  `,

  'how-it-works': () => `
    <section class="container">
      <h1 class="text-center">How It Works</h1>
      <p class="text-center" style="max-width: 600px; margin: 1rem auto 3rem; color: var(--gray);">
        Simple pickup and return at Nippori Station. Here's everything you need to know.
      </p>

      <div style="max-width: 800px; margin: 0 auto;">
        <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 2rem;">
          <h2>📍 Pickup at Nippori Station</h2>
          <p><strong>Location:</strong> ${config.location.address}</p>
          <p><strong>Access:</strong> JR Yamanote Line, Keihin-Tohoku Line, Keisei Line</p>
          <p style="margin-top: 1rem;"><strong>Pickup Process:</strong></p>
          <ol style="color: var(--gray); line-height: 2;">
            <li>Meet our staff at the designated meeting point (details in confirmation email)</li>
            <li>Present your driver's license and IDP/translation</li>
            <li>Complete vehicle inspection together</li>
            <li>Receive keys and vehicle instructions</li>
            <li>Start your journey!</li>
          </ol>
          <p style="font-size: 0.9rem; color: var(--gray); margin-top: 1rem;">
            ⏰ Please arrive 10 minutes before your scheduled pickup time.
          </p>
        </div>

        <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 2rem;">
          <h2>📄 Required Documents</h2>
          <h3 style="margin-top: 1.5rem;">For Japanese Residents:</h3>
          <ul style="color: var(--gray);">
            <li>Valid Japanese driver's license</li>
          </ul>
          
          <h3 style="margin-top: 1.5rem;">For International Visitors:</h3>
          <ul style="color: var(--gray);">
            <li><strong>Option 1:</strong> Valid home country license + International Driving Permit (IDP)</li>
            <li><strong>Option 2:</strong> Valid license from approved countries + official Japanese translation</li>
          </ul>
          
          <div class="alert alert-info" style="margin-top: 1rem;">
            <strong>Approved Countries:</strong> Switzerland, Germany, France, Belgium, Slovenia, Monaco, Taiwan (with TECO translation)
          </div>
          
          <h3 style="margin-top: 1.5rem;">Additional Requirements:</h3>
          <ul style="color: var(--gray);">
            <li>Minimum age: 21 years old</li>
            <li>Valid for at least 1 year</li>
            <li>Credit card for security deposit (no charge)</li>
          </ul>
        </div>

        <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 2rem;">
          <h2>🔄 Return Process</h2>
          <ol style="color: var(--gray); line-height: 2;">
            <li><strong>Charge the vehicle:</strong> Return with at least 20% battery (or face ¥3,000 fee)</li>
            <li><strong>Clean the interior:</strong> Remove all trash and personal items</li>
            <li><strong>Return to Nippori:</strong> Same location as pickup</li>
            <li><strong>Final inspection:</strong> Check vehicle condition with our staff</li>
            <li><strong>Return keys:</strong> Complete paperwork and you're done!</li>
          </ol>
          
          <div class="alert alert-info" style="margin-top: 1rem;">
            <strong>Late Return:</strong> ¥2,000 per hour. Please contact us if you'll be late: ${config.contact.phone}
          </div>
          
          <p style="margin-top: 1rem;"><strong>Charging Stations:</strong></p>
          <p style="color: var(--gray);">
            Tokyo has extensive Tesla Supercharger and public charging networks. We recommend using PlugShare app to find nearby stations. Free charging available at pickup location.
          </p>
        </div>

        <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 2rem;">
          <h2>🚨 Emergency & Support</h2>
          <div style="background: var(--light); padding: 1.5rem; border-radius: 0.5rem; margin-top: 1rem;">
            <p><strong>24/7 Emergency Hotline:</strong> ${config.contact.phone}</p>
            <p><strong>Email Support:</strong> ${config.contact.email}</p>
            <p><strong>LINE:</strong> ${config.contact.line}</p>
            <p style="margin-top: 1rem;"><strong>In Case of Accident:</strong></p>
            <ol style="color: var(--gray);">
              <li>Call police (110) and ambulance (119) if needed</li>
              <li>Contact our emergency line immediately</li>
              <li>Do not leave the scene</li>
              <li>Exchange information with other parties</li>
              <li>Take photos of damage and scene</li>
            </ol>
          </div>
        </div>

        <div class="alert alert-info">
          <strong>Important:</strong> Please download the pickup/return guide PDF from our <a href="#downloads" style="color: var(--primary); font-weight: 600;">Downloads</a> page before your rental date.
        </div>
      </div>
    </section>
  `,

  book: () => renderBookingFlow(),

  faq: () => `
    <section class="container">
      <h1 class="text-center">Frequently Asked Questions</h1>
      <div style="max-width: 800px; margin: 2rem auto;">
        ${renderFAQFull()}
      </div>
    </section>
  `,

  contact: () => `
    <section class="container">
      <h1 class="text-center">Contact Us</h1>
      <div style="max-width: 600px; margin: 2rem auto;">
        <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2>Get in Touch</h2>
          <div style="margin-top: 2rem;">
            <p style="margin-bottom: 1rem;">
              <strong>📧 Email:</strong><br>
              <a href="mailto:${config.contact.email}" style="color: var(--primary);">${config.contact.email}</a>
            </p>
            <p style="margin-bottom: 1rem;">
              <strong>📱 Phone:</strong><br>
              <a href="tel:${config.contact.phone}" style="color: var(--primary);">${config.contact.phone}</a>
            </p>
            <p style="margin-bottom: 1rem;">
              <strong>💬 LINE:</strong><br>
              ${config.contact.line}
            </p>
            <p style="margin-bottom: 1rem;">
              <strong>🕐 Business Hours:</strong><br>
              ${config.contact.hours}
            </p>
            <p style="margin-bottom: 1rem;">
              <strong>📍 Pickup Location:</strong><br>
              ${config.location.name}<br>
              ${config.location.address}
            </p>
          </div>
          
          <div class="alert alert-info" style="margin-top: 2rem;">
            <strong>Response Time:</strong> We typically respond within 2 hours during business hours, and within 24 hours outside business hours.
          </div>
        </div>
      </div>
    </section>
  `,

  terms: () => `
    <section class="container">
      <h1 class="text-center">Terms & Conditions</h1>
      <div style="max-width: 800px; margin: 2rem auto; line-height: 1.8;">
        <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 2rem;">
          <h2>Rental Agreement (貸渡約款)</h2>
          
          <h3 style="margin-top: 2rem;">1. Eligibility</h3>
          <ul style="color: var(--gray);">
            <li>Minimum age: 21 years old</li>
            <li>Valid driver's license held for at least 1 year</li>
            <li>International visitors: IDP or official translation required</li>
          </ul>
          
          <h3 style="margin-top: 2rem;">2. Booking & Payment</h3>
          <ul style="color: var(--gray);">
            <li>No advance payment required for MVP</li>
            <li>Full payment due at pickup</li>
            <li>Credit card required for security deposit (no charge unless damage)</li>
            <li>Accepted payment: Cash, Credit Card (Visa, Mastercard, JCB)</li>
          </ul>
          
          <h3 style="margin-top: 2rem;">3. Cancellation Policy</h3>
          <ul style="color: var(--gray);">
            <li><strong>7+ days before:</strong> Free cancellation</li>
            <li><strong>3-6 days before:</strong> 50% cancellation fee</li>
            <li><strong>0-2 days before:</strong> 100% cancellation fee</li>
            <li><strong>No-show:</strong> 100% charge</li>
          </ul>
          
          <h3 style="margin-top: 2rem;">4. Insurance & Liability</h3>
          <ul style="color: var(--gray);">
            <li>Basic insurance included (up to ¥10,000,000 coverage)</li>
            <li>Excess: ¥100,000 (reducible to ¥0 with CDW option)</li>
            <li>Driver responsible for all traffic violations and fines</li>
            <li>Damage must be reported immediately</li>
          </ul>
          
          <h3 style="margin-top: 2rem;">5. Vehicle Use</h3>
          <ul style="color: var(--gray);">
            <li>Only authorized driver may operate vehicle</li>
            <li>No smoking in vehicles (¥50,000 penalty)</li>
            <li>No pets without prior approval</li>
            <li>Prohibited: Racing, off-road use, illegal activities</li>
            <li>Return with minimum 20% battery charge</li>
          </ul>
          
          <h3 style="margin-top: 2rem;">6. Late Return</h3>
          <ul style="color: var(--gray);">
            <li>¥2,000 per hour late fee</li>
            <li>Please contact us if delayed</li>
            <li>After 6 hours late: considered unauthorized use</li>
          </ul>
        </div>
        
        <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 2rem;">
          <h2>Privacy Policy</h2>
          <p style="color: var(--gray);">
            We collect personal information (name, email, phone, license details) solely for rental purposes. Your data is stored securely and never shared with third parties except as required by law. You have the right to request access, correction, or deletion of your data at any time.
          </p>
        </div>
        
        <div class="alert alert-info">
          For detailed terms in Japanese and English, please download the PDF from our <a href="#downloads" style="color: var(--primary); font-weight: 600;">Downloads</a> page.
        </div>
      </div>
    </section>
  `,

  downloads: () => `
    <section class="container">
      <h1 class="text-center">Downloads</h1>
      <div style="max-width: 600px; margin: 2rem auto;">
        <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2>Important Documents</h2>
          <p style="color: var(--gray); margin-bottom: 2rem;">Download these documents before your rental date.</p>
          
          <div style="border: 1px solid var(--border); border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1rem; cursor: pointer;" onclick="alert('PDF download would be available in production')">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="font-size: 2rem;">📄</div>
              <div style="flex: 1;">
                <h3 style="margin: 0;">Pickup & Return Guide</h3>
                <p style="color: var(--gray); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Complete instructions for Nippori pickup and return process</p>
              </div>
              <div style="color: var(--primary); font-weight: 600;">Download</div>
            </div>
          </div>
          
          <div style="border: 1px solid var(--border); border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1rem; cursor: pointer;" onclick="alert('PDF download would be available in production')">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="font-size: 2rem;">📄</div>
              <div style="flex: 1;">
                <h3 style="margin: 0;">Rental Agreement (EN/JP)</h3>
                <p style="color: var(--gray); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Complete terms and conditions in English and Japanese</p>
              </div>
              <div style="color: var(--primary); font-weight: 600;">Download</div>
            </div>
          </div>
          
          <div style="border: 1px solid var(--border); border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1rem; cursor: pointer;" onclick="alert('PDF download would be available in production')">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="font-size: 2rem;">📄</div>
              <div style="flex: 1;">
                <h3 style="margin: 0;">Insurance & Liability Summary</h3>
                <p style="color: var(--gray); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Coverage details and optional CDW information</p>
              </div>
              <div style="color: var(--primary); font-weight: 600;">Download</div>
            </div>
          </div>
          
          <div style="border: 1px solid var(--border); border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1rem; cursor: pointer;" onclick="alert('PDF download would be available in production')">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="font-size: 2rem;">📄</div>
              <div style="flex: 1;">
                <h3 style="margin: 0;">Vehicle Inspection Checklist</h3>
                <p style="color: var(--gray); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Pre and post-rental inspection form</p>
              </div>
              <div style="color: var(--primary); font-weight: 600;">Download</div>
            </div>
          </div>
          
          <div style="border: 1px solid var(--border); border-radius: 0.5rem; padding: 1.5rem; cursor: pointer;" onclick="alert('PDF download would be available in production')">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="font-size: 2rem;">📄</div>
              <div style="flex: 1;">
                <h3 style="margin: 0;">Emergency Contact Card</h3>
                <p style="color: var(--gray); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Keep in vehicle - important phone numbers and instructions</p>
              </div>
              <div style="color: var(--primary); font-weight: 600;">Download</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,

  confirmation: () => renderConfirmation()
};

// Booking flow renderer
function renderBookingFlow() {
  const step = state.bookingData.step;
  
  return `
    <section class="container">
      <div class="booking-container">
        <h1 class="text-center">Book Your Tesla</h1>
        
        <div class="booking-steps">
          <div class="booking-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}">
            <div class="step-indicator">1</div>
            <div>Select</div>
          </div>
          <div class="booking-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}">
            <div class="step-indicator">2</div>
            <div>Review</div>
          </div>
          <div class="booking-step ${step >= 3 ? 'active' : ''}">
            <div class="step-indicator">3</div>
            <div>Confirm</div>
          </div>
        </div>

        ${step === 1 ? renderBookingStep1() : ''}
        ${step === 2 ? renderBookingStep2() : ''}
        ${step === 3 ? renderBookingStep3() : ''}
      </div>
    </section>
  `;
}

function renderBookingStep1() {
  return `
    <form id="booking-form-step1" style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h2>Step 1: Select Your Rental</h2>
      
      <div class="form-group">
        <label for="vehicle">Vehicle *</label>
        <select id="vehicle" name="vehicle" required>
          <option value="">Select a vehicle</option>
          <option value="model3">Tesla Model 3 - From ¥12,000/day</option>
          <option value="modelY">Tesla Model Y - From ¥15,000/day</option>
        </select>
      </div>

      <div style="display: grid; gap: 1rem; grid-template-columns: 1fr 1fr;">
        <div class="form-group">
          <label for="pickup-date">Pickup Date *</label>
          <input type="date" id="pickup-date" name="pickupDate" required min="${getTodayDate()}">
        </div>
        <div class="form-group">
          <label for="pickup-time">Pickup Time *</label>
          <select id="pickup-time" name="pickupTime" required>
            <option value="">Select time</option>
            ${generateTimeOptions()}
          </select>
        </div>
      </div>

      <div style="display: grid; gap: 1rem; grid-template-columns: 1fr 1fr;">
        <div class="form-group">
          <label for="return-date">Return Date *</label>
          <input type="date" id="return-date" name="returnDate" required min="${getTodayDate()}">
        </div>
        <div class="form-group">
          <label for="return-time">Return Time *</label>
          <select id="return-time" name="returnTime" required>
            <option value="">Select time</option>
            ${generateTimeOptions()}
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>Pickup/Return Location</label>
        <input type="text" value="Nippori Station, Tokyo" disabled style="background: var(--light);">
        <p style="font-size: 0.9rem; color: var(--gray); margin-top: 0.5rem;">
          📍 ${config.location.address}
        </p>
      </div>

      <div class="form-group">
        <label>Add-ons (Optional)</label>
        <div class="checkbox-group">
          <input type="checkbox" id="addon-etc" name="addons" value="etc">
          <label for="addon-etc" style="font-weight: normal;">ETC Card - ¥500/day</label>
        </div>
        <div class="checkbox-group">
          <input type="checkbox" id="addon-child" name="addons" value="childSeat">
          <label for="addon-child" style="font-weight: normal;">Child Seat - ¥1,000/day</label>
        </div>
        <div class="checkbox-group">
          <input type="checkbox" id="addon-insurance" name="addons" value="insurance">
          <label for="addon-insurance" style="font-weight: normal;">Additional Insurance (CDW) - ¥2,000/day</label>
        </div>
      </div>

      <div id="step1-error" class="alert alert-error hidden"></div>

      <button type="submit" class="btn btn-primary" style="width: 100%;">Continue to Review</button>
    </form>
  `;
}

function renderBookingStep2() {
  const pricing = state.bookingData.pricing;
  
  if (!pricing) {
    return '<div class="alert alert-error">Pricing calculation failed. Please go back and try again.</div>';
  }

  return `
    <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h2>Step 2: Review Your Booking</h2>
      
      <div style="margin: 2rem 0;">
        <h3>Rental Summary</h3>
        <div class="price-row">
          <span>Vehicle</span>
          <span>${pricing.vehicle}</span>
        </div>
        <div class="price-row">
          <span>Pickup</span>
          <span>${state.bookingData.pickupDate} ${state.bookingData.pickupTime}</span>
        </div>
        <div class="price-row">
          <span>Return</span>
          <span>${state.bookingData.returnDate} ${state.bookingData.returnTime}</span>
        </div>
        <div class="price-row">
          <span>Duration</span>
          <span>${pricing.days} day(s)</span>
        </div>
        <div class="price-row">
          <span>Location</span>
          <span>Nippori Station</span>
        </div>
      </div>

      <div class="price-breakdown">
        <h3>Price Breakdown</h3>
        <div class="price-row">
          <span>Vehicle Rental (${pricing.days} days × ¥${pricing.dailyRate.toLocaleString()})</span>
          <span>¥${pricing.rentalCost.toLocaleString()}</span>
        </div>
        ${pricing.addons.map(addon => `
          <div class="price-row">
            <span>${addon.name} (${addon.quantity} days × ¥${addon.unitPrice.toLocaleString()})</span>
            <span>¥${addon.total.toLocaleString()}</span>
          </div>
        `).join('')}
        <div class="price-row">
          <span><strong>Total Amount</strong></span>
          <span><strong>¥${pricing.total.toLocaleString()}</strong></span>
        </div>
      </div>

      <div class="alert alert-info">
        <strong>Important Reminders:</strong>
        <ul style="margin: 0.5rem 0 0 1.5rem;">
          <li>Valid driver's license + IDP/translation required</li>
          <li>Return with minimum 20% battery charge</li>
          <li>Payment due at pickup (cash or credit card)</li>
          <li>Free cancellation up to 7 days before pickup</li>
        </ul>
      </div>

      <div style="display: grid; gap: 1rem; grid-template-columns: 1fr 1fr; margin-top: 2rem;">
        <button onclick="bookingPrevStep()" class="btn btn-outline">Back</button>
        <button onclick="bookingNextStep()" class="btn btn-primary">Continue to Details</button>
      </div>
    </div>
  `;
}

function renderBookingStep3() {
  return `
    <form id="booking-form-step3" style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h2>Step 3: Your Details</h2>
      
      <div class="form-group">
        <label for="customer-name">Full Name *</label>
        <input type="text" id="customer-name" name="name" required placeholder="As shown on driver's license">
      </div>

      <div class="form-group">
        <label for="customer-email">Email Address *</label>
        <input type="email" id="customer-email" name="email" required placeholder="your.email@example.com">
        <p style="font-size: 0.9rem; color: var(--gray); margin-top: 0.5rem;">
          Confirmation details will be sent to this email
        </p>
      </div>

      <div class="form-group">
        <label for="customer-phone">Phone Number *</label>
        <input type="tel" id="customer-phone" name="phone" required placeholder="+81-90-1234-5678">
      </div>

      <div class="form-group">
        <label for="customer-nationality">Nationality *</label>
        <select id="customer-nationality" name="nationality" required>
          <option value="">Select nationality</option>
          <option value="Japan">Japan</option>
          <option value="USA">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="Canada">Canada</option>
          <option value="Australia">Australia</option>
          <option value="China">China</option>
          <option value="Taiwan">Taiwan</option>
          <option value="Korea">South Korea</option>
          <option value="Singapore">Singapore</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div class="form-group">
        <label for="license-type">Driver's License Type *</label>
        <select id="license-type" name="licenseType" required>
          <option value="">Select license type</option>
          <option value="Japanese">Japanese License</option>
          <option value="IDP">International Driving Permit (IDP)</option>
          <option value="Translation">Approved License + Japanese Translation</option>
        </select>
        <p style="font-size: 0.9rem; color: var(--gray); margin-top: 0.5rem;">
          You must present original documents at pickup
        </p>
      </div>

      <div class="form-group">
        <div class="checkbox-group">
          <input type="checkbox" id="agree-terms" name="agreeTerms" required>
          <label for="agree-terms" style="font-weight: normal;">
            I agree to the <a href="#terms" style="color: var(--primary);">Terms & Conditions</a> and <a href="#terms" style="color: var(--primary);">Cancellation Policy</a> *
          </label>
        </div>
      </div>

      <div class="alert alert-info">
        <strong>Next Steps:</strong> After submitting, you'll receive a confirmation email with your booking ID and pickup instructions. Payment will be collected at the Nippori pickup location.
      </div>

      <div id="step3-error" class="alert alert-error hidden"></div>
      <div id="step3-loading" class="hidden" style="text-align: center; padding: 2rem;">
        <div class="spinner"></div>
        <p style="margin-top: 1rem;">Processing your booking...</p>
      </div>

      <div style="display: grid; gap: 1rem; grid-template-columns: 1fr 1fr; margin-top: 2rem;">
        <button type="button" onclick="bookingPrevStep()" class="btn btn-outline">Back</button>
        <button type="submit" class="btn btn-primary">Complete Booking</button>
      </div>
    </form>
  `;
}

function renderConfirmation() {
  const bookingId = state.bookingData.bookingId || generateBookingId();
  const pricing = state.bookingData.pricing;
  
  return `
    <section class="confirmation">
      <div class="container">
        <div style="font-size: 4rem; margin-bottom: 1rem;">✓</div>
        <h1>Booking Confirmed!</h1>
        <p style="font-size: 1.25rem; color: var(--gray); max-width: 600px; margin: 1rem auto;">
          Your Tesla rental has been confirmed. Check your email for complete details.
        </p>
        
        <div class="booking-id">${bookingId}</div>
        <p style="color: var(--gray);">Please save this booking ID for your records</p>

        <div class="next-steps" style="max-width: 600px; margin: 3rem auto;">
          <h2>What's Next?</h2>
          <ul>
            <li>
              <strong>✉️ Check Your Email</strong><br>
              <span style="color: var(--gray);">Confirmation email sent to ${state.bookingData.customer.email} with pickup instructions and booking details.</span>
            </li>
            <li>
              <strong>📄 Download Documents</strong><br>
              <span style="color: var(--gray);">Visit our <a href="#downloads" style="color: var(--primary);">Downloads</a> page for pickup guide and rental agreement.</span>
            </li>
            <li>
              <strong>📍 Arrive at Nippori</strong><br>
              <span style="color: var(--gray);">On ${state.bookingData.pickupDate} at ${state.bookingData.pickupTime}, meet us at Nippori Station. Arrive 10 minutes early.</span>
            </li>
            <li>
              <strong>🎉 Enjoy Your Tesla!</strong><br>
              <span style="color: var(--gray);">Drive safely and return by ${state.bookingData.returnDate} ${state.bookingData.returnTime} with 20%+ battery.</span>
            </li>
          </ul>
        </div>

        <div style="background: var(--light); padding: 2rem; border-radius: 1rem; max-width: 600px; margin: 2rem auto; text-align: left;">
          <h3>Booking Summary</h3>
          <p><strong>Vehicle:</strong> ${pricing.vehicle}</p>
          <p><strong>Duration:</strong> ${pricing.days} day(s)</p>
          <p><strong>Pickup:</strong> ${state.bookingData.pickupDate} ${state.bookingData.pickupTime}</p>
          <p><strong>Return:</strong> ${state.bookingData.returnDate} ${state.bookingData.returnTime}</p>
          <p><strong>Location:</strong> Nippori Station</p>
          <p><strong>Total:</strong> ¥${pricing.total.toLocaleString()}</p>
        </div>

        <div class="alert alert-info" style="max-width: 600px; margin: 2rem auto;">
          <strong>Questions?</strong> Contact us at ${config.contact.email} or ${config.contact.phone}
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem;">
          <a href="#home" class="btn btn-outline">Back to Home</a>
          <a href="#downloads" class="btn btn-primary">Download Documents</a>
        </div>
      </div>
    </section>
  `;
}

// FAQ renderer
function renderFAQPreview() {
  const faqs = getFAQs().slice(0, 3);
  return faqs.map((faq, index) => `
    <div class="faq-item" data-faq="${index}">
      <div class="faq-question">
        <span>${faq.q}</span>
        <span>+</span>
      </div>
      <div class="faq-answer">${faq.a}</div>
    </div>
  `).join('');
}

function renderFAQFull() {
  const faqs = getFAQs();
  return faqs.map((faq, index) => `
    <div class="faq-item" data-faq="${index}">
      <div class="faq-question">
        <span>${faq.q}</span>
        <span>+</span>
      </div>
      <div class="faq-answer">${faq.a}</div>
    </div>
  `).join('');
}

function getFAQs() {
  return [
    {
      q: "What documents do I need to rent a Tesla?",
      a: "For Japanese residents: valid Japanese driver's license. For international visitors: your home country license plus either an International Driving Permit (IDP) or official Japanese translation. Minimum age is 21 and license must be valid for at least 1 year."
    },
    {
      q: "Is payment required when booking?",
      a: "No advance payment required for this MVP version. Full payment is due at pickup. We accept cash and major credit cards (Visa, Mastercard, JCB). A credit card is required for security deposit (no charge unless damage)."
    },
    {
      q: "What's included in the rental price?",
      a: "Your rental includes: unlimited mileage, basic insurance coverage (up to ¥10M), 24/7 roadside assistance, and complimentary charging at our pickup location. Optional add-ons (ETC card, child seat, additional insurance) are available for extra fees."
    },
    {
      q: "What's your cancellation policy?",
      a: "Free cancellation up to 7 days before pickup. 3-6 days before: 50% fee. 0-2 days before or no-show: 100% charge. Please contact us as early as possible if you need to cancel."
    },
    {
      q: "Where do I pick up and return the vehicle?",
      a: "Both pickup and return are at Nippori Station in Tokyo. The exact meeting point will be provided in your confirmation email. Please arrive 10 minutes before your scheduled pickup time."
    },
    {
      q: "Do I need to return the car fully charged?",
      a: "Please return with at least 20% battery charge. Returns below 20% incur a ¥3,000 low battery fee. Tokyo has many charging stations - use the PlugShare app to find them. Free charging is available at our pickup location."
    },
    {
      q: "What happens if I return the car late?",
      a: "Late returns are charged ¥2,000 per hour. Please contact us immediately if you'll be late. After 6 hours late without contact, it may be considered unauthorized use."
    },
    {
      q: "Is insurance included? What about accidents?",
      a: "Yes, basic insurance is included with coverage up to ¥10M. The excess (deductible) is ¥100K, which can be reduced to ¥0 with our optional CDW (¥2,000/day). In case of accident: call police (110), contact our emergency line, don't leave the scene, exchange information, and take photos."
    },
    {
      q: "Can I drive to other prefectures or take the car on ferries?",
      a: "Yes, you can drive throughout Japan. However, ferry travel requires prior approval. Contact us before your rental if you plan to use ferries."
    },
    {
      q: "What if I have problems during my rental?",
      a: "Our 24/7 emergency hotline (${config.contact.phone}) is always available. For non-emergencies, contact us via email (${config.contact.email}) or LINE (${config.contact.line}). We typically respond within 2 hours during business hours."
    }
  ];
}

// Utility functions
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function generateTimeOptions() {
  const times = [];
  for (let h = 9; h <= 18; h++) {
    times.push(`<option value="${h}:00">${h}:00</option>`);
    if (h < 18) times.push(`<option value="${h}:30">${h}:30</option>`);
  }
  return times.join('');
}

// Event handlers
function bookingNextStep() {
  state.bookingData.step += 1;
  navigateTo('book');
}

function bookingPrevStep() {
  state.bookingData.step -= 1;
  navigateTo('book');
}

async function submitBooking(formData) {
  try {
    // Show loading
    document.getElementById('step3-loading').classList.remove('hidden');
    document.getElementById('step3-error').classList.add('hidden');
    
    // Generate booking ID
    const bookingId = generateBookingId();
    state.bookingData.bookingId = bookingId;
    state.bookingData.customer = formData;
    
    // Prepare booking data
    const bookingRecord = {
      booking_id: bookingId,
      created_at: new Date().toISOString(),
      car_model: state.bookingData.vehicle,
      pickup_datetime: `${state.bookingData.pickupDate} ${state.bookingData.pickupTime}`,
      return_datetime: `${state.bookingData.returnDate} ${state.bookingData.returnTime}`,
      location: 'Nippori',
      addons: state.bookingData.addons.join(', '),
      price_total: state.bookingData.pricing.total,
      price_breakdown: JSON.stringify(state.bookingData.pricing.breakdown),
      customer_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      nationality: formData.nationality,
      license_type: formData.licenseType,
      consent_timestamp: new Date().toISOString(),
      status: 'submitted'
    };
    
    // Submit to backend API
    const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';
    const response = await fetch(`${apiUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingRecord)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Booking submission failed');
    }
    
    const result = await response.json();
    console.log('Booking confirmed:', result);
    
    // Navigate to confirmation
    navigateTo('confirmation');
    
  } catch (error) {
    console.error('Booking submission error:', error);
    document.getElementById('step3-loading').classList.add('hidden');
    const errorEl = document.getElementById('step3-error');
    errorEl.textContent = error.message || 'Failed to process booking. Please try again or contact support.';
    errorEl.classList.remove('hidden');
  }
}

// Navigation
function navigateTo(page) {
  state.currentPage = page;
  window.location.hash = page;
  renderPage(page);
  window.scrollTo(0, 0);
}

function renderPage(page) {
  const app = document.getElementById('app');
  const pageContent = pages[page] || pages.home;
  app.innerHTML = typeof pageContent === 'function' ? pageContent() : pageContent;
  attachEventListeners();
}

function attachEventListeners() {
  // FAQ toggles
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
  
  // Booking form step 1
  const form1 = document.getElementById('booking-form-step1');
  if (form1) {
    form1.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form1);
      
      // Validate dates
      const pickup = new Date(`${formData.get('pickupDate')} ${formData.get('pickupTime')}`);
      const returnDate = new Date(`${formData.get('returnDate')} ${formData.get('returnTime')}`);
      
      if (returnDate <= pickup) {
        document.getElementById('step1-error').textContent = 'Return date must be after pickup date';
        document.getElementById('step1-error').classList.remove('hidden');
        return;
      }
      
      // Store data
      state.bookingData.vehicle = formData.get('vehicle');
      state.bookingData.pickupDate = formData.get('pickupDate');
      state.bookingData.pickupTime = formData.get('pickupTime');
      state.bookingData.returnDate = formData.get('returnDate');
      state.bookingData.returnTime = formData.get('returnTime');
      
      // Get addons
      state.bookingData.addons = [];
      document.querySelectorAll('input[name="addons"]:checked').forEach(checkbox => {
        state.bookingData.addons.push(checkbox.value);
      });
      
      // Calculate pricing
      const pricing = calculatePrice(
        state.bookingData.vehicle,
        `${state.bookingData.pickupDate} ${state.bookingData.pickupTime}`,
        `${state.bookingData.returnDate} ${state.bookingData.returnTime}`,
        state.bookingData.addons
      );
      
      if (!pricing) {
        document.getElementById('step1-error').textContent = 'Invalid rental period';
        document.getElementById('step1-error').classList.remove('hidden');
        return;
      }
      
      state.bookingData.pricing = pricing;
      bookingNextStep();
    });
  }
  
  // Booking form step 3
  const form3 = document.getElementById('booking-form-step3');
  if (form3) {
    form3.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form3);
      const customerData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        nationality: formData.get('nationality'),
        licenseType: formData.get('licenseType'),
        agreeTerms: formData.get('agreeTerms') === 'on'
      };
      
      if (!customerData.agreeTerms) {
        document.getElementById('step3-error').textContent = 'You must agree to the terms and conditions';
        document.getElementById('step3-error').classList.remove('hidden');
        return;
      }
      
      submitBooking(customerData);
    });
  }
}

// Initialize
function init() {
  // Handle navigation
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1).split('?')[0];
    const page = hash || 'home';
    
    // Handle book with pre-selected vehicle
    if (page === 'book' && window.location.hash.includes('?vehicle=')) {
      const params = new URLSearchParams(window.location.hash.split('?')[1]);
      const vehicle = params.get('vehicle');
      if (vehicle) {
        state.bookingData.vehicle = vehicle;
        setTimeout(() => {
          const select = document.getElementById('vehicle');
          if (select) select.value = vehicle;
        }, 100);
      }
    }
    
    renderPage(page);
  });
  
  // Initial render
  const initialPage = window.location.hash.slice(1).split('?')[0] || 'home';
  renderPage(initialPage);
}

// Make functions globally available
window.bookingNextStep = bookingNextStep;
window.bookingPrevStep = bookingPrevStep;

// Start app
init();
