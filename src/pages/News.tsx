
import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsBuilder } from '@/components/news/NewsBuilder';
import { useNews, NewsItem } from '@/hooks/useNews';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function News() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    newsItems,
    isLoading,
    createNews,
    updateNews,
    deleteNews,
    isCreating,
    isUpdating,
  } = useNews();

  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSave = (data: Partial<NewsItem>) => {
    if (editingNews) {
      updateNews({ ...data, id: editingNews.id });
    } else {
      createNews(data);
    }
    setShowBuilder(false);
    setEditingNews(null);
  };

  const handleEdit = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    setShowBuilder(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      deleteNews(id);
    }
  };

  const handleCancel = () => {
    setShowBuilder(false);
    setEditingNews(null);
  };

  const handleCreateNew = () => {
    setEditingNews(null);
    setShowBuilder(true);
  };

  if (showBuilder) {
    return (
      <NewsBuilder
        newsItem={editingNews || undefined}
        onSave={handleSave}
        onBack={handleCancel}
        isLoading={isCreating || isUpdating}
      />
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">News & Changelog</h1>
          <p className="text-gray-600">Share updates and announcements with your users</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Create News
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="feature">Feature</SelectItem>
            <SelectItem value="bugfix">Bug Fix</SelectItem>
            <SelectItem value="announcement">Announcement</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading news items...</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No news items found.</p>
          </div>
        ) : (
          filteredNews.map((newsItem) => (
            <NewsCard
              key={newsItem.id}
              newsItem={newsItem}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={user?.id === newsItem.user_id}
            />
          ))
        )}
      </div>
    </div>
  );
}
