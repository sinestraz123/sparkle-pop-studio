
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Clock } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Insights and metrics for your engagement campaigns</p>
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              We're working on powerful analytics features to help you track engagement, 
              measure performance, and optimize your campaigns.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Expected release: Q1 2024</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
