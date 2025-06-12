
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import Banner from "./pages/Banner";
import Checklist from "./pages/Checklist";
import Survey from "./pages/Survey";
import Feedback from "./pages/Feedback";
import FeedbackList from "./pages/FeedbackList";
import FeedbackResponses from "./pages/FeedbackResponses";
import Spotlight from "./pages/Spotlight";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="min-h-screen flex w-full">
                    <AppSidebar />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/builder" element={<Builder />} />
                        <Route path="/builder/:id" element={<Builder />} />
                        <Route path="/banner" element={<Banner />} />
                        <Route path="/banner/:id" element={<Banner />} />
                        <Route path="/checklist" element={<Checklist />} />
                        <Route path="/checklist/:id" element={<Checklist />} />
                        <Route path="/surveys" element={<Survey />} />
                        <Route path="/surveys/:id" element={<Survey />} />
                        <Route path="/feedback" element={<FeedbackList />} />
                        <Route path="/feedback/builder" element={<Feedback />} />
                        <Route path="/feedback/responses" element={<FeedbackResponses />} />
                        <Route path="/feedback/:id" element={<Feedback />} />
                        <Route path="/spotlight" element={<Spotlight />} />
                        <Route path="/spotlight/:id" element={<Spotlight />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
