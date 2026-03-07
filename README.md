# SEE.SMART Landing Page

Automated NEMT Dispatch & Revenue Recovery.

## What This Project Does

- Presents a marketing landing page (`index.html` + `styles.css`).
- Features a dynamic ROI Calculator for operators.
- Professional 2-step onboarding flow:
  1. Profile submission (captures lead data via Vercel Serverless API).
  2. Stripe Checkout redirection for subscription activation.

## Technical Setup

- **Backend:** Node.js Serverless Functions (`api/` folder).
- **Payments:** Stripe.js integration with dynamic "per vehicle" scaling.
- **Environment Variables:**
  - `STRIPE_SECRET_KEY`: Used in the backend to create checkout sessions.
  - `STRIPE_PUBLISHABLE_KEY`: Used in the frontend.

## Deployment

This site is optimized for deployment on **Vercel**. 

1. Push to GitHub.
2. Import to Vercel.
3. Add Stripe API keys to Vercel Environment Variables.

## Lead Capture

Leads are captured during the onboarding process and can be managed directly in the **Stripe Dashboard** under "Customers" or "Checkout Sessions".
