/* ==========================================================================
   PORTFOLIO ROUTES (backend/routes/portfolio.js)
   Synchronized Case Studies & Portfolio Projects CRUD
   ========================================================================== */

import express from 'express';
import { getPortfolio, savePortfolio } from '../config/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Real Portfolio Case Studies matching the Savrajas website
const DEFAULT_PORTFOLIO = [
  {
    id: "ml-sentiment-analyzer",
    title: "ML Sentiment Analyzer",
    client: "Savrajas Internal R&D",
    category: "Machine Learning & NLP",
    industry: "AI & Natural Language Processing",
    description: "A real-time sentiment analysis engine that processes social media feeds, customer reviews, and support tickets using fine-tuned BERT transformers with 94% accuracy.",
    techStack: "Python, BERT, Flask, React, AWS SageMaker",
    tags: ["NLP", "Python", "AI"],
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    active: true,
    featured: true
  },
  {
    id: "image-classifier",
    title: "Image Classification Engine",
    client: "Enterprise Vision Labs",
    category: "Deep Learning & Computer Vision",
    industry: "AI & Computer Vision",
    description: "Production-grade image classification system trained on 50K+ labeled images using custom CNN architectures for automated visual quality assurance.",
    techStack: "Python, TensorFlow, Keras, OpenCV, GCP Vertex AI",
    tags: ["CNN", "TensorFlow", "Computer Vision"],
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    active: true,
    featured: true
  },
  {
    id: "predictive-analytics",
    title: "Predictive Analytics Dashboard",
    client: "DataDriven Corp",
    category: "Data Science & Analytics",
    industry: "Data Science & Business Analytics",
    description: "End-to-end ML pipeline that ingests enterprise data, trains gradient-boosted models for revenue forecasting, churn prediction, and demand planning.",
    techStack: "Python, Scikit-learn, Pandas, Plotly Dash, PostgreSQL",
    tags: ["ML Pipeline", "Pandas", "Scikit-learn"],
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    active: true,
    featured: true
  },
  {
    id: "recommendation-engine",
    title: "AI Recommendation Engine",
    client: "ShopSmart E-Commerce",
    category: "Machine Learning & Personalization",
    industry: "E-Commerce & Personalization",
    description: "Hybrid recommendation system combining collaborative filtering and content-based approaches. Serves personalized suggestions to 100K+ users in real time.",
    techStack: "Python, Surprise, FastAPI, Redis, React, Docker",
    tags: ["Collaborative Filtering", "Python", "API"],
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    active: true,
    featured: true
  },
  {
    id: "nlp-chatbot",
    title: "NLP Smart Chatbot",
    client: "CustomerFirst Solutions",
    category: "Conversational AI & LLM",
    industry: "Conversational AI & Customer Support",
    description: "Intelligent conversational assistant powered by retrieval-augmented generation (RAG). Understands context across multi-turn dialogues and resolves 80% queries.",
    techStack: "Python, LangChain, OpenAI GPT, Pinecone, Next.js",
    tags: ["NLP", "Transformers", "LLM"],
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    active: true,
    featured: true
  },
  {
    id: "fraud-detection",
    title: "Fraud Detection System",
    client: "FinTech Secure Systems",
    category: "ML & Cybersecurity",
    industry: "FinTech & Cybersecurity",
    description: "Real-time transactional anomaly detection engine flagging fraudulent activities with sub-100ms latency using XGBoost and streaming event pipelines.",
    techStack: "Python, XGBoost, Scikit-learn, Docker, AWS",
    tags: ["Anomaly Detection", "XGBoost", "FinTech"],
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    active: true,
    featured: true
  }
];

// GET /api/portfolio - Public or authenticated
router.get('/', async (req, res) => {
  try {
    const cloudProjects = await getPortfolio();
    let projects = DEFAULT_PORTFOLIO;

    if (cloudProjects && Array.isArray(cloudProjects) && cloudProjects.length > 0) {
      const isLegacy = cloudProjects.some(p => p.id === 'elect-capital' || p.title === 'Elect Capital');
      if (!isLegacy) {
        projects = cloudProjects;
      }
    }

    return res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    console.error('[API] GET /portfolio error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve portfolio projects.',
      data: DEFAULT_PORTFOLIO
    });
  }
});

// POST /api/portfolio - Protected: Add New Project
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { title, client, category, industry, description, tags, metrics, logo, url, active, featured } = req.body;

    if (!title || !client) {
      return res.status(400).json({
        success: false,
        error: 'Project title and client name are required.'
      });
    }

    const currentList = (await getPortfolio()) || DEFAULT_PORTFOLIO;

    const newProject = {
      id: 'p_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      title: title.trim(),
      client: client.trim(),
      category: (category || 'Enterprise Software').trim(),
      industry: (industry || 'Technology').trim(),
      description: (description || '').trim(),
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []),
      metrics: (metrics || '').trim(),
      logo: logo || 'assets/images/app-icon.png',
      url: (url || '').trim(),
      active: active !== false,
      featured: Boolean(featured),
      createdAt: new Date().toISOString()
    };

    const updatedList = [newProject, ...currentList];
    const saved = await savePortfolio(updatedList);

    if (!saved) {
      return res.status(500).json({
        success: false,
        error: 'Failed to save new project to database.'
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Project created and synced to cloud successfully.',
      project: newProject
    });
  } catch (err) {
    console.error('[API] POST /portfolio error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while creating project.'
    });
  }
});

// PUT /api/portfolio/:id - Protected: Update Project
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const currentList = (await getPortfolio()) || DEFAULT_PORTFOLIO;
    const index = currentList.findIndex(p => String(p.id) === String(id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: `Project with ID ${id} not found.`
      });
    }

    const updatedProject = {
      ...currentList[index],
      ...updates,
      id: currentList[index].id, // preserve immutable ID
      updatedAt: new Date().toISOString()
    };

    currentList[index] = updatedProject;
    const saved = await savePortfolio(currentList);

    if (!saved) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update project in database.'
      });
    }

    return res.json({
      success: true,
      message: 'Project updated successfully.',
      project: updatedProject
    });
  } catch (err) {
    console.error(`[API] PUT /portfolio/${req.params.id} error:`, err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while updating project.'
    });
  }
});

// DELETE /api/portfolio/:id - Protected: Delete Project
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const currentList = (await getPortfolio()) || DEFAULT_PORTFOLIO;
    const filteredList = currentList.filter(p => String(p.id) !== String(id));

    if (filteredList.length === currentList.length) {
      return res.status(404).json({
        success: false,
        error: `Project with ID ${id} not found.`
      });
    }

    const saved = await savePortfolio(filteredList);
    if (!saved) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete project from database.'
      });
    }

    return res.json({
      success: true,
      message: 'Project deleted successfully.',
      id
    });
  } catch (err) {
    console.error(`[API] DELETE /portfolio/${req.params.id} error:`, err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while deleting project.'
    });
  }
});

export default router;

