import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export interface InfoCardProps {
  id: string;
  title: string;
  city?: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  icon?: LucideIcon;
  onClick?: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  city,
  category,
  image,
  excerpt,
  date,
  tags,
  icon: Icon,
  onClick,
}) => {
  return (
    <Card 
      className="overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
        />
        {city && (
          <Badge 
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
          >
            {city}
          </Badge>
        )}
      </div>
      
      <CardHeader className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {Icon && <Icon className="w-4 h-4" />}
          <span>{category}</span>
          <span>•</span>
          <time dateTime={date}>
            {format(new Date(date), 'MMM d, yyyy')}
          </time>
        </div>
        <h3 className="font-semibold text-xl leading-tight hover:text-primary transition-colors">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-2">
          {excerpt}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCard; 