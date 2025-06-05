
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BuilderHeaderProps {
  onCreateAnnouncement: () => void;
}

export const BuilderHeader: React.FC<BuilderHeaderProps> = ({ onCreateAnnouncement }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
        <p className="text-muted-foreground mt-1">Create and manage your announcement campaigns</p>
      </div>
      <Button 
        onClick={onCreateAnnouncement}
        className="bg-black hover:bg-gray-800 text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Announcement
      </Button>
    </div>
  );
};
