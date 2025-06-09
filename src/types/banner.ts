
export interface Banner {
  id: string;
  title: string;
  content: string;
  background_color: string;
  text_color: string;
  button_text: string;
  button_url: string;
  show_button: boolean;
  status: 'draft' | 'active';
  position: 'top' | 'bottom';
  width: number;
  height: number;
  views: number;
  clicks: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  show_sender: boolean;
  sender_name: string;
  show_dismiss: boolean;
  style: 'inline' | 'floating';
  action_type: 'none' | 'open_url' | 'open_url_button' | 'ask_reactions' | 'collect_emails' | 'product_tour';
}
