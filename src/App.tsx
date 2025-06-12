import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Auth } from '@/pages/Auth';
import { Index } from '@/pages/Index';
import { Builder } from '@/pages/Builder';
import { Banner } from '@/pages/Banner';
import { Checklist } from '@/pages/Checklist';
import { Survey } from '@/pages/Survey';
import { Feedback } from '@/pages/Feedback';
import { FeedbackResponses } from '@/pages/FeedbackResponses';
import { Spotlight } from '@/pages/Spotlight';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';
import { NotFound } from '@/pages/NotFound';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';

import VideoTutorials from '@/pages/VideoTutorials';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={
            <ProtectedRoute>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1">
                    <div className="container mx-auto">
                      <Routes>
                        <Route index element={<Index />} />
                        <Route path="builder/:id?" element={<Builder />} />
                        <Route path="banner/:id?" element={<Banner />} />
                        <Route path="checklist/:id?" element={<Checklist />} />
                        <Route path="surveys/:id?" element={<Survey />} />
                        <Route path="feedback/:id?" element={<Feedback />} />
                        <Route path="feedback/responses" element={<FeedbackResponses />} />
                        <Route path="spotlight/:id?" element={<Spotlight />} />
                        <Route path="video-tutorials/:id?" element={<VideoTutorials />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="settings" element={<Settings />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
