
import { useState, useEffect } from 'react';
import { SurveyBuilderHeader } from '@/components/survey-builder/SurveyBuilderHeader';
import { SurveyContentSection } from '@/components/survey-builder/SurveyContentSection';
import { SurveyQuestionsSection } from '@/components/survey-builder/SurveyQuestionsSection';
import { SurveySettingsSection } from '@/components/survey-builder/SurveySettingsSection';
import { SurveyTriggerSection } from '@/components/survey-builder/SurveyTriggerSection';
import { useSurveyQuestionsManager } from '@/hooks/useSurveys';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Settings, FileText, HelpCircle, Zap } from 'lucide-react';

interface SurveyBuilderProps {
  survey?: any;
  onSave: (data: any) => void;
  onBack: () => void;
  isLoading: boolean;
  onDataChange?: (data: any) => void;
}

export const SurveyBuilder = ({ survey, onSave, onBack, isLoading, onDataChange }: SurveyBuilderProps) => {
  const { questions } = useSurveyQuestionsManager(survey?.id);
  const [contentOpen, setContentOpen] = useState(true);
  const [questionsOpen, setQuestionsOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [triggerOpen, setTriggerOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft',
    background_color: '#ffffff',
    text_color: '#000000',
    button_color: '#3b82f6',
    position: 'center',
    type: 'modal',
    trigger_type: 'auto_show',
    auto_show: false,
    delay: 0,
    show_close_button: true,
    show_progress: true,
    questions: [],
  });

  useEffect(() => {
    if (survey) {
      setFormData({
        title: survey.title || '',
        description: survey.description || '',
        status: survey.status || 'draft',
        background_color: survey.background_color || '#ffffff',
        text_color: survey.text_color || '#000000',
        button_color: survey.button_color || '#3b82f6',
        position: survey.position || 'center',
        type: survey.type || 'modal',
        trigger_type: survey.trigger_type || 'auto_show',
        auto_show: survey.auto_show || false,
        delay: survey.delay || 0,
        show_close_button: survey.show_close_button ?? true,
        show_progress: survey.show_progress ?? true,
        questions: [],
      });
    }
  }, [survey]);

  useEffect(() => {
    if (questions) {
      const mappedQuestions = questions.map(q => ({
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options,
        required: q.required,
      }));
      setFormData(prev => ({
        ...prev,
        questions: mappedQuestions,
      }));
    }
  }, [questions]);

  // Notify parent component when formData changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const handleSave = () => {
    onSave(formData);
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const SectionHeader = ({ icon: Icon, title, subtitle, isOpen, onToggle }: {
    icon: any;
    title: string;
    subtitle: string;
    isOpen: boolean;
    onToggle: () => void;
  }) => (
    <CollapsibleTrigger
      className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      onClick={onToggle}
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
          <Icon className="h-4 w-4 text-blue-600" />
        </div>
        <div className="text-left">
          <div className="font-medium text-gray-900">{title}</div>
          <div className="text-sm text-gray-500">{subtitle}</div>
        </div>
      </div>
      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </CollapsibleTrigger>
  );

  return (
    <div className="h-full flex flex-col">
      <SurveyBuilderHeader
        title={formData.title || 'New Survey'}
        onBack={onBack}
        onSave={handleSave}
        isLoading={isLoading}
        status={formData.status}
        onStatusChange={(status) => updateFormData({ status })}
      />
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Content Section */}
        <Collapsible open={contentOpen} onOpenChange={setContentOpen}>
          <SectionHeader
            icon={FileText}
            title="Content"
            subtitle="Survey title and description"
            isOpen={contentOpen}
            onToggle={() => setContentOpen(!contentOpen)}
          />
          <CollapsibleContent className="mt-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <SurveyContentSection
                title={formData.title}
                description={formData.description}
                onTitleChange={(title) => updateFormData({ title })}
                onDescriptionChange={(description) => updateFormData({ description })}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Questions Section */}
        <Collapsible open={questionsOpen} onOpenChange={setQuestionsOpen}>
          <SectionHeader
            icon={HelpCircle}
            title="Questions"
            subtitle={`${formData.questions.length} question${formData.questions.length !== 1 ? 's' : ''}`}
            isOpen={questionsOpen}
            onToggle={() => setQuestionsOpen(!questionsOpen)}
          />
          <CollapsibleContent className="mt-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <SurveyQuestionsSection
                questions={formData.questions}
                onQuestionsChange={(questions) => updateFormData({ questions })}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Settings Section */}
        <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
          <SectionHeader
            icon={Settings}
            title="Appearance"
            subtitle="Colors, position, and display options"
            isOpen={settingsOpen}
            onToggle={() => setSettingsOpen(!settingsOpen)}
          />
          <CollapsibleContent className="mt-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <SurveySettingsSection
                backgroundColor={formData.background_color}
                textColor={formData.text_color}
                buttonColor={formData.button_color}
                position={formData.position}
                showCloseButton={formData.show_close_button}
                showProgress={formData.show_progress}
                onBackgroundColorChange={(background_color) => updateFormData({ background_color })}
                onTextColorChange={(text_color) => updateFormData({ text_color })}
                onButtonColorChange={(button_color) => updateFormData({ button_color })}
                onPositionChange={(position) => updateFormData({ position })}
                onShowCloseButtonChange={(show_close_button) => updateFormData({ show_close_button })}
                onShowProgressChange={(show_progress) => updateFormData({ show_progress })}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Trigger Section */}
        <Collapsible open={triggerOpen} onOpenChange={setTriggerOpen}>
          <SectionHeader
            icon={Zap}
            title="Trigger"
            subtitle="When does it show?"
            isOpen={triggerOpen}
            onToggle={() => setTriggerOpen(!triggerOpen)}
          />
          <CollapsibleContent className="mt-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <SurveyTriggerSection
                triggerType={formData.trigger_type}
                autoShow={formData.auto_show}
                delay={formData.delay}
                onTriggerTypeChange={(trigger_type) => updateFormData({ trigger_type })}
                onAutoShowChange={(auto_show) => updateFormData({ auto_show })}
                onDelayChange={(delay) => updateFormData({ delay })}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
