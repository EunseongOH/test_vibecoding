import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import ChallengeItem from '../../components/ChallengeItem';
import { Trophy, Target, Sparkles, Plus } from 'lucide-react-native';

export default function ChallengeScreen() {
  const { challenges, userChallenges, joinChallenge, progressChallenge } = useAppStore();

  const ongoingUserChallenges = userChallenges.filter(uc => uc.status === 'ongoing');
  const completedUserChallenges = userChallenges.filter(uc => uc.status === 'completed');

  const joinedChallengeIds = userChallenges.map(uc => uc.challenge_id);
  const recommendedChallenges = challenges.filter(c => !joinedChallengeIds.includes(c.id));

  const handleJoinChallenge = (challengeId: string, title: string) => {
    Alert.alert(
      '챌린지 도전',
      `“${title}” 챌린지를 시작해 볼까요?`,
      [
        { text: '나중에 할래요', style: 'cancel' },
        { 
          text: '챌린지 시작하기', 
          onPress: async () => {
            await joinChallenge(challengeId);
          } 
        }
      ]
    );
  };

  const handleProgress = async (userChallengeId: string) => {
    await progressChallenge(userChallengeId, 1);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }} showsVerticalScrollIndicator={false}>
        
        {/* Title - SWIFIN UX Writing Rules */}
        <View className="mb-4">
          <Text className="text-[10px] font-bold text-primary-500 tracking-wider">SWIFIN CHALLENGE</Text>
          <Text className="text-xl font-black text-gray-800 mt-0.5">이번 주엔 이 소비만 조금 줄여볼까요?</Text>
          <Text className="text-xs text-gray-400 mt-1 font-medium leading-normal">
            SWIFIN이 내 소비 패턴에 맞춰 해볼 만한 목표를 추천했어요. 무리하지 않고 작게 시작해요.
          </Text>
        </View>

        {/* 1. Dashboard - SWIFIN UX Writing Rules */}
        <View className="bg-primary-500 p-5 rounded-[28px] shadow-md shadow-primary-200 flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white/80 text-[10px] font-bold">작은 실천이 쌓이고 있어요</Text>
            <Text className="text-white text-2xl font-black mt-0.5">
              {completedUserChallenges.length}번 해냈어요!
            </Text>
            <Text className="text-white/70 text-[9px] font-bold mt-1">
              오늘도 목표에 가까워졌어요. 무리하지 않고 이어가볼게요.
            </Text>
          </View>
          <View className="bg-white/20 p-3 rounded-full">
            <Trophy size={28} color="white" />
          </View>
        </View>

        {/* 2. Ongoing Challenges */}
        <View className="mb-5">
          <View className="flex-row items-center mb-3">
            <Target size={16} color="#2cba85" className="mr-1" />
            <Text className="text-sm font-black text-gray-800">진행 중인 실천</Text>
          </View>

          {ongoingUserChallenges.length > 0 ? (
            ongoingUserChallenges.map((uc) => (
              <ChallengeItem 
                key={uc.id} 
                userChallenge={uc} 
                onProgress={handleProgress} 
              />
            ))
          ) : (
            // Empty state - SWIFIN UX Writing Rules
            <View className="h-24 rounded-[24px] bg-gray-50 border border-gray-100/70 items-center justify-center p-4">
              <Text className="text-[10px] text-gray-400 font-bold text-center leading-relaxed">
                아직 진행 중인 챌린지가 없어요.{'\n'}내 소비 패턴에 맞는 작은 절약 목표를 추천받아보세요!
              </Text>
            </View>
          )}
        </View>

        {/* 3. Recommended Challenges */}
        <View className="mb-8">
          <View className="flex-row items-center mb-3">
            <Sparkles size={16} color="#2cba85" className="mr-1" />
            <Text className="text-sm font-black text-gray-800">나에게 맞는 절약 방식 추천</Text>
          </View>

          {recommendedChallenges.length > 0 ? (
            recommendedChallenges.map((challenge) => (
              <TouchableOpacity
                key={challenge.id}
                onPress={() => handleJoinChallenge(challenge.id, challenge.title)}
                activeOpacity={0.8}
                className="w-full p-4 rounded-[24px] border border-gray-100 bg-white mb-3 shadow-sm flex-row justify-between items-center"
              >
                <View className="flex-1 pr-2">
                  <Text className="text-sm font-bold text-gray-800">{challenge.title}</Text>
                  <Text className="text-[10px] font-medium text-gray-400 mt-0.5" numberOfLines={2}>
                    {challenge.description}
                  </Text>
                  <View className="flex-row mt-1.5 items-center space-x-2">
                    <Text className="text-[9px] font-black text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
                      {challenge.target_days}일 도전
                    </Text>
                    <Text className="text-[9px] font-bold text-gray-450">
                      +{challenge.reward_points}P
                    </Text>
                  </View>
                </View>
                <View className="w-8 h-8 bg-primary-50 rounded-full items-center justify-center">
                  <Plus size={14} color="#2cba85" />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="h-16 rounded-[24px] bg-gray-50 border border-gray-100/70 items-center justify-center p-4">
              <Text className="text-[10px] text-gray-400 font-bold text-center">
                모든 챌린지에 도전하셨어요. 대단해요! 🌟
              </Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
