# Streaming Availability API Setup (Optional)

This guide explains how to set up the Streaming Availability API for better India streaming coverage.

## Why Use This?

TMDb's streaming data for India is limited. The Streaming Availability API provides better coverage of Indian OTT platforms like:
- Disney+ Hotstar
- Zee5
- SonyLIV
- JioCinema
- And many more

## How It Works

**Hybrid Approach:**
1. **Primary:** We try TMDb first (free, no setup needed)
2. **Fallback:** If TMDb has no India data, we try Streaming Availability API
3. **Last Resort:** If neither works, users get a "Search Streaming Options" button

This means the API is only called when TMDb fails, keeping usage low!

## Setup Instructions

### Step 1: Sign Up for RapidAPI (Free)

1. Go to https://rapidapi.com/
2. Click "Sign Up" (free account)
3. Verify your email

### Step 2: Subscribe to Streaming Availability API

1. Go to https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability
2. Click "Subscribe to Test"
3. Choose a plan:
   - **Free:** 100 requests/month (great for testing!)
   - **Basic:** $9.99/month - 10,000 requests
   - **Pro:** $49.99/month - 100,000 requests

### Step 3: Get Your API Key

1. After subscribing, you'll see your dashboard
2. Click on "Apps" in the top menu
3. Select your default app (or create one)
4. Copy your **X-RapidAPI-Key** (looks like: `abc123def456...`)

### Step 4: Add to Your Environment Variables

1. In your project root, create or update `.env.local`:
   ```bash
   NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
   ```

2. Replace `your_rapidapi_key_here` with the key you copied

3. Restart your development server:
   ```bash
   npm run dev
   ```

### Step 5: Test It

1. Visit a movie page that has no India streaming data (like "Robinhood")
2. Check the browser console - you should see:
   - "TMDb has no India data, trying Streaming Availability API..."
   - "Found streaming data via Streaming Availability API" (if available)
3. The "Where to Watch" section should now show data!

## Vercel Deployment

Add the environment variable in Vercel:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add: `NEXT_PUBLIC_RAPIDAPI_KEY` = `your_key_here`
4. Redeploy your application

## Cost Estimation

**Free Tier (100 requests/month):**
- Good for: Testing, low-traffic sites
- Covers: ~100 movies where TMDb has no data

**Basic Plan ($9.99/month for 10,000 requests):**
- Good for: Most production sites
- Covers: ~10,000 fallback requests
- If TMDb covers 80% of content, you'd need 50,000 total page views to hit this

## Monitoring Usage

Check your RapidAPI dashboard to monitor:
- Requests used this month
- Remaining requests
- Usage trends

## Is This Required?

**No!** The app works fine without it:
- TMDb provides streaming data for popular content
- When no data is available, users get a "Search Streaming Options" button
- The API just improves coverage for India-specific content

## Recommended Approach

1. **Start without it** - Use the free TMDb + Search button
2. **Monitor user feedback** - See if users complain about missing data
3. **Add the free tier** - Test with 100 requests/month
4. **Upgrade if needed** - Only if you hit the limit

## Troubleshooting

**"Streaming Availability API key not configured" in console:**
- Normal! This means the API key isn't set
- App still works, just without the fallback

**API calls failing:**
- Check your API key is correct
- Verify you haven't exceeded monthly quota
- Check RapidAPI dashboard for status

**No data showing:**
- Some content may not be available in any database
- "Search Streaming Options" button is the fallback

## Questions?

Check the API documentation: https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability/details
