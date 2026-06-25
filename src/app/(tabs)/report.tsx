import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import ReportChart from '../../components/ReportChart';
import { PERSONAS } from '../../constants/challenges';
import { Sparkles, Flame } from 'lucide-react-native';

export default function ReportScreen() {
  const { expenses, profile } = useAppStore();

  const swipedExpenses = expenses.filter(e => e.swipe_status !== 'pending');
  const satisfiedExpenses = swipedExpenses.filter(e => e.swipe_status === 'satisfied');
  const regretExpenses = swipedExpenses.filter(e => e.swipe_status === 'regret');

  const totalAmount = swipedExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const regretAmount = regretExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const userPersonaType = profile?.persona_type || 'none';
  const persona = PERSONAS[userPersonaType];

  const categoryMap: Record<string, number> = {};
  swipedExpenses.forEach(e => {
    const category = e.category || '기타';
    categoryMap[category] = (categoryMap[category] || 0) + Number(e.amount);
  });

  const categoryData = Object.keys(categoryMap)
    .map(cat => ({
      category: cat,
      amount: categoryMap[cat],
      percentage: totalAmount > 0 ? (categoryMap[cat] / totalAmount) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  const regretReasons = regretExpenses
    .map(e => e.regret_reason || '')
    .filter(Boolean);

  const reasonCountMap: Record<string, number> = {};
  regretReasons.forEach(r => {
    const cleanReason = r.split(' - ')[0] || r;
    reasonCountMap[cleanReason] = (reasonCountMap[cleanReason] || 0) + 1;
  });

  const sortedReasons = Object.keys(reasonCountMap)
    .map(reason => ({ reason, count: reasonCountMap[reason] }))
    .sort((a, b) => b.count - a.count);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }} showsVerticalScrollIndicator={false}>
        
        {/* Title - SWIFIN UX Writing Rules */}
        <View className="mb-4">
          <Text className="text-[10px] font-bold text-primary-500 tracking-wider">SWIFIN REPORT</Text>
          <Text className="text-xl font-black text-gray-800 mt-0.5">내 소비 패턴이 보이기 시작했어요</Text>
          <Text className="text-xs text-gray-400 mt-1 font-medium leading-normal">
            만족한 소비와 줄이고 싶은 소비를 함께 살펴볼게요.
          </Text>
        </View>

        {/* 1. Persona Card */}
        <View className={`w-full p-5 rounded-[32px] bg-gradient-to-br ${persona.bgGradient} border border-white/50 shadow-md shadow-gray-100/50 mb-6 items-center`}>
          <Text className="text-5xl mb-2">{persona.emoji}</Text>
          <View className="bg-white/40 px-2.5 py-0.5 rounded-full mb-1.5">
            <Text className="text-[9px] font-black text-gray-700">나의 소비 페르소나</Text>
          </View>
          <Text className="text-xl font-black text-gray-800 text-center mb-2 leading-tight">
            {profile?.nickname || '소비초보'}님은{'\n'}“{persona.name}”
          </Text>
          <Text className="text-xs font-semibold text-gray-600 text-center leading-relaxed mb-3.5 px-1">
            {persona.description}
          </Text>
          
          {/* Advice bubble */}
          <View className="w-full bg-white/70 p-3 rounded-2xl border border-white">
            <View className="flex-row items-center space-x-1 mb-1">
              <Sparkles size={12} color="#0f766e" />
              <Text className="text-[10px] font-bold text-teal-900">SWIFIN의 소비 제언</Text>
            </View>
            <Text className="text-[10px] font-medium text-gray-600 leading-relaxed">
              {persona.recommendation}
            </Text>
          </View>
        </View>

        {/* 2. Stat summary widgets - SWIFIN UX Writing Rules */}
        <View className="flex-row gap-2 mb-6">
          <View className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100/60 items-center">
            <Text className="text-[9px] font-bold text-gray-400 mb-0.5">돌아본 지출</Text>
            <Text className="text-sm font-black text-gray-800">{swipedExpenses.length}건</Text>
          </View>
          <View className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100/60 items-center">
            <Text className="text-[9px] font-bold text-gray-400 mb-0.5">누적 지출액</Text>
            <Text className="text-sm font-black text-gray-800">
              {totalAmount >= 10000 
                ? `${(totalAmount / 10000).toFixed(1)}만원` 
                : `${totalAmount.toLocaleString()}원`}
            </Text>
          </View>
          <View className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100/60 items-center">
            <Text className="text-[9px] font-bold text-gray-400 mb-0.5">줄여볼 수 있는 소비</Text>
            <Text className="text-sm font-black text-regret-DEFAULT">
              {regretAmount >= 10000 
                ? `${(regretAmount / 10000).toFixed(1)}만원` 
                : `${regretAmount.toLocaleString()}원`}
            </Text>
          </View>
        </View>

        {/* 3. Report Chart */}
        <View className="bg-white p-5 rounded-[28px] border border-gray-100/70 shadow-sm shadow-gray-100 mb-6">
          <ReportChart 
            satisfiedCount={satisfiedExpenses.length} 
            regretCount={regretExpenses.length} 
            categoryData={categoryData}
          />
        </View>

        {/* 4. Top Regret Reasons Analyzed - SWIFIN UX Writing Rules */}
        <View className="bg-gray-50 p-5 rounded-[28px] border border-gray-100/70 mb-8">
          <View className="flex-row items-center mb-3">
            <Flame size={16} color="#ff6b6b" className="mr-1" />
            <Text className="text-sm font-black text-gray-800">아쉬움이 남은 소비 요인</Text>
          </View>
          
          {sortedReasons.length > 0 ? (
            <View className="space-y-2">
              {sortedReasons.slice(0, 3).map((item, index) => (
                <View key={item.reason || index} className="flex-row justify-between items-center bg-white px-3 py-2.5 rounded-xl border border-gray-100/60">
                  <View className="flex-row items-center">
                    <View className="w-5 h-5 rounded-lg bg-regret-light items-center justify-center mr-1.5">
                      <Text className="text-[9px] font-bold text-regret-DEFAULT">{index + 1}</Text>
                    </View>
                    <Text className="text-xs font-bold text-gray-700">{item.reason}</Text>
                  </View>
                  <Text className="text-[9px] font-bold text-gray-450">{item.count}회 감지됨</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-[10px] text-gray-450 leading-normal text-center py-2">
              아쉬움이 남은 소비와 원인을 기록하면,{'\n'}소비 패턴을 분석하여 요인을 진단해 드려요.
            </Text>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
