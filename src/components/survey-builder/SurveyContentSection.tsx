
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface SurveyContentSectionProps {
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
}

export const SurveyContentSection = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: SurveyContentSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Content</h3>
      
      <div className="space-y-2">
        <Label htmlFor="title">Survey Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter survey title..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Enter survey description..."
          rows={3}
        />
      </div>
    </div>
  );
};
