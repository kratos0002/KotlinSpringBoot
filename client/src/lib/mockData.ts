import { 
  Stethoscope, 
  Scissors, 
  Home, 
  ShoppingBag, 
  Hotel, 
  Coffee, 
  GraduationCap,
  Store,
  Bone,
  BookOpen,
  PawPrint,
  Heart,
  Award,
  Sparkles
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
    id: '1',
    title: 'Essential Pet Care Tips for New Pet Parents',
    city: 'amsterdam',
    category: 'Care Guide',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&auto=format&fit=crop',
    excerpt: 'A comprehensive guide for new pet parents covering basic care, nutrition, and health maintenance.',
    content: 'Being a new pet parent can be both exciting and overwhelming...',
    date: '2024-03-15',
    tags: ['New Pet', 'Care Guide', 'Tips'],
    icon: BookOpen,
    views: 1200
  },
  {
    id: '2',
    title: 'Understanding Your Pet\'s Body Language',
    city: 'dublin',
    category: 'Behavior',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop',
    excerpt: 'Learn to interpret your pet\'s body language and understand their needs better.',
    content: 'Animals communicate primarily through body language...',
    date: '2024-03-14',
    tags: ['Behavior', 'Communication', 'Training'],
    icon: PawPrint,
    views: 980
  },
  {
    id: '3',
    title: 'Preventive Healthcare for Pets',
    city: 'calgary',
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&auto=format&fit=crop',
    excerpt: 'A guide to preventive healthcare measures to keep your pet healthy and happy.',
    content: 'Regular preventive care is essential for your pet\'s health...',
    date: '2024-03-13',
    tags: ['Health', 'Veterinary', 'Prevention'],
    icon: Stethoscope,
    views: 850
  },
  {
    id: '4',
    title: 'Pet-Friendly Home Modifications',
    city: 'amsterdam',
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop',
    excerpt: 'Make your home safe and comfortable for your pets with these modifications.',
    content: 'Creating a pet-friendly home environment is crucial...',
    date: '2024-03-12',
    tags: ['Home', 'Safety', 'DIY'],
    icon: Heart,
    views: 720
  },
  {
    id: '5',
    title: 'Grooming Tips for Different Pet Types',
    city: 'dublin',
    category: 'Grooming',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&auto=format&fit=crop',
    excerpt: 'Professional grooming tips for different types of pets and coat care.',
    content: 'Regular grooming is essential for your pet\'s health and appearance...',
    date: '2024-03-11',
    tags: ['Grooming', 'Care', 'Tips'],
    icon: Scissors,
    views: 650
  },
  {
    id: '6',
    title: 'Pet-Friendly Cafes and Restaurants Guide',
    city: 'calgary',
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=800&auto=format&fit=crop',
    excerpt: 'Discover the best pet-friendly dining spots in your city.',
    content: 'More establishments are becoming pet-friendly...',
    date: '2024-03-10',
    tags: ['Dining', 'Social', 'City Guide'],
    icon: Coffee,
    views: 890
  }
];

export const faqs = [
  {
    question: "How often should I take my pet to the vet?",
    answer: "Adult dogs and cats should visit the vet at least once a year for a check-up. Puppies and kittens need more frequent visits, typically every 3-4 weeks until they're about 4 months old. Senior pets may need bi-annual check-ups."
  },
  {
    question: "What vaccinations does my pet need?",
    answer: "Core vaccinations for dogs include distemper, parvovirus, and rabies. For cats, core vaccines include panleukopenia, calicivirus, herpesvirus, and rabies. Your vet can provide a personalized vaccination schedule based on your pet's age, lifestyle, and risk factors."
  },
  {
    question: "How can I tell if my pet is at a healthy weight?",
    answer: "You should be able to feel your pet's ribs without pressing too hard, and see a visible waist when viewed from above. If you're unsure, consult your veterinarian for a proper assessment and dietary recommendations."
  },
  {
    question: "What should I do if my pet has an emergency after hours?",
    answer: "Keep the contact information for your nearest 24-hour emergency veterinary clinic readily available. Know the signs of common pet emergencies and don't hesitate to seek immediate care if your pet shows concerning symptoms."
  },
  {
    question: "How can I socialize my pet properly?",
    answer: "Start socializing your pet early, exposing them to different people, animals, and environments in a positive way. Use treats and praise to create positive associations. For puppies, consider puppy classes once they've received their core vaccinations."
  }
]; 