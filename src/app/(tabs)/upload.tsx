import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAppStore } from '../../store/useAppStore';
import { processReceiptImage } from '../../services/ocr';
import { supabase, isDemoMode } from '../../services/supabase';
import { Sparkles, Upload, X } from 'lucide-react-native';

export default function UploadScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingText, setLoadingText] = useState('소비 카드를 만들고 있어요');
  const [loadingSub, setLoadingSub] = useState('결제내역에서 시간, 장소, 금액을 읽고 있어요.');
  const { addExpense, session } = useAppStore();
  const router = useRouter();

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '결제 캡처 내역을 가져오기 위해 앨범 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!imageUri) return;

    setIsProcessing(true);
    setLoadingText('이미지를 안전하게 업로드하고 있어요');
    setLoadingSub('개인정보와 소비 데이터는 암호화되어 보호돼요.');

    try {
      const userId = session?.user?.id || 'demo-user';
      let imageUrl = '';

      if (isDemoMode) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        imageUrl = 'https://demo-storage-url.com/mock-receipt.jpg';
      } else {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const fileExt = imageUri.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { data, error } = await supabase.storage
          .from('expenses')
          .upload(filePath, blob, {
            contentType: `image/${fileExt === 'png' ? 'png' : 'jpeg'}`,
          });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('expenses')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      setLoadingText('소비 카드를 만들고 있어요');
      setLoadingSub('결제내역에서 시간, 장소, 금액을 읽고 있어요.');
      const ocrResult = await processReceiptImage(imageUri);

      await addExpense(
        ocrResult.storeName,
        ocrResult.amount,
        ocrResult.category,
        imageUrl,
        ocrResult.purchasedAt
      );

      setIsProcessing(false);
      setImageUri(null);
      
      Alert.alert(
        '소비 카드가 만들어졌어요 🎉', 
        '잘못 읽은 정보가 있다면 언제든 상세 수정 화면에서 수정할 수 있어요.',
        [{ text: '소비 카드 확인하기', onPress: () => router.push('/(tabs)') }]
      );

    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      Alert.alert('내역을 읽지 못했어요', '이미지가 흐리거나 결제 정보가 잘 보이지 않을 수 있어요. 더 선명한 캡처를 다시 올려주세요.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Outer Safety Padding */}
      <View className="flex-1 px-5 py-4 justify-between">
        
        {/* Title - SWIFIN UX Writing Rules */}
        <View className="mb-2">
          <Text className="text-[10px] font-bold text-primary-500 tracking-wider">SWIFIN UPLOAD</Text>
          <Text className="text-xl font-black text-gray-800 mt-0.5">결제내역 캡처를 올려주세요</Text>
          <Text className="text-xs text-gray-400 mt-1 font-medium leading-normal">
            SWIFIN이 시간, 장소, 금액을 읽어 소비 카드로 정리해드려요. 결제내역은 소비 분석을 위해서만 안전하게 사용돼요.
          </Text>
        </View>

        {/* Upload Container */}
        <View className="flex-1 justify-center py-2 max-h-[60%]">
          {imageUri ? (
            <View className="w-full aspect-[4/3] max-h-[300px] rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative mx-auto">
              <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
              <TouchableOpacity
                onPress={() => setImageUri(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 items-center justify-center"
              >
                <X size={16} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handlePickImage}
              activeOpacity={0.7}
              className="w-full aspect-[4/3] max-h-[300px] rounded-3xl border-2 border-dashed border-primary-200 bg-primary-50/20 items-center justify-center mx-auto"
            >
              <View className="w-12 h-12 rounded-2xl bg-primary-100 items-center justify-center mb-3">
                <Upload size={22} color="#2cba85" />
              </View>
              <Text className="text-sm font-bold text-gray-650">직접 적지 않아도 괜찮아요</Text>
              <Text className="text-[10px] text-gray-450 mt-1">이곳을 눌러 결제 정보가 잘 보이는 이미지를 올려주세요</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Action Button - SWIFIN UX Writing Rules */}
        <View className="w-full pt-2">
          <TouchableOpacity
            onPress={handleUploadAndAnalyze}
            disabled={!imageUri || isProcessing}
            activeOpacity={0.9}
            className={`w-full py-3.5 rounded-2xl flex-row justify-center items-center shadow-md ${
              imageUri ? 'bg-primary-500 shadow-primary-200' : 'bg-gray-200 shadow-none'
            }`}
          >
            <Sparkles size={18} color="white" className="mr-1.5" />
            <Text className="text-white font-bold text-base">소비 카드 만들기</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Overlay */}
      {isProcessing && (
        <View className="absolute inset-0 bg-black/60 items-center justify-center px-6 z-50">
          <View className="bg-white p-6 rounded-3xl items-center w-full max-w-xs shadow-xl">
            <ActivityIndicator size="large" color="#2cba85" className="mb-3" />
            <Text className="text-sm font-bold text-gray-800 text-center">{loadingText}</Text>
            <Text className="text-[10px] text-gray-450 mt-1.5 text-center">{loadingSub}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
