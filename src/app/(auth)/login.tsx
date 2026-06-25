import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Wallet } from 'lucide-react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithGoogle, isLoading } = useAppStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('알림', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('로그인 실패', error.message || '이메일 혹은 비밀번호를 확인해주세요.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('로그인 실패', error.message || 'Google 로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Outer Safety Padding */}
      <View className="flex-1 px-5 py-4 justify-center">
        
        {/* Header/Logo */}
        <View className="items-center mb-8">
          <View className="w-14 h-14 rounded-2xl bg-primary-100 items-center justify-center mb-3">
            <Wallet size={28} color="#2cba85" />
          </View>
          <Text className="text-2xl font-black text-gray-800 tracking-tight">SWIFIN</Text>
          <Text className="text-gray-400 mt-1 text-xs font-semibold">나를 위한 따뜻한 소비 절제 다이어리</Text>
        </View>

        {/* Card Form container */}
        <View className="bg-gray-50 p-5 rounded-[28px] border border-gray-100/60 shadow-sm mb-5">
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
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            className="w-full bg-white px-3.5 py-3 rounded-2xl border border-gray-200 text-sm text-gray-800 font-medium"
          />
        </View>

        {/* Buttons */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.9}
          className="w-full bg-primary-500 py-3.5 rounded-2xl flex-row justify-center items-center shadow-md shadow-primary-200 mb-3"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">로그인</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center my-3.5">
          <View className="flex-1 h-[1px] bg-gray-150" />
          <Text className="text-gray-400 text-[10px] font-bold mx-3">또는</Text>
          <View className="flex-1 h-[1px] bg-gray-150" />
        </View>

        {/* Google Login Button */}
        <TouchableOpacity
          onPress={handleGoogleLogin}
          disabled={isLoading}
          activeOpacity={0.85}
          className="w-full bg-white border border-gray-200 py-3.5 rounded-2xl flex-row justify-center items-center shadow-sm mb-4"
        >
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.png' }} 
            className="w-4 h-4 mr-2"
            resizeMode="contain"
          />
          <Text className="text-gray-700 font-bold text-sm">Google로 계속하기</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mt-1">
          <Text className="text-gray-450 text-xs">아직 회원이 아니신가요? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text className="text-primary-500 font-bold text-xs underline">회원가입</Text>
          </TouchableOpacity>
        </View>

        {/* Security assurance */}
        <Text className="text-[10px] text-gray-400 text-center mt-6">
          🔒 내 소비 데이터는 본인만 볼 수 있어요. 안전하게 보관돼요.
        </Text>
      </View>
    </SafeAreaView>
  );
}
