import { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SearchBar } from '../components/SearchBar';
import { SegmentedControl } from '../components/SegmentedControl';
import { EntityListItem } from '../components/EntityListItem';
import { StatCard } from '../components/StatCard';
import { athletes } from '../data/mockData';
import { TrainingLevel } from '../types';
import { palette } from '../theme/colors';

const levelOptions: { label: string; value: TrainingLevel | 'all' }[] = [
  { label: 'All levels', value: 'all' },
  { label: 'Elite', value: 'elite' },
  { label: 'Advanced', value: 'advanced' },
  { label: 'Intermediate', value: 'intermediate' },
];

export const AthletesScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | TrainingLevel>('all');

  const filteredAthletes = useMemo(() => {
    return athletes.filter((athlete) => {
      const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevel === 'all' || athlete.level === selectedLevel;
      return matchesSearch && matchesLevel;
    });
  }, [searchTerm, selectedLevel]);

  const readinessAverage = Math.round(
    filteredAthletes.reduce((acc, athlete) => acc + athlete.readinessScore, 0) /
      Math.max(filteredAthletes.length, 1),
  );

  return (
    <ScreenWrapper>
      <View style={styles.headerRow}>
        <Text variant="headlineSmall" style={styles.headline}>
          Athlete Management
        </Text>
        <Chip icon="account-plus" onPress={() => {}}>
          Add athlete
        </Chip>
      </View>

      <SearchBar placeholder="Search athletes" onChangeText={setSearchTerm} />

      <SegmentedControl<'all' | TrainingLevel>
        options={levelOptions}
        value={selectedLevel}
        onChange={setSelectedLevel}
      />

      <View style={styles.kpiRow}>
        <StatCard
          label="Total Athletes"
          value={`${filteredAthletes.length}`}
          caption="Matching current filters"
          trend={4}
        />
        <StatCard
          label="Avg Readiness"
          value={`${readinessAverage}%`}
          caption="Health & performance"
          trend={2}
          variant="accent"
        />
      </View>

      <Text variant="titleMedium" style={styles.listHeading}>
        Roster overview
      </Text>

      <View style={styles.list}>
        {filteredAthletes.map((athlete) => (
          <EntityListItem
            key={athlete.id}
            title={athlete.name}
            subtitle={`${athlete.age} yrs • ${athlete.sport}`}
            meta={`Readiness ${athlete.readinessScore}% • ${athlete.level.toUpperCase()}`}
            avatar={athlete.avatar}
            trailing={<Chip compact icon="pulse" style={styles.trailingChip}>Daily</Chip>}
          />
        ))}
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
    gap: 16,
    flexWrap: 'wrap',
  },
  listHeading: {
    color: palette.neutral500,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  list: {
    gap: 12,
  },
  trailingChip: {
    backgroundColor: 'rgba(54, 87, 255, 0.1)',
  },
});

