import { StyleSheet, View } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { batches, coaches } from '../data/mockData';
import { palette } from '../theme/colors';

export const BatchesScreen = () => {
  return (
    <ScreenWrapper>
      <View style={styles.headerRow}>
        <Text variant="headlineSmall" style={styles.headline}>
          Batch Management
        </Text>
        <Chip icon="account-multiple-plus" onPress={() => {}}>
          Create batch
        </Chip>
      </View>

      <View style={styles.list}>
        {batches.map((batch) => {
          const coach = coaches.find((item) => item.id === batch.coachId);
          return (
            <View key={batch.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium" style={styles.title}>
                  {batch.name}
                </Text>
                <Chip compact style={styles.levelChip}>
                  {batch.level.toUpperCase()}
                </Chip>
              </View>
              <Text variant="bodyMedium" style={styles.subtitle}>
                {batch.sport} • {batch.schedule}
              </Text>
              <View style={styles.metaRow}>
                <Chip icon="account-group" compact style={styles.metaChip}>
                  {batch.size} athletes
                </Chip>
                <Chip icon="account-tie" compact style={styles.metaChip}>
                  {coach?.name ?? 'Unassigned'}
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
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: 24,
    padding: 18,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: palette.neutral900,
  },
  levelChip: {
    backgroundColor: 'rgba(54, 87, 255, 0.12)',
  },
  subtitle: {
    color: palette.neutral500,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaChip: {
    backgroundColor: '#F1F5F9',
  },
});

