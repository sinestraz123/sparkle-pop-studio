import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnnouncementPreviewProps {
  announcement: any;
}

export const AnnouncementPreview: React.FC<AnnouncementPreviewProps> = ({ announcement }) => {
  const getPositionClasses = () => {
    switch (announcement.position) {
      case 'top':
        return 'top-8 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'bottom-8 left-1/2 transform -translate-x-1/2';
      case 'corner':
        return 'top-8 right-8';
      case 'bottom-right':
        return 'bottom-8 right-8';
      default:
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
  };

  const getTypeClasses = () => {
    switch (announcement.type) {
      case 'banner':
        return 'w-full max-w-md';
      case 'popover':
        return 'w-80';
      default:
        return 'w-96';
    }
  };

  const getVideoEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // YouTube - handle both youtube.com and youtu.be formats
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo
    const vimeoRegex = /vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    // Direct video URL
    return url;
  };

  const renderMedia = () => {
    if (announcement.video_url) {
      const embedUrl = getVideoEmbedUrl(announcement.video_url);
      const isDirectVideo = !embedUrl.includes('youtube.com') && !embedUrl.includes('vimeo.com');
      
      return (
        <div className="w-full h-48 bg-black relative overflow-hidden rounded-t-lg">
          {isDirectVideo ? (
            <video 
              src={embedUrl}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title="Video player"
            />
          )}
        </div>
      );
    }
    
    if (announcement.image_url) {
      return (
        <div className="w-full h-48 bg-gradient-to-br from-green-400 via-blue-500 to-red-500 relative overflow-hidden rounded-t-lg">
          <img 
            src={announcement.image_url} 
            alt="Announcement media"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    
    return null;
  };

  if (announcement.type === 'banner' && announcement.position === 'top') {
    return (
      <div className="absolute top-0 left-0 right-0 z-50">
        <div 
          className="p-4 text-center"
          style={{ 
            backgroundColor: announcement.background_color,
            color: announcement.text_color 
          }}
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold">{announcement.title}</h3>
              <p className="text-sm opacity-90">{announcement.description}</p>
            </div>
            {announcement.button_text && (
              <Button
                style={{ backgroundColor: announcement.button_color }}
                className="ml-4 text-white"
              >
                {announcement.button_text}
              </Button>
            )}
            {announcement.show_close_button && (
              <button className="ml-4 p-1">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`absolute ${getPositionClasses()} z-50`}>
      <div 
        className={`${getTypeClasses()} rounded-lg shadow-2xl overflow-hidden`}
        style={{ backgroundColor: announcement.background_color }}
      >
        {announcement.show_close_button && (
          <div className="absolute top-3 right-3 z-10">
            <button className="p-1 rounded-full hover:bg-black/10">
              <X className="h-4 w-4" style={{ color: announcement.text_color }} />
            </button>
          </div>
        )}

        {renderMedia()}

        <div className="p-6">
          <h2 
            className="text-xl font-bold mb-3"
            style={{ color: announcement.text_color }}
          >
            {announcement.title}
          </h2>
          
          <p 
            className="text-sm mb-4 leading-relaxed"
            style={{ color: announcement.text_color }}
          >
            {announcement.description}
          </p>

          {announcement.button_text && (
            <Button
              className="w-full text-white font-medium"
              style={{ backgroundColor: announcement.button_color }}
            >
              {announcement.button_text}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
