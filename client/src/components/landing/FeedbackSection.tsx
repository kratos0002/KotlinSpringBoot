import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCity } from '@/hooks/use-city.tsx';
import { CheckCircle2, Send, Cat, Dog, Bird, Fish, Rabbit, Heart, PawPrint } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { Card } from "@/components/ui/card";

const petTypes = [
  "Dog",
  "Cat",
  "Bird",
  "Rabbit",
  "Hamster",
  "Fish",
  "Reptile",
  "Other"
];

const useCases = [
  "Finding local pet services",
  "Connecting with other pet owners",
  "Accessing pet-related information",
  "Organizing pet playdates",
  "Finding lost pets",
  "Other"
];

// Helper function to get pet icon by type
const getPetIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'dog': return <Dog className="w-5 h-5" />;
    case 'cat': return <Cat className="w-5 h-5" />;
    case 'bird': return <Bird className="w-5 h-5" />;
    case 'fish': return <Fish className="w-5 h-5" />;
    case 'rabbit': return <Rabbit className="w-5 h-5" />;
    default: return <PawPrint className="w-5 h-5" />;
  }
};

// Pet images for decoration
const petImages = [
  "/images/pet-1.jpg",
  "/images/pet-2.jpg",
  "/images/pet-3.jpg",
  "/images/pet-4.jpg",
  "https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
];

const FeedbackSection = () => {
  const { city } = useCity();
  const [formData, setFormData] = useState({
    email: '',
    feedback: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit feedback');
      }

      setIsSubmitted(true);
      setFormData({ email: '', feedback: '' }); // Reset form after successful submission
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit feedback');
    }
  };

  // Define accent colors based on city
  const accentClass = cn(
    city === 'Amsterdam' && 'from-amsterdam to-amsterdam/70',
    city === 'Dublin' && 'from-dublin to-dublin/70',
    city === 'Calgary' && 'from-calgary to-calgary/70',
    !city && 'from-primary to-primary/70'
  );

  const cityTextClass = cn(
    city === 'Amsterdam' && 'text-amsterdam',
    city === 'Dublin' && 'text-dublin',
    city === 'Calgary' && 'text-calgary',
    !city && 'text-primary'
  );
  
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Help Improve Your City's Pet Services</h2>
          <p className="text-gray-600 mb-4">
            Share your feedback about pet services in your city.
          </p>
          <Textarea
            placeholder="Your feedback..."
            value={formData.feedback}
            onChange={handleChange}
            name="feedback"
            className="mb-4"
          />
          <Input
            type="email"
            placeholder="Your email (required)"
            value={formData.email}
            onChange={handleChange}
            name="email"
            required
            className="mb-4"
          />
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitted || !formData.feedback.trim() || !formData.email.trim()}
            className="w-full"
          >
            {isSubmitted ? 'Thanks for your feedback!' : 'Submit Feedback'}
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default FeedbackSection; 