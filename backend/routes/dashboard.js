/* ==========================================================================
   DASHBOARD METRICS ROUTES (backend/routes/dashboard.js)
   Aggregates live metrics, counts, and pipeline statistics
   ========================================================================== */

import express from 'express';
import { getLeads, getPortfolio, getPricing } from '../config/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/dashboard/stats - Protected Admin Only
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const [leads, portfolio, pricing] = await Promise.all([
      getLeads(),
      getPortfolio(),
      getPricing()
    ]);

    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    const totalPipeline = leads.reduce((sum, l) => sum + (Number(l.totalPrice) || 0), 0);
    const avgPipeline = totalLeads > 0 ? Math.round(totalPipeline / totalLeads) : 0;
    const totalProjects = portfolio ? portfolio.length : 0;

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        totalLeads,
        newLeads,
        totalProjects,
        totalPipeline,
        avgPipeline,
        currency: 'INR',
        cloudSync: 'online',
        pricingActive: Boolean(pricing)
      }
    });
  } catch (err) {
    console.error('[API] GET /dashboard/stats error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to aggregate dashboard metrics.'
    });
  }
});

export default router;

