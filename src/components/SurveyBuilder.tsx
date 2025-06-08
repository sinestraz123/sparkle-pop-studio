
import { SurveyBuilderHeader } from '@/components/survey-builder/SurveyBuilderHeader';
import { SurveyContentSection } from '@/components/survey-builder/SurveyContentSection';
import { SurveyQuestionsSection } from '@/components/survey-builder/SurveyQuestionsSection';
import { SurveySettingsSection } from '@/components/survey-builder/SurveySettingsSection';
import { SurveyTriggerSection } from '@/components/survey-builder/SurveyTriggerSection';
import { SectionHeader } from '@/components/survey-builder/SectionHeader';
import { useSurveyFormData } from '@/hooks/useSurveyFormData';
import { useSurveyBuilderSections } from '@/hooks/useSurveyBuilderSections';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { FileText, HelpCircle, Settings, Zap } from 'lucide-react';

interface SurveyBuilderProps {
  survey?: any;
  onSave: (data: any) => void;
  onBack: () => void;
  isLoading: boolean;
  onDataChange?: (data: any) => void;
}

export const SurveyBuilder = ({ survey, onSave, onBack, isLoading, onDataChange }: SurveyBuilderProps) => {
  const { formData, updateFormData } = useSurveyFormData(survey, onDataChange);
  const {
    contentOpen,
    setContentOpen,
    questionsOpen,
    setQuestionsOpen,
    settingsOpen,
    setSettingsOpen,
    triggerOpen,
    setTriggerOpen,
  } = useSurveyBuilderSections();

  const handleSave = () => {
    onSave(formData);
  };

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
