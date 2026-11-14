import { StyleSheet, View } from 'react-native';
import { Text, Chip, ProgressBar } from 'react-native-paper';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { academies, coaches } from '../data/mockData';
import { palette } from '../theme/colors';

export const AcademiesScreen = () => {
  return (
    <ScreenWrapper>
      <View style={styles.headerRow}>
        <Text variant="headlineSmall" style={styles.headline}>
          Academy Management
        </Text>
        <Chip icon="city" onPress={() => {}}>
          New academy
        </Chip>
      </View>

      <View style={styles.grid}>
        {academies.map((academy) => {
          const headCoach = coaches.find((coach) => coach.id === academy.headCoachId);
          const occupancyRate = academy.occupancy / academy.capacity;
          return (
            <View key={academy.id} style={styles.card}>
              <Text variant="titleMedium" style={styles.title}>
                {academy.name}
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                {academy.location}
              </Text>
              <View style={styles.metaRow}>
                <Chip icon="account-tie-outline" compact style={styles.chip}>
                  {headCoach?.name ?? 'Unassigned'}
                </Chip>
              </View>
              <View style={styles.metaRow}>
                <Text variant="bodySmall" style={styles.metaLabel}>
                  Capacity
                </Text>
                <Text variant="bodySmall" style={styles.metaValue}>
                  {academy.occupancy}/{academy.capacity}
                </Text>
              </View>
              <ProgressBar progress={occupancyRate} color={palette.secondary} style={styles.progress} />
              <View style={styles.footerRow}>
                <Chip icon="trending-up" compact style={styles.performanceChip}>
                  {(occupancyRate * 100).toFixed(0)}% occupancy
                </Chip>
                <Chip icon="calendar" compact style={styles.performanceChip}>
                  12 sessions/week
                </Chip>
              </View>
            </View>
          );
        })}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    flexBasis: '48%',
    backgroundColor: palette.white,
    borderRadius: 24,
    padding: 18,
    gap: 12,
  },
  title: {
    color: palette.neutral900,
  },
  subtitle: {
    color: palette.neutral500,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    backgroundColor: 'rgba(54, 87, 255, 0.08)',
  },
  metaLabel: {
    color: palette.neutral500,
  },
  metaValue: {
    color: palette.neutral900,
    fontWeight: '600',
  },
  progress: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  performanceChip: {
    backgroundColor: '#F8FAFC',
  },
});

