
import { Banner } from '@/components/BannerBuilder';

interface BannerPreviewProps {
  banner: Banner;
}

export const BannerPreview = ({ banner }: BannerPreviewProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
        <p className="text-sm text-gray-600">See how your banner will look</p>
      </div>
      
      <div className="flex-1 p-6 bg-gray-100 flex items-center justify-center">
        <div className="relative">
          {/* Banner Preview */}
          <div
            className="rounded-lg shadow-lg flex items-center justify-between p-4"
            style={{
              backgroundColor: banner.background_color,
              color: banner.text_color,
              width: `${banner.width * 2}px`,
              height: `${banner.height * 2}px`,
              minWidth: '386px',
              minHeight: '126px'
            }}
          >
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">{banner.title}</h3>
              <p className="text-xs opacity-90">{banner.content}</p>
            </div>
            
            {banner.show_button && banner.button_text && (
              <button
                className="ml-4 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors"
                style={{ color: banner.text_color }}
              >
                {banner.button_text}
              </button>
            )}
          </div>

          {/* Position indicator */}
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">
              Position: <span className="font-medium capitalize">{banner.position}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
