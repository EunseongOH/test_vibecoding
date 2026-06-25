import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { ChevronLeft, Trash2, Save } from 'lucide-react-native';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { expenses, updateExpenseDetail, deleteExpense } = useAppStore();
  const router = useRouter();

  const expense = expenses.find((e) => e.id === id);

  // Form State
  const [storeName, setStoreName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [regretReason, setRegretReason] = useState('');

  useEffect(() => {
    if (expense) {
      setStoreName(expense.store_name);
      setAmount(expense.amount.toString());
      setCategory(expense.category || '');
      setRegretReason(expense.regret_reason || '');
    }
  }, [expense]);

  if (!expense) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500 font-medium">해당 소비 데이터를 찾을 수 없습니다.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-primary-500 px-6 py-3 rounded-2xl">
          <Text className="text-white font-bold">뒤로가기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    const parsedAmount = Number(amount);
    if (!storeName || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('알림', '올바른 가게명과 금액을 입력해 주세요.');
      return;
    }

    try {
      await updateExpenseDetail(expense.id, {
        store_name: storeName,
        amount: parsedAmount,
        category,
        regret_reason: expense.swipe_status === 'regret' ? regretReason : undefined,
      });
      router.back();
    } catch (err: any) {
      Alert.alert('저장 실패', err.message || '소비 내역 수정 중 에러가 발생했습니다.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      '소비 카드 삭제',
      '이 소비 카드를 정말 삭제하시겠습니까? 삭제된 카드는 복구할 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            await deleteExpense(expense.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Bar */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <ChevronLeft size={24} color="#4b5563" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">소비 상세 수정</Text>
        <TouchableOpacity onPress={handleDelete} className="p-2">
          <Trash2 size={20} color="#ff6b6b" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        
        {/* Card Form */}
        <View className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-sm mb-6">
          <Text className="text-sm font-semibold text-gray-500 mb-2 ml-1">가게 이름</Text>
          <TextInput
            value={storeName}
            onChangeText={setStoreName}
            className="w-full bg-white px-4 py-3.5 rounded-2xl border border-gray-200 text-gray-800 mb-4 font-medium"
          />

          <Text className="text-sm font-semibold text-gray-500 mb-2 ml-1">금액 (원)</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="number-pad"
            className="w-full bg-white px-4 py-3.5 rounded-2xl border border-gray-200 text-gray-800 mb-4 font-medium"
          />

          <Text className="text-sm font-semibold text-gray-500 mb-2 ml-1">카테고리</Text>
          <TextInput
            value={category}
            onChangeText={setCategory}
            className="w-full bg-white px-4 py-3.5 rounded-2xl border border-gray-200 text-gray-800 mb-4 font-medium"
          />

          {expense.swipe_status === 'regret' && (
            <>
              <Text className="text-sm font-semibold text-gray-500 mb-2 ml-1">후회하는 이유</Text>
              <TextInput
                value={regretReason}
                onChangeText={setRegretReason}
                multiline
                numberOfLines={2}
                className="w-full bg-white px-4 py-3.5 rounded-2xl border border-gray-200 text-gray-800 font-medium"
                textAlignVertical="top"
              />
            </>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.9}
          className="w-full bg-primary-500 py-4 rounded-2xl flex-row justify-center items-center shadow-md shadow-primary-200"
        >
          <Save size={20} color="white" className="mr-2" />
          <Text className="text-white font-bold text-lg">수정 내용 저장</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
