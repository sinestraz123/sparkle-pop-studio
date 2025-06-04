
import React from 'react';
import { CheckSquare, Plus, Trash, GripVertical } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  media_type: 'none' | 'image' | 'gif' | 'url';
  media_url?: string;
}

interface ChecklistItemsSectionProps {
  items: ChecklistItem[];
  updateItem: (itemId: string, field: string, value: any) => void;
  addItem: () => void;
  removeItem: (itemId: string) => void;
}

export const ChecklistItemsSection: React.FC<ChecklistItemsSectionProps> = ({
  items,
  updateItem,
  addItem,
  removeItem,
}) => {
  return (
    <AccordionItem value="items" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <CheckSquare className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Items</div>
            <div className="text-sm text-gray-500">{items.length} checklist items</div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        {items.map((item, index) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{index + 1}.</span>
                <Input 
                  value={item.title}
                  onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                  placeholder="Item title"
                  className="font-medium"
                />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            
            <Textarea 
              value={item.description || ''}
              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
              placeholder="Item description (optional)"
              rows={2}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">Media Type</Label>
                <Select 
                  value={item.media_type} 
                  onValueChange={(value) => updateItem(item.id, 'media_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="gif">GIF</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {item.media_type !== 'none' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    {item.media_type === 'url' ? 'URL' : 'Media URL'}
                  </Label>
                  <Input 
                    value={item.media_url || ''}
                    onChange={(e) => updateItem(item.id, 'media_url', e.target.value)}
                    placeholder={`Enter ${item.media_type} URL`}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          onClick={addItem}
          className="w-full flex items-center space-x-2 text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          <Plus className="h-4 w-4" />
          <span>Add item</span>
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
};
