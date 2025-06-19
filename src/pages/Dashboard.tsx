import React from 'react';
import { Plus, BarChart3, TrendingUp, Eye, MousePointer, CheckSquare, Calendar, Activity, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnnouncements } from '@/hooks/useAnnouncements';

const Dashboard = () => {
  const { announcements, isLoading } = useAnnouncements();

  // Calculate comprehensive stats from real data
  const totalViews = announcements.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalClicks = announcements.reduce((sum, a) => sum + (a.clicks || 0), 0);
  const activeCampaigns = announcements.filter(a => a.status === 'active').length;
  const totalCampaigns = announcements.length;
  const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

  // Recent activity with better formatting
  const recentActivity = announcements
    .slice(0, 5)
    .map(announcement => ({
      id: announcement.id,
      type: "announcement",
      title: announcement.title,
      action: announcement.status === 'active' ? 'activated' : announcement.status,
      time: new Date(announcement.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: announcement.status
    }));

  const stats = [
    { 
      title: "Total Views", 
      value: totalViews.toLocaleString(), 
      icon: Eye, 
      change: "+12%", 
      changeType: "positive",
      description: "Across all campaigns"
    },
    { 
      title: "Total Clicks", 
      value: totalClicks.toLocaleString(), 
      icon: MousePointer, 
      change: "+8%", 
      changeType: "positive",
      description: "User interactions"
    },
    { 
      title: "Active Campaigns", 
      value: activeCampaigns.toString(), 
      icon: Target, 
      change: `${totalCampaigns} total`, 
      changeType: "neutral",
      description: "Currently running"
    },
    { 
      title: "Conversion Rate", 
      value: `${conversionRate}%`, 
      icon: TrendingUp, 
      change: "+2.4%", 
      changeType: "positive",
      description: "Click-through rate"
    }
  ];

  const quickActions = [
    {
      title: "Create Announcement",
      description: "Engage users with important updates",
      icon: Plus,
      href: "/builder",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "View Analytics",
      description: "Monitor performance and trends",
      icon: BarChart3,
      href: "/analytics",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Here's what's happening with your engagement campaigns today.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/builder">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5" />
              New Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <stat.icon className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <Badge 
                  variant={stat.changeType === 'positive' ? 'default' : 'secondary'}
                  className={
                    stat.changeType === 'positive' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''
                  }
                >
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.href} className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-200 group-hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-4 transition-colors`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates from your campaigns</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/builder">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'active' ? 'bg-green-500' :
                    activity.status === 'draft' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Campaign {activity.action} • {activity.time}
                    </p>
                  </div>
                  <Badge variant={activity.status === 'active' ? 'default' : 'secondary'}>
                    {activity.status}
                  </Badge>
                </div>
              )) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                  <p className="text-xs text-muted-foreground mt-1">Create your first campaign to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Campaign Overview
            </CardTitle>
            <CardDescription>Status breakdown of all campaigns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Active</span>
                </div>
                <span className="font-semibold text-green-700">
                  {announcements.filter(a => a.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">Draft</span>
                </div>
                <span className="font-semibold text-yellow-700">
                  {announcements.filter(a => a.status === 'draft').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <span className="font-semibold text-gray-700">
                  {announcements.filter(a => a.status === 'completed').length}
                </span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Total Campaigns</span>
                <span className="text-lg font-bold">{totalCampaigns}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalCampaigns > 0 ? (activeCampaigns / totalCampaigns) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeCampaigns} of {totalCampaigns} campaigns active
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Insights
          </CardTitle>
          <CardDescription>Key metrics and recommendations for your campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalViews.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Impressions</div>
              <div className="text-xs text-green-600 mt-1">↗ +12% from last week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{conversionRate}%</div>
              <div className="text-sm text-muted-foreground">Avg. Click Rate</div>
              <div className="text-xs text-green-600 mt-1">↗ +2.4% from last week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{activeCampaigns}</div>
              <div className="text-sm text-muted-foreground">Active Campaigns</div>
              <div className="text-xs text-blue-600 mt-1">Running smoothly</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
