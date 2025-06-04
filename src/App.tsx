
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import SurveyBuilder from "./pages/SurveyBuilder";
import Surveys from "./pages/Surveys";
import Checklist from "./pages/Checklist";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {user ? (
            <SidebarProvider>
              <div className="min-h-screen flex w-full bg-gray-50">
                <AppSidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header />
                  <main className="flex-1 overflow-auto">
                    <Routes>
                      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                      <Route path="/builder" element={<ProtectedRoute><Builder /></ProtectedRoute>} />
                      <Route path="/builder/:id" element={<ProtectedRoute><Builder /></ProtectedRoute>} />
                      <Route path="/surveys" element={<ProtectedRoute><Surveys /></ProtectedRoute>} />
                      <Route path="/survey-builder" element={<ProtectedRoute><SurveyBuilder /></ProtectedRoute>} />
                      <Route path="/survey-builder/:id" element={<ProtectedRoute><SurveyBuilder /></ProtectedRoute>} />
                      <Route path="/checklist" element={<ProtectedRoute><Checklist /></ProtectedRoute>} />
                      <Route path="/checklist/:id" element={<ProtectedRoute><Checklist /></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </SidebarProvider>
          ) : (
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<Auth />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
