import { Edit3, HeartCrack, Sparkles } from 'lucide-react-native';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Expense } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;

interface SwipeCardProps {
  expense: Expense;
  onSwipeLeft: (id: string) => void;
  onSwipeRight: (id: string) => void;
  onPressDetail: (id: string) => void;
  index: number;
}

const getCardStyle = (category: string) => {
  const cat = category?.trim() || '';
  switch (cat) {
    case '식비':
      return {
        bgClass: 'bg-amber-100/90',
        borderClass: 'border-amber-200/50',
        badgeBg: 'bg-amber-200/70',
        badgeText: 'text-amber-900',
      };
    case '카페':
      return {
        bgClass: 'bg-teal-100/90',
        borderClass: 'border-teal-200/50',
        badgeBg: 'bg-teal-200/70',
        badgeText: 'text-teal-900',
      };
    case '쇼핑':
    case '패션':
    case '뷰티':
      return {
        bgClass: 'bg-rose-100/90',
        borderClass: 'border-rose-200/50',
        badgeBg: 'bg-rose-200/70',
        badgeText: 'text-rose-900',
      };
    case '교통':
      return {
        bgClass: 'bg-sky-100/90',
        borderClass: 'border-sky-200/50',
        badgeBg: 'bg-sky-200/70',
        badgeText: 'text-sky-900',
      };
    case '정기구독':
    default:
      return {
        bgClass: 'bg-purple-100/90',
        borderClass: 'border-purple-200/50',
        badgeBg: 'bg-purple-200/70',
        badgeText: 'text-purple-900',
      };
  }
};

export default function SwipeCard({
  expense,
  onSwipeLeft,
  onSwipeRight,
  onPressDetail,
  index,
}: SwipeCardProps) {
  const isTopCard = index === 0;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .enabled(isTopCard)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, {
          velocity: event.velocityX,
        });
        runOnJS(onSwipeLeft)(expense.id);
      } else if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, {
          velocity: event.velocityX,
        });
        runOnJS(onSwipeRight)(expense.id);
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    if (!isTopCard) {
      return {
        transform: [{ scale: 0.94 }, { translateY: 12 }],
        opacity: 0.75,
      };
    }

    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-5, 0, 5],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
      opacity: 1,
    };
  });

  const leftBadgeStyle = useAnimatedStyle(() => {
    if (!isTopCard) return { opacity: 0 };

    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, -24, 0],
      [1, 0.25, 0],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0.92],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }, { translateX: -4 }],
    };
  });

  const rightBadgeStyle = useAnimatedStyle(() => {
    if (!isTopCard) return { opacity: 0 };

    const opacity = interpolate(
      translateX.value,
      [0, 24, SWIPE_THRESHOLD],
      [0, 0.25, 1],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0.92, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }, { translateX: 4 }],
    };
  });

  const formattedAmount = Number(expense.amount).toLocaleString('ko-KR');

  const purchasedDate = expense.purchased_at || expense.created_at || new Date().toISOString();
  const dateObj = new Date(purchasedDate);
  const dateString = isNaN(dateObj.getTime())
    ? '최근 결제 내역'
    : dateObj.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

  const cardStyle = getCardStyle(expense.category);

  const cardContent = (
    <Animated.View
      style={[animatedStyle, styles.cardShadow]}
      className={`w-full max-w-[290px] h-full max-h-[320px] border ${cardStyle.bgClass} ${cardStyle.borderClass} overflow-hidden`}
    >
      {/* Clean swipe feedback badges */}
      {isTopCard && (
        <>
          <Animated.View
            pointerEvents="none"
            style={[leftBadgeStyle]}
            className="absolute left-5 top-12 z-20 bg-white/95 px-3 py-1.5 rounded-2xl border border-rose-100 shadow-sm"
          >
            <View className="flex-row items-center">
              <HeartCrack size={12} color="#f87171" className="mr-1.5" />
              <Text className="text-[10px] font-black text-rose-500">아쉬운 소비</Text>
            </View>
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[rightBadgeStyle]}
            className="absolute right-5 top-12 z-20 bg-white/95 px-3 py-1.5 rounded-2xl border border-teal-100 shadow-sm"
          >
            <View className="flex-row items-center">
              <Sparkles size={12} color="#14b8a6" className="mr-1.5" />
              <Text className="text-[10px] font-black text-teal-600">만족 소비</Text>
            </View>
          </Animated.View>
        </>
      )}

      {/* Main card contents with modern balanced margins & padding */}
      <View className="flex-1 justify-between p-7">
        
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-400 font-bold text-[10px] tracking-wide">{dateString}</Text>
          {isTopCard && (
            <Pressable
              onPress={() => onPressDetail(expense.id)}
              className="bg-white/90 px-3 py-1 rounded-full border border-black/5 active:opacity-70"
            >
              <Text className="text-[10px] font-bold text-gray-600">수정</Text>
            </Pressable>
          )}
        </View>

        {/* Store and Amount (Clean Typography & Spacious Layout) */}
        <View className="items-center justify-center flex-1 my-6">
          <View className={`${cardStyle.badgeBg} px-3 py-0.5 rounded-full mb-4`}>
            <Text className={`${cardStyle.badgeText} font-black text-[10px] tracking-wide`}>
              {expense.category || '소비'}
            </Text>
          </View>

          <Text
            className="text-lg font-black text-gray-800 text-center mb-2 px-1 leading-snug"
            numberOfLines={2}
          >
            {expense.store_name}
          </Text>

          <Text className="text-3xl font-black text-primary-650 tracking-tight mt-1">
            {formattedAmount}원
          </Text>
        </View>

      </View>
    </Animated.View>
  );

  return (
    <View
      className="absolute w-full h-full justify-center items-center"
      style={{ zIndex: 10 - index }}
      pointerEvents={isTopCard ? 'auto' : 'none'}
    >
      {isTopCard ? (
        <GestureDetector gesture={panGesture}>{cardContent}</GestureDetector>
      ) : (
        cardContent
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    borderRadius: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow:
          '0 12px 28px -10px rgba(0, 0, 0, 0.06), 0 4px 10px -5px rgba(0, 0, 0, 0.03)',
      } as any,
    }),
  },
});