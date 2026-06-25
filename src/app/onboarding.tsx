import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Wallet, Flame, ArrowRight } from 'lucide-react-native';

const SLIDES = [
  {
    title: '나에게 맞는 절약은 따로 있어요 🌟',
    description: 'SWIFIN이 소비 내역을 바탕으로 줄이고 싶은 소비와 지켜도 좋은 소비를 함께 찾아드릴게요.',
    icon: Wallet,
    color: 'bg-emerald-50 text-primary-500',
    iconColor: '#2cba85',
  },
  {
    title: '아쉬움과 만족, 가볍게 스와이프 👆',
    description: '생성된 소비 카드를 왼쪽으로 밀어 아쉬움을 남기고, 오른쪽으로 밀어 만족을 표현하세요. 내 감정을 기록하는 소비 다이어리!',
    icon: Sparkles,
    color: 'bg-pastel-purple text-purple-500',
    iconColor: '#a78bfa',
  },
  {
    title: '나만을 위한 해볼 만한 챌린지 🏆',
    description: '분석된 소비 패턴에 맞춰 무리하지 않고 도전해 볼 수 있는 작은 절약 미션을 추천해 드려요.',
    icon: Flame,
    color: 'bg-pastel-pink text-regret-DEFAULT',
    iconColor: '#ff6b6b',
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < SLIDES.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      router.push('/(auth)/login');
    }
  };

  const ActiveIcon = SLIDES[currentStep].icon;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Outer Safety Padding */}
      <View className="flex-1 px-5 py-4 justify-between">
        
        {/* Skip Button */}
        <View className="items-end h-6">
          {currentStep < SLIDES.length - 1 && (
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-gray-400 font-bold text-xs">건너뛰기</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content Area */}
        <View className="items-center px-2">
          {/* Card Icon Area */}
          <View className={`w-20 h-20 rounded-2xl ${SLIDES[currentStep].color} items-center justify-center mb-6 shadow-sm border border-white`}>
            <ActiveIcon size={36} color={SLIDES[currentStep].iconColor} />
          </View>

          {/* Indicators */}
          <View className="flex-row space-x-1.5 mb-6 justify-center">
            {SLIDES.map((_, index) => (
              <View
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentStep ? 'w-5 bg-primary-500' : 'w-1.5 bg-gray-200'
                }`}
              />
            ))}
          </View>

          <Text className="text-xl font-black text-gray-800 text-center mb-3 leading-snug">
            {SLIDES[currentStep].title}
          </Text>
          <Text className="text-xs text-gray-450 text-center leading-relaxed px-4">
            {SLIDES[currentStep].description}
          </Text>
        </View>

        {/* Action Button - SWIFIN UX Writing Rules */}
        <View className="px-2 pb-2">
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.9}
            className="w-full bg-primary-500 py-3.5 rounded-2xl flex-row justify-center items-center shadow-md shadow-primary-200"
          >
            <Text className="text-white font-bold text-sm mr-1.5">
              {currentStep === SLIDES.length - 1 ? '내 소비 돌아보기' : '다음으로'}
            </Text>
            <ArrowRight size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
