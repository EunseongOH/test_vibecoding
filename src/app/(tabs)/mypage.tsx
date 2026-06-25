import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { isDemoMode } from '../../services/supabase';
import { User, LogOut, Save, ShieldAlert } from 'lucide-react-native';

export default function MyPageScreen() {
  const { profile, updateProfileNickname, signOut, userChallenges } = useAppStore();
  const [nickname, setNickname] = useState(profile?.nickname || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateNickname = async () => {
    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임을 입력해 주세요.');
      return;
    }
    
    try {
      await updateProfileNickname(nickname.trim());
      setIsEditing(false);
      Alert.alert('변경 완료', '닉네임 변경을 완료했어요!');
    } catch (err: any) {
      Alert.alert('변경 실패', err.message || '닉네임 변경 중 에러가 발생했습니다.');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까? 안전하게 세션을 폐기합니다.',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '로그아웃', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
          } 
        }
      ]
    );
  };

  const completedCount = userChallenges.filter(uc => uc.status === 'completed').length;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }} showsVerticalScrollIndicator={false}>
          
          {/* Title */}
          <View className="mb-4">
            <Text className="text-[10px] font-bold text-primary-500 tracking-wider">SWIFIN SETTINGS</Text>
            <Text className="text-xl font-black text-gray-800 mt-0.5">마이페이지</Text>
          </View>

          {/* Profile Card */}
          <View className="w-full bg-gray-50 border border-gray-100 rounded-[28px] p-5 mb-5">
            <View className="flex-row items-center space-x-3 mb-4">
              <View className="w-12 h-12 rounded-xl bg-primary-100 items-center justify-center">
                <User size={24} color="#2cba85" />
              </View>
              <View className="flex-1">
                {isEditing ? (
                  <View className="flex-row items-center space-x-2">
                    <TextInput
                      value={nickname}
                      placeholder="어떻게 불러드릴까요?"
                      onChangeText={setNickname}
                      className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 font-bold flex-1"
                    />
                    <TouchableOpacity
                      onPress={handleUpdateNickname}
                      className="bg-primary-500 p-2 rounded-lg"
                    >
                      <Save size={14} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <Text className="text-base font-black text-gray-800 mr-2">{profile?.nickname}</Text>
                    <TouchableOpacity onPress={() => setIsEditing(true)}>
                      <Text className="text-[10px] font-bold text-primary-500 underline">수정</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <Text className="text-[10px] text-gray-400 font-medium mt-0.5">{profile?.email}</Text>
              </View>
            </View>

            {/* Mini achievement */}
            <View className="border-t border-gray-200/40 pt-3.5 flex-row justify-around">
              <View className="items-center">
                <Text className="text-[10px] text-gray-400 font-bold">참여한 챌린지</Text>
                <Text className="text-sm font-black text-gray-800 mt-0.5">{userChallenges.length}개</Text>
              </View>
              <View className="w-[1px] h-6 bg-gray-200" />
              <View className="items-center">
                <Text className="text-[10px] text-gray-400 font-bold">성공한 챌린지</Text>
                <Text className="text-sm font-black text-primary-500 mt-0.5">{completedCount}개</Text>
              </View>
            </View>
          </View>

          {/* Privacy Security Trust Card - SWIFIN UX Writing Rules */}
          <View className="w-full bg-primary-50/30 border border-primary-100/50 rounded-2xl p-4 mb-5">
            <Text className="text-xs font-black text-primary-800">🔒 개인정보 및 보안 신뢰</Text>
            <Text className="text-[10px] text-primary-700/80 leading-relaxed mt-1 font-medium">
              SWIFIN은 사용자의 결제내역과 금융 데이터를 가장 안전하게 보호합니다. 수집된 정보는 본인 이외에 누구도 절대 조회할 수 없도록 암호화되어 관리돼요.
            </Text>
          </View>

          {/* Mode & Status Alert */}
          <View className="w-full p-4 rounded-2xl bg-pastel-yellow border border-yellow-100 flex-row items-start space-x-2.5 mb-5">
            <ShieldAlert size={18} color="#b7791f" className="mt-0.5" />
            <View className="flex-1">
              <Text className="text-[10px] font-black text-amber-800">
                동작 환경: {isDemoMode ? '데모(Local Offline) 모드' : 'Supabase 클라우드 모드'}
              </Text>
              <Text className="text-[9px] font-medium text-amber-700/80 leading-relaxed mt-1">
                {isDemoMode 
                  ? '실제 Supabase 접속 키가 연동되지 않아 오프라인 데모 모드로 실행 중입니다. 작성된 데이터는 로컬 메모리에만 임시 저장됩니다.'
                  : 'Supabase 데이터베이스 및 보안 정책(RLS)이 정상 동작하고 있습니다.'}
              </Text>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleSignOut}
            activeOpacity={0.8}
            className="w-full bg-red-50 border border-red-100 py-3.5 rounded-2xl flex-row justify-center items-center mt-2"
          >
            <LogOut size={16} color="#ff6b6b" className="mr-1.5" />
            <Text className="text-regret-DEFAULT font-bold text-sm">로그아웃</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
