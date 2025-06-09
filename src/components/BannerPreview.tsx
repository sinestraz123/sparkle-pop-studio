
import { Banner } from '@/components/BannerBuilder';

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
      
      <div className="flex-1 p-4 lg:p-8 bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {/* Banner Preview */}
          <div
            className="rounded-lg shadow-lg flex items-center justify-between p-4 mx-auto"
            style={{
              backgroundColor: banner.background_color,
              color: banner.text_color,
              width: `${Math.max(banner.width * 2, 400)}px`,
              height: `${Math.max(banner.height * 2, 120)}px`,
              maxWidth: '100%'
            }}
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm lg:text-base mb-1 truncate">{banner.title}</h3>
              <p className="text-xs lg:text-sm opacity-90 line-clamp-2">{banner.content}</p>
            </div>
            
            {banner.show_button && banner.button_text && (
              <button
                className="ml-4 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded text-xs lg:text-sm font-medium transition-colors flex-shrink-0"
                style={{ color: banner.text_color }}
              >
                {banner.button_text}
              </button>
            )}
          </div>

          {/* Position indicator */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
              Position: <span className="font-medium capitalize">{banner.position}</span>
            </span>
          </div>

          {/* Dimensions info */}
          <div className="mt-4 text-center">
            <span className="text-xs text-gray-500">
              Dimensions: {banner.width * 2}px × {banner.height * 2}px
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
