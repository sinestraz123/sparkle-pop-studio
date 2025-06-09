
import { useState } from 'react';
import { BannerBuilder } from '@/components/BannerBuilder';
import { BannersList } from '@/components/BannersList';
import { Banner } from '@/types/banner';
import { useAuth } from '@/hooks/useAuth';

const BannerPage = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'list' | 'builder'>('list');
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to create and manage your banners.</p>
        </div>
      </div>
    );
  }

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setCurrentView('builder');
  };

  const handleCreateNew = () => {
    setEditingBanner(null);
    setCurrentView('builder');
  };

  const handleBackToList = () => {
    setEditingBanner(null);
    setCurrentView('list');
  };

  if (currentView === 'builder') {
    return (
      <BannerBuilder
        initialBanner={editingBanner}
        onSave={handleBackToList}
        onCancel={handleBackToList}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BannersList
        onEditBanner={handleEditBanner}
        onCreateNew={handleCreateNew}
      />
    </div>
  );
};

export default BannerPage;
