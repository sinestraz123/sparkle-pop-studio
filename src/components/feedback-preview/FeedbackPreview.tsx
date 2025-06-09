
import { FeedbackWidget } from '@/components/feedback-preview/FeedbackWidget';
import { FeedbackConfig } from '@/components/FeedbackBuilder';

interface FeedbackPreviewProps {
  configs: FeedbackConfig[];
}

export const FeedbackPreview = ({ configs }: FeedbackPreviewProps) => {
  return (
    <div className="h-full bg-gray-100 relative overflow-hidden">
      {/* Background content to simulate a real page */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Preview Page</h1>
          <div className="space-y-4">
            <div className="h-32 bg-white rounded-lg shadow-sm border"></div>
            <div className="h-24 bg-white rounded-lg shadow-sm border"></div>
            <div className="h-40 bg-white rounded-lg shadow-sm border"></div>
          </div>
        </div>
      </div>

      {/* Multiple Feedback Widgets */}
      {configs.map((config) => (
        <FeedbackWidget key={config.id} config={config} />
      ))}
    </div>
  );
};
