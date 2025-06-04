
import React, { useState } from 'react';
import { X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PopupConfig {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
  videoUrl: string;
  type: string;
  position: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  showCloseButton: boolean;
  autoShow: boolean;
  delay: number;
}

interface PopupPreviewProps {
  config: PopupConfig;
}

const PopupPreview: React.FC<PopupPreviewProps> = ({ config }) => {
  const [isVisible, setIsVisible] = useState(true);

  const getPositionClasses = () => {
    switch (config.position) {
      case 'top':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'corner':
        return 'bottom-4 right-4';
      default:
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
  };

  const getTypeClasses = () => {
    switch (config.type) {
      case 'banner':
        return 'w-full max-w-none rounded-none';
      case 'popover':
        return 'w-80 rounded-lg shadow-lg';
      default:
        return 'w-96 max-w-sm rounded-xl shadow-2xl';
    }
  };

  if (!isVisible) return null;

  const renderMedia = () => {
    if (config.videoUrl) {
      // Simple video preview placeholder
      return (
        <div className="relative w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          <Play className="h-12 w-12 text-gray-400" />
          <div className="absolute bottom-2 left-2 text-xs text-gray-600 bg-white px-2 py-1 rounded">
            Video: {config.videoUrl.substring(0, 30)}...
          </div>
        </div>
      );
    }
    
    if (config.imageUrl) {
      return (
        <img 
          src={config.imageUrl} 
          alt="Announcement" 
          className="w-full h-40 object-cover rounded-lg mb-4"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      );
    }
    
    return null;
  };

  return (
    <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
      {/* Browser mockup */}
      <div className="bg-white border-b border-gray-200 p-3 flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
        <div className="flex-1 bg-gray-100 rounded px-3 py-1 text-sm text-gray-600">
          yourwebsite.com
        </div>
      </div>

      {/* Website content mockup */}
      <div className="p-8 bg-gray-50 h-full">
        <div className="space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>

        {/* Popup */}
        {config.type === 'modal' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div 
              className={`relative ${getTypeClasses()} p-6 animate-scale-in`}
              style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
            >
              {config.showCloseButton && (
                <button 
                  onClick={() => setIsVisible(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              
              {renderMedia()}
              
              <h3 className="text-xl font-bold mb-3" style={{ color: config.textColor }}>
                {config.title}
              </h3>
              <p className="text-sm mb-4 opacity-80" style={{ color: config.textColor }}>
                {config.description}
              </p>
              
              {config.buttonText && (
                <Button 
                  className="w-full font-medium transition-all duration-200 hover:shadow-lg"
                  style={{ 
                    backgroundColor: config.buttonColor,
                    borderColor: config.buttonColor 
                  }}
                >
                  {config.buttonText}
                </Button>
              )}
            </div>
          </div>
        )}

        {config.type === 'popover' && (
          <div 
            className={`absolute ${getPositionClasses()} ${getTypeClasses()} p-4 animate-fade-in`}
            style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
          >
            {config.showCloseButton && (
              <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            {renderMedia()}
            
            <h4 className="font-semibold mb-2" style={{ color: config.textColor }}>
              {config.title}
            </h4>
            <p className="text-sm mb-3 opacity-80" style={{ color: config.textColor }}>
              {config.description}
            </p>
            
            {config.buttonText && (
              <Button 
                size="sm" 
                className="w-full text-xs"
                style={{ 
                  backgroundColor: config.buttonColor,
                  borderColor: config.buttonColor 
                }}
              >
                {config.buttonText}
              </Button>
            )}
          </div>
        )}

        {config.type === 'banner' && (
          <div 
            className={`absolute top-16 left-0 right-0 ${getTypeClasses()} p-4 flex items-center justify-between animate-slide-in-right`}
            style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
          >
            <div className="flex-1">
              <h4 className="font-semibold mb-1" style={{ color: config.textColor }}>
                {config.title}
              </h4>
              <p className="text-sm opacity-80" style={{ color: config.textColor }}>
                {config.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-3 ml-4">
              {config.buttonText && (
                <Button 
                  size="sm"
                  style={{ 
                    backgroundColor: config.buttonColor,
                    borderColor: config.buttonColor 
                  }}
                >
                  {config.buttonText}
                </Button>
              )}
              
              {config.showCloseButton && (
                <button 
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupPreview;
