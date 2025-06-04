
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ExternalLink, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NewsPreviewProps {
  newsItem?: any;
}

export function NewsPreview({ newsItem }: NewsPreviewProps) {
  if (!newsItem) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <div className="text-center">
          <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Preview will appear here</p>
        </div>
      </div>
    );
  }

  const isLink = newsItem.type === "link";

  return (
    <div className="space-y-4">
      {/* News Card Preview */}
      <Card className="overflow-hidden">
        {newsItem.image_url && (
          <div className="aspect-video w-full">
            <img
              src={newsItem.image_url}
              alt={newsItem.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {newsItem.type}
            </Badge>
            {newsItem.category && (
              <Badge variant="outline" className="text-xs">
                {newsItem.category}
              </Badge>
            )}
          </div>
          
          <h3 className="text-xl font-bold leading-tight">
            {newsItem.title || "Untitled News Item"}
          </h3>
          
          {newsItem.description && (
            <p className="text-gray-600 text-sm">
              {newsItem.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {newsItem.author_name && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {newsItem.author_name}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {newsItem.published_at 
                ? formatDistanceToNow(new Date(newsItem.published_at), { addSuffix: true })
                : "Not published"
              }
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLink ? (
            <Button className="w-full gap-2" variant="outline">
              <ExternalLink className="w-4 h-4" />
              Read More
            </Button>
          ) : (
            <>
              {newsItem.content && (
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 line-clamp-3">
                    {newsItem.content}
                  </p>
                </div>
              )}
              <Button className="w-full mt-4" variant="outline">
                Read Full Article
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Mobile Preview */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium mb-3 text-sm">Mobile Preview</h4>
        <div className="bg-white rounded-lg p-3 max-w-xs mx-auto">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {newsItem.type}
              </Badge>
            </div>
            <h5 className="font-semibold text-sm leading-tight">
              {newsItem.title || "Untitled"}
            </h5>
            <p className="text-xs text-gray-600 line-clamp-2">
              {newsItem.description}
            </p>
            <div className="text-xs text-gray-400">
              {newsItem.published_at 
                ? formatDistanceToNow(new Date(newsItem.published_at), { addSuffix: true })
                : "Not published"
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
