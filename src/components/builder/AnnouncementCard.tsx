
import React from 'react';
import { Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tables } from '@/integrations/supabase/types';

type Announcement = Tables<'announcements'>;

interface AnnouncementCardProps {
  announcement: Announcement;
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'modal':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'banner':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'popover':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg leading-tight">{announcement.title}</CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {announcement.description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={() => onEdit(announcement)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(announcement.id)}
                className="text-red-600"
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status and Type Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={getStatusColor(announcement.status)}>
            {announcement.status}
          </Badge>
          <Badge variant="outline" className={getTypeColor(announcement.type)}>
            {announcement.type}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Views</p>
            <p className="font-semibold">{(announcement.views || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Clicks</p>
            <p className="font-semibold">{announcement.clicks || 0}</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-sm text-muted-foreground border-t pt-3">
          <div className="flex justify-between items-center">
            <span>Position: {announcement.position}</span>
            <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit(announcement)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
