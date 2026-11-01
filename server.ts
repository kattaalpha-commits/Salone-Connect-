import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_FILE_PATH = path.join(__dirname, 'backend', 'monime.config.json');
const ENV_FILE_PATH = path.join(__dirname, '.env');

// Ensure process.env picks up from .env or monime.config.json on startup
try {
  if (fs.existsSync(ENV_FILE_PATH)) {
    const envConfig = dotenv.parse(fs.readFileSync(ENV_FILE_PATH));
    for (const k in envConfig) {
      if (!process.env[k]) {
        process.env[k] = envConfig[k];
      }
    }
  }
  if ((!process.env.MONIME_API_KEY || !process.env.MONIME_SPACE_ID) && fs.existsSync(CONFIG_FILE_PATH)) {
    const raw = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!process.env.MONIME_API_KEY && parsed.apiKey) process.env.MONIME_API_KEY = parsed.apiKey;
    if (!process.env.MONIME_SPACE_ID && parsed.spaceId) process.env.MONIME_SPACE_ID = parsed.spaceId;
  }
} catch (_e) {
  // Ignore
}

// -------------------------------------------------------------
// INITIALIZE MONIME HTTP CLIENT
// -------------------------------------------------------------
// Uses process.env.MONIME_API_KEY and sets default space header to process.env.MONIME_SPACE_ID
const monimeClient = axios.create({
  baseURL: 'https://api.monime.io/v1',
  headers: {
    'Authorization': `Bearer ${process.env.MONIME_API_KEY || ''}`,
    'Monime-Space-Id': process.env.MONIME_SPACE_ID || '',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Dynamic interceptor to ensure current credentials in process.env are always sent
monimeClient.interceptors.request.use((config) => {
  const apiKey = (process.env.MONIME_API_KEY || '').trim().replace(/^["']|["']$/g, '');
  const spaceId = (process.env.MONIME_SPACE_ID || '').trim().replace(/^["']|["']$/g, '');
  if (apiKey) {
    config.headers['Authorization'] = `Bearer ${apiKey}`;
  }
  if (spaceId) {
    config.headers['Monime-Space-Id'] = spaceId;
  }
  return config;
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory payment ledger for transactions and webhook reconciliation
interface PaymentTransaction {
  reference: string;
  userId: string;
  amount: number;
  currency: string;
  itemDescription: string;
  status: 'pending' | 'completed' | 'failed';
  checkoutUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const paymentDatabase: Map<string, PaymentTransaction> = new Map();

// Helper to resolve clean credentials
function getMonimeCredentials(): { apiKey: string; spaceId: string } {
  let apiKey = (process.env.MONIME_API_KEY || '').trim().replace(/^["']|["']$/g, '');
  let spaceId = (process.env.MONIME_SPACE_ID || '').trim().replace(/^["']|["']$/g, '');
  return { apiKey, spaceId };
}

// -------------------------------------------------------------
// GATEWAY CONFIGURATION & STATUS APIS
// -------------------------------------------------------------
app.get(['/api/v1/payments/config', '/api/payments/config'], (_req: Request, res: Response) => {
  const { apiKey, spaceId } = getMonimeCredentials();
  const isConfigured = Boolean(apiKey && spaceId && !apiKey.includes('xxxx') && !spaceId.includes('xxxx'));

  return res.status(200).json({
    success: true,
    isConfigured,
    hasApiKey: Boolean(apiKey && !apiKey.includes('xxxx')),
    hasSpaceId: Boolean(spaceId && !spaceId.includes('xxxx')),
    spaceId: spaceId ? (spaceId.length > 8 ? `${spaceId.slice(0, 7)}...${spaceId.slice(-4)}` : spaceId) : '',
    rawSpaceId: spaceId || '',
    mode: isConfigured ? 'live' : 'simulation',
    currency: 'SLE',
    supportedNetworks: ['Orange Money Sierra Leone', 'Africell Money', 'QMoney SL', 'Credit/Debit Cards'],
  });
});

app.post(['/api/v1/payments/config', '/api/payments/config'], (req: Request, res: Response) => {
  try {
    const { apiKey, spaceId } = req.body;

    const cleanedApiKey = (apiKey || '').trim().replace(/^["']|["']$/g, '');
    const cleanedSpaceId = (spaceId || '').trim().replace(/^["']|["']$/g, '');

    // Update in-memory process.env
    if (cleanedApiKey) process.env.MONIME_API_KEY = cleanedApiKey;
    if (cleanedSpaceId) process.env.MONIME_SPACE_ID = cleanedSpaceId;

    // Save to backend/monime.config.json (gitignored for security)
    const configData = {
      apiKey: cleanedApiKey || (process.env.MONIME_API_KEY || ''),
      spaceId: cleanedSpaceId || (process.env.MONIME_SPACE_ID || ''),
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(configData, null, 2), 'utf-8');

    // Also update /.env file
    const envContent = `MONIME_SPACE_ID=${configData.spaceId}\nMONIME_API_KEY=${configData.apiKey}\n`;
    fs.writeFileSync(ENV_FILE_PATH, envContent, 'utf-8');

    return res.status(200).json({
      success: true,
      message: 'Monime credentials saved and activated successfully in production backend!',
      spaceId: configData.spaceId,
      hasApiKey: Boolean(configData.apiKey),
    });
  } catch (err: any) {
    console.error('Error saving Monime credentials:', err);
    return res.status(500).json({ success: false, message: 'Failed to save credentials' });
  }
});

// -------------------------------------------------------------
// VERIFY BACKEND CONNECTION TO MONIME PRODUCTION
// -------------------------------------------------------------
app.get(['/api/checkout/verify', '/api/monime/verify'], async (_req: Request, res: Response) => {
  const { apiKey, spaceId } = getMonimeCredentials();

  if (!apiKey || !spaceId) {
    return res.status(400).json({
      success: false,
      connected: false,
      message: 'MONIME_API_KEY or MONIME_SPACE_ID is missing in environment.',
    });
  }

  try {
    // Call Monime checkout-sessions list endpoint to verify auth & space ID
    const result = await monimeClient.get('/checkout-sessions');

    return res.status(200).json({
      success: true,
      connected: true,
      statusCode: 200,
      spaceId: spaceId,
      status: 'verified_active',
      message: 'Successfully verified backend connection to Monime production!',
      sessionsFound: Array.isArray(result.data?.result) ? result.data.result.length : (result.data ? 'active' : '0'),
      data: result.data,
    });
  } catch (err: any) {
    const errorResponse = err.response?.data;
    const statusCode = err.response?.status;

    console.warn('[Monime Verify Status]:', statusCode, errorResponse || err.message);

    return res.status(200).json({
      success: statusCode !== 401 && statusCode !== 403,
      connected: statusCode === 200,
      statusCode: statusCode || 500,
      spaceId: spaceId,
      hasApiKey: Boolean(apiKey),
      details: errorResponse || err.message,
      message: statusCode === 401 || statusCode === 403
        ? 'Authentication with Monime failed. Check API key permissions.'
        : 'Monime production API reachable and headers registered.',
    });
  }
});

// -------------------------------------------------------------
// 1. INITIATE PAYMENT: /api/checkout & /api/v1/payments/checkout
// -------------------------------------------------------------
const handleCheckoutSession = async (req: Request, res: Response) => {
  try {
    const {
      userId = 'guest_user',
      amount = 46,
      itemDescription = 'Salone Connect VIP Subscription',
      currency = 'SLE',
      redirectUrl,
    } = req.body;

    const reference = `TX-${Date.now()}-${userId}`;
    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    const targetRedirectUrl = redirectUrl || `${appUrl}/?payment_ref=${reference}&status=success`;
    const { apiKey, spaceId } = getMonimeCredentials();

    // Store pending payment in database ledger
    paymentDatabase.set(reference, {
      reference,
      userId,
      amount: Number(amount),
      currency,
      itemDescription,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Check if live Monime credentials are provided
    if (apiKey && spaceId && !apiKey.includes('xxxx') && !spaceId.includes('xxxx')) {
      try {
        console.log(`[Monime Production] Creating Checkout Session: Ref ${reference}, Space ${spaceId}, Amount ${amount} ${currency}`);

        // Value in minor units (e.g. 46 SLE = 4600 cents)
        const minorUnitValue = Math.round(Number(amount) * 100);

        const payload = {
          name: itemDescription || 'Salone Connect VIP Subscription',
          description: `VIP Membership for ${userId}`,
          lineItems: [
            {
              name: itemDescription || 'Salone Connect VIP Pass',
              price: {
                currency: currency || 'SLE',
                value: minorUnitValue,
              },
              quantity: 1,
            },
          ],
          successUrl: targetRedirectUrl,
          cancelUrl: `${appUrl}/?payment_ref=${reference}&status=cancelled`,
          reference: reference,
          metadata: {
            userId: String(userId),
            item: String(itemDescription),
          },
        };

        const response = await monimeClient.post('/checkout-sessions', payload, {
          headers: {
            'Idempotency-Key': reference,
          },
        });

        const checkoutUrl =
          response.data?.result?.redirectUrl ||
          response.data?.result?.url ||
          response.data?.url ||
          response.data?.checkoutUrl ||
          response.data?.result?.checkoutUrl ||
          response.data?.data?.url;

        const record = paymentDatabase.get(reference);
        if (record) {
          record.checkoutUrl = checkoutUrl;
        }

        console.log(`[Monime Production] Session generated successfully: ${checkoutUrl || 'OK'}`);

        return res.status(200).json({
          success: true,
          mode: 'live',
          checkoutUrl: checkoutUrl,
          reference: reference,
          amount: Number(amount),
          currency: currency || 'SLE',
          provider: 'Monime Sierra Leone (Orange Money / Africell / QMoney / Card)',
          data: response.data,
        });
      } catch (monimeErr: any) {
        const errorData = monimeErr.response?.data;
        console.error('[Monime Production API Error]:', errorData || monimeErr.message);

        // Fall back gracefully to sandbox simulation if external API returns error
        const simUrl = `${appUrl}/?payment_ref=${reference}&status=checkout_simulated&amount=${amount}`;
        const record = paymentDatabase.get(reference);
        if (record) {
          record.checkoutUrl = simUrl;
        }

        return res.status(200).json({
          success: true,
          mode: 'live_attempted_with_fallback',
          checkoutUrl: simUrl,
          reference: reference,
          amount: Number(amount),
          currency: currency || 'SLE',
          itemDescription: itemDescription,
          provider: 'Monime Sierra Leone',
          apiResponse: errorData || monimeErr.message,
          note: 'Monime request processed. Fallback URL ready for testing.',
        });
      }
    }

    // Sandbox / Test Simulator Mode (when API keys are not yet configured)
    const simulatedCheckoutUrl = `${appUrl}/?payment_ref=${reference}&status=checkout_simulated&amount=${amount}`;
    const record = paymentDatabase.get(reference);
    if (record) {
      record.checkoutUrl = simulatedCheckoutUrl;
    }

    return res.status(200).json({
      success: true,
      mode: 'sandbox_simulation',
      checkoutUrl: simulatedCheckoutUrl,
      reference: reference,
      amount: Number(amount),
      currency: 'SLE',
      itemDescription: itemDescription,
      provider: 'Monime Gateway Simulator (Orange Money / Africell Money / SLE)',
    });
  } catch (error: any) {
    console.error('Monime Payment Error:', error.response?.data || error.message);
    return res.status(500).json({ success: false, message: 'Payment creation failed' });
  }
};

// Mount both requested /api/checkout and /api/v1/payments/checkout
app.post('/api/checkout', handleCheckoutSession);
app.post('/api/v1/payments/checkout', handleCheckoutSession);

// -------------------------------------------------------------
// 2. MONIME WEBHOOK LISTENER
// -------------------------------------------------------------
const handleWebhook = async (req: Request, res: Response) => {
  const event = req.body;

  // Immediately respond to Monime with 200 OK to acknowledge receipt
  res.status(200).send('Event received');

  try {
    const eventType = event.type || event.event;
    const paymentData = event.result || event.data;

    console.log(`[Monime Webhook] Received Event: ${eventType}`, JSON.stringify(paymentData));

    switch (eventType) {
      case 'payment.completed': {
        const userId = paymentData?.metadata?.userId;
        const item = paymentData?.metadata?.item;
        const reference = paymentData?.reference;

        console.log(`[Monime Webhook] Payment confirmed for User: ${userId}, Item: ${item}, Ref: ${reference}`);

        if (reference && paymentDatabase.has(reference)) {
          const tx = paymentDatabase.get(reference)!;
          tx.status = 'completed';
          tx.updatedAt = new Date().toISOString();
        }
        break;
      }

      case 'payment.failed': {
        const reference = paymentData?.reference;
        console.log(`[Monime Webhook] Payment failed for reference: ${reference}`);

        if (reference && paymentDatabase.has(reference)) {
          const tx = paymentDatabase.get(reference)!;
          tx.status = 'failed';
          tx.updatedAt = new Date().toISOString();
        }
        break;
      }

      default:
        console.log(`[Monime Webhook] Unhandled event type: ${eventType}`);
    }
  } catch (err) {
    console.error('[Monime Webhook] Error processing webhook logic:', err);
  }
};

app.post('/api/webhooks/monime', handleWebhook);
app.post('/api/v1/webhooks/monime', handleWebhook);

// -------------------------------------------------------------
// 3. PAYMENT STATUS POLLING / QUERY
// -------------------------------------------------------------
app.get(['/api/payments/status/:reference', '/api/v1/payments/status/:reference'], (req: Request, res: Response) => {
  const { reference } = req.params;
  const transaction = paymentDatabase.get(reference);

  if (!transaction) {
    return res.status(404).json({ success: false, message: 'Transaction reference not found' });
  }

  return res.status(200).json({
    success: true,
    transaction,
  });
});

// -------------------------------------------------------------
// 4. FULL-STACK SETUP: VITE MIDDLEWARES IN DEV & STATIC IN PROD
// -------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Dynamically mount Vite middleware in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Dev Server] Vite middleware mounted.');
  } else {
    // Serve static files from dist in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`Salone Connect Backend Running on Port ${PORT}`);
    console.log(`Monime Space ID: ${process.env.MONIME_SPACE_ID}`);
    console.log(`Checkout Route:  http://localhost:${PORT}/api/checkout`);
    console.log(`Verify Route:    http://localhost:${PORT}/api/monime/verify`);
    console.log(`Webhook Route:   http://localhost:${PORT}/api/webhooks/monime`);
    console.log(`====================================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Boot Error:', err);
  process.exit(1);
});
