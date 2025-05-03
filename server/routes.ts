import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { setupAuth } from "./auth.js";
import { z } from "zod";
import { insertPetSchema, insertUserSchema, feedbackSchema } from "../shared/schema.js";
import perplexityRoutes from "./routes/perplexity.js";
import { perplexityClient } from "./utils/perplexityClient.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Perplexity API routes
  app.use('/api/perplexity', perplexityRoutes);

  // User profile routes
  app.put("/api/user", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const userId = req.user.id;
      const updatedUser = await storage.updateUser(userId, req.body);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (err) {
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // Pet routes
  app.get("/api/pets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const userId = req.user.id;
      const pets = await storage.getPetsByUserId(userId);
      res.json(pets);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch pets" });
    }
  });

  app.post("/api/pets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const userId = req.user.id;
      const petData = { ...req.body, userId };
      
      // Validate pet data
      const validatedData = insertPetSchema.parse(petData);
      
      const newPet = await storage.createPet(validatedData);
      res.status(201).json(newPet);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid pet data", 
          errors: err.errors 
        });
      }
      res.status(500).json({ message: "Failed to create pet" });
    }
  });

  app.put("/api/pets/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const petId = parseInt(req.params.id);
      const userId = req.user.id;
      
      // Check if pet exists and belongs to user
      const pet = await storage.getPet(petId);
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      
      if (pet.userId !== userId) {
        return res.status(403).json({ message: "You don't have permission to update this pet" });
      }
      
      const updatedPet = await storage.updatePet(petId, req.body);
      res.json(updatedPet);
    } catch (err) {
      res.status(500).json({ message: "Failed to update pet" });
    }
  });

  app.delete("/api/pets/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const petId = parseInt(req.params.id);
      const userId = req.user.id;
      
      // Check if pet exists and belongs to user
      const pet = await storage.getPet(petId);
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      
      if (pet.userId !== userId) {
        return res.status(403).json({ message: "You don't have permission to delete this pet" });
      }
      
      await storage.deletePet(petId);
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ message: "Failed to delete pet" });
    }
  });

  // Service Provider routes
  app.get("/api/services", async (req, res) => {
    try {
      const { city, category } = req.query;
      
      if (!city) {
        return res.status(400).json({ message: "City parameter is required" });
      }
      
      const services = await perplexityClient.getPetServicesForCity(
        city as string, 
        category as string
      );
      
      res.json(services);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      const service = await storage.getServiceProvider(serviceId);
      
      if (!service) {
        return res.status(404).json({ message: "Service provider not found" });
      }
      
      res.json(service);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch service provider" });
    }
  });

  // Feature voting routes
  app.get("/api/features", async (req, res) => {
    try {
      const features = await storage.getFeatures();
      res.json(features);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch features" });
    }
  });

  app.post("/api/features/:id/vote", async (req, res) => {
    try {
      const featureId = parseInt(req.params.id);
      const updatedFeature = await storage.incrementFeatureVotes(featureId);
      
      if (!updatedFeature) {
        return res.status(404).json({ message: "Feature not found" });
      }
      
      res.json(updatedFeature);
    } catch (err) {
      res.status(500).json({ message: "Failed to update feature votes" });
    }
  });

  // City Information routes
  app.get("/api/info", async (req, res) => {
    try {
      const { city, category } = req.query;
      
      if (!city) {
        return res.status(400).json({ message: "City parameter is required" });
      }
      
      const info = await storage.getCityInfoByCity(
        city as string, 
        category as string | undefined
      );
      
      res.json(info);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch city information" });
    }
  });

  // Feedback routes
  app.post("/api/feedback", async (req, res) => {
    try {
      const validationResult = feedbackSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid feedback data",
          errors: validationResult.error.errors
        });
      }
      
      const { email, feedback: feedbackText } = validationResult.data;
      const result = await storage.createFeedback({
        email,
        feedback: feedbackText
      });
      
      res.json(result);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      res.status(500).json({ message: "Failed to submit feedback" });
    }
  });

  app.get("/api/feedback", async (req, res) => {
    try {
      const feedback = await storage.getFeedback();
      res.json(feedback);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
