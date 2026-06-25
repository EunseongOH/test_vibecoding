import { create } from 'zustand';
import { supabase, isDemoMode } from '../services/supabase';
import { Profile, Expense, Challenge, UserChallenge, SwipeStatus } from '../types';
import { DEFAULT_CHALLENGES } from '../constants/challenges';

interface AppState {
  session: any | null;
  profile: Profile | null;
  expenses: Expense[];
  challenges: Challenge[];
  userChallenges: UserChallenge[];
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  setSession: (session: any) => void;
  fetchProfile: () => Promise<void>;
  updateProfileNickname: (nickname: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nickname: string) => Promise<void>;
  signOut: () => Promise<void>;
  
  // Expense Actions
  fetchExpenses: () => Promise<void>;
  addExpense: (storeName: string, amount: number, category: string, imageUrl?: string, purchasedAt?: string) => Promise<Expense>;
  updateExpenseSwipe: (id: string, status: SwipeStatus, regretReason?: string) => Promise<void>;
  updateExpenseDetail: (id: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  
  // Challenge Actions
  fetchChallenges: () => Promise<void>;
  fetchUserChallenges: () => Promise<void>;
  joinChallenge: (challengeId: string) => Promise<void>;
  progressChallenge: (userChallengeId: string, daysToAdd?: number) => Promise<void>;
  
  // Utility Heuristics
  calculatePersona: () => Promise<void>;
}

// Initial Mock data for demo mode
const INITIAL_DEMO_EXPENSES: Expense[] = [
  {
    id: 'e1',
    user_id: 'demo-user',
    store_name: '스타벅스 강남대로점',
    amount: 5800,
    category: '카페',
    purchased_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    swipe_status: 'pending',
    is_edited: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'e2',
    user_id: 'demo-user',
    store_name: '배달의민족 (엽기떡볶이)',
    amount: 24000,
    category: '식비',
    purchased_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    swipe_status: 'pending',
    is_edited: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'e3',
    user_id: 'demo-user',
    store_name: '올리브영 명동점',
    amount: 18500,
    category: '뷰티',
    purchased_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    swipe_status: 'pending',
    is_edited: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'e4',
    user_id: 'demo-user',
    store_name: '유튜브 프리미엄 결제',
    amount: 14900,
    category: '정기구독',
    purchased_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    swipe_status: 'satisfied',
    is_edited: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'e5',
    user_id: 'demo-user',
    store_name: '택시 (카카오T)',
    amount: 12500,
    category: '교통',
    purchased_at: new Date(Date.now() - 6 * 24 * 3600000).toISOString(),
    swipe_status: 'regret',
    regret_reason: '늦잠을 자서 어쩔 수 없이 탔는데 지출이 아깝다.',
    is_edited: false,
    created_at: new Date().toISOString(),
  }
];

export const useAppStore = create<AppState>((set, get) => ({
  session: null,
  profile: null,
  expenses: [],
  challenges: [],
  userChallenges: [],
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true });
    
    // Auth Listener setup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      set({ session });
      if (session) {
        await get().fetchProfile();
        await get().fetchExpenses();
        await get().fetchChallenges();
        await get().fetchUserChallenges();
      } else {
        // Reset state or use demo data
        if (isDemoMode) {
          set({
            profile: {
              id: 'demo-user',
              email: 'demo@swifin.com',
              nickname: '소비초보',
              persona_type: 'none',
              created_at: new Date().toISOString(),
            },
            expenses: INITIAL_DEMO_EXPENSES,
            challenges: DEFAULT_CHALLENGES,
            userChallenges: [],
          });
        } else {
          set({ profile: null, expenses: [], userChallenges: [] });
        }
      }
    });

    if (isDemoMode) {
      set({
        session: { user: { id: 'demo-user', email: 'demo@swifin.com' } },
        profile: {
          id: 'demo-user',
          email: 'demo@swifin.com',
          nickname: '소비초보',
          persona_type: 'none',
          created_at: new Date().toISOString(),
        },
        expenses: INITIAL_DEMO_EXPENSES,
        challenges: DEFAULT_CHALLENGES,
        userChallenges: [],
        isInitialized: true,
        isLoading: false,
      });
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, isInitialized: true, isLoading: false });
      if (session) {
        await get().fetchProfile();
        await get().fetchExpenses();
        await get().fetchChallenges();
        await get().fetchUserChallenges();
      }
    }
  },

  setSession: (session) => set({ session }),

  signIn: async (email, password) => {
    set({ isLoading: true });
    if (isDemoMode) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockSession = { user: { id: 'demo-user', email } };
      set({ 
        session: mockSession,
        profile: {
          id: 'demo-user',
          email,
          nickname: '소비초보',
          persona_type: 'none',
          created_at: new Date().toISOString(),
        },
        isLoading: false
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      set({ session: data.session });
      await get().fetchProfile();
      await get().fetchExpenses();
      await get().fetchChallenges();
      await get().fetchUserChallenges();
    } catch (err) {
      set({ isLoading: false });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email, password, nickname) => {
    set({ isLoading: true });
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockSession = { user: { id: 'demo-user', email } };
      set({ 
        session: mockSession,
        profile: {
          id: 'demo-user',
          email,
          nickname,
          persona_type: 'none',
          created_at: new Date().toISOString(),
        },
        isLoading: false
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      if (data.user) {
        // Create user profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { id: data.user.id, email, nickname, persona_type: 'none' }
          ]);
        
        if (profileError) throw profileError;
      }
    } catch (err) {
      set({ isLoading: false });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    if (isDemoMode) {
      set({ session: null, profile: null, expenses: [], userChallenges: [], isLoading: false });
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ session: null, profile: null, expenses: [], userChallenges: [] });
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProfile: async () => {
    const { session } = get();
    if (!session) return;
    
    if (isDemoMode) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (error) throw error;
      set({ profile: data });
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  },

  updateProfileNickname: async (nickname: string) => {
    const { session, profile } = get();
    if (!session || !profile) return;

    if (isDemoMode) {
      set({ profile: { ...profile, nickname } });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ nickname })
        .eq('id', session.user.id);

      if (error) throw error;
      set({ profile: { ...profile, nickname } });
    } catch (err) {
      console.error('Error updating nickname:', err);
    }
  },

  fetchExpenses: async () => {
    const { session } = get();
    if (!session) return;
    if (isDemoMode) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', session.user.id)
        .order('purchased_at', { ascending: false });

      if (error) throw error;
      set({ expenses: data || [] });
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  },

  addExpense: async (storeName: string, amount: number, category: string, imageUrl?: string, purchasedAt?: string) => {
    const { session, expenses } = get();
    const userId = session?.user?.id || 'demo-user';

    const newExpenseObj: Partial<Expense> = {
      user_id: userId,
      store_name: storeName,
      amount,
      category,
      image_url: imageUrl || '',
      swipe_status: 'pending',
      purchased_at: purchasedAt || new Date().toISOString(),
      is_edited: false,
      created_at: new Date().toISOString(),
    };

    if (isDemoMode) {
      const created: Expense = {
        ...newExpenseObj,
        id: Math.random().toString(36).substr(2, 9),
      } as Expense;
      
      set({ expenses: [created, ...expenses] });
      return created;
    }

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([newExpenseObj])
        .select()
        .single();

      if (error) throw error;
      set({ expenses: [data, ...expenses] });
      return data;
    } catch (err) {
      console.error('Error adding expense:', err);
      throw err;
    }
  },

  updateExpenseSwipe: async (id: string, status: SwipeStatus, regretReason?: string) => {
    const { expenses } = get();
    const updatedExpenses = expenses.map(e => 
      e.id === id ? { ...e, swipe_status: status, regret_reason: regretReason } : e
    );
    set({ expenses: updatedExpenses });

    if (isDemoMode) {
      await get().calculatePersona();
      return;
    }

    try {
      const { error } = await supabase
        .from('expenses')
        .update({ swipe_status: status, regret_reason: regretReason })
        .eq('id', id);

      if (error) throw error;
      await get().calculatePersona();
    } catch (err) {
      console.error('Error swiping expense:', err);
    }
  },

  updateExpenseDetail: async (id: string, updates: Partial<Expense>) => {
    const { expenses } = get();
    const updatedExpenses = expenses.map(e => 
      e.id === id ? { ...e, ...updates, is_edited: true } : e
    );
    set({ expenses: updatedExpenses });

    if (isDemoMode) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .update({ ...updates, is_edited: true })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating expense details:', err);
    }
  },

  deleteExpense: async (id: string) => {
    const { expenses } = get();
    set({ expenses: expenses.filter(e => e.id !== id) });

    if (isDemoMode) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  },

  fetchChallenges: async () => {
    if (isDemoMode) {
      set({ challenges: DEFAULT_CHALLENGES });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*');

      if (error) throw error;
      set({ challenges: data || DEFAULT_CHALLENGES });
    } catch (err) {
      console.error('Error fetching challenges:', err);
    }
  },

  fetchUserChallenges: async () => {
    const { session, challenges } = get();
    if (!session) return;
    if (isDemoMode) return;

    try {
      const { data, error } = await supabase
        .from('user_challenges')
        .select(`
          *,
          challenge:challenge_id(*)
        `)
        .eq('user_id', session.user.id);

      if (error) throw error;
      set({ userChallenges: data || [] });
    } catch (err) {
      console.error('Error fetching user challenges:', err);
    }
  },

  joinChallenge: async (challengeId: string) => {
    const { session, userChallenges, challenges } = get();
    const userId = session?.user?.id || 'demo-user';
    const challengeDetails = challenges.find(c => c.id === challengeId);

    const newUserChallengeObj = {
      user_id: userId,
      challenge_id: challengeId,
      status: 'ongoing' as const,
      progress_days: 0,
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isDemoMode) {
      const created: UserChallenge = {
        ...newUserChallengeObj,
        id: Math.random().toString(36).substr(2, 9),
        challenge: challengeDetails,
      };
      set({ userChallenges: [...userChallenges, created] });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_challenges')
        .insert([newUserChallengeObj])
        .select()
        .single();

      if (error) throw error;
      
      const hydratedData = {
        ...data,
        challenge: challengeDetails,
      };

      set({ userChallenges: [...userChallenges, hydratedData] });
    } catch (err) {
      console.error('Error joining challenge:', err);
    }
  },

  progressChallenge: async (userChallengeId: string, daysToAdd: number = 1) => {
    const { userChallenges } = get();
    const updated = userChallenges.map(uc => {
      if (uc.id === userChallengeId) {
        const nextProgress = uc.progress_days + daysToAdd;
        const limitDays = uc.challenge?.target_days || 7;
        const isCompleted = nextProgress >= limitDays;
        
        return {
          ...uc,
          progress_days: Math.min(nextProgress, limitDays),
          status: isCompleted ? ('completed' as const) : uc.status,
          updated_at: new Date().toISOString(),
        };
      }
      return uc;
    });

    set({ userChallenges: updated });

    if (isDemoMode) return;

    try {
      const targetUc = updated.find(uc => uc.id === userChallengeId);
      if (!targetUc) return;

      const { error } = await supabase
        .from('user_challenges')
        .update({
          progress_days: targetUc.progress_days,
          status: targetUc.status,
          updated_at: targetUc.updated_at,
        })
        .eq('id', userChallengeId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating challenge progress:', err);
    }
  },

  calculatePersona: async () => {
    const { expenses, profile, session } = get();
    if (!profile) return;

    // Filter to only swiped expenses (exclude 'pending')
    const swiped = expenses.filter(e => e.swipe_status !== 'pending');
    
    // We need at least 3 swiped items to calculate a persona
    if (swiped.length < 3) {
      if (profile.persona_type !== 'none') {
        const updatedProfile = { ...profile, persona_type: 'none' as const };
        set({ profile: updatedProfile });
        if (!isDemoMode && session) {
          await supabase.from('profiles').update({ persona_type: 'none' }).eq('id', session.user.id);
        }
      }
      return;
    }

    const regrets = swiped.filter(e => e.swipe_status === 'regret');
    const satisfieds = swiped.filter(e => e.swipe_status === 'satisfied');
    
    const regretRatio = regrets.length / swiped.length;
    const totalAmount = swiped.reduce((sum, e) => sum + Number(e.amount), 0);
    const regretAmount = regrets.reduce((sum, e) => sum + Number(e.amount), 0);
    const avgAmount = totalAmount / swiped.length;

    let newPersona: Profile['persona_type'] = 'none';

    if (regretRatio >= 0.6) {
      // Regret is high. Determine if it is Tiger (large impulsive single spends) or Fairy (many small regrets)
      const hasLargeSpends = regrets.some(e => Number(e.amount) > avgAmount * 1.5);
      if (hasLargeSpends) {
        newPersona = 'tiger';
      } else {
        newPersona = 'fairy';
      }
    } else if (regretRatio <= 0.25) {
      // Regret is very low. Plan-oriented
      newPersona = 'squirrel';
    } else {
      // Neutral regret but if they evaluate everything and still regret quite a bit of amount
      if (regretAmount > totalAmount * 0.4) {
        newPersona = 'scrooge';
      } else {
        newPersona = 'squirrel'; // Default to squirrel
      }
    }

    if (profile.persona_type !== newPersona) {
      const updatedProfile = { ...profile, persona_type: newPersona };
      set({ profile: updatedProfile });
      
      if (!isDemoMode && session) {
        try {
          await supabase
            .from('profiles')
            .update({ persona_type: newPersona })
            .eq('id', session.user.id);
        } catch (err) {
          console.error('Error updating calculated persona in DB:', err);
        }
      }
    }
  }
}));
