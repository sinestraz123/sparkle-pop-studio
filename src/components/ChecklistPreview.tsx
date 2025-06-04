
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X, ExternalLink } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  media_type: 'none' | 'image' | 'gif' | 'url';
  media_url?: string;
}

interface ChecklistConfig {
  title: string;
  description: string;
  items: ChecklistItem[];
  progress_bar_color: string;
  button_text: string;
  button_url: string;
  show_progress: boolean;
  auto_hide: boolean;
}

interface ChecklistPreviewProps {
  config: ChecklistConfig;
}

export const ChecklistPreview: React.FC<ChecklistPreviewProps> = ({ config }) => {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(true);

  const toggleItem = (itemId: string) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const completedCount = completedItems.size;
  const totalCount = config.items.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Auto hide when completed
  const allCompleted = completedCount === totalCount && totalCount > 0;
  if (config.auto_hide && allCompleted && isVisible) {
    setTimeout(() => setIsVisible(false), 1000);
  }

  if (!isVisible) return null;

  const renderMedia = (item: ChecklistItem) => {
    if (item.media_type === 'none' || !item.media_url) return null;

    switch (item.media_type) {
      case 'image':
      case 'gif':
        return (
          <img 
            src={item.media_url} 
            alt={item.title}
            className="w-full h-32 object-cover rounded-md mt-2"
          />
        );
      case 'url':
        return (
          <Button
            variant="outline"
            size="sm"
            className="mt-2 text-xs h-8"
            onClick={() => window.open(item.media_url, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Open Link
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md mx-auto p-6 border border-gray-100">
        {/* Close button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{config.title}</h2>
          <p className="text-sm text-gray-600 mb-4">{config.description}</p>
          
          {/* Progress Bar */}
          {config.show_progress && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span className="font-medium">{completedCount}/{totalCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${progressPercentage}%`,
                    backgroundColor: config.progress_bar_color 
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Checklist Items */}
        <div className="space-y-3 mb-6">
          {config.items.map((item) => (
            <div key={item.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Checkbox 
                checked={completedItems.has(item.id)}
                onCheckedChange={() => toggleItem(item.id)}
                className="mt-0.5 data-[state=checked]:bg-black data-[state=checked]:border-black"
              />
              <div className="flex-1 min-w-0">
                <div className={`font-medium text-sm transition-all duration-200 ${
                  completedItems.has(item.id) 
                    ? 'line-through text-gray-500' 
                    : 'text-gray-900'
                }`}>
                  {item.title}
                </div>
                {item.description && (
                  <div className="text-xs text-gray-600 mt-1">
                    {item.description}
                  </div>
                )}
                {renderMedia(item)}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <span className="mr-1">⚡</span>
            <span>Powered by Likemetric</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-gray-500 hover:text-gray-700"
            onClick={() => setIsVisible(false)}
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
};
