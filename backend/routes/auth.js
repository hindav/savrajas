/* ==========================================================================
   AUTHENTICATION ROUTES (backend/routes/auth.js)
   Admin PIN login, token generation, and session verification
   ========================================================================== */

import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

let currentPin = process.env.ADMIN_PIN || '1234';
const JWT_SECRET = process.env.JWT_SECRET || 'savrajas_secure_fallback_secret_key_2026';
const TOKEN_EXPIRY = '7d';

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { pin } = req.body;

  if (!pin) {
    return res.status(400).json({
      success: false,
      error: 'Security PIN is required.'
    });
  }

  if (String(pin).trim() !== String(currentPin).trim()) {
    return res.status(401).json({
      success: false,
      error: 'Incorrect security PIN. Please try again.'
    });
  }

  // Issue secure JWT token
  const token = jwt.sign(
    {
      role: 'admin',
      issuedAt: Date.now()
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  return res.json({
    success: true,
    message: 'Authentication successful.',
    token,
    expiresIn: TOKEN_EXPIRY,
    user: {
      role: 'admin',
      appName: 'Savrajas Admin'
    }
  });
});

// GET /api/auth/verify
router.get('/verify', authenticateAdmin, (req, res) => {
  return res.json({
    success: true,
    valid: true,
    admin: req.admin
  });
});

// POST /api/auth/change-pin
router.post('/change-pin', authenticateAdmin, (req, res) => {
  const { oldPin, newPin } = req.body;

  if (!oldPin || !newPin) {
    return res.status(400).json({
      success: false,
      error: 'Both old PIN and new PIN are required.'
    });
  }

  if (String(oldPin).trim() !== String(currentPin).trim()) {
    return res.status(401).json({
      success: false,
      error: 'Current PIN verification failed.'
    });
  }

  if (String(newPin).trim().length !== 4 || !/^\d{4}$/.test(String(newPin).trim())) {
    return res.status(400).json({
      success: false,
      error: 'New PIN must be exactly 4 digits.'
    });
  }

  currentPin = String(newPin).trim();
  return res.json({
    success: true,
    message: 'Security PIN updated successfully.'
  });
});

export default router;

