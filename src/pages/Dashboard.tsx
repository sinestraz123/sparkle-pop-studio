
import React from 'react';
import { Plus, BarChart3, Settings, Bell } from 'lucide-react';
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
    { title: "Total Views", value: "3,404", icon: BarChart3, change: "+12%" },
    { title: "Total Clicks", value: "413", icon: Bell, change: "+8%" },
    { title: "Active Announcements", value: "1", icon: Settings, change: "0%" },
    { title: "Conversion Rate", value: "12.1%", icon: BarChart3, change: "+2.4%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
            <p className="text-gray-600">Manage your SaaS announcements and track engagement</p>
          </div>
          <Link to="/builder">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
              <Plus className="mr-2 h-5 w-5" />
              Create Announcement
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Announcements Table */}
        <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Recent Announcements</CardTitle>
            <CardDescription>Track and manage your announcement campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Views</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Clicks</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.map((announcement) => (
                    <tr key={announcement.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{announcement.title}</div>
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
                      <td className="py-4 px-4 text-gray-600">{announcement.views.toLocaleString()}</td>
                      <td className="py-4 px-4 text-gray-600">{announcement.clicks}</td>
                      <td className="py-4 px-4 text-gray-600">{announcement.createdAt}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Link to={`/builder/${announcement.id}`}>
                            <Button variant="outline" size="sm" className="text-xs">
                              Edit
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" className="text-xs text-red-600 hover:text-red-700">
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
    </div>
  );
};

export default Dashboard;
