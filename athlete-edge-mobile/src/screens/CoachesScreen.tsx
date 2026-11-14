import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Chip, ProgressBar } from 'react-native-paper';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SearchBar } from '../components/SearchBar';
import { EntityListItem } from '../components/EntityListItem';
import { StatCard } from '../components/StatCard';
import { coaches, sessions } from '../data/mockData';
import { palette } from '../theme/colors';

export const CoachesScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCoaches = useMemo(
    () =>
      coaches.filter((coach) =>
        coach.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm],
  );

  const averageRating = (
    filteredCoaches.reduce((sum, coach) => sum + coach.rating, 0) /
    Math.max(filteredCoaches.length, 1)
  ).toFixed(1);

  const totalSessions = sessions.filter((session) => session.status === 'scheduled').length;

  return (
    <ScreenWrapper>
      <View style={styles.headerRow}>
        <Text variant="headlineSmall" style={styles.headline}>
          Coach Management
        </Text>
        <Chip icon="account-tie" onPress={() => {}}>
          Assign coach
        </Chip>
      </View>

      <SearchBar placeholder="Search coaches" onChangeText={setSearchTerm} />

      <View style={styles.kpiRow}>
        <StatCard
          label="Active Coaches"
          value={`${filteredCoaches.length}`}
          caption="Available for assignment"
          trend={filteredCoaches.length > 5 ? 3 : -2}
        />
        <StatCard
          label="Avg Rating"
          value={averageRating}
          caption="Based on athlete feedback"
          trend={1}
          variant="accent"
        />
      </View>

      <Text variant="titleMedium" style={styles.listHeading}>
        Coaching roster
      </Text>

      <View style={styles.list}>
        {filteredCoaches.map((coach) => {
          const utilization = Math.min(coach.activeAthletes / 20, 1);
          return (
            <View key={coach.id} style={styles.coachCard}>
              <EntityListItem
                title={coach.name}
                subtitle={`${coach.specialization}`}
                meta={`Experience ${coach.experience} yrs • ${coach.activeAthletes} athletes`}
                avatar={coach.avatar}
                trailing={<Chip icon="star" compact>{coach.rating.toFixed(1)}</Chip>}
              />
              <View style={styles.utilizationRow}>
                <Text variant="bodySmall" style={styles.utilizationLabel}>
                  Workload balance
                </Text>
                <Text variant="bodySmall" style={styles.utilizationValue}>
                  {(utilization * 100).toFixed(0)}%
                </Text>
              </View>
              <ProgressBar progress={utilization} color={palette.primary} style={styles.progress} />
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
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  listHeading: {
    color: palette.neutral500,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  list: {
    gap: 16,
  },
  coachCard: {
    backgroundColor: palette.white,
    borderRadius: 24,
    padding: 16,
    gap: 12,
  },
  utilizationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  utilizationLabel: {
    color: palette.neutral500,
  },
  utilizationValue: {
    color: palette.primary,
    fontWeight: '600',
  },
  progress: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
  },
});

