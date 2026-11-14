import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}

export const SegmentedControl = <T extends string>({ options, value, onChange }: SegmentedControlProps<T>) => {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <TouchableRipple
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segment, selected && styles.segmentActive]}
            borderless
          >
            <View>
              <Text variant="labelLarge" style={[styles.label, selected && styles.labelActive]}>
                {option.label}
              </Text>
            </View>
          </TouchableRipple>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    padding: 6,
    borderRadius: 999,
    gap: 6,
  },
  segment: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  label: {
    color: '#64748B',
  },
  labelActive: {
    color: '#1E293B',
  },
});

