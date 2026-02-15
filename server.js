// Simple Node.js server for handling bookings
// This handles Google Sheets integration and email sending

import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Google Sheets setup
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || 'YOUR_SPREADSHEET_ID';
const sheets = google.sheets('v4');

async function getGoogleAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: process.env.GOOGLE_CREDENTIALS ? JSON.parse(process.env.GOOGLE_CREDENTIALS) : undefined,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return auth;
}

// Email setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Booking submission endpoint
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = req.body;
    
    // Validate booking data
    if (!booking.booking_id || !booking.email || !booking.customer_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Save to Google Sheets
    await saveToSheets(booking);
    
    // Send confirmation email
    await sendConfirmationEmail(booking);
    
    res.json({ 
      success: true, 
      booking_id: booking.booking_id,
      message: 'Booking confirmed. Check your email for details.'
    });
    
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ 
      error: 'Failed to process booking',
      message: error.message 
    });
  }
});

async function saveToSheets(booking) {
  try {
    const auth = await getGoogleAuth();
    
    const values = [[
      booking.booking_id,
      booking.created_at,
      booking.car_model,
      booking.pickup_datetime,
      booking.return_datetime,
      booking.location,
      booking.addons,
      booking.price_total,
      booking.price_breakdown,
      booking.customer_name,
      booking.email,
      booking.phone,
      booking.nationality,
      booking.license_type,
      booking.consent_timestamp,
      booking.status
    ]];
    
    await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId: SPREADSHEET_ID,
      range: 'Bookings!A:P',
      valueInputOption: 'RAW',
      resource: { values }
    });
    
    console.log('Booking saved to Google Sheets:', booking.booking_id);
  } catch (error) {
    console.error('Error saving to sheets:', error);
    throw error;
  }
}

async function sendConfirmationEmail(booking) {
  const emailHtml = generateConfirmationEmail(booking);
  
  const mailOptions = {
    from: process.env.SMTP_FROM || '"Tokyo EV Rental" <booking@tokyoevrental.com>',
    to: booking.email,
    subject: `Booking Confirmed - ${booking.booking_id}`,
    html: emailHtml,
  };
  
  await transporter.sendMail(mailOptions);
  console.log('Confirmation email sent to:', booking.email);
}

function generateConfirmationEmail(booking) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 30px 20px; text-align: center; }
    .content { background: #f9fafb; padding: 30px 20px; }
    .booking-id { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; color: #2563eb; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-row:last-child { border-bottom: none; }
    .label { font-weight: bold; }
    .info-box { background: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; }
    .footer { background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 14px; }
    .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ Booking Confirmed!</h1>
      <p>Your Tesla rental is all set</p>
    </div>
    
    <div class="content">
      <p>Dear ${booking.customer_name},</p>
      <p>Thank you for booking with Tokyo EV Rental! Your reservation has been confirmed.</p>
      
      <div class="booking-id">
        ${booking.booking_id}
      </div>
      <p style="text-align: center; color: #6b7280;">Your Booking Reference Number</p>
      
      <div class="details">
        <h2>Booking Details</h2>
        <div class="detail-row">
          <span class="label">Vehicle:</span>
          <span>${booking.car_model === 'model3' ? 'Tesla Model 3' : 'Tesla Model Y'}</span>
        </div>
        <div class="detail-row">
          <span class="label">Pickup:</span>
          <span>${booking.pickup_datetime}</span>
        </div>
        <div class="detail-row">
          <span class="label">Return:</span>
          <span>${booking.return_datetime}</span>
        </div>
        <div class="detail-row">
          <span class="label">Location:</span>
          <span>Nippori Station, Tokyo</span>
        </div>
        <div class="detail-row">
          <span class="label">Add-ons:</span>
          <span>${booking.addons || 'None'}</span>
        </div>
        <div class="detail-row">
          <span class="label">Total Amount:</span>
          <span style="font-size: 18px; font-weight: bold; color: #2563eb;">¥${parseInt(booking.price_total).toLocaleString()}</span>
        </div>
      </div>
      
      <div class="info-box">
        <strong>📍 Pickup Location:</strong><br>
        Nippori Station<br>
        〒116-0013 Tokyo, Arakawa, Nishi-Nippori, 2-chome<br>
        <br>
        <strong>Access:</strong> JR Yamanote Line, Keihin-Tohoku Line, Keisei Line<br>
        <strong>Meeting Point:</strong> Details will be sent 24 hours before pickup
      </div>
      
      <h2>What to Bring:</h2>
      <ul>
        <li>Valid driver's license + IDP or Japanese translation</li>
        <li>Credit card for security deposit</li>
        <li>This booking confirmation (digital or printed)</li>
      </ul>
      
      <h2>Important Reminders:</h2>
      <ul>
        <li>Arrive 10 minutes before your scheduled pickup time</li>
        <li>Return vehicle with at least 20% battery charge</li>
        <li>Payment due at pickup (cash or credit card)</li>
        <li>Late return fee: ¥2,000 per hour</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://tokyoevrental.com/#downloads" class="btn">Download Pickup Guide</a>
      </div>
      
      <div class="info-box">
        <strong>Need Help?</strong><br>
        📧 Email: booking@tokyoevrental.com<br>
        📱 Phone: +81-3-1234-5678<br>
        💬 LINE: @tokyoev<br>
        🕐 Hours: 9:00 - 18:00 JST
      </div>
      
      <h2>Cancellation Policy:</h2>
      <p style="color: #6b7280; font-size: 14px;">
        • 7+ days before: Free cancellation<br>
        • 3-6 days before: 50% fee<br>
        • 0-2 days before: 100% fee
      </p>
      
      <p>We look forward to seeing you at Nippori Station!</p>
      <p>Safe travels,<br><strong>Tokyo EV Rental Team</strong></p>
    </div>
    
    <div class="footer">
      <p>© 2025 Tokyo EV Rental. All rights reserved.</p>
      <p>
        <a href="https://tokyoevrental.com/#terms" style="color: white;">Terms & Conditions</a> | 
        <a href="https://tokyoevrental.com/#terms" style="color: white;">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
