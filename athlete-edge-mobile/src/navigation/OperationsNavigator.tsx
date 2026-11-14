import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';
import { AcademiesScreen } from '../screens/AcademiesScreen';
import { SessionsScreen } from '../screens/SessionsScreen';
import { BatchesScreen } from '../screens/BatchesScreen';
import { AttendanceScreen } from '../screens/AttendanceScreen';

export type OperationsTabParamList = {
  Academies: undefined;
  Sessions: undefined;
  Batches: undefined;
  Attendance: undefined;
};

const TopTab = createMaterialTopTabNavigator<OperationsTabParamList>();

export const OperationsNavigator = () => {
  const theme = useTheme();

  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
          height: 4,
          borderRadius: 999,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          textTransform: 'none',
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceDisabled,
      }}
    >
      <TopTab.Screen name="Academies" component={AcademiesScreen} />
      <TopTab.Screen name="Sessions" component={SessionsScreen} />
      <TopTab.Screen name="Batches" component={BatchesScreen} />
      <TopTab.Screen name="Attendance" component={AttendanceScreen} />
    </TopTab.Navigator>
  );
};

