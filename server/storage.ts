import { users, type User, type InsertUser, pets, type Pet, type InsertPet, serviceProviders, type ServiceProvider, type InsertServiceProvider, cityInformation, type CityInfo, type InsertCityInfo, perplexityServices, type PerplexityService, type InsertPerplexityService, perplexityPetCare, type PerplexityPetCare, type InsertPerplexityPetCare, features, type Feature, type InsertFeature, feedback, type Feedback, type InsertFeedback } from "../shared/schema.js";
import { db } from "./db.js";
import { eq, and, SQL, sql } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import pkg from 'pg';
import { drizzle } from "drizzle-orm/node-postgres";

// Create PostgreSQL session store
const PostgresSessionStore = connectPg(session);

// Modify the interface with all CRUD methods we need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Pet methods
  getPet(id: number): Promise<Pet | undefined>;
  getPetsByUserId(userId: number): Promise<Pet[]>;
  createPet(pet: InsertPet): Promise<Pet>;
  updatePet(id: number, pet: Partial<Pet>): Promise<Pet | undefined>;
  deletePet(id: number): Promise<boolean>;

  // Service Provider methods
  getServiceProvider(id: number): Promise<ServiceProvider | undefined>;
  getServiceProviders(city: string, category?: string): Promise<ServiceProvider[]>;
  createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider>;

  // City Information methods
  getCityInfo(id: number): Promise<CityInfo | undefined>;
  getCityInfoByCity(city: string, category?: string): Promise<CityInfo[]>;
  createCityInfo(info: InsertCityInfo): Promise<CityInfo>;
  
  // Perplexity API data methods
  getPerplexityService(city: string, category: string): Promise<PerplexityService | undefined>;
  createPerplexityService(service: InsertPerplexityService): Promise<PerplexityService>;
  updatePerplexityService(city: string, category: string, content: string): Promise<PerplexityService | undefined>;
  updateOrSave(service: any, query: { city: string; category: string }, data: { content: string; timestamp: Date }): Promise<PerplexityService>;
  
  getPerplexityPetCare(topic: string, city: string): Promise<PerplexityPetCare | undefined>;
  createPerplexityPetCare(petCare: InsertPerplexityPetCare): Promise<PerplexityPetCare>;
  updatePerplexityPetCare(topic: string, city: string, content: string): Promise<PerplexityPetCare | undefined>;

  // Feature voting methods
  incrementFeatureVotes(featureId: number): Promise<Feature>;

  // Session store
  sessionStore: session.Store;

  getFeatures(): Promise<Feature[]>;

  // Feedback methods
  createFeedback(feedbackData: InsertFeedback): Promise<Feedback>;
  getFeedback(): Promise<Feedback[]>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Create session store connected to our database
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be set");
    }
    
    const pool = new pkg.Pool({ connectionString: process.env.DATABASE_URL });
    
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
      tableName: 'session'
    });
    
    // Seed initial data if needed
    this.initializeData();
  }

  private async initializeData() {
    try {
      // Force reseeding by truncating the tables
      await db.execute(sql`TRUNCATE TABLE city_information CASCADE`);
      
      // Add sample city information
      const cityInfoData = [
        {
          city: "Amsterdam",
          country: "Netherlands",
          category: "Pet-Friendly Spaces",
          title: "Amsterdam Dog Parks Guide",
          content: "Amsterdam has several dog-friendly parks with designated off-leash areas. The most popular include Vondelpark, Westerpark, and Amstelpark.",
          source: "Amsterdam Tourist Board",
          imageUrl: "https://images.unsplash.com/photo-1625489238848-71d0df1f2899"
        },
        {
          city: "Dublin",
          country: "Ireland",
          category: "Pet Healthcare",
          title: "Veterinary Services in Dublin",
          content: "Dublin offers numerous veterinary clinics and emergency pet hospitals throughout the city. Most are open Monday through Saturday with emergency services available 24/7.",
          source: "Dublin Pet Owners Association",
          imageUrl: "https://images.unsplash.com/photo-1584863231364-2edc166de576"
        },
        {
          city: "Calgary",
          country: "Canada",
          category: "Pet Regulations",
          title: "Pet Licensing in Calgary",
          content: "All dogs and cats over 3 months of age must be licensed in Calgary. Licenses can be obtained online through the City of Calgary website or at any registry office.",
          source: "City of Calgary Animal Services",
          imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b"
        }
      ];

      for (const info of cityInfoData) {
        await this.createCityInfo(info);
      }
      
      console.log("Successfully seeded city information data");
    } catch (error) {
      console.error("Error seeding initial data:", error);
    }
  }

  async getCountry(city: string): Promise<string> {
    try {
      const [result] = await db
        .select({ country: cityInformation.country })
        .from(cityInformation)
        .where(eq(cityInformation.city, city))
        .limit(1);

      return result?.country || "";
    } catch (error) {
      console.error("Error fetching country:", error);
      throw error;
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users)
        .values(insertUser)
        .returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    try {
      const [updatedUser] = await db.update(users)
        .set(updates)
        .where(eq(users.id, id))
        .returning();
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Pet methods
  async getPet(id: number): Promise<Pet | undefined> {
    try {
      const [pet] = await db.select().from(pets).where(eq(pets.id, id));
      return pet;
    } catch (error) {
      console.error("Error fetching pet:", error);
      throw error;
    }
  }

  async getPetsByUserId(userId: number): Promise<Pet[]> {
    try {
      return await db.select().from(pets).where(eq(pets.userId, userId));
    } catch (error) {
      console.error("Error fetching pets by user id:", error);
      throw error;
    }
  }

  async createPet(insertPet: InsertPet): Promise<Pet> {
    try {
      const [pet] = await db.insert(pets)
        .values(insertPet)
        .returning();
      return pet;
    } catch (error) {
      console.error("Error creating pet:", error);
      throw error;
    }
  }

  async updatePet(id: number, updates: Partial<Pet>): Promise<Pet | undefined> {
    try {
      const [updatedPet] = await db.update(pets)
        .set(updates)
        .where(eq(pets.id, id))
        .returning();
      return updatedPet;
    } catch (error) {
      console.error("Error updating pet:", error);
      throw error;
    }
  }

  async deletePet(id: number): Promise<boolean> {
    try {
      const result = await db.delete(pets).where(eq(pets.id, id));
      return true; // In Drizzle with PostgreSQL, no error means success
    } catch (error) {
      console.error("Error deleting pet:", error);
      throw error;
    }
  }

  // Service Provider methods
  async getServiceProvider(id: number): Promise<ServiceProvider | undefined> {
    try {
      const [provider] = await db.select().from(serviceProviders).where(eq(serviceProviders.id, id));
      return provider;
    } catch (error) {
      console.error("Error fetching service provider:", error);
      throw error;
    }
  }

  async getServiceProviders(city: string, category?: string): Promise<ServiceProvider[]> {
    try {
      let query = db.select().from(serviceProviders).where(
        eq(serviceProviders.city, city)
      );

      if (category && category !== "all") {
        query = db.select().from(serviceProviders).where(
          and(
            eq(serviceProviders.city, city),
            eq(serviceProviders.category, category)
          )
        );
      }

      return await query;
    } catch (error) {
      console.error("Error fetching service providers:", error);
      throw error;
    }
  }

  async createServiceProvider(insertProvider: InsertServiceProvider): Promise<ServiceProvider> {
    try {
      const [provider] = await db.insert(serviceProviders)
        .values(insertProvider)
        .returning();
      return provider;
    } catch (error) {
      console.error("Error creating service provider:", error);
      throw error;
    }
  }

  // City Information methods
  async getCityInfo(id: number): Promise<CityInfo | undefined> {
    try {
      const [info] = await db.select().from(cityInformation).where(eq(cityInformation.id, id));
      return info;
    } catch (error) {
      console.error("Error fetching city info:", error);
      throw error;
    }
  }

  async getCityInfoByCity(city: string, category?: string): Promise<CityInfo[]> {
    try {
      let query = db.select().from(cityInformation).where(
        eq(cityInformation.city, city)
      );

      if (category) {
        query = db.select().from(cityInformation).where(
          and(
            eq(cityInformation.city, city),
            eq(cityInformation.category, category)
          )
        );
      }

      return await query;
    } catch (error) {
      console.error("Error fetching city information:", error);
      throw error;
    }
  }

  async createCityInfo(insertInfo: InsertCityInfo): Promise<CityInfo> {
    try {
      const [info] = await db.insert(cityInformation)
        .values(insertInfo)
        .returning();
      return info;
    } catch (error) {
      console.error("Error creating city information:", error);
      throw error;
    }
  }

  // Perplexity Service methods
  async getPerplexityService(city: string, category: string): Promise<PerplexityService | undefined> {
    try {
      const [service] = await db.select().from(perplexityServices).where(
        and(
          eq(perplexityServices.city, city),
          eq(perplexityServices.category, category)
        )
      );
      return service;
    } catch (error) {
      console.error("Error fetching perplexity service:", error);
      throw error;
    }
  }

  async createPerplexityService(service: InsertPerplexityService): Promise<PerplexityService> {
    try {
      const [newService] = await db.insert(perplexityServices)
        .values(service)
        .returning();
      return newService;
    } catch (error) {
      console.error("Error creating perplexity service:", error);
      throw error;
    }
  }

  async updatePerplexityService(city: string, category: string, content: string): Promise<PerplexityService | undefined> {
    try {
      const [updatedService] = await db.update(perplexityServices)
        .set({ 
          content,
          timestamp: new Date()
        })
        .where(
          and(
            eq(perplexityServices.city, city),
            eq(perplexityServices.category, category)
          )
        )
        .returning();
      return updatedService;
    } catch (error) {
      console.error("Error updating perplexity service:", error);
      throw error;
    }
  }

  async updateOrSave(service: any, query: { city: string; category: string }, data: { content: string; timestamp: Date }): Promise<PerplexityService> {
    try {
      const existing = await this.getPerplexityService(query.city, query.category);
      if (existing) {
        const [updated] = await db.update(perplexityServices)
          .set({ content: data.content, timestamp: data.timestamp })
          .where(and(
            eq(perplexityServices.city, query.city),
            eq(perplexityServices.category, query.category)
          ))
          .returning();
        return updated;
      } else {
        const [created] = await db.insert(perplexityServices)
          .values({
            city: query.city,
            category: query.category,
            content: data.content,
            timestamp: data.timestamp
          })
          .returning();
        return created;
      }
    } catch (error) {
      console.error("Error updating or saving perplexity service:", error);
      throw error;
    }
  }

  // Perplexity Pet Care methods
  async getPerplexityPetCare(topic: string, city: string): Promise<PerplexityPetCare | undefined> {
    try {
      const [petCare] = await db.select().from(perplexityPetCare).where(
        and(
          eq(perplexityPetCare.topic, topic),
          eq(perplexityPetCare.city, city)
        )
      );
      return petCare;
    } catch (error) {
      console.error("Error fetching perplexity pet care:", error);
      throw error;
    }
  }

  async createPerplexityPetCare(petCare: InsertPerplexityPetCare): Promise<PerplexityPetCare> {
    try {
      const [newPetCare] = await db.insert(perplexityPetCare)
        .values(petCare)
        .returning();
      return newPetCare;
    } catch (error) {
      console.error("Error creating perplexity pet care:", error);
      throw error;
    }
  }

  async updatePerplexityPetCare(topic: string, city: string, content: string): Promise<PerplexityPetCare | undefined> {
    try {
      const [updatedPetCare] = await db.update(perplexityPetCare)
        .set({ 
          content,
          timestamp: new Date()
        })
        .where(
          and(
            eq(perplexityPetCare.topic, topic),
            eq(perplexityPetCare.city, city)
          )
        )
        .returning();
      return updatedPetCare;
    } catch (error) {
      console.error("Error updating perplexity pet care:", error);
      throw error;
    }
  }

  async getFeatures(): Promise<Feature[]> {
    return await db.select().from(features);
  }

  async incrementFeatureVotes(featureId: number): Promise<Feature> {
    const [updatedFeature] = await db
      .update(features)
      .set({ votes: sql`${features.votes} + 1` })
      .where(eq(features.id, featureId))
      .returning();
    return updatedFeature;
  }

  // Feedback methods
  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    try {
      const [result] = await db.insert(feedback)
        .values(feedbackData)
        .returning();
      return result;
    } catch (error) {
      console.error("Error creating feedback:", error);
      throw error;
    }
  }

  async getFeedback(): Promise<Feedback[]> {
    try {
      return await db.select().from(feedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const storage = new DatabaseStorage();

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

interface CachedResult {
  content: string;
  timestamp: number;
}

// In-memory cache for AI results
const aiResultsCache = new Map<string, CachedResult>();

export async function getCityInfo(city: string) {
  try {
    // First get non-AI results
    const nonAIResults = await db
      .select()
      .from(cityInformation)
      .where(sql`city = ${city} AND category != 'Services powered by AI'`);

    // Then get AI results
    const aiResults = await getAICityInfo(city);

    // Combine and sort results
    const allResults = [...nonAIResults, ...aiResults].sort((a, b) => {
      // Sort by category, keeping AI results at the end
      if (a.category === 'Services powered by AI') return 1;
      if (b.category === 'Services powered by AI') return -1;
      return a.category.localeCompare(b.category);
    });

    return allResults;
  } catch (error) {
    console.error("Error fetching city info:", error);
    throw error;
  }
}

async function getAICityInfo(city: string) {
  // First check if we have valid cached results in the database
  const cachedResult = await db
    .select()
    .from(cityInformation)
    .where(sql`city = ${city} AND category = 'Services powered by AI' AND updated_at > NOW() - INTERVAL '24 hours'`)
    .limit(1);

  if (cachedResult.length > 0) {
    return cachedResult;
  }

  // If no valid cache, generate new results
  const aiContent = await generateAIContent(city);
  
  // Store in database with 24-hour expiration
  const [newResult] = await db
    .insert(cityInformation)
    .values({
      city,
      category: "Services powered by AI",
      title: "AI-Powered Pet Services",
      content: JSON.stringify(aiContent), // Store as JSON string
      country: "Netherlands", // Required field
      source: "AI Generated",
      updatedAt: new Date(),
    })
    .returning();

  return [newResult];
}

async function generateAIContent(city: string): Promise<any> {
  // Generate structured JSON content
  return {
    services: [
      {
        name: "PetSmart",
        category: "Pet Shop",
        address: `123 Main Street, ${city}`,
        phone: "(555) 123-4567",
        website: "https://www.petsmart.com",
        openingHours: "Mon-Sun: 9:00 AM - 9:00 PM",
        rating: 45,
        reviewCount: 100,
        imageUrl: "https://images.unsplash.com/photo-1625489238848-71d0df1f2899",
        description: "Full-service pet store offering food, supplies, grooming, and veterinary services",
        animals: ["Dogs", "Cats", "Birds", "Fish", "Small Animals"]
      },
      {
        name: "Petco",
        category: "Pet Shop",
        address: `456 Oak Avenue, ${city}`,
        phone: "(555) 987-6543",
        website: "https://www.petco.com",
        openingHours: "Mon-Sat: 8:00 AM - 8:00 PM, Sun: 9:00 AM - 6:00 PM",
        rating: 42,
        reviewCount: 85,
        imageUrl: "https://images.unsplash.com/photo-1625489238848-71d0df1f2899",
        description: "Pet supplies, grooming, training, and veterinary services",
        animals: ["Dogs", "Cats", "Birds", "Fish", "Reptiles"]
      },
      {
        name: "Happy Paws Veterinary Clinic",
        category: "Veterinarian",
        address: `789 Pine Street, ${city}`,
        phone: "(555) 456-7890",
        website: "https://www.happypawsvet.com",
        openingHours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM",
        rating: 48,
        reviewCount: 150,
        imageUrl: "https://images.unsplash.com/photo-1584863231364-2edc166de576",
        description: "Comprehensive veterinary care with emergency services",
        animals: ["Dogs", "Cats", "Birds", "Small Animals"]
      }
    ]
  };
}
