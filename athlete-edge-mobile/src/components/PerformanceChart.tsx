import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { PerformanceTrendPoint } from '../types';
import { palette } from '../theme/colors';

const chartWidth = Dimensions.get('window').width - 48;

interface PerformanceChartProps {
  data: PerformanceTrendPoint[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  const theme = useTheme();
  const labels = data.map((point) => point.month);
  const attendanceSeries = data.map((point) => point.attendance);
  const readinessSeries = data.map((point) => point.readiness);

  const chartConfig = {
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    color: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
    labelColor: () => '#475569',
    decimalPlaces: 0,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: theme.colors.surface,
    },
    propsForBackgroundLines: {
      strokeDasharray: '4 4',
      stroke: '#E2E8F0',
    },
  } as const;

  const chartData = {
    labels,
    datasets: [
      {
        data: attendanceSeries,
        color: () => palette.primary,
        strokeWidth: 3,
      },
      {
        data: readinessSeries,
        color: () => palette.secondary,
        strokeWidth: 3,
      },
    ],
    legend: ['Attendance', 'Readiness'],
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}> 
      <Text variant="titleMedium" style={styles.title}>
        Performance Trend
      </Text>
      <LineChart
        data={chartData}
        width={chartWidth}
        height={240}
        chartConfig={chartConfig}
        formatYLabel={(value) => `${parseInt(value, 10)}%`}
        bezier
        withDots
        withShadow={false}
        style={styles.chart}
        segments={4}
        fromZero
      />
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: palette.primary }]} />
          <Text variant="labelMedium">Attendance</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: palette.secondary }]} />
          <Text variant="labelMedium">Readiness</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    gap: 16,
    elevation: 1,
  },
  title: {
    marginBottom: 4,
  },
  chart: {
    borderRadius: 16,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
});

