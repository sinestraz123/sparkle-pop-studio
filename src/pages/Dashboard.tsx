
import React from 'react';
import { Plus, BarChart3, TrendingUp, Eye, MousePointer, CheckSquare, Users, Target, RectangleHorizontal, FileQuestion, MessageSquare, Video, Settings, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useAnnouncements } from '@/hooks/useAnnouncements';

const Dashboard = () => {
  const { announcements, isLoading } = useAnnouncements();

  // Calculate stats from real data
  const totalViews = announcements.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalClicks = announcements.reduce((sum, a) => sum + (a.clicks || 0), 0);
  const activeCampaigns = announcements.filter(a => a.status === 'active').length;
  const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

  const features = [
    {
      title: "Announcements",
      description: "Create engaging pop-up announcements to capture user attention",
      icon: Plus,
      href: "/builder",
      gradient: "from-blue-600 to-blue-800",
      image: "📢",
      category: "Engagement"
    },
    {
      title: "Banner",
      description: "Display important messages with customizable banner notifications",
      icon: RectangleHorizontal,
      href: "/banner",
      gradient: "from-green-600 to-green-800",
      image: "🎯",
      category: "Engagement"
    },
    {
      title: "Spotlight",
      description: "Highlight specific features or content on your website",
      icon: Target,
      href: "/spotlight",
      gradient: "from-yellow-600 to-orange-600",
      image: "💡",
      category: "Engagement"
    },
    {
      title: "Checklist",
      description: "Guide users through onboarding with interactive checklists",
      icon: CheckSquare,
      href: "/checklist",
      gradient: "from-purple-600 to-purple-800",
      image: "✅",
      category: "User Interaction"
    },
    {
      title: "Surveys",
      description: "Collect valuable user feedback with customizable surveys",
      icon: FileQuestion,
      href: "/surveys",
      gradient: "from-pink-600 to-rose-700",
      image: "📊",
      category: "User Interaction"
    },
    {
      title: "Feedback",
      description: "Gather user insights with rating and feedback widgets",
      icon: MessageSquare,
      href: "/feedback",
      gradient: "from-indigo-600 to-indigo-800",
      image: "💬",
      category: "User Interaction"
    },
    {
      title: "Video Tutorials",
      description: "Create engaging video tutorials and guides for users",
      icon: Video,
      href: "/video-tutorials",
      gradient: "from-red-600 to-red-800",
      image: "🎥",
      category: "Support"
    },
    {
      title: "Analytics",
      description: "Monitor performance and gain insights from your campaigns",
      icon: BarChart3,
      href: "/analytics",
      gradient: "from-teal-600 to-teal-800",
      image: "📈",
      category: "Insights"
    }
  ];

  const stats = [
    { 
      title: "Total Views", 
      value: totalViews.toLocaleString(), 
      icon: Eye, 
      change: "+12%",
      color: "text-blue-600"
    },
    { 
      title: "Total Clicks", 
      value: totalClicks.toLocaleString(), 
      icon: MousePointer, 
      change: "+8%",
      color: "text-green-600"
    },
    { 
      title: "Active Campaigns", 
      value: activeCampaigns.toString(), 
      icon: Target, 
      change: `${announcements.length} total`,
      color: "text-purple-600"
    },
    { 
      title: "Conversion Rate", 
      value: `${conversionRate}%`, 
      icon: TrendingUp, 
      change: "+2.4%",
      color: "text-orange-600"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Choose a Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select from our powerful suite of engagement tools to create amazing user experiences
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {features.map((feature, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Link to={feature.href} className="group block h-full">
                    <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105 overflow-hidden">
                      <div className={`h-2 bg-gradient-to-r ${feature.gradient}`}></div>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {feature.category}
                          </Badge>
                          <div className="text-3xl">{feature.image}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                            New {feature.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>

                        <div className="pt-4">
                          <Button className={`w-full bg-gradient-to-r ${feature.gradient} hover:opacity-90 transition-opacity`}>
                            <feature.icon className="mr-2 h-4 w-4" />
                            Create Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/builder" className="group">
              <div className="text-center p-4 rounded-xl hover:bg-white/80 transition-all duration-300 group-hover:scale-105">
                <Plus className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">New Campaign</p>
              </div>
            </Link>
            <Link to="/analytics" className="group">
              <div className="text-center p-4 rounded-xl hover:bg-white/80 transition-all duration-300 group-hover:scale-105">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium">View Analytics</p>
              </div>
            </Link>
            <Link to="/settings" className="group">
              <div className="text-center p-4 rounded-xl hover:bg-white/80 transition-all duration-300 group-hover:scale-105">
                <Settings className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium">Settings</p>
              </div>
            </Link>
            <Link to="/help" className="group">
              <div className="text-center p-4 rounded-xl hover:bg-white/80 transition-all duration-300 group-hover:scale-105">
                <HelpCircle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <p className="text-sm font-medium">Help Center</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
