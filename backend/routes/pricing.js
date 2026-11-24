/* ==========================================================================
   PRICING ROUTES (backend/routes/pricing.js)
   Synchronized Pricing Tiers and Add-ons configuration
   ========================================================================== */

import express from 'express';
import { getPricing, savePricing } from '../config/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Fallback pricing configuration matching default Savrajas pricing structure
const DEFAULT_PRICING = {
  tiers: {
    starter: { basePrice: 24999, name: "Starter" },
    pro: { basePrice: 49999, name: "Professional" },
    enterprise: { basePrice: 99999, name: "Enterprise" }
  },
  addons: {
    ai_bot: 14999,
    cloud_host: 7999,
    payment_gw: 9999,
    cms_panel: 11999,
    seo_pack: 8999,
    analytics: 5999
  },
  maintenance: {
    monthly: 4999,
    quarterly: 12999,
    annual: 44999
  },
  hourlyRate: 1500,
  currency: "INR"
};

// GET /api/pricing - Public or authenticated
router.get('/', async (req, res) => {
  try {
    const cloudPricing = await getPricing();
    const activePricing = cloudPricing || DEFAULT_PRICING;
    return res.json({
      success: true,
      source: cloudPricing ? 'database' : 'defaults',
      data: activePricing
    });
  } catch (err) {
    console.error('[API] GET /pricing error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve pricing configuration.',
      data: DEFAULT_PRICING
    });
  }
});

// PUT /api/pricing - Protected Admin Only
router.put('/', authenticateAdmin, async (req, res) => {
  try {
    const pricingPayload = req.body;
    if (!pricingPayload || typeof pricingPayload !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid pricing payload.'
      });
    }

    const saved = await savePricing(pricingPayload);
    if (!saved) {
      return res.status(500).json({
        success: false,
        error: 'Failed to persist pricing to database.'
      });
    }

    return res.json({
      success: true,
      message: 'Pricing configuration published to cloud database successfully.',
      data: pricingPayload
    });
  } catch (err) {
    console.error('[API] PUT /pricing error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while saving pricing.'
    });
  }
});

export default router;

