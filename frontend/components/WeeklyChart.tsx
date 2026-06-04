import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, G, Line } from 'react-native-svg';
import { DayStat } from '../types';
import { ColorScheme } from '../utils/theme';

interface WeeklyChartProps {
  data: DayStat[];
  colors: ColorScheme;
  height?: number;
}

export default function WeeklyChart({ data, colors, height = 120 }: WeeklyChartProps) {
  const chartWidth = 300;
  const chartHeight = height;
  const barWidth = 30;
  const gap = (chartWidth - barWidth * data.length) / (data.length + 1);
  const maxCal = Math.max(...data.map(d => d.calories), 100);

  return (
    <View testID="weekly-chart">
      <Svg width="100%" height={chartHeight + 30} viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}>
        <G>
          {data.map((stat, index) => {
            const barHeight = stat.calories > 0 ? Math.max((stat.calories / maxCal) * chartHeight * 0.85, 4) : 4;
            const x = gap + index * (barWidth + gap);
            const y = chartHeight - barHeight;
            const isToday = stat.day === 'Today';

            return (
              <G key={stat.day}>
                {/* Background bar */}
                <Rect
                  x={x}
                  y={0}
                  width={barWidth}
                  height={chartHeight}
                  rx={8}
                  fill={colors.ringBg}
                />
                {/* Active bar */}
                {stat.calories > 0 && (
                  <Rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={8}
                    fill={isToday ? colors.primary : colors.accent}
                    opacity={isToday ? 1 : 0.7}
                  />
                )}
              </G>
            );
          })}
        </G>
      </Svg>
      {/* Day labels */}
      <View style={styles.labels}>
        {data.map((stat) => (
          <Text
            key={stat.day}
            style={[
              styles.dayLabel,
              {
                color: stat.day === 'Today' ? colors.primary : colors.textSecondary,
                fontWeight: stat.day === 'Today' ? '700' : '400',
              },
            ]}
          >
            {stat.day === 'Today' ? 'Now' : stat.day.slice(0, 3)}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    marginTop: -8,
  },
  dayLabel: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
});
