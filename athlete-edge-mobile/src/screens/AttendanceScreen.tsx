import { StyleSheet, View } from 'react-native';
import { Text, Chip, ProgressBar } from 'react-native-paper';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { attendanceRecords, sessions } from '../data/mockData';
import { palette } from '../theme/colors';

export const AttendanceScreen = () => {
  return (
    <ScreenWrapper>
      <View style={styles.headerRow}>
        <Text variant="headlineSmall" style={styles.headline}>
          Attendance Management
        </Text>
        <Chip icon="file-chart" onPress={() => {}}>
          Export report
        </Chip>
      </View>

      <View style={styles.list}>
        {attendanceRecords.map((record) => {
          const session = sessions.find((item) => item.id === record.sessionId);
          const attendanceRate = record.present / record.totalAthletes;
          return (
            <View key={record.id} style={styles.card}>
              <Text variant="titleMedium" style={styles.title}>
                {session?.title ?? 'Session'}
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                {record.date} • {session?.startTime} - {session?.endTime}
              </Text>
              <View style={styles.metaRow}>
                <Chip compact icon="account-group" style={styles.metaChip}>
                  {record.present}/{record.totalAthletes} present
                </Chip>
                <Chip compact icon="clock" style={styles.metaChip}>
                  {record.late} late
                </Chip>
                <Chip compact icon="check-circle" style={styles.metaChip}>
                  {record.excused} excused
                </Chip>
              </View>
              <ProgressBar progress={attendanceRate} color={palette.success} style={styles.progress} />
              <Text variant="bodySmall" style={styles.footnote}>
                Attendance rate {(attendanceRate * 100).toFixed(0)}%
              </Text>
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
  title: {
    color: palette.neutral900,
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
  progress: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
  },
  footnote: {
    color: palette.neutral500,
  },
});

