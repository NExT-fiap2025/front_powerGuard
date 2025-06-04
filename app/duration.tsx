import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

import Header from '../src/components/Header';
import EventCard from '../src/components/EventCard';
import { getAllEvents } from '../src/storage/eventsStorage';
import { EventData } from '../src/types/Event';

export default function DurationScreen() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [averageDuration, setAverageDuration] = useState(0);
  const [longestOutage, setLongestOutage] = useState<EventData | null>(null);
  const isFocused = useIsFocused();
  const router = useRouter();

  const loadEvents = useCallback(async () => {
    const eventsData = await getAllEvents();
    setEvents(eventsData);
    
    // Calculate average duration for resolved events
    const resolvedEvents = eventsData.filter(
      e => e.resolved && e.actualDuration !== null
    );
    
    if (resolvedEvents.length > 0) {
      const totalDuration = resolvedEvents.reduce(
        (sum, event) => sum + (event.actualDuration || 0), 
        0
      );
      setAverageDuration(totalDuration / resolvedEvents.length);
      
      // Find longest outage
      const longest = resolvedEvents.reduce(
        (max, event) => (!max || (event.actualDuration || 0) > (max.actualDuration || 0)) ? event : max,
        null as EventData | null
      );
      setLongestOutage(longest);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadEvents();
    }
  }, [isFocused, loadEvents]);

  const handleEventPress = (eventId: string) => {
    router.push({ pathname: '/event/[id]', params: { id: eventId } });
  };
  
  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const getDurationCategory = (event: EventData) => {
    const duration = event.resolved && event.actualDuration ? event.actualDuration : event.estimatedDuration;
    if (duration < 2) return 'Short';
    if (duration < 8) return 'Medium';
    return 'Long';
  };

  // Group events by duration category
  const shortEvents = events.filter(e => getDurationCategory(e) === 'Short');
  const mediumEvents = events.filter(e => getDurationCategory(e) === 'Medium');
  const longEvents = events.filter(e => getDurationCategory(e) === 'Long');

  return (
    <View style={styles.container}>
      <Header title="Outage Duration" />
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {events.length > 0 ? (
          <>
            <Animated.View 
              style={styles.statsContainer}
              entering={FadeInUp.duration(400)}
            >
              <Text style={styles.statsTitle}>Duration Statistics</Text>
              
              <View style={styles.statRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {averageDuration > 0 ? formatDuration(averageDuration) : 'N/A'}
                  </Text>
                  <Text style={styles.statLabel}>Average Duration</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {longestOutage ? formatDuration(longestOutage.actualDuration || 0) : 'N/A'}
                  </Text>
                  <Text style={styles.statLabel}>Longest Outage</Text>
                </View>
              </View>
              
              <View style={styles.durationBarContainer}>
                <Text style={styles.durationBarLabel}>Duration Distribution:</Text>
                <View style={styles.durationBar}>
                  <View 
                    style={[
                      styles.durationSegment, 
                      { 
                        backgroundColor: '#60A5FA',
                        flex: Math.max(0.1, shortEvents.length / Math.max(1, events.length))
                      }
                    ]}
                  />
                  <View 
                    style={[
                      styles.durationSegment, 
                      { 
                        backgroundColor: '#FBBF24',
                        flex: Math.max(0.1, mediumEvents.length / Math.max(1, events.length))
                      }
                    ]}
                  />
                  <View 
                    style={[
                      styles.durationSegment, 
                      { 
                        backgroundColor: '#F87171',
                        flex: Math.max(0.1, longEvents.length / Math.max(1, events.length))
                      }
                    ]}
                  />
                </View>
                <View style={styles.durationLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#60A5FA' }]} />
                    <Text style={styles.legendText}>Short (0-2h)</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#FBBF24' }]} />
                    <Text style={styles.legendText}>Medium (2-8h)</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#F87171' }]} />
                    <Text style={styles.legendText}>Long (8h+)</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
            
            {shortEvents.length > 0 && (
              <Animated.View entering={FadeInUp.duration(400).delay(100)}>
                <Text style={styles.sectionTitle}>Short Outages (0-2 hours)</Text>
                {shortEvents.map((event, index) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onPress={handleEventPress} 
                  />
                ))}
              </Animated.View>
            )}
            
            {mediumEvents.length > 0 && (
              <Animated.View entering={FadeInUp.duration(400).delay(200)}>
                <Text style={styles.sectionTitle}>Medium Outages (2-8 hours)</Text>
                {mediumEvents.map((event, index) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onPress={handleEventPress} 
                  />
                ))}
              </Animated.View>
            )}
            
            {longEvents.length > 0 && (
              <Animated.View entering={FadeInUp.duration(400).delay(300)}>
                <Text style={styles.sectionTitle}>Long Outages (8+ hours)</Text>
                {longEvents.map((event, index) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onPress={handleEventPress} 
                  />
                ))}
              </Animated.View>
            )}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Duration Data Available</Text>
            <Text style={styles.emptyText}>
              Start by recording power outages to track their duration.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
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
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#4B5563',
  },
  durationBarContainer: {
    marginTop: 8,
  },
  durationBarLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  durationBar: {
    height: 16,
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  durationSegment: {
    height: '100%',
  },
  durationLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#4B5563',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 8,
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 48,
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