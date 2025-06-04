
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Chrome } from 'lucide-react';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">Likemetric</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {isLogin ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="text-gray-600 text-sm">
          {isLogin ? 'Sign in to your account to continue' : 'Sign up to get started with Likemetric'}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <Button
          onClick={handleGoogleAuth}
          variant="outline"
          className="w-full h-11 border-gray-300 hover:border-gray-400 bg-white text-gray-700 font-medium"
          type="button"
        >
          <Chrome className="w-4 h-4 mr-3" />
          Continue with Google
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-50 px-2 text-gray-500">or</span>
        </div>
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Full name
            </Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required={!isLogin}
              className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
              placeholder="Enter your full name"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
            placeholder="you@example.com"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            {isLogin && (
              <button
                type="button"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Forgot Password?
              </button>
            )}
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
            placeholder="Enter your password"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
          disabled={loading}
        >
          {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span className="text-green-600 hover:text-green-700 font-medium">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </button>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        By continuing, you agree to Likemetric's{' '}
        <button className="text-green-600 hover:text-green-700 underline">
          Terms of Service
        </button>{' '}
        and{' '}
        <button className="text-green-600 hover:text-green-700 underline">
          Privacy Policy
        </button>
      </div>
    </div>
  );
}
