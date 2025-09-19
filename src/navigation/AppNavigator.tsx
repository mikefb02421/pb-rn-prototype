import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {RootStackParamList, MainTabParamList} from '../services/types';
import SearchScreen from '../screens/SearchScreen';
import GalleryScreen from '../screens/GalleryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ImageViewerScreen from '../screens/ImageViewerScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'Search':
              iconName = 'search';
              break;
            case 'Gallery':
              iconName = 'photo-library';
              break;
            case 'Favorites':
              iconName = 'favorite';
              break;
            default:
              iconName = 'circle';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
      })}>
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{title: 'Search'}}
      />
      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{title: 'Gallery'}}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{title: 'Favorites'}}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="ImageViewer"
        component={ImageViewerScreen}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;