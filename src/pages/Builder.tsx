
import React from 'react';
import { Plus, Eye, MousePointer, Calendar, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Builder = () => {
  const announcements = [
    {
      id: 1,
      title: "New Chrome Extension Launch",
      description: "Now you can create leads directly from LinkedIn – or anywhere you find your next prospect.",
      status: "Active",
      type: "Modal",
      views: 1248,
      clicks: 89,
      createdAt: "2 days ago",
      position: "Center"
    },
    {
      id: 2,
      title: "Webinar: Advanced Features",
      description: "Join us for an exclusive webinar showcasing our latest advanced features and capabilities.",
      status: "Draft",
      type: "Banner",
      views: 0,
      clicks: 0,
      createdAt: "5 days ago",
      position: "Top"
    },
    {
      id: 3,
      title: "Product Update v2.1",
      description: "Exciting new updates and improvements to enhance your user experience.",
      status: "Completed",
      type: "Popover",
      views: 2156,
      clicks: 324,
      createdAt: "1 week ago",
      position: "Bottom Right"
    },
    {
      id: 4,
      title: "Holiday Sale Announcement",
      description: "Don't miss our biggest sale of the year with up to 50% off all premium features.",
      status: "Scheduled",
      type: "Modal",
      views: 0,
      clicks: 0,
      createdAt: "3 days ago",
      position: "Center"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Modal':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Banner':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Popover':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground mt-1">Create and manage your announcement campaigns</p>
        </div>
        <Link to="/builder/new">
          <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Announcement
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
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
                <p className="text-2xl font-bold">{announcements.filter(a => a.status === 'Active').length}</p>
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
                <p className="text-2xl font-bold">{announcements.reduce((sum, a) => sum + a.views, 0).toLocaleString()}</p>
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
                <p className="text-2xl font-bold">{announcements.reduce((sum, a) => sum + a.clicks, 0).toLocaleString()}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <MousePointer className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
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
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/builder/${announcement.id}`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Preview</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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
                  <p className="font-semibold">{announcement.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Clicks</p>
                  <p className="font-semibold">{announcement.clicks}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="text-sm text-muted-foreground border-t pt-3">
                <div className="flex justify-between items-center">
                  <span>Position: {announcement.position}</span>
                  <span>{announcement.createdAt}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Link to={`/builder/${announcement.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Edit
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {announcements.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No announcements yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first announcement to engage with your users
            </p>
            <Link to="/builder/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Announcement
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Builder;
