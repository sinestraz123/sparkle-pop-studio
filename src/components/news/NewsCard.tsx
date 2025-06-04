
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Edit, Trash2, Calendar } from 'lucide-react';
import { NewsItem } from '@/hooks/useNews';
import { format } from 'date-fns';

interface NewsCardProps {
  newsItem: NewsItem;
  onEdit?: (newsItem: NewsItem) => void;
  onDelete?: (id: string) => void;
  canEdit?: boolean;
}

export function NewsCard({ newsItem, onEdit, onDelete, canEdit = false }: NewsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="w-full mb-4 overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Header Section */}
        <div 
          className="p-6 cursor-pointer"
          onClick={toggleExpanded}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={newsItem.status === 'published' ? 'default' : 'secondary'}>
                  {newsItem.status}
                </Badge>
                {newsItem.category && (
                  <Badge variant="outline">{newsItem.category}</Badge>
                )}
              </div>
              
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {newsItem.title}
              </h3>
              
              {newsItem.description && (
                <p className="text-gray-600 mb-3">
                  {newsItem.description}
                </p>
              )}
              
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(newsItem.created_at), 'MMM dd, yyyy')}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              {canEdit && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(newsItem);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(newsItem.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              <Button variant="ghost" size="sm">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-6 pb-6 border-t bg-gray-50">
            {newsItem.image_url && (
              <div className="mt-4 mb-4">
                <img
                  src={newsItem.image_url}
                  alt={newsItem.title}
                  className="w-full max-w-2xl rounded-lg shadow-sm"
                />
              </div>
            )}
            
            {newsItem.content && (
              <div className="mt-4">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {newsItem.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
