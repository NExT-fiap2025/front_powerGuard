import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import Header from '../src/components/Header';
import Input from '../src/components/Input';
import EventCard from '../src/components/EventCard';
import { getAllEvents } from '../src/storage/eventsStorage';
import { EventData } from '../src/types/Event';
import { useRouter } from 'expo-router';

export default function LocationScreen() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const isFocused = useIsFocused();
  const router = useRouter();
  
  useEffect(() => {
    if (isFocused) {
      loadEvents();
    }
  }, [isFocused]);
  
  const loadEvents = async () => {
    const eventsData = await getAllEvents();
    setEvents(eventsData);
    
    // Extract unique locations
    const uniqueLocations = Array.from(
      new Set(eventsData.map(event => event.location))
    );
    setLocations(uniqueLocations);
    
    // Initialize with all events
    setFilteredEvents(eventsData);
  };
  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
      return;
    }
    
    const filtered = events.filter(event => 
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  const handleEventPress = (eventId: string) => {
    router.push({ pathname: '/event/[id]', params: { id: eventId } });
  };
  
  return (
    <View style={styles.container}>
      <Header title="Affected Locations" />
      
      <View style={styles.content}>
        <Animated.View entering={FadeInUp.duration(400)}>
          <Input
            label="Search Locations"
            placeholder="Enter neighborhood, city, or ZIP code..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerStyle={styles.searchContainer}
          />
        </Animated.View>
        
        {locations.length > 0 ? (
          <>
            <Animated.View 
              style={styles.statsContainer}
              entering={FadeInUp.duration(400).delay(100)}
            >
              <Text style={styles.statsTitle}>Location Statistics</Text>
              <View style={styles.statsGrid}>
                {locations.slice(0, 6).map((location, index) => {
                  const count = events.filter(e => e.location === location).length;
                  return (
                    <View key={index} style={styles.statCard}>
                      <Text style={styles.statLocation} numberOfLines={1}>
                        {location}
                      </Text>
                      <Text style={styles.statCount}>{count} {count === 1 ? 'event' : 'events'}</Text>
                    </View>
                  );
                })}
              </View>
            </Animated.View>
            
            <Animated.View entering={FadeInUp.duration(400).delay(200)}>
              <Text style={styles.sectionTitle}>
                {filteredEvents.length} Power Outage {filteredEvents.length === 1 ? 'Event' : 'Events'}
                {searchQuery ? ` for "${searchQuery}"` : ''}
              </Text>
            </Animated.View>
            
            <FlatList
              data={filteredEvents}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <Animated.View entering={FadeInUp.duration(400).delay(300 + index * 50)}>
                  <EventCard event={item} onPress={handleEventPress} />
                </Animated.View>
              )}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No events found for this location.
                </Text>
              }
            />
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Locations Recorded</Text>
            <Text style={styles.emptyText}>
              Start by recording a power outage to track affected locations.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  statLocation: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  statCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#60A5FA',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});