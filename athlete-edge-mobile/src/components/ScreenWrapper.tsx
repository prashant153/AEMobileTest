import { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

interface ScreenWrapperProps {
  children: ReactNode;
  withScroll?: boolean;
  padded?: boolean;
}

export const ScreenWrapper = ({ children, withScroll = true, padded = true }: ScreenWrapperProps) => {
  const theme = useTheme();

  if (withScroll) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}> 
        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.scrollContent, padded && styles.scrollPadded]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.container, padded && styles.padded]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    gap: 24,
  },
  scrollPadded: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
  },
  padded: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
  },
});

