import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const InfoCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-video">
        <Skeleton className="w-full h-full" />
      </div>
      
      <CardHeader className="space-y-2">
        {/* Category and date skeleton */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        {/* Title skeleton */}
        <Skeleton className="h-6 w-[80%]" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Excerpt skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
        </div>
        
        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14" />
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCardSkeleton; 