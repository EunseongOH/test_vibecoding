export interface Profile {
  id: string;
  email: string;
  nickname: string;
  persona_type: 'none' | 'squirrel' | 'tiger' | 'fairy' | 'scrooge'; 
  // squirrel: 현명한 다람쥐, tiger: 충동적 호랑이, fairy: 탕진 요정, scrooge: 자린고비
  created_at: string;
}

export type SwipeStatus = 'pending' | 'satisfied' | 'regret';

export interface Expense {
  id: string;
  user_id: string;
  store_name: string;
  amount: number;
  category: string;
  purchased_at: string;
  image_url?: string;
  swipe_status: SwipeStatus;
  regret_reason?: string;
  is_edited: boolean;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  target_days: number;
  reward_points: number;
  created_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  status: 'ongoing' | 'completed' | 'failed';
  progress_days: number;
  started_at: string;
  updated_at: string;
  challenge?: Challenge; // Joined challenge details
}
