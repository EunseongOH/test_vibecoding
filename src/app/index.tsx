import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function LoadingIndex() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <ActivityIndicator size="large" color="#2cba85" />
    </View>
  );
}
