
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthForm } from '@/components/auth/AuthForm';
import { User, Session } from '@supabase/supabase-js';

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

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branded area */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <span className="text-white font-bold text-2xl">L</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome to Likemetric</h1>
            <p className="text-xl text-green-100 max-w-md text-center leading-relaxed">
              The modern platform for building engaging announcements and measuring user interactions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 max-w-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h3 className="font-semibold mb-2">📊 Analytics Dashboard</h3>
              <p className="text-sm text-green-100">Track engagement and user interactions in real-time</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h3 className="font-semibold mb-2">🎯 Smart Targeting</h3>
              <p className="text-sm text-green-100">Deliver personalized content to the right audience</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h3 className="font-semibold mb-2">🚀 Easy Integration</h3>
              <p className="text-sm text-green-100">Simple setup with powerful customization options</p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
