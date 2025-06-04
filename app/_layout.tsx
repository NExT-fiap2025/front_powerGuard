import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { MapPin, Clock, AlertCircle, BookOpen } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
  useFrameworkReady();

  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E5E7EB',
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#1E3A8A',
          tabBarInactiveTintColor: '#6B7280',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tabs.Screen
          name="overview"
          options={{
            title: 'Overview',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="flash-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="location"
          options={{
            title: 'Location',
            tabBarIcon: ({ color, size }) => (
              <MapPin color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="duration"
          options={{
            title: 'Duration',
            tabBarIcon: ({ color, size }) => (
              <Clock color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="damages"
          options={{
            title: 'Damages',
            tabBarIcon: ({ color, size }) => (
              <AlertCircle color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="tips"
          options={{
            title: 'Safety Tips',
            tabBarIcon: ({ color, size }) => (
              <BookOpen color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
