import React from 'react';
import { X, MapPin, Phone, Globe, Mail, Star, Clock, Tag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
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
    hours?: {
      [key: string]: {
        open: string;
        close: string;
      };
    };
  };
}

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  isOpen,
  onClose,
  service
}) => {
  const renderRatingStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={cn(
            "w-4 h-4",
            index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          )}
        />
      ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl font-semibold">
              {service.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Service Image */}
        <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
          <img
            src={service.image}
            alt={service.name}
            className="object-cover w-full h-full"
          />
        </AspectRatio>

        {/* Rating and Category */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {renderRatingStars(service.rating)}
            <span className="ml-2 text-sm text-muted-foreground">
              {service.rating.toFixed(1)}
            </span>
          </div>
          <Badge variant="secondary">{service.categoryName}</Badge>
        </div>

        {/* Description */}
        <p className="text-muted-foreground">{service.description}</p>

        {/* Contact Information */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{service.address}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a
              href={`tel:${service.phone}`}
              className="hover:text-primary"
            >
              {service.phone}
            </a>
          </div>
          {service.website && (
            <div className="flex items-center space-x-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a
                href={service.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                {service.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a
              href={`mailto:${service.email}`}
              className="hover:text-primary"
            >
              {service.email}
            </a>
          </div>
        </div>

        {/* Business Hours */}
        {service.hours && (
          <div className="space-y-2">
            <h3 className="font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Business Hours
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(service.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between">
                  <span className="font-medium">{day}</span>
                  <span className="text-muted-foreground">
                    {hours.open} - {hours.close}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {service.tags.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              Services
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          <Button className="flex-1">
            Book Appointment
          </Button>
          <Button variant="outline" className="flex-1">
            Contact
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailModal; 