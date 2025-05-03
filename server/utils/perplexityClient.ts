import { storage } from "../storage.js";

interface PerplexityServiceResponse {
  city: string;
  category: string;
  content: any;
  timestamp: string;
}

export interface ServiceProvider {
  name: string;
  category: string;
  address: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  description?: string;
  animals: string[];
}

export class PerplexityClient {
  private apiKey: string;
  private baseUrl: string = "https://api.perplexity.ai/chat/completions";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async query(prompt: string, systemMessage: string = ""): Promise<any> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: systemMessage || "You are a helpful assistant that provides accurate and up-to-date information. Always respond with valid JSON when requested."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Perplexity API error details:', errorData);
      throw new Error(`Perplexity API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async getPetServicesForCity(city: string, country: string, category?: string): Promise<PerplexityServiceResponse> {
    try {
      // Check cache first
      const cacheKey = category || 'all';
      const cachedService = await storage.getPerplexityService(city, cacheKey);
      
      if (cachedService && cachedService.timestamp) {
        // Check if cache is less than 24 hours old
        const cacheAge = Date.now() - cachedService.timestamp.getTime();
        if (cacheAge < 24 * 60 * 60 * 1000) {
          return JSON.parse(cachedService.content);
        }
      }

      // If no valid cache, generate new content
      const prompt = `Please provide a comprehensive list of pet services in ${city},${country} ${category ? ` for ${category}` : ''}. 
      Format the response as a JSON array of service providers with the following structure:
      [
        {
          "name": "Service Name",
          "category": "Service Category",
          "address": "Full Address",
          "phone": "Phone Number",
          "website": "Website URL",
          "openingHours": "Opening Hours",
          "rating": 45, // Rating out of 50
          "reviewCount": 100,
          "imageUrl": "Image URL",
          "description": "Brief description of services",
          "animals": ["Dogs", "Cats", "Birds"]
        }
      ]
      Only provide the JSON response without any formatting ensuring all fields are double quoted. No other text.
      Include at least 3-5 entries with realistic details.`;

      const response = await this.query(prompt);
      const services = JSON.parse(response);

      // Store in cache
      await storage.updateOrSave(
        services,
        { city, category: cacheKey },
        { content: JSON.stringify(services), timestamp: new Date() }
      );

      return services;
    } catch (error) {
      console.error("Error fetching pet services:", error);
      throw error;
    }
  }

  async getPetCareInfo(topic: string, city: string): Promise<PerplexityServiceResponse> {
    try {
      // Check cache first
      const cachedInfo = await storage.getPerplexityPetCare(topic, city);
      
      if (cachedInfo && cachedInfo.timestamp) {
        // Check if cache is less than 24 hours old
        const cacheAge = Date.now() - cachedInfo.timestamp.getTime();
        if (cacheAge < 24 * 60 * 60 * 1000) {
          return {
            city,
            category: 'pet-care',
            content: JSON.parse(cachedInfo.content),
            timestamp: cachedInfo.timestamp.toISOString()
          };
        }
      }

      // If no valid cache, generate new content
      const prompt = `Please provide detailed information about ${topic} for pets in ${city}.
      Format the response as a JSON object with the following structure:
      {
        "topic": "${topic}",
        "city": "${city}",
        "content": "Detailed information about the topic",
        "sources": ["Source 1", "Source 2"],
        "lastUpdated": "Current date"
      }`;

      const response = await this.query(prompt);
      const info = JSON.parse(response);

      // Store in cache
      await storage.updatePerplexityPetCare(topic, city, JSON.stringify(info));

      return {
        city,
        category: 'pet-care',
        content: info,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error fetching pet care info:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const perplexityClient = new PerplexityClient(process.env.PERPLEXITY_API_KEY || "");