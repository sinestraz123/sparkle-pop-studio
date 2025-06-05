
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthForm } from '@/components/auth/AuthForm';
import { User, Session } from '@supabase/supabase-js';
import { Heart } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import PopupPreview from '@/components/PopupPreview';

export default function Auth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

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

  // Don't render auth form if user is already authenticated
  if (session?.user) {
    return null;
  }

  // Sample popup configurations for the slideshow
  const samplePopups = [
    {
      title: "New Product Feature!",
      description: "Introducing our revolutionary Dark Mode - experience our platform like never before with a sleek, modern interface.",
      buttonText: "Switch to Dark Mode",
      buttonUrl: "#",
      imageUrl: "",
      videoUrl: "",
      type: "modal",
      position: "center",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      buttonColor: "#1f2937",
      showCloseButton: true,
      autoShow: true,
      delay: 0
    },
    {
      title: "Special Offer",
      description: "Get 50% off your first month! Limited time offer for new users.",
      buttonText: "Claim Offer",
      buttonUrl: "#",
      imageUrl: "",
      videoUrl: "",
      type: "popover",
      position: "corner",
      backgroundColor: "#3b82f6",
      textColor: "#ffffff",
      buttonColor: "#1d4ed8",
      showCloseButton: true,
      autoShow: true,
      delay: 0
    },
    {
      title: "Welcome to Our Platform!",
      description: "Join thousands of users who trust our platform for their engagement needs.",
      buttonText: "Get Started",
      buttonUrl: "#",
      imageUrl: "",
      videoUrl: "",
      type: "banner",
      position: "top",
      backgroundColor: "#10b981",
      textColor: "#ffffff",
      buttonColor: "#059669",
      showCloseButton: true,
      autoShow: true,
      delay: 0
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Light Blue Background with Announcement Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 relative overflow-hidden">
        <div className="flex flex-col justify-center items-center w-full p-12 relative z-10">
          {/* Logo/Icon */}
          <div className="mb-6">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">NEW</span>
            </div>
          </div>
          
          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Introducing
          </h1>
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-8">
            Announcements
          </h2>
          
          {/* Carousel with Popup Examples */}
          <div className="w-full max-w-md">
            <Carousel className="w-full" opts={{ align: "start", loop: true }}>
              <CarouselContent>
                {samplePopups.map((popup, index) => (
                  <CarouselItem key={index}>
                    <div className="p-2">
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <PopupPreview config={popup} />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>

          <p className="text-sm text-gray-700 text-center max-w-md mt-6">
            Create beautiful popups and announcements to engage your users and boost conversions.
          </p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <AuthForm defaultIsLogin={true} />
        </div>
      </div>
    </div>
  );
}
