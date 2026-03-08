const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY is missing in Vercel settings.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, company, email, phone, vehicles, preferences } = req.body;

  try {
    // 1. Create the Customer FIRST so they show up in the Stripe App immediately
    const customer = await stripe.customers.create({
      email: email,
      name: name,
      phone: phone,
      metadata: {
        company: company || 'Not provided',
        phone: phone || 'Not provided',
        vehicles: vehicles || '1',
        preferences: (preferences || 'None').substring(0, 500),
        status: 'Lead (Form Submitted)'
      }
    });

    // 2. Create the Checkout Session using the new Customer ID
    const session = await stripe.checkout.sessions.create({
      customer: customer.id, // Links the session to the customer we just created
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'SEE.SMART Vehicle Slot',
              description: `Subscription for ${company || 'your fleet'}`,
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
        lead_customer_id: customer.id,
        company: company || 'Not provided',
        phone: phone || 'Not provided'
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
