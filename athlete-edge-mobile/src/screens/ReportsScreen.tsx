import { StyleSheet, View } from 'react-native';
import { Text, Chip, DataTable } from 'react-native-paper';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { PerformanceChart } from '../components/PerformanceChart';
import { performanceTrend, performanceKPIs } from '../data/mockData';
import { palette } from '../theme/colors';

export const ReportsScreen = () => {
  const topMetrics = performanceKPIs.slice(0, 3);

  return (
    <ScreenWrapper>
      <View style={styles.headerRow}>
        <Text variant="headlineSmall" style={styles.headline}>
          Reports & Analytics
        </Text>
        <Chip icon="download" onPress={() => {}}>
          Export PDF
        </Chip>
      </View>

      <PerformanceChart data={performanceTrend} />

      <View style={styles.metricRow}>
        {topMetrics.map((metric) => (
          <View key={metric.id} style={styles.metricCard}>
            <Text variant="labelMedium" style={styles.metricLabel}>
              {metric.label}
            </Text>
            <Text variant="headlineSmall" style={styles.metricValue}>
              {metric.value}
              {metric.suffix ?? ''}
            </Text>
            <Text variant="bodySmall" style={styles.metricFootnote}>
              {metric.changeDirection === 'up' ? '+' : '-'}
              {metric.change}% vs last cycle
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.tableCard}>
        <Text variant="titleMedium" style={styles.tableTitle}>
          Engagement summary
        </Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Month</DataTable.Title>
            <DataTable.Title numeric>Attendance</DataTable.Title>
            <DataTable.Title numeric>Readiness</DataTable.Title>
            <DataTable.Title numeric>Sessions</DataTable.Title>
          </DataTable.Header>
          {performanceTrend.map((point) => (
            <DataTable.Row key={point.month}>
              <DataTable.Cell>{point.month}</DataTable.Cell>
              <DataTable.Cell numeric>{point.attendance}%</DataTable.Cell>
              <DataTable.Cell numeric>{point.readiness}%</DataTable.Cell>
              <DataTable.Cell numeric>{point.sessions}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headline: {
    color: palette.neutral900,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricCard: {
    flexBasis: '30%',
    minWidth: 140,
    backgroundColor: palette.white,
    borderRadius: 20,
    padding: 16,
    gap: 8,
  },
  metricLabel: {
    color: palette.neutral500,
  },
  metricValue: {
    color: palette.neutral900,
  },
  metricFootnote: {
    color: palette.neutral500,
  },
  tableCard: {
    backgroundColor: palette.white,
    borderRadius: 24,
    padding: 16,
    elevation: 1,
  },
  tableTitle: {
    marginBottom: 12,
    color: palette.neutral900,
  },
});

