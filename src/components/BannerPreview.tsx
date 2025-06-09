
import { Banner } from '@/types/banner';
import { X } from 'lucide-react';

interface BannerPreviewProps {
  banner: Banner;
}

export const BannerPreview = ({ banner }: BannerPreviewProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 lg:p-6 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
        <p className="text-sm text-gray-600">See how your banner will look</p>
      </div>
      
      <div className="flex-1 p-4 lg:p-8 bg-gray-50 flex items-start justify-center">
        <div className="w-full max-w-6xl">
          {/* Banner Preview */}
          <div
            className={`w-full flex items-center justify-between p-4 ${
              banner.style === 'floating' ? 'rounded-lg shadow-lg mx-4' : ''
            }`}
            style={{
              backgroundColor: banner.background_color,
              color: banner.text_color,
            }}
          >
            {banner.show_sender && (
              <div className="flex items-center gap-3 mr-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {banner.sender_name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{banner.sender_name}</p>
                </div>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm lg:text-base font-medium">{banner.title}</p>
            </div>

            {banner.action_type === 'open_url_button' && banner.show_button && banner.button_text && (
              <button
                className="ml-4 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded text-xs lg:text-sm font-medium transition-colors flex-shrink-0"
                style={{ color: banner.text_color }}
              >
                {banner.button_text}
              </button>
            )}

            {banner.show_dismiss && (
              <button className="ml-4 p-1 hover:bg-white/20 rounded flex-shrink-0">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Position indicator */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
              Position: <span className="font-medium capitalize">{banner.position}</span> | 
              Style: <span className="font-medium capitalize">{banner.style}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
