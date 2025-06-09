
import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';

interface FeedbackWidgetProps {
  config: any;
}

export const FeedbackWidget = ({ config }: FeedbackWidgetProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [textResponse, setTextResponse] = useState('');

  if (!isVisible) return null;

  const getPositionClasses = () => {
    switch (config.position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-right':
        return 'bottom-6 right-6';
      default:
        return 'bottom-6 left-1/2 transform -translate-x-1/2';
    }
  };

  const renderRatingScale = () => {
    if (config.type === 'nps') {
      return (
        <div className="space-y-3">
          <div className="flex justify-between text-xs opacity-80">
            <span>Not likely</span>
            <span>Very likely</span>
          </div>
          <div className="flex gap-1">
            {[...Array(11)].map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedRating(i)}
                className={`w-8 h-8 rounded text-sm font-medium transition-all ${
                  selectedRating === i
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                style={{ color: selectedRating === i ? '#000' : config.textColor }}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (config.type === 'csat') {
      const ratings = ['😞', '😐', '🙂', '😊', '😍'];
      return (
        <div className="flex gap-2 justify-center">
          {ratings.map((emoji, i) => (
            <button
              key={i}
              onClick={() => setSelectedRating(i)}
              className={`w-12 h-12 rounded-full text-2xl transition-all ${
                selectedRating === i
                  ? 'bg-white/30 scale-110'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      );
    }

    return (
      <textarea
        value={textResponse}
        onChange={(e) => setTextResponse(e.target.value)}
        placeholder="Type your response..."
        className="w-full h-20 p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-white resize-none focus:outline-none focus:ring-2 focus:ring-white/50"
        style={{ color: config.textColor }}
      />
    );
  };

  return (
    <div className={`absolute ${getPositionClasses()} z-50`}>
      <div
        className="max-w-sm rounded-xl shadow-2xl backdrop-blur-sm border border-white/20 p-6"
        style={{ backgroundColor: config.backgroundColor }}
      >
        {config.showCloseButton && (
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" style={{ color: config.textColor }} />
          </button>
        )}

        <div className="space-y-4">
          <h3
            className="text-sm font-medium leading-relaxed"
            style={{ color: config.textColor }}
          >
            {config.question}
          </h3>

          {renderRatingScale()}

          {config.type !== 'short' && (
            <div className="pt-2">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                style={{ color: config.textColor }}
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {config.type === 'short' && textResponse && (
            <div className="pt-2">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                style={{ color: config.textColor }}
              >
                <span>Submit</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
