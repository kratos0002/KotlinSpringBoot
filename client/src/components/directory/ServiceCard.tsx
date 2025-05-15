import React from 'react';
import { cn } from '@/lib/utils';
import { MapPin, Globe, Phone, Mail, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AnimatedButton from '@/components/ui/AnimatedButton';

interface ServiceCardProps {
  id: number;
  name: string;
  category: number;
  categoryName: string;
  city: string;
  address: string;
  phone: string;
  website: string;
  email: string;
  rating: number;
  image: string;
  description: string;
  tags: string[];
  icon: React.ElementType;
}

const ServiceCard = ({
  id,
  name,
  category,
  categoryName,
  city,
  address,
  phone,
  website,
  email,
  rating,
  image,
  description,
  tags,
  icon: Icon
}: ServiceCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[16/9] relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">{name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Icon className="w-4 h-4 mr-1" />
              {categoryName}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{address}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
              <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
            </div>
            
            {website && (
              <div className="flex items-center text-sm">
                <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                <a 
                  href={website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline truncate"
                >
                  {website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            
            {email && (
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                <a href={`mailto:${email}`} className="hover:underline">{email}</a>
              </div>
            )}
          </div>
          
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, index) => (
                <span 
                  key={index}
                  className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    city === 'amsterdam' && 'bg-amsterdam/10',
                    city === 'dublin' && 'bg-dublin/10',
                    city === 'calgary' && 'bg-calgary/10',
                    !city && 'bg-primary/10'
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="pt-3">
            <AnimatedButton 
              className={cn(
                "w-full",
                city === 'amsterdam' && 'bg-amsterdam hover:bg-amsterdam/90',
                city === 'dublin' && 'bg-dublin hover:bg-dublin/90',
                city === 'calgary' && 'bg-calgary hover:bg-calgary/90',
                !city && 'bg-primary hover:bg-primary/90'
              )}
              hoverEffect="scale"
            >
              View Details
            </AnimatedButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard; 