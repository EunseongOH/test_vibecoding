import React from 'react';
import { View, Text } from 'react-native';

interface ReportChartProps {
  satisfiedCount: number;
  regretCount: number;
  categoryData: { category: string; amount: number; percentage: number }[];
}

export default function ReportChart({ satisfiedCount, regretCount, categoryData }: ReportChartProps) {
  const total = satisfiedCount + regretCount;
  const satisfiedPct = total > 0 ? Math.round((satisfiedCount / total) * 100) : 50;
  const regretPct = total > 0 ? Math.round((regretCount / total) * 100) : 50;

  return (
    <View className="w-full space-y-6">
      
      {/* Satisfied vs Regret Bar */}
      <View>
        <Text className="text-sm font-bold text-gray-500 mb-3 ml-1">소비 만족도 비율</Text>
        
        {total > 0 ? (
          <View className="w-full">
            {/* Stacked bar */}
            <View className="h-6 w-full bg-gray-100 rounded-full overflow-hidden flex-row">
              {satisfiedPct > 0 && (
                <View style={{ width: `${satisfiedPct}%` }} className="h-full bg-satisfied-DEFAULT" />
              )}
              {regretPct > 0 && (
                <View style={{ width: `${regretPct}%` }} className="h-full bg-regret-DEFAULT" />
              )}
            </View>
            
            {/* Legend with percentages */}
            <View className="flex-row justify-between mt-2.5 px-1">
              <View className="flex-row items-center space-x-1.5">
                <View className="w-3 h-3 rounded-full bg-satisfied-DEFAULT" />
                <Text className="text-xs font-bold text-gray-600">만족 소비 {satisfiedPct}%</Text>
              </View>
              <View className="flex-row items-center space-x-1.5">
                <View className="w-3 h-3 rounded-full bg-regret-DEFAULT" />
                <Text className="text-xs font-bold text-gray-600">후회 소비 {regretPct}%</Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="h-16 w-full rounded-2xl bg-gray-50 items-center justify-center border border-gray-100">
            <Text className="text-xs font-bold text-gray-400">데이터가 더 쌓이면 비율이 측정됩니다.</Text>
          </View>
        )}
      </View>

      {/* Category Progress Bars */}
      <View className="mt-4">
        <Text className="text-sm font-bold text-gray-500 mb-3 ml-1">지출이 가장 큰 카테고리</Text>
        
        {categoryData.length > 0 ? (
          <View className="space-y-4">
            {categoryData.slice(0, 3).map((item, index) => (
              <View key={item.category || index} className="w-full">
                <View className="flex-row justify-between items-center mb-1.5">
                  <Text className="text-sm font-bold text-gray-700">{item.category}</Text>
                  <Text className="text-xs font-bold text-gray-500">
                    {item.amount.toLocaleString()}원 ({Math.round(item.percentage)}%)
                  </Text>
                </View>
                <View className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <View
                    style={{ width: `${item.percentage}%` }}
                    className="h-full bg-primary-400 rounded-full"
                  />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="h-16 w-full rounded-2xl bg-gray-50 items-center justify-center border border-gray-100">
            <Text className="text-xs font-bold text-gray-400">카테고리별 지출 통계가 없습니다.</Text>
          </View>
        )}
      </View>

    </View>
  );
}
