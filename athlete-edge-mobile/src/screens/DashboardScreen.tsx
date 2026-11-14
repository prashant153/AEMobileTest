import { View, StyleSheet } from 'react-native';
import { Text, Button, Chip } from 'react-native-paper';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SearchBar } from '../components/SearchBar';
import { StatCard } from '../components/StatCard';
import { SessionCard } from '../components/SessionCard';
import { PerformanceChart } from '../components/PerformanceChart';
import { palette } from '../theme/colors';
import { sessions, performanceKPIs, performanceTrend } from '../data/mockData';

export const DashboardScreen = () => {
  const upcomingSessions = sessions.filter((session) => session.status === 'scheduled').slice(0, 2);

  return (
    <ScreenWrapper>
      <View style={styles.headerRow}>
        <View>
          <Text variant="headlineMedium" style={styles.headline}>
            Welcome back, Coach!
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Track progress and manage your performance ecosystem.
          </Text>
        </View>
        <Button mode="contained" onPress={() => {}} style={styles.addButton}>
          New Session
        </Button>
      </View>

      <SearchBar placeholder="Search across athletes, coaches, academies..." />

      <View style={styles.kpiGrid}>
        {performanceKPIs.map((kpi, index) => (
          <StatCard
            key={kpi.id}
            label={kpi.label}
            value={`${kpi.value}${kpi.suffix ?? ''}`}
            caption={index === 0 ? 'Across all academies' : undefined}
            trend={kpi.change * (kpi.changeDirection === 'up' ? 1 : -1)}
            variant={index % 2 === 0 ? 'primary' : 'accent'}
          />
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text variant="titleLarge">Quick Actions</Text>
        <Chip icon="lightning-bolt" textStyle={styles.chipText} style={styles.chip}>
          Smart suggestions
        </Chip>
      </View>
      <View style={styles.quickActions}>
        {quickActionItems.map((item) => (
          <View key={item.label} style={styles.quickActionCard}>
            <View style={[styles.quickIconContainer, { backgroundColor: item.color }]}> 
              <Text style={styles.quickIcon}>{item.icon}</Text>
            </View>
            <Text variant="titleMedium" style={styles.quickLabel}>
              {item.label}
            </Text>
            <Text variant="bodySmall" style={styles.quickDescription}>
              {item.description}
            </Text>
            <Button mode="text" onPress={() => {}} compact style={styles.quickButton}>
              {item.cta}
            </Button>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text variant="titleLarge">Upcoming Sessions</Text>
        <Button mode="text" onPress={() => {}} compact>
          View all
        </Button>
      </View>
      <View style={styles.sessionList}>
        {upcomingSessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </View>

      <PerformanceChart data={performanceTrend} />
    </ScreenWrapper>
  );
};

const quickActionItems = [
  {
    label: 'Review attendance insights',
    description: 'Identify batches with declining attendance rate.',
    cta: 'Open attendance',
    color: 'rgba(54, 87, 255, 0.12)',
    icon: '📊',
  },
  {
    label: 'Assign new training plan',
    description: 'Match athletes to a coach based on readiness data.',
    cta: 'Create plan',
    color: 'rgba(255, 140, 66, 0.12)',
    icon: '🧠',
  },
  {
    label: 'Evaluate coach load',
    description: 'Balance workload across your coaching staff.',
    cta: 'View coaches',
    color: 'rgba(74, 222, 222, 0.12)',
    icon: '🧑‍🏫',
  },
];

const styles = StyleSheet.create({
  headerRow: {
    gap: 16,
  },
  headline: {
    color: palette.neutral900,
  },
  subtitle: {
    color: '#475569',
  },
  addButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    borderRadius: 12,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chip: {
    backgroundColor: 'rgba(54, 87, 255, 0.08)',
  },
  chipText: {
    color: palette.primary,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickActionCard: {
    flexBasis: '48%',
    backgroundColor: palette.white,
    borderRadius: 24,
    padding: 18,
    gap: 12,
    elevation: 1,
  },
  quickIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIcon: {
    fontSize: 24,
  },
  quickLabel: {
    color: palette.neutral900,
  },
  quickDescription: {
    color: palette.neutral500,
  },
  quickButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  sessionList: {
    gap: 16,
  },
});

