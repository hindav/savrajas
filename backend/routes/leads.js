/* ==========================================================================
   LEADS & CRM ROUTES (backend/routes/leads.js)
   Synchronized Client Inquiries, Estimates & CRM Pipeline
   ========================================================================== */

import express from 'express';
import { getLeads, createLead, updateLeadStatus, deleteLead } from '../config/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/leads - Protected: List all CRM inquiries
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const leads = await getLeads();
    return res.json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (err) {
    console.error('[API] GET /leads error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve client leads.',
      data: []
    });
  }
});

// POST /api/leads - Public & Android: Ingest Inquiry/Lead
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, projectType, project_type, addons, maintenance, tier, totalPrice, total_price, status } = req.body;

    if (!name && !email && !phone) {
      return res.status(400).json({
        success: false,
        error: 'At least one contact identifier (name, email, or phone) is required.'
      });
    }

    const leadPayload = {
      name: (name || 'Valued Client').trim(),
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      projectType: (projectType || project_type || 'Custom Software Inquiry').trim(),
      addons: (addons || '').toString(),
      maintenance: (maintenance || 'Standard').toString(),
      tier: (tier || '').toString(),
      totalPrice: Number(totalPrice || total_price) || 0,
      status: (status || 'new').toLowerCase(),
      timestamp: new Date().toISOString()
    };

    const created = await createLead(leadPayload);

    return res.status(201).json({
      success: true,
      message: 'Inquiry received and synced successfully.',
      data: created || leadPayload
    });
  } catch (err) {
    console.error('[API] POST /leads error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while saving inquiry.'
    });
  }
});

// PATCH /api/leads/:id/status - Protected: Update status
router.patch('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'contacted', 'in-progress', 'in_progress', 'closed', 'lost', 'deleted'];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.filter(s => s !== 'deleted').join(', ')}`
      });
    }

    const updated = await updateLeadStatus(id, status.toLowerCase());
    if (!updated) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update lead status in database.'
      });
    }

    return res.json({
      success: true,
      message: 'Lead status updated successfully.',
      id,
      status: status.toLowerCase()
    });
  } catch (err) {
    console.error(`[API] PATCH /leads/${req.params.id}/status error:`, err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while updating lead status.'
    });
  }
});

// DELETE /api/leads/:id - Protected: Delete lead
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteLead(id);

    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete lead from database.'
      });
    }

    return res.json({
      success: true,
      message: 'Lead deleted successfully.',
      id
    });
  } catch (err) {
    console.error(`[API] DELETE /leads/${req.params.id} error:`, err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while deleting lead.'
    });
  }
});

export default router;

