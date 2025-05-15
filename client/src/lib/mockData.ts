import { 
  Stethoscope, 
  Scissors, 
  Home, 
  ShoppingBag, 
  Hotel, 
  Coffee, 
  GraduationCap,
  Store,
  Bone
} from 'lucide-react';

export const serviceCategories = [
  {
    id: 1,
    name: 'Veterinarians',
    icon: Stethoscope,
    description: 'Professional pet healthcare services'
  },
  {
    id: 2,
    name: 'Groomers',
    icon: Scissors,
    description: 'Pet grooming and styling services'
  },
  {
    id: 3,
    name: 'Pet Sitters',
    icon: Home,
    description: 'In-home pet care services'
  },
  {
    id: 4,
    name: 'Pet Stores',
    icon: ShoppingBag,
    description: 'Pet supplies and accessories'
  },
  {
    id: 5,
    name: 'Boarding',
    icon: Hotel,
    description: 'Pet boarding and daycare services'
  },
  {
    id: 6,
    name: 'Pet-Friendly Cafes',
    icon: Coffee,
    description: 'Cafes that welcome pets'
  },
  {
    id: 7,
    name: 'Training Schools',
    icon: GraduationCap,
    description: 'Pet training and behavior services'
  }
];

export const mockServiceProviders = [
  {
    id: 1,
    name: "Central Veterinary Clinic",
    category: 1,
    city: "amsterdam",
    address: "123 Canal Street, Amsterdam",
    phone: "+31 20 555 0123",
    website: "https://centralvetclinic.nl",
    email: "info@centralvetclinic.nl",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800",
    description: "Full-service veterinary clinic offering preventive care, surgery, and emergency services.",
    tags: ["Emergency Care", "Surgery", "Dental Care"]
  },
  {
    id: 2,
    name: "Pawsome Grooming",
    category: 2,
    city: "dublin",
    address: "45 O'Connell Street, Dublin",
    phone: "+353 1 555 0123",
    website: "https://pawsomegrooming.ie",
    email: "book@pawsomegrooming.ie",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800",
    description: "Professional grooming services for all breeds, including spa treatments and styling.",
    tags: ["Grooming", "Pet Spa", "All Breeds"]
  },
  {
    id: 3,
    name: "Happy Tails Daycare",
    category: 5,
    city: "calgary",
    address: "789 Centre Street, Calgary",
    phone: "+1 403 555 0123",
    website: "https://happytails.ca",
    email: "care@happytails.ca",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800",
    description: "Luxury pet boarding facility with 24/7 care and daily activities.",
    tags: ["Boarding", "Daycare", "Training"]
  },
  {
    id: 4,
    name: "Paws & Whiskers Cafe",
    category: 6,
    city: "amsterdam",
    address: "456 Jordaan Street, Amsterdam",
    phone: "+31 20 555 0456",
    website: "https://pawsandwhiskers.nl",
    email: "hello@pawsandwhiskers.nl",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    description: "Pet-friendly cafe serving great coffee and homemade treats for both humans and pets.",
    tags: ["Pet-Friendly", "Coffee", "Pet Menu"]
  },
  {
    id: 5,
    name: "Elite Pet Training Academy",
    category: 7,
    city: "dublin",
    address: "78 Grafton Street, Dublin",
    phone: "+353 1 555 0456",
    website: "https://elitepettraining.ie",
    email: "train@elitepettraining.ie",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800",
    description: "Professional dog training services offering group classes and private sessions.",
    tags: ["Training", "Behavior", "Puppy Classes"]
  },
  {
    id: 6,
    name: "Pet Supply Plus",
    category: 4,
    city: "calgary",
    address: "321 Bow Street, Calgary",
    phone: "+1 403 555 0456",
    website: "https://petsupplyplus.ca",
    email: "shop@petsupplyplus.ca",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800",
    description: "Complete pet supply store offering food, toys, and accessories for all types of pets.",
    tags: ["Pet Supplies", "Food", "Accessories"]
  },
  {
    id: 7,
    name: "Home Pet Care Services",
    category: 3,
    city: "amsterdam",
    address: "789 Vondelpark Road, Amsterdam",
    phone: "+31 20 555 0789",
    website: "https://homepetcare.nl",
    email: "care@homepetcare.nl",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800",
    description: "Professional pet sitting and dog walking services in the comfort of your home.",
    tags: ["Pet Sitting", "Dog Walking", "Home Visits"]
  }
];

// Mock articles for the info hub
export const mockArticles = [
  {
    id: 1,
    title: "Essential Vaccinations for Your Pet",
    category: "Health",
    city: "amsterdam",
    excerpt: "Learn about the core vaccines your pet needs and when to get them.",
    content: "Vaccinations are crucial for protecting your pet against various diseases...",
    image: "https://images.unsplash.com/photo-1612460036362-f0f1884d7fc4?w=800",
    date: "2024-01-15",
    author: "Dr. Sarah Johnson",
    views: 1250,
    tags: ["Health", "Vaccinations", "Preventive Care"],
    trending: true
  },
  {
    id: 2,
    title: "Choosing the Right Pet Insurance",
    category: "Insurance",
    city: "dublin",
    excerpt: "Compare different pet insurance options to find the best coverage.",
    content: "Pet insurance can help cover unexpected veterinary costs...",
    image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800",
    date: "2024-01-20",
    author: "Mark Thompson",
    views: 980,
    tags: ["Insurance", "Financial Planning", "Healthcare"],
    trending: false
  },
  {
    id: 3,
    title: "Tips for Moving with Pets",
    category: "Lifestyle",
    city: "calgary",
    excerpt: "Make your move stress-free for both you and your pets.",
    content: "Moving to a new home can be stressful for pets...",
    image: "https://images.unsplash.com/photo-1523480717984-24cba35ae1ef?w=800",
    date: "2024-01-25",
    author: "Emily Parker",
    views: 1500,
    tags: ["Moving", "Stress Management", "Pet Care"],
    trending: true
  }
]; 