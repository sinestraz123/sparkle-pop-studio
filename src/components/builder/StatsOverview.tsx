
import React from 'react';
import { Calendar, Eye, MousePointer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tables } from '@/integrations/supabase/types';

type Announcement = Tables<'announcements'>;

interface StatsOverviewProps {
  announcements: Announcement[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ announcements }) => {
  const totalViews = announcements.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalClicks = announcements.reduce((sum, a) => sum + (a.clicks || 0), 0);
  const activeCount = announcements.filter(a => a.status === 'active').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Announcements</p>
              <p className="text-2xl font-bold">{announcements.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <Eye className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <Eye className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
              <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-full">
              <MousePointer className="h-4 w-4 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
