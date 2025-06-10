
import { useState } from 'react';
import { useFeedback } from '@/hooks/useFeedback';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Eye, Trash2, BarChart3 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const FeedbackList = () => {
  const { feedbacks, addFeedback, deleteFeedback, updateFeedback, isLoading } = useFeedback();
  const navigate = useNavigate();

  const activeCount = feedbacks.filter(f => f.isActive).length;
  const totalViews = feedbacks.reduce((sum, f) => sum + (0), 0); // Will be populated when analytics are added
  const totalResponses = feedbacks.reduce((sum, f) => sum + (0), 0); // Will be populated when analytics are added

  const handleEdit = (feedbackId: string) => {
    navigate(`/feedback/${feedbackId}`);
  };

  const handlePreview = (feedbackId: string) => {
    // Navigate to preview mode
    navigate(`/feedback/${feedbackId}?mode=preview`);
  };

  const handleToggleStatus = (feedbackId: string, currentStatus: boolean) => {
    updateFeedback(feedbackId, { isActive: !currentStatus });
  };

  const handleDelete = (feedbackId: string) => {
    if (window.confirm('Are you sure you want to delete this feedback widget?')) {
      deleteFeedback(feedbackId);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Loading feedback widgets...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Feedback Widgets</h1>
          <p className="text-gray-600 mt-1">Create and manage your feedback campaigns</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/feedback/responses">
              <BarChart3 className="h-4 w-4" />
              View Responses
            </Link>
          </Button>
          <Button onClick={addFeedback} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Feedback Widget
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Feedback Widgets</p>
                <p className="text-2xl font-bold">{feedbacks.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Edit className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">{totalViews}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold">{totalResponses}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Widgets Grid */}
      {feedbacks.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Edit className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No feedback widgets yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first feedback widget to start collecting user feedback.
              </p>
              <Button onClick={addFeedback} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Feedback Widget
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((feedback, index) => (
            <Card key={feedback.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Feedback Widget #{index + 1}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {feedback.steps[0]?.question || 'No question set'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(feedback.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2 mb-4">
                  <Badge variant={feedback.isActive ? "default" : "secondary"}>
                    {feedback.isActive ? 'active' : 'draft'}
                  </Badge>
                  <Badge variant="outline">
                    {feedback.steps.length} step{feedback.steps.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Views</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Responses</span>
                    <span className="font-medium">0</span>
                  </div>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  Position: {feedback.position}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(feedback.id)}
                    className="flex items-center gap-1 flex-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(feedback.id)}
                    className="flex items-center gap-1 flex-1"
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
