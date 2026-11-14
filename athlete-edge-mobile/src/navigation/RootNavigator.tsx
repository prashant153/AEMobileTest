import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AthletesScreen } from '../screens/AthletesScreen';
import { CoachesScreen } from '../screens/CoachesScreen';
import { OperationsNavigator } from './OperationsNavigator';
import { ReportsScreen } from '../screens/ReportsScreen';

export type RootTabParamList = {
  Dashboard: undefined;
  Athletes: undefined;
  Coaches: undefined;
  Operations: undefined;
  Reports: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const CustomNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

export const RootNavigator = () => {
  const theme = useTheme();

  return (
    <NavigationContainer theme={CustomNavigationTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurfaceDisabled,
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 4,
            height: 72,
            paddingTop: 8,
            paddingBottom: 16,
            backgroundColor: theme.colors.surface,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarIcon: ({ color, size }) => {
            const iconMap: Record<keyof RootTabParamList, keyof typeof MaterialCommunityIcons.glyphMap> = {
              Dashboard: 'view-dashboard-outline',
              Athletes: 'account-group-outline',
              Coaches: 'account-tie-outline',
              Operations: 'cog-outline',
              Reports: 'chart-line',
            };
            const iconName = iconMap[route.name as keyof RootTabParamList];
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Athletes" component={AthletesScreen} />
        <Tab.Screen name="Coaches" component={CoachesScreen} />
        <Tab.Screen name="Operations" component={OperationsNavigator} />
        <Tab.Screen name="Reports" component={ReportsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

