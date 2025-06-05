
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  onCreateAnnouncement: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateAnnouncement }) => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Plus className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No announcements yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first announcement to engage with your users
        </p>
        <Button 
          onClick={onCreateAnnouncement}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Announcement
        </Button>
      </CardContent>
    </Card>
  );
};
