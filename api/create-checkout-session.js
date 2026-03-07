module.exports = async (req, res) => {
  // 1. Check for Secret Key
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('CRITICAL: STRIPE_SECRET_KEY is not defined in environment variables.');
    return res.status(500).json({ 
      error: 'Backend Configuration Error: Stripe Secret Key is missing. Please add STRIPE_SECRET_KEY to Vercel environment variables.' 
    });
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, company, email, phone, vehicles, preferences } = req.body;

  try {
    // 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'SEE.SMART Vehicle Slot',
              description: `Automated dispatch for ${company || 'your fleet'}`,
            },
            unit_amount: 30000, // $300.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: Math.max(1, parseInt(vehicles) || 1),
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/?success=true`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
      metadata: {
        name: name || 'Not provided',
        company: company || 'Not provided',
        phone: phone || 'Not provided',
        vehicles: vehicles || '1',
        preferences: (preferences || 'None').substring(0, 500),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe Session Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
