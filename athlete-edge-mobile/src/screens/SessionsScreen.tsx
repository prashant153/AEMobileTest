import { StyleSheet, View } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SessionCard } from '../components/SessionCard';
import { sessions } from '../data/mockData';
import { palette } from '../theme/colors';

export const SessionsScreen = () => {
  return (
    <ScreenWrapper>
      <View style={styles.headerRow}>
        <Text variant="headlineSmall" style={styles.headline}>
          Session Management
        </Text>
        <Chip icon="calendar-plus" onPress={() => {}}>
          Schedule
        </Chip>
      </View>

      <View style={styles.filters}>
        <Chip selected icon="calendar">
          Upcoming
        </Chip>
        <Chip icon="history">Completed</Chip>
        <Chip icon="alert">At risk</Chip>
      </View>

      <View style={styles.list}>
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
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
  filters: {
    flexDirection: 'row',
    gap: 12,
  },
  list: {
    gap: 16,
  },
});

