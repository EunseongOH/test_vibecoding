import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { ChevronLeft } from 'lucide-react-native';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const { signUp, isLoading } = useAppStore();
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password || !nickname) {
      Alert.alert('알림', '모든 정보를 입력해주세요.');
      return;
    }

    try {
      await signUp(email, password, nickname);
      Alert.alert(
        '가입 완료', 
        '회원가입이 완료되었습니다! 가입한 계정으로 로그인해 주세요.',
        [{ text: '확인', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (error: any) {
      Alert.alert('회원가입 실패', error.message || '가입 정보를 다시 한 번 확인해 주세요.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Bar */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <ChevronLeft size={22} color="#4b5563" />
        </TouchableOpacity>
        <Text className="text-base font-bold text-gray-800 ml-2">회원가입</Text>
      </View>

      {/* Outer Safety Padding */}
      <View className="flex-1 px-5 py-4 justify-center">
        <View className="items-center mb-5">
          <Text className="text-xl font-black text-gray-800 tracking-tight">SWIFIN에 오신 걸 환영해요!</Text>
          <Text className="text-gray-450 mt-1 text-xs font-semibold">건전하고 유쾌한 소비 습관을 함께 만들어요.</Text>
        </View>

        {/* Input Card */}
        <View className="bg-gray-50 p-5 rounded-[28px] border border-gray-100/60 shadow-sm mb-5">
          <Text className="text-xs font-bold text-gray-500 mb-1.5 ml-1">닉네임</Text>
          <TextInput
            placeholder="어떻게 불러드릴까요?"
            value={nickname}
            onChangeText={setNickname}
            className="w-full bg-white px-3.5 py-3 rounded-2xl border border-gray-200 text-sm text-gray-800 mb-3.5 font-medium"
          />

          <Text className="text-xs font-bold text-gray-500 mb-1.5 ml-1">이메일 주소</Text>
          <TextInput
            placeholder="example@swifin.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="w-full bg-white px-3.5 py-3 rounded-2xl border border-gray-200 text-sm text-gray-800 mb-3.5 font-medium"
          />

          <Text className="text-xs font-bold text-gray-500 mb-1.5 ml-1">비밀번호</Text>
          <TextInput
            placeholder="6자리 이상 비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            className="w-full bg-white px-3.5 py-3 rounded-2xl border border-gray-200 text-sm text-gray-800 font-medium"
          />
        </View>

        {/* Button */}
        <TouchableOpacity
          onPress={handleSignup}
          disabled={isLoading}
          activeOpacity={0.9}
          className="w-full bg-primary-500 py-3.5 rounded-2xl flex-row justify-center items-center shadow-md shadow-primary-200"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">가입 완료하기</Text>
          )}
        </TouchableOpacity>

        {/* Security assurance */}
        <Text className="text-[10px] text-gray-400 text-center mt-6">
          🔒 내 소비 데이터는 본인만 볼 수 있어요. 개인정보는 안전하게 보호돼요.
        </Text>
      </View>
    </SafeAreaView>
  );
}
