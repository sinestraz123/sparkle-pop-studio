
import React from 'react';
import { Plus, BarChart3, TrendingUp, Eye, MousePointer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const announcements = [
    {
      id: 1,
      title: "New Chrome Extension Launch",
      status: "Active",
      views: 1248,
      clicks: 89,
      type: "Modal",
      createdAt: "2 days ago"
    },
    {
      id: 2,
      title: "Webinar: Advanced Features",
      status: "Draft",
      views: 0,
      clicks: 0,
      type: "Banner",
      createdAt: "5 days ago"
    },
    {
      id: 3,
      title: "Product Update v2.1",
      status: "Completed",
      views: 2156,
      clicks: 324,
      type: "Popover",
      createdAt: "1 week ago"
    }
  ];

  const stats = [
    { title: "Total Views", value: "3,404", icon: Eye, change: "+12%", changeType: "positive" },
    { title: "Total Clicks", value: "413", icon: MousePointer, change: "+8%", changeType: "positive" },
    { title: "Active Announcements", value: "1", icon: BarChart3, change: "0%", changeType: "neutral" },
    { title: "Conversion Rate", value: "12.1%", icon: TrendingUp, change: "+2.4%", changeType: "positive" }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor your announcement performance and engagement</p>
        </div>
        <Link to="/builder">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Announcement
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Announcements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Announcements</CardTitle>
              <CardDescription>Track and manage your announcement campaigns</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Views</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Clicks</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((announcement) => (
                  <tr key={announcement.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium">{announcement.title}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {announcement.type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        announcement.status === 'Active' 
                          ? 'bg-green-100 text-green-800'
                          : announcement.status === 'Draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {announcement.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{announcement.views.toLocaleString()}</td>
                    <td className="py-4 px-4 text-muted-foreground">{announcement.clicks}</td>
                    <td className="py-4 px-4 text-muted-foreground">{announcement.createdAt}</td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Link to={`/builder/${announcement.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
