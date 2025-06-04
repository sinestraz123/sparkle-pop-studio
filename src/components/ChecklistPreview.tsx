
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X, ExternalLink, Check } from 'lucide-react';

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

  const handleLetsDoIt = (item: ChecklistItem) => {
    if (item.media_type === 'url' && item.media_url) {
      window.open(item.media_url, '_blank');
    }
    // Mark item as completed when action is taken
    toggleItem(item.id);
  };

  const handleSkip = (itemId: string) => {
    // Mark item as completed when skipped
    toggleItem(itemId);
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
        <div className="space-y-4 mb-6">
          {config.items.map((item) => {
            const isCompleted = completedItems.has(item.id);
            
            return (
              <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start space-x-3">
                  {/* Custom Checkbox */}
                  <div 
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                      isCompleted 
                        ? 'bg-black border-black' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    {isCompleted && <Check className="h-3 w-3 text-white" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm transition-all duration-200 ${
                      isCompleted 
                        ? 'line-through text-gray-500' 
                        : 'text-gray-900'
                    }`}>
                      {item.title}
                    </div>
                    {item.description && (
                      <div className={`text-xs mt-1 ${
                        isCompleted ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {item.description}
                      </div>
                    )}
                    
                    {/* Action Buttons - show for all items, disabled when completed */}
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        disabled={isCompleted}
                        className={`text-xs h-8 rounded-md ${
                          isCompleted 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-black hover:bg-gray-800 text-white'
                        }`}
                        onClick={() => handleLetsDoIt(item)}
                      >
                        Let's do it
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isCompleted}
                        className={`text-xs h-8 ${
                          isCompleted 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => handleSkip(item.id)}
                      >
                        Skip
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
