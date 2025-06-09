
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, ThumbsUp, ThumbsDown, Heart, Star } from 'lucide-react';

interface BannerConfig {
  title: string;
  content: string;
  showSender: boolean;
  senderName: string;
  showDismissButton: boolean;
  action: 'none' | 'url' | 'url_button' | 'reactions' | 'emails' | 'product_tour';
  actionUrl: string;
  actionButtonText: string;
  style: 'inline' | 'floating';
  position: 'top' | 'bottom';
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
}

interface BannerPreviewProps {
  config: BannerConfig;
}

export const BannerPreview: React.FC<BannerPreviewProps> = ({ config }) => {
  const [email, setEmail] = useState('');
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Banner was dismissed</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={() => setIsVisible(true)}
        >
          Show Banner Again
        </Button>
      </div>
    );
  }

  const bannerStyle = {
    backgroundColor: config.backgroundColor,
    color: config.textColor,
  };

  const buttonStyle = {
    backgroundColor: config.buttonColor,
    color: config.backgroundColor,
    border: `1px solid ${config.buttonColor}`,
  };

  const renderActionContent = () => {
    switch (config.action) {
      case 'url_button':
        return (
          <Button 
            style={buttonStyle}
            size="sm"
            className="ml-4"
            onClick={() => window.open(config.actionUrl, '_blank')}
          >
            {config.actionButtonText}
          </Button>
        );

      case 'emails':
        return (
          <div className="flex gap-2 ml-4">
            <Input
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/90 text-gray-900"
              style={{ maxWidth: '200px' }}
            />
            <Button 
              style={buttonStyle}
              size="sm"
            >
              Subscribe
            </Button>
          </div>
        );

      case 'reactions':
        return (
          <div className="flex gap-2 ml-4">
            {[
              { icon: ThumbsUp, value: 'thumbs-up' },
              { icon: ThumbsDown, value: 'thumbs-down' },
              { icon: Heart, value: 'heart' },
              { icon: Star, value: 'star' },
            ].map(({ icon: Icon, value }) => (
              <Button
                key={value}
                variant={selectedReaction === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedReaction(value)}
                className={selectedReaction === value ? '' : 'bg-white/90 text-gray-700'}
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        );

      case 'product_tour':
        return (
          <Button 
            style={buttonStyle}
            size="sm"
            className="ml-4"
          >
            Start Tour
          </Button>
        );

      default:
        return null;
    }
  };

  const bannerContent = (
    <div 
      className={`${config.style === 'floating' ? 'rounded-lg shadow-lg' : ''} p-4 w-full`}
      style={bannerStyle}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-center">
          {config.showSender && (
            <div className="flex items-center mr-4">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-2"
                style={{ backgroundColor: config.textColor, color: config.backgroundColor }}
              >
                {config.senderName.charAt(0)}
              </div>
              <span className="text-sm opacity-90">{config.senderName}</span>
            </div>
          )}
          
          <div className="flex-1">
            <div className="font-medium">{config.title}</div>
            {config.content && (
              <div className="text-sm opacity-90 mt-1">{config.content}</div>
            )}
          </div>

          {renderActionContent()}
        </div>

        {config.showDismissButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="ml-4 text-current hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Preview Container */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="bg-white rounded-lg overflow-hidden min-h-96">
          {/* Mock Website Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-600 rounded"></div>
                <span className="font-semibold">SaaS App</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">Login</Button>
                <Button size="sm">Sign Up</Button>
              </div>
            </div>
          </div>

          {/* Banner - Top Position */}
          {config.position === 'top' && bannerContent}

          {/* Mock Content */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Our SaaS Platform</h1>
            <p className="text-gray-600 mb-6">
              This is a preview of how your banner will appear on your website. 
              The banner is positioned {config.position} and styled as {config.style}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Feature {i}</h3>
                  <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet consectetur.</p>
                </div>
              ))}
            </div>
          </div>

          {/* Banner - Bottom Position */}
          {config.position === 'bottom' && bannerContent}
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Preview Information</h4>
        <div className="space-y-1 text-sm text-blue-800">
          <p><strong>Style:</strong> {config.style === 'inline' ? 'Inline (full width)' : 'Floating (with rounded corners and shadow)'}</p>
          <p><strong>Position:</strong> {config.position === 'top' ? 'Top of page' : 'Bottom of page'}</p>
          <p><strong>Action:</strong> {config.action === 'none' ? 'No action' : config.action.replace('_', ' ')}</p>
          {config.action === 'url' && <p><strong>Click behavior:</strong> Entire banner is clickable</p>}
        </div>
      </div>
    </div>
  );
};
