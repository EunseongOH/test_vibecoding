import { Challenge } from '../types';

export const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: '배달 대신 집밥 요리하기 🍳',
    description: '이번 주 배달 음식을 끊고 집밥을 해 먹으며 식비를 아껴보세요.',
    category: '식비',
    target_days: 7,
    reward_points: 300,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c2',
    title: '테이크아웃 커피 대신 텀블러 쓰기 ☕',
    description: '매일 사 마시는 커피값도 모이면 큽니다! 텀블러로 홈카페를 실천해 봐요.',
    category: '카페',
    target_days: 5,
    reward_points: 150,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c3',
    title: '장바구니 결제 24시간 미루기 🛒',
    description: '마음에 드는 물건을 장바구니에 담아두고 24시간 뒤에 다시 고민해 보세요.',
    category: '쇼핑',
    target_days: 7,
    reward_points: 200,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c4',
    title: '하루 무지출 실천하기 🚫',
    description: '단 하루라도 돈을 쓰지 않는 완벽한 무지출 데이를 달성해 보세요.',
    category: '기타',
    target_days: 3,
    reward_points: 500,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c5',
    title: '택시 대신 대중교통 이용하기 🚌',
    description: '늦잠이나 귀찮음으로 습관처럼 타던 택시 대신 지하철과 버스를 이용하세요.',
    category: '교통',
    target_days: 5,
    reward_points: 200,
    created_at: new Date().toISOString(),
  }
];

export interface PersonaDetails {
  type: 'squirrel' | 'tiger' | 'fairy' | 'scrooge' | 'none';
  name: string;
  emoji: string;
  description: string;
  recommendation: string;
  bgGradient: string;
}

export const PERSONAS: Record<string, PersonaDetails> = {
  none: {
    type: 'none',
    name: '소비 분석 중',
    emoji: '🔍',
    description: '소비 카드를 스와이프하여 분류해주시면 내 소비 패턴을 분석해 드려요.',
    recommendation: '최소 3개 이상의 소비 카드를 만족/아쉬움으로 분류해 주세요!',
    bgGradient: 'from-gray-100 to-gray-200',
  },
  squirrel: {
    type: 'squirrel',
    name: '계획적인 다람쥐',
    emoji: '🐿️',
    description: '미래를 대비해 야금야금 도토리를 저축하는 꼼꼼한 계획가 타입입니다.',
    recommendation: '나에게 주는 선물처럼 가치 있는 만족 소비에는 조금 더 너그러워져도 괜찮아요.',
    bgGradient: 'from-emerald-100 to-teal-200',
  },
  tiger: {
    type: 'tiger',
    name: '가끔 지르는 호랑이',
    emoji: '🐯',
    description: '평소에는 이성적이지만, 마음에 드는 가치를 만나면 맹수처럼 질러버리는 화끈한 타입입니다.',
    recommendation: '장바구니에 담은 뒤 딱 24시간 뒤에 결제 버튼을 누르는 연습을 추천해요.',
    bgGradient: 'from-orange-100 to-amber-200',
  },
  fairy: {
    type: 'fairy',
    name: '기분파 요정',
    emoji: '🧚',
    description: '소소한 일상의 기쁨을 소중히 여겨 가벼운 지출을 즐기는 감성 타입입니다.',
    recommendation: '한 주 예산을 정해두고 그 한도 안에서 자유롭게 소확행을 실천해 보세요.',
    bgGradient: 'from-pink-100 to-rose-200',
  },
  scrooge: {
    type: 'scrooge',
    name: '수호자 자린고비',
    emoji: '🪙',
    description: '지출 전반에 매우 철저한 기준을 가지고 재정을 보수적으로 수호하는 타입입니다.',
    recommendation: '소비에 대한 후회보다는 나를 윤택하게 하는 지출에 만족을 더 크게 느껴보세요.',
    bgGradient: 'from-indigo-100 to-violet-200',
  }
};
