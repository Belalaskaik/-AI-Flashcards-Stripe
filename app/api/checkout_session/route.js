import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Handle POST requests (creating a session)
export async function POST(req) {
  try {
    const body = await req.json(); // Parse the incoming request body
    const { priceId } = body; // Extract priceId from the request body

    let productName = '';
    let unitAmount = 0;

    // Determine the product name and amount based on the priceId
    switch (priceId) {
      case 'price_basic':
        productName = 'Basic Subscription';
        unitAmount = 500; // $5.00 in cents
        break;
      case 'price_pro':
        productName = 'Pro Subscription';
        unitAmount = 1000; // $10.00 in cents
        break;
      default:
        throw new Error('Invalid price ID');
    }

    const params = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
            },
            unit_amount: unitAmount,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}`, // Redirects to the homepage on cancel or back button press
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    console.log('Created checkout session:', checkoutSession.id);

    return NextResponse.json(checkoutSession, { status: 200 });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}

// Handle GET requests (retrieving a session)
export async function GET(req) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: { message: 'Session ID is required' } }, { status: 400 });
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    console.log('Retrieved checkout session:', checkoutSession);

    return NextResponse.json(checkoutSession, { status: 200 });
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
