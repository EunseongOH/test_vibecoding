import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { UserChallenge } from '../types';
import { Check, Trophy } from 'lucide-react-native';

interface ChallengeItemProps {
  userChallenge: UserChallenge;
  onProgress: (id: string) => void;
}

export default function ChallengeItem({ userChallenge, onProgress }: ChallengeItemProps) {
  const challenge = userChallenge.challenge;
  if (!challenge) return null;

  const targetDays = challenge.target_days;
  const progressDays = userChallenge.progress_days;
  const progressPercent = Math.min((progressDays / targetDays) * 100, 100);
  const isCompleted = userChallenge.status === 'completed';

  return (
    <View className={`w-full p-5 rounded-3xl border mb-4 shadow-sm bg-white ${
      isCompleted ? 'border-primary-300 bg-primary-50/10' : 'border-gray-100'
    }`}>
      
      {/* Title block */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 pr-2">
          <Text className="text-base font-extrabold text-gray-800">{challenge.title}</Text>
          <Text className="text-xs font-semibold text-gray-400 mt-1">{challenge.description}</Text>
        </View>
        <View className={`px-2.5 py-1 rounded-full ${
          isCompleted ? 'bg-primary-100' : 'bg-gray-100'
        }`}>
          <Text className={`text-[10px] font-black ${
            isCompleted ? 'text-primary-600' : 'text-gray-500'
          }`}>
            {challenge.category}
          </Text>
        </View>
      </View>

      {/* Progress Info */}
      <View className="flex-row justify-between items-center mb-1.5">
        <Text className="text-xs font-semibold text-gray-400">진행도</Text>
        <Text className="text-xs font-bold text-gray-600">
          {progressDays}일 / {targetDays}일 ({Math.round(progressPercent)}%)
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
        <View
          style={{ width: `${progressPercent}%` }}
          className={`h-full rounded-full ${isCompleted ? 'bg-primary-500' : 'bg-primary-400'}`}
        />
      </View>

      {/* Check In Action Button - SWIFIN UX Writing Rules */}
      {isCompleted ? (
        <View className="w-full py-3 rounded-2xl bg-primary-50 border border-primary-200 flex-row justify-center items-center">
          <Trophy size={16} color="#178760" className="mr-1.5" />
          <Text className="text-primary-600 font-bold text-sm">챌린지 완수! 대단해요 🌟</Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => onProgress(userChallenge.id)}
          activeOpacity={0.8}
          className="w-full py-3 rounded-2xl bg-primary-500 flex-row justify-center items-center shadow-md shadow-primary-100"
        >
          <Check size={16} color="white" className="mr-1.5" />
          <Text className="text-white font-bold text-sm">오늘 기록하기</Text>
        </TouchableOpacity>
      )}

    </View>
  );
}
