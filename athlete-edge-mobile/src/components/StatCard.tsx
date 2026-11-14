import { ColorValue, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { palette } from '../theme/colors';

interface StatCardProps {
  label: string;
  value: string;
  caption?: string;
  trend?: number;
  variant?: 'primary' | 'success' | 'warning' | 'accent';
}

const gradientMap = {
  primary: ['#3657FF', '#5D7BFF'],
  success: ['#2ECC71', '#4ADE80'],
  warning: ['#F6C667', '#F59E0B'],
  accent: ['#4ADEDE', '#22D3EE'],
} as const satisfies Record<string, readonly [ColorValue, ColorValue]>;

export const StatCard = ({ label, value, caption, trend, variant = 'primary' }: StatCardProps) => {
  const theme = useTheme();
  const trendColor = trend && trend >= 0 ? palette.success : palette.danger;
  const trendPrefix = trend && trend > 0 ? '+' : '';

  return (
    <LinearGradient
      colors={gradientMap[variant]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text variant="labelMedium" style={[styles.label, { color: palette.white, opacity: 0.8 }]}> 
        {label}
      </Text>
      <Text variant="headlineLarge" style={[styles.value, { color: palette.white }]}>{value}</Text>
      {caption ? (
        <Text variant="bodyMedium" style={[styles.caption, { color: palette.white, opacity: 0.9 }]}> 
          {caption}
        </Text>
      ) : null}
      {trend !== undefined ? (
        <View style={styles.trendRow}>
          <View
            style={[
              styles.trendBadge,
              { backgroundColor: palette.white, borderColor: 'rgba(255,255,255,0.35)' },
            ]}
          >
            <Text variant="labelMedium" style={{ color: trendColor }}>
              {trendPrefix}
              {trend}%
            </Text>
          </View>
          <Text variant="bodySmall" style={{ color: 'rgba(255,255,255,0.7)' }}>
            vs last month
          </Text>
        </View>
      ) : null}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    gap: 12,
    elevation: 4,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    fontSize: 36,
  },
  caption: {
    letterSpacing: 0.3,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trendBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
});

