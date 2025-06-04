import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { PlusCircle } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import Header from '../src/components/Header';
import EventCard from '../src/components/EventCard';
import SummaryCard from '../src/components/SummaryCard';
import Button from '../src/components/Button';
import { getAllEvents, getEventSummary } from '../src/storage/eventsStorage';
import { EventData, EventSummary } from '../src/types/Event';

export default function OverviewScreen() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [summary, setSummary] = useState<EventSummary>({
    totalEvents: 0,
    resolvedEvents: 0,
    averageDuration: 0,
    mostAffectedLocation: '',
    latestEventDate: '',
  });
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const router = useRouter();

  const loadData = useCallback(async () => {
    const eventsData = await getAllEvents();
    const summaryData = await getEventSummary();
    
    // Sort by date descending (newest first)
    eventsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setEvents(eventsData);
    setSummary(summaryData);
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused, loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleEventPress = (eventId: string) => {
    router.push({ pathname: '/event/[id]', params: { id: eventId } });
  };

  const renderEmptyState = () => (
    <Animated.View 
      style={styles.emptyContainer}
      entering={FadeInUp.duration(500).delay(300)}
    >
      <PlusCircle color="#60A5FA" size={64} />
      <Text style={styles.emptyTitle}>No Power Outages Recorded</Text>
      <Text style={styles.emptyText}>
        Start by adding your first power outage event to track outages in your area
      </Text>
      <Button
        title="Add New Outage"
        onPress={() => router.push('/add-event')}
        style={{ marginTop: 24 }}
      />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="PowerGuard" 
        showAddButton={events.length > 0}
        onAddPress={() => router.push('/add-event')}
      />
      
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.duration(400).delay(index * 100)}>
            <EventCard event={item} onPress={handleEventPress} />
          </Animated.View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <Animated.View entering={FadeInUp.duration(400)}>
              <SummaryCard summary={summary} />
            </Animated.View>
            
            {events.length > 0 && (
              <Animated.View entering={FadeInUp.duration(400).delay(200)}>
                <View style={styles.recentHeader}>
                  <Text style={styles.recentTitle}>Recent Outage Events</Text>
                  <TouchableOpacity onPress={() => router.push('/add-event')}>
                    <PlusCircle color="#60A5FA" size={24} />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
          </View>
        )}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerContainer: {
    padding: 16,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E3A8A',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
});