
import React from 'react';
import { Plus, BarChart3, TrendingUp, Eye, MousePointer, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnnouncements } from '@/hooks/useAnnouncements';

const Dashboard = () => {
  const { announcements, isLoading } = useAnnouncements();

  // Calculate stats from real data
  const totalViews = announcements.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalClicks = announcements.reduce((sum, a) => sum + (a.clicks || 0), 0);
  const activeCampaigns = announcements.filter(a => a.status === 'active').length;
  const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

  const recentActivity = announcements
    .slice(0, 3)
    .map(announcement => ({
      id: announcement.id,
      type: "announcement",
      title: announcement.title,
      action: announcement.status === 'active' ? 'was activated' : `is ${announcement.status}`,
      time: new Date(announcement.created_at).toLocaleDateString()
    }));

  const stats = [
    { title: "Total Views", value: totalViews.toLocaleString(), icon: Eye, change: "+12%", changeType: "positive" },
    { title: "Total Clicks", value: totalClicks.toLocaleString(), icon: MousePointer, change: "+8%", changeType: "positive" },
    { title: "Active Campaigns", value: activeCampaigns.toString(), icon: BarChart3, change: "+1", changeType: "positive" },
    { title: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp, change: "+2.4%", changeType: "positive" }
  ];

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor your engagement performance and activity</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/builder">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </Link>
          <Link to="/checklist">
            <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
              <CheckSquare className="mr-2 h-4 w-4" />
              New Checklist
            </Button>
          </Link>
        </div>
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
                <div className="p-3 bg-gradient-to-r from-green-100 to-teal-100 rounded-full">
                  <stat.icon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/builder" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create New Announcement
              </Button>
            </Link>
            <Link to="/checklist" className="block">
              <Button variant="outline" className="w-full justify-start">
                <CheckSquare className="mr-2 h-4 w-4" />
                Create New Checklist
              </Button>
            </Link>
            <Link to="/analytics" className="block">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.title}</span>
                      <span className="text-muted-foreground"> {activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Announcements Overview</CardTitle>
                <CardDescription>Your announcement campaigns at a glance</CardDescription>
              </div>
              <Link to="/builder">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active</span>
                <span className="font-semibold">{announcements.filter(a => a.status === 'active').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Draft</span>
                <span className="font-semibold">{announcements.filter(a => a.status === 'draft').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="font-semibold">{announcements.filter(a => a.status === 'completed').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Checklists Overview</CardTitle>
                <CardDescription>Track user progress and completion</CardDescription>
              </div>
              <Link to="/checklist">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Published</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Draft</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <span className="font-semibold">0%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
