
export interface Survey {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: string;
  background_color: string;
  text_color: string;
  button_color: string;
  position: string;
  type: string;
  trigger_type: string;
  auto_show: boolean;
  delay: number;
  show_close_button: boolean;
  show_progress: boolean;
  views: number;
  responses: number;
  created_at: string;
  updated_at: string;
}

export interface SurveyQuestion {
  id: string;
  survey_id: string;
  question_text: string;
  question_type: string;
  options?: any;
  required: boolean;
  order_index: number;
}

export interface SurveyInsert {
  user_id: string;
  title: string;
  description?: string;
  status?: string;
  background_color?: string;
  text_color?: string;
  button_color?: string;
  position?: string;
  type?: string;
  trigger_type?: string;
  auto_show?: boolean;
  delay?: number;
  show_close_button?: boolean;
  show_progress?: boolean;
}
