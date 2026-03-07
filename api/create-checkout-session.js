const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, company, email, phone, vehicles, preferences } = req.body;

  try {
    // 1. Log the lead (In a real app, save to DB or send email)
    console.log('New Lead Received:', { name, company, email, phone, vehicles, preferences });

    // 2. Create Stripe Checkout Session
    // We assume you have a Product in Stripe with a recurring price.
    // If not, we can create a dynamic one or use a Price ID from your dashboard.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'SEE.SMART Vehicle Slot',
              description: `Automated dispatch for ${company}`,
            },
            unit_amount: 30000, // $300.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: parseInt(vehicles) || 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/?success=true`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
      metadata: {
        company,
        phone,
        vehicles,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe Error:', err);
    res.status(500).json({ error: err.message });
  }
};
