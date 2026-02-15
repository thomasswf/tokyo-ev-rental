# Tokyo EV Rental - Deployment Guide

## Files Location
All deployment files are stored in: `code/tokyo-ev-rental/`

## Required Files for Deployment
- `index.html` - Main website HTML
- `app.js` - Frontend JavaScript application
- `config.js` - Configuration file
- `server.js` - Node.js backend for bookings API
- `package.json` - Node.js dependencies
- `vercel.json` - Vercel deployment configuration
- `sitemap.xml` - SEO sitemap
- `robots.txt` - SEO robots file

## Deployment Options

### Option 1: Vercel (Recommended - Free SSL + Serverless Functions)

#### Prerequisites
- Vercel account (sign up at https://vercel.com)
- Vercel CLI or GitHub integration

#### Method A: Deploy via Vercel CLI

1. **Install Vercel CLI globally:**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to project directory:**
   ```bash
   cd code/tokyo-ev-rental
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```
   Follow the email verification link

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

5. **Follow the prompts:**
   - Set up and deploy? Yes
   - Which scope? Select your account
   - Link to existing project? No
   - Project name? tokyo-ev-rental
   - Directory? ./
   - Override settings? No

6. **Your site will be live at:**
   `https://tokyo-ev-rental.vercel.app` (or custom domain)

#### Method B: Deploy via GitHub (Easier)

1. **Create a new GitHub repository**

2. **Push the code to GitHub:**
   ```bash
   cd code/tokyo-ev-rental
   git init
   git add .
   git commit -m "Initial commit - Tokyo EV Rental website"
   git remote add origin https://github.com/YOUR_USERNAME/tokyo-ev-rental.git
   git push -u origin main
   ```

3. **Connect to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect the settings
   - Click "Deploy"

4. **Automatic deployments:**
   - Every push to main branch = automatic deployment
   - Pull requests get preview URLs

### Option 2: Netlify (Alternative - Free SSL + Form Handling)

#### Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   cd code/tokyo-ev-rental
   netlify deploy --prod
   ```

4. **Configure:**
   - Build command: (leave empty)
   - Publish directory: ./

5. **Note:** Netlify requires serverless functions to be in `/netlify/functions/` directory. You'll need to adapt server.js.

### Option 3: Railway (Node.js Friendly - Free SSL)

1. **Sign up at https://railway.app**

2. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

3. **Login:**
   ```bash
   railway login
   ```

4. **Deploy:**
   ```bash
   cd code/tokyo-ev-rental
   railway init
   railway up
   ```

5. **Your app will be live with automatic HTTPS**

### Option 4: Render (Free Tier Available)

1. **Sign up at https://render.com**

2. **Create New Web Service:**
   - Connect your GitHub repository
   - Or deploy manually via dashboard

3. **Settings:**
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Auto-deploy: Yes

4. **Free SSL is automatically provided**

## Environment Variables (If Needed)

For production deployment, you may want to set:

```
NODE_ENV=production
PORT=3000
```

## Custom Domain Setup

### For Vercel:
1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL certificate is automatically provisioned

### For Netlify:
1. Go to Site Settings > Domain Management
2. Add custom domain
3. Update DNS records as instructed
4. SSL certificate is auto-provisioned

## Post-Deployment Checklist

- [ ] Website loads correctly at HTTPS URL
- [ ] Test booking form submission
- [ ] Verify all images and assets load
- [ ] Check mobile responsiveness
- [ ] Test date picker functionality
- [ ] Verify email notifications (if configured)
- [ ] Test all navigation links
- [ ] Check sitemap.xml accessibility
- [ ] Verify robots.txt is accessible
- [ ] Test booking availability checker

## Monitoring & Analytics

After deployment, consider adding:
- Google Analytics
- Vercel Analytics (built-in)
- Error tracking (Sentry)

## Support & Troubleshooting

### Common Issues:

**1. Server.js not working on Vercel:**
- Vercel requires serverless functions in `/api/` directory
- Current vercel.json is configured to route `/api/*` to server.js
- If issues persist, move endpoints to `/api/` folder

**2. CORS errors:**
- Update server.js with your production domain
- Add proper CORS headers

**3. Environment variables:**
- Set in platform dashboard (Vercel/Netlify/Railway)
- Never commit sensitive keys to git

**4. Build failures:**
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check build logs in platform dashboard

## Estimated Deployment Time
- Vercel CLI: 2-5 minutes
- GitHub → Vercel: 3-7 minutes
- Railway: 3-5 minutes
- Render: 5-10 minutes

## Cost
All mentioned platforms offer **free tiers** with SSL:
- Vercel: Free for personal projects
- Netlify: 100GB bandwidth/month free
- Railway: $5 credit/month free
- Render: Free tier available

## Next Steps After Deployment

1. **Email Integration:** Configure SendGrid or similar for booking confirmations
2. **Payment Processing:** Integrate Stripe for online payments
3. **Analytics:** Add Google Analytics tracking code
4. **SEO:** Submit sitemap to Google Search Console
5. **Monitoring:** Set up uptime monitoring (UptimeRobot)

---

**Your Tokyo EV Rental website is production-ready and waiting to be deployed!**

For any deployment assistance, refer to platform-specific documentation:
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- Railway: https://docs.railway.app
- Render: https://render.com/docs
