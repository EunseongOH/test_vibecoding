import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sparkles, PlusCircle, BarChart3, Trophy, User } from 'lucide-react-native';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  // Expand height to accommodate text labels + icon without clipping
  const bottomBarHeight = Platform.select({
    ios: 72 + insets.bottom,
    android: 68,
    default: 68,
  });

  const bottomBarPadding = Platform.select({
    ios: insets.bottom + 2,
    android: 8,
    default: 8,
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2cba85', // Mint Active color
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          height: bottomBarHeight,
          paddingBottom: bottomBarPadding,
          paddingTop: 8,
          backgroundColor: '#ffffff',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '다이어리',
          tabBarIcon: ({ color }) => <Sparkles size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: '소비 등록',
          tabBarIcon: ({ color }) => <PlusCircle size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: '소비 분석',
          tabBarIcon: ({ color }) => <BarChart3 size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="challenge"
        options={{
          title: '챌린지',
          tabBarIcon: ({ color }) => <Trophy size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: '마이',
          tabBarIcon: ({ color }) => <User size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
