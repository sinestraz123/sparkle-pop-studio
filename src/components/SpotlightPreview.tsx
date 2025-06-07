
import React from 'react';
import { X } from 'lucide-react';

interface SpotlightPreviewProps {
  spotlight: any;
}

export const SpotlightPreview: React.FC<SpotlightPreviewProps> = ({ spotlight }) => {
  console.log('SpotlightPreview rendering with:', { 
    video_url: spotlight?.video_url,
    title: spotlight?.title 
  });

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

  if (!spotlight || !spotlight.video_url) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Spotlight Preview</h3>
          <p className="text-gray-500">Add a title and video URL to see the preview</p>
        </div>
      </div>
    );
  }

  const embedUrl = getVideoEmbedUrl(spotlight.video_url);
  const isDirectVideo = !embedUrl.includes('youtube.com') && !embedUrl.includes('vimeo.com');

  return (
    <div className="h-full flex items-center justify-center p-8" style={{ backgroundColor: '#f3f4f6' }}>
      {/* Larger overlay for video spotlight */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden relative">
        {/* Close button */}
        <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors">
          <X className="h-5 w-5 text-gray-700" />
        </button>

        {/* Video container - larger for better viewing */}
        <div className="w-full h-96 bg-black relative overflow-hidden">
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
              title="Spotlight video"
            />
          )}
        </div>

        {/* Title section */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {spotlight.title || 'Spotlight Title'}
          </h2>
        </div>
      </div>
    </div>
  );
};
