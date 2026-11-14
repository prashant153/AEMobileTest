import { StyleSheet, View } from 'react-native';
import { Text, Badge, TouchableRipple, useTheme } from 'react-native-paper';
import { TrainingSession } from '../types';
import { palette } from '../theme/colors';
import { format } from 'date-fns';

interface SessionCardProps {
  session: TrainingSession;
  onPress?: (session: TrainingSession) => void;
}

const statusColor = {
  scheduled: palette.accent,
  completed: palette.success,
  cancelled: palette.danger,
};

export const SessionCard = ({ session, onPress }: SessionCardProps) => {
  const theme = useTheme();

  const dateLabel = format(new Date(session.date), 'MMM dd, yyyy');

  return (
    <TouchableRipple style={styles.touchable} onPress={() => onPress?.(session)}>
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}> 
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
            {session.title}
          </Text>
          <Badge style={[styles.badge, { backgroundColor: statusColor[session.status] }]}>
            {session.status}
          </Badge>
        </View>
        <View style={styles.row}>
          <Text variant="labelMedium" style={styles.label}>
            {dateLabel} • {session.startTime} - {session.endTime}
          </Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.tag}>
            <Text variant="bodySmall" style={styles.tagText}>
              Focus: {session.focus}
            </Text>
          </View>
          <View style={styles.tag}>
            <Text variant="bodySmall" style={styles.tagText}>
              Intensity: {session.intensity.toUpperCase()}
            </Text>
          </View>
          <View style={styles.attendance}>
            <Text variant="labelMedium" style={{ color: palette.primary }}>
              {session.attendanceRate}% attendance
            </Text>
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 24,
  },
  container: {
    borderRadius: 24,
    padding: 20,
    gap: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    textTransform: 'capitalize',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: '#475569',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tag: {
    backgroundColor: '#EEF2FF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    color: palette.primary,
    letterSpacing: 0.2,
  },
  attendance: {
    marginLeft: 'auto',
    justifyContent: 'center',
  },
});

