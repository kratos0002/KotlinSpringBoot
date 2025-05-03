import { Router } from 'express';
import { perplexityClient } from '../utils/perplexityClient.js';
import { storage } from '../storage.js';

const router = Router();

/**
 * GET /api/perplexity/services
 * Query params:
 * - city: required - City to get services for
 * - category: optional - Type of service
 */
router.get('/services', async (req, res) => {
  const { city, category } = req.query;
  
  if (!city || typeof city !== 'string') {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  const country = await storage.getCountry(city);
  try {
    const serviceData = await perplexityClient.getPetServicesForCity(
      city,
      typeof category === 'string' ? category : ""
    );
    res.json(serviceData);
  } catch (error: any) {
    console.error('Error fetching services:', error);
    res.status(500).json({ 
      error: 'Failed to fetch service data', 
      details: error.message 
    });
  }
});

/**
 * GET /api/perplexity/pet-care
 * Query params:
 * - topic: required - Pet care topic to search for
 * - city: optional - City for location-specific information
 */
router.get('/pet-care', async (req, res) => {
  const { topic, city } = req.query;
  
  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({ error: 'Topic parameter is required' });
  }

  try {
    const infoData = await perplexityClient.getPetCareInfo(
      topic,
      typeof city === 'string' ? city : ""
    );
    res.json(infoData);
  } catch (error: any) {
    console.error('Error fetching pet care information:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pet care information', 
      details: error.message 
    });
  }
});

export default router;