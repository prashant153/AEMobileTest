import { ReactNode } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';

interface EntityListItemProps {
  title: string;
  subtitle?: string;
  meta?: string;
  avatar?: string;
  trailing?: ReactNode;
  onPress?: () => void;
}

export const EntityListItem = ({ title, subtitle, meta, avatar, trailing, onPress }: EntityListItemProps) => {
  const theme = useTheme();

  return (
    <TouchableRipple onPress={onPress} borderless style={{ borderRadius: 20 }}>
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}> 
        {avatar ? <Image source={{ uri: avatar }} style={styles.avatar} /> : null}
        <View style={styles.content}>
          <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="bodyMedium" style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
          {meta ? (
            <Text variant="bodySmall" style={styles.meta} numberOfLines={1}>
              {meta}
            </Text>
          ) : null}
        </View>
        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    gap: 16,
    elevation: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: 2,
  },
  subtitle: {
    color: '#475569',
  },
  meta: {
    color: '#94A3B8',
    marginTop: 4,
  },
  trailing: {
    marginLeft: 12,
  },
});

