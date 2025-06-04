
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface NewsPreviewProps {
  formData: any;
}

export const NewsPreview: React.FC<NewsPreviewProps> = ({ formData }) => {
  return (
    <div className="h-full p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Preview</h2>
        <p className="text-sm text-gray-600">This is how your news item will appear</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={formData.status === 'published' ? 'default' : 'secondary'}>
            {formData.status}
          </Badge>
          {formData.category && (
            <Badge variant="outline">{formData.category}</Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-2 text-gray-900">
          {formData.title || 'Your news title will appear here'}
        </h3>

        {/* Description */}
        {formData.description && (
          <p className="text-gray-600 mb-3">
            {formData.description}
          </p>
        )}

        {/* Date */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>

        {/* Image */}
        {formData.image_url && (
          <div className="mb-4">
            <img
              src={formData.image_url}
              alt={formData.title}
              className="w-full max-w-2xl rounded-lg shadow-sm"
            />
          </div>
        )}

        {/* Content */}
        {formData.content && (
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">
              {formData.content}
            </p>
          </div>
        )}

        {/* Placeholder when empty */}
        {!formData.title && !formData.description && !formData.content && (
          <div className="text-center py-8 text-gray-400">
            <p>Start adding content to see the preview</p>
          </div>
        )}
      </div>
    </div>
  );
};
