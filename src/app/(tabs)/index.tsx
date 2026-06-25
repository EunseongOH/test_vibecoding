import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import SwipeCard from '../../components/SwipeCard';
import { Sparkles, BookOpen, AlertCircle, HeartCrack } from 'lucide-react-native';

const REGRET_REASONS = [
  '습관처럼 썼어요 ⚡',
  '가격이 아쉬웠어요 💸',
  '꼭 필요하진 않았어요 📦',
  '비슷한 걸 또 샀어요 😵',
  '기분에 따라 샀어요 🌋',
];

export default function DiaryScreen() {
  const { expenses, updateExpenseSwipe, profile } = useAppStore();
  const router = useRouter();

  const pendingExpenses = expenses.filter((e) => e.swipe_status === 'pending');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const handleSwipeRight = (id: string) => {
    updateExpenseSwipe(id, 'satisfied');
  };

  const handleSwipeLeft = (id: string) => {
    setSelectedExpenseId(id);
    setSelectedTag('');
    setCustomReason('');
    setModalVisible(true);
  };

  const submitRegretReason = () => {
    if (!selectedExpenseId) return;
    const finalReason = [selectedTag, customReason.trim()]
      .filter(Boolean)
      .join(' - ');

    updateExpenseSwipe(selectedExpenseId, 'regret', finalReason || '특별한 이유 없음');
    setModalVisible(false);
    setSelectedExpenseId(null);
  };

  const skipRegretReason = () => {
    if (!selectedExpenseId) return;
    updateExpenseSwipe(selectedExpenseId, 'regret', '이유 없음');
    setModalVisible(false);
    setSelectedExpenseId(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50/90">
      {/* Outer Safety Padding */}
      <View className="flex-1 px-5 py-4 justify-between">
        
        {/* Header - SWIFIN UX Writing Rules */}
        <View className="flex-row justify-between items-center mb-3">
          <View>
            <Text className="text-[9px] font-bold text-primary-500 tracking-wider">SWIFIN DIARY</Text>
            <Text className="text-base font-black text-gray-800 mt-0.5">
              이 소비는 어땠나요?
            </Text>
          </View>
          <View className="bg-white px-2.5 py-1 rounded-full flex-row items-center border border-gray-100 shadow-sm">
            <BookOpen size={10} color="#2cba85" className="mr-1" />
            <Text className="text-[9px] font-black text-primary-600">
              돌아볼 카드 {pendingExpenses.length}장
            </Text>
          </View>
        </View>

        {/* Card Pile Area - Constrained to prevent layout overflow */}
        <View className="w-full h-[340px] justify-center items-center relative my-2">
          {pendingExpenses.length > 0 ? (
            pendingExpenses.slice(0, 1).map((expense, idx) => (
              <SwipeCard
                key={expense.id}
                expense={expense}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onPressDetail={(id) => router.push(`/detail/${id}`)}
                index={idx}
              />
            ))
          ) : (
            // Zero State (Empty Stack) - SWIFIN UX Writing Rules
            <View className="items-center px-4 justify-center">
              <View className="w-12 h-12 bg-primary-50 rounded-2xl items-center justify-center mb-3 border border-primary-100/50">
                <Sparkles size={24} color="#2cba85" />
              </View>
              <Text className="text-sm font-bold text-gray-800 text-center mb-1">
                아직 소비 카드가 없어요
              </Text>
              <Text className="text-[10px] text-gray-450 text-center leading-relaxed mb-4">
                결제내역 캡처를 올리면 소비를 카드로 정리해드릴게요.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/upload')}
                activeOpacity={0.8}
                className="bg-primary-500 px-4 py-2.5 rounded-xl shadow-md shadow-primary-200"
              >
                <Text className="text-white font-bold text-[10px]">첫 소비 카드 만들기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Swipe Hint - Modern Guide Plate (Card Exterior Bottom) */}
        {pendingExpenses.length > 0 && (
          <View className="items-center w-full px-4 mb-2">
            <View className="bg-white/95 border border-gray-100 rounded-2xl py-3 px-5 w-full max-w-[290px] shadow-sm">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <HeartCrack size={14} color="#f87171" className="mr-2.5" />
                  <View>
                    <Text className="text-[10px] font-black text-rose-500">아쉬웠다면</Text>
                    <Text className="text-[8px] font-bold text-gray-400 mt-0.5">왼쪽으로 슥-</Text>
                  </View>
                </View>

                <View className="h-6 w-[1px] bg-gray-150" />

                <View className="flex-row items-center justify-end">
                  <View className="items-end">
                    <Text className="text-[10px] font-black text-teal-650">만족했다면</Text>
                    <Text className="text-[8px] font-bold text-gray-400 mt-0.5">오른쪽으로 슥-</Text>
                  </View>
                  <Sparkles size={14} color="#14b8a6" className="ml-2.5" />
                </View>
              </View>
            </View>
            <Text className="text-[8px] font-bold text-gray-400 mt-3 text-center">
              정답은 없어요. 가볍게 넘기며 마음을 기록해 보세요.
            </Text>
          </View>
        )}
      </View>

      {/* Regret Reason Input Modal - SWIFIN UX Writing Rules */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-white rounded-t-[40px] px-6 py-6 shadow-xl max-h-[90%]">
            
            {/* Modal Title */}
            <View className="items-center mb-4">
              <View className="w-10 h-10 bg-regret-light rounded-2xl items-center justify-center mb-2">
                <AlertCircle size={20} color="#ff6b6b" />
              </View>
              <Text className="text-lg font-black text-gray-800">어떤 점이 아쉬웠나요?</Text>
              <Text className="text-[10px] text-gray-450 mt-0.5">다음 소비를 더 잘 선택할 수 있도록 이유를 가볍게 남겨주세요.</Text>
            </View>

            {/* Quick tag list */}
            <ScrollView className="max-h-40 mb-4" showsVerticalScrollIndicator={false}>
              <Text className="text-xs font-black text-gray-500 mb-2">태그를 선택해 보세요</Text>
              <View className="flex-row flex-wrap gap-2">
                {REGRET_REASONS.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => setSelectedTag(tag)}
                    className={`px-3 py-2 rounded-xl border ${
                      selectedTag === tag
                        ? 'bg-regret-light border-regret-DEFAULT'
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-bold ${
                        selectedTag === tag ? 'text-regret-DEFAULT' : 'text-gray-700'
                      }`}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Custom text input */}
            <Text className="text-xs font-black text-gray-500 mb-2">직접 남기기 (선택)</Text>
            <TextInput
              placeholder="구체적인 아쉬운 이유를 한 줄로 적어주세요."
              value={customReason}
              onChangeText={setCustomReason}
              className="w-full bg-gray-50 border border-gray-150 rounded-xl px-3 py-3 text-sm text-gray-800 font-medium mb-5"
            />

            {/* Bottom buttons */}
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={skipRegretReason}
                className="flex-1 bg-gray-100 py-3.5 rounded-xl items-center"
              >
                <Text className="text-gray-550 font-bold text-sm">그냥 넘기기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={submitRegretReason}
                className="flex-1 bg-regret-DEFAULT py-3.5 rounded-xl items-center shadow-lg shadow-red-100"
              >
                <Text className="text-white font-bold text-sm">이유 저장하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
