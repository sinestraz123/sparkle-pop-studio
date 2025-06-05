
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthForm } from '@/components/auth/AuthForm';
import { User, Session } from '@supabase/supabase-js';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, X, Bell, Gift, Zap } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [currentPreview, setCurrentPreview] = useState(0);

  const popupPreviews = [
    {
      title: "Welcome Announcement",
      message: "Welcome to EngageHub! Get started with creating your first announcement.",
      type: "welcome",
      icon: <Gift className="w-5 h-5" />
    },
    {
      title: "Feature Update",
      message: "New analytics dashboard is now available. Check out the improved insights!",
      type: "update", 
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: "Important Notice",
      message: "Scheduled maintenance will occur tonight from 2-4 AM EST.",
      type: "notice",
      icon: <Bell className="w-5 h-5" />
    }
  ];

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Redirect to home if user is authenticated
        if (session?.user) {
          navigate('/');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Redirect to home if user is already authenticated
      if (session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPreview((prev) => (prev + 1) % popupPreviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Don't render auth form if user is already authenticated
  if (session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex">
      {/* Left Side - Introduction */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-100/40 to-blue-100/40 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-lg">
          <Badge className="mb-6 bg-gray-900 text-white hover:bg-gray-800">
            NEW
          </Badge>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Introducing
            <br />
            <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Announcements
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Create beautiful, engaging announcements that capture your users' attention. 
            Build interactive popups, notifications, and onboarding flows with ease.
          </p>

          {/* Popup Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-w-sm animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center text-white">
                    {popupPreviews[currentPreview].icon}
                  </div>
                  <span className="font-semibold text-gray-900">EngageHub</span>
                </div>
                <X className="w-4 h-4 text-gray-400" />
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">
                {popupPreviews[currentPreview].title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                {popupPreviews[currentPreview].message}
              </p>
              
              <div className="flex gap-2">
                <Button size="sm" className="bg-gray-900 hover:bg-gray-800">
                  Get Started
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
                <Button size="sm" variant="outline">
                  Later
                </Button>
              </div>
            </div>

            {/* Preview indicators */}
            <div className="flex gap-2 mt-6 justify-center">
              {popupPreviews.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentPreview ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 relative">
        {/* Background decorative elements for mobile */}
        <div className="absolute inset-0 overflow-hidden lg:hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-100/40 to-blue-100/40 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-100/20 to-pink-100/20 rounded-full blur-3xl"></div>
        </div>

        {/* Floating dots pattern for mobile */}
        <div className="absolute inset-0 opacity-30 lg:hidden">
          <div className="absolute top-20 left-20 w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
        </div>

        {/* Main auth card */}
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
}
