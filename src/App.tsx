import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"
import Index from './pages/Index';
import Auth from './pages/Auth';
import SubmitPost from './pages/SubmitPost';
import BrowsePosts from './pages/BrowsePosts';
import Dashboard from './pages/Dashboard';
import AdminSettings from './pages/AdminSettings';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import HelpfulLinks from './pages/HelpfulLinks';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/submit-post" element={<SubmitPost />} />
            <Route path="/posts" element={<BrowsePosts />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/helpful-links" element={<HelpfulLinks />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
