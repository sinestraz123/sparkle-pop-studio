
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  mediaType: 'none' | 'image' | 'gif' | 'url';
  mediaUrl?: string;
  completed: boolean;
}

interface ChecklistConfig {
  title: string;
  description: string;
  items: ChecklistItem[];
  progressBarColor: string;
  buttonText: string;
  buttonUrl: string;
  showProgress: boolean;
  autoHide: boolean;
}

interface ChecklistPreviewProps {
  config: ChecklistConfig;
}

const ChecklistPreview: React.FC<ChecklistPreviewProps> = ({ config }) => {
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

  if (!isVisible) return null;

  const renderMedia = (item: ChecklistItem) => {
    if (item.mediaType === 'none' || !item.mediaUrl) return null;

    switch (item.mediaType) {
      case 'image':
      case 'gif':
        return (
          <img 
            src={item.mediaUrl} 
            alt={item.title}
            className="w-full h-32 object-cover rounded-md mt-2"
          />
        );
      case 'url':
        return (
          <a 
            href={item.mediaUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm mt-1 block"
          >
            {item.mediaUrl}
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg max-w-md mx-auto mt-8 p-6">
      {/* Close button */}
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{config.title}</h2>
        <p className="text-sm text-gray-600 mb-4">{config.description}</p>
        
        {/* Progress Bar */}
        {config.showProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>{completedCount} / {totalCount}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: config.progressBarColor 
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Checklist Items */}
      <div className="space-y-4 mb-6">
        {config.items.map((item) => (
          <div key={item.id} className="flex items-start space-x-3">
            <Checkbox 
              checked={completedItems.has(item.id)}
              onCheckedChange={() => toggleItem(item.id)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className={`font-medium text-sm ${completedItems.has(item.id) ? 'line-through text-gray-500' : 'text-gray-900'}`}>
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

      {/* Action Button */}
      {config.buttonText && (
        <Button 
          className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          onClick={() => window.open(config.buttonUrl, '_blank')}
        >
          {config.buttonText}
        </Button>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500">
          <span className="mr-1">⚡</span>
          <span>Powered by CommandBar</span>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-gray-500">
          Skip
        </Button>
      </div>
    </div>
  );
};

export default ChecklistPreview;
