import express from 'express';
import jwt from 'jsonwebtoken';
import Form from '../models/Form.js';
import Response from '../models/Response.js';

const router = express.Router();

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Create form
router.post('/', authenticateToken, async (req, res) => {
  try {
    const form = new Form({
      ...req.body,
      createdBy: req.user.userId
    });
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ message: 'Error creating form', error: error.message });
  }
});

// Get form by ID
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching form', error: error.message });
  }
});

// Get user's forms
router.get('/', authenticateToken, async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.user.userId });
    res.json(forms);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching forms', error: error.message });
  }
});

// Submit form response
router.post('/:id/responses', async (req, res) => {
  try {
    const response = new Response({
      formId: req.params.id,
      responses: req.body.responses
    });
    await response.save();
    res.status(201).json({ message: 'Response submitted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error submitting response', error: error.message });
  }
});

// all responses
router.get('/:id/responses', authenticateToken, async (req, res) => {
  try {

    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to view these responses.' });
    }


    const responses = await Response.find({ formId: req.params.id });
    res.json(responses);
    
  } catch (error) {
    res.status(500).json({ message: 'Error fetching responses', error: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const formId = req.params.id;
    const userId = req.user.userId;

    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this form.' });
    }

    await Response.deleteMany({ formId: formId });
    
    await Form.findByIdAndDelete(formId);

    res.status(200).json({ message: 'Form and all associated responses deleted successfully' });

  } catch (error) {
    console.error("Delete form error:", error);
    res.status(500).json({ message: 'Error deleting form', error: error.message });
  }
});

export default router;
