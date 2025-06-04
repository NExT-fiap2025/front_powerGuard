import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

import Header from '../src/components/Header';
import { getAllEvents } from '../src/storage/eventsStorage';
import { EventData } from '../src/types/Event';
import { AlertTriangle } from 'lucide-react-native';

export default function DamagesScreen() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  const [filter, setFilter] = useState<'all' | 'damaged'>('all');
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
    applyFilter(filter, eventsData);
  };

  const applyFilter = (filterType: 'all' | 'damaged', eventsData: EventData[] = events) => {
    setFilter(filterType);
    if (filterType === 'all') {
      setFilteredEvents(eventsData);
    } else {
      setFilteredEvents(eventsData.filter(event => event.damages && event.damages.trim() !== ''));
    }
  };

  const handleEventPress = (eventId: string) => {
    router.push({ pathname: '/event/[id]', params: { id: eventId } });
  };

  const renderDamageItem = ({ item, index }: { item: EventData, index: number }) => (
    <Animated.View 
      style={styles.damageCard}
      entering={FadeInUp.duration(400).delay(100 + index * 50)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <AlertTriangle color="#F97316" size={20} />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.resolved ? '#10B981' : '#F97316' }
        ]}>
          <Text style={styles.statusText}>
            {item.resolved ? 'Resolved' : 'Active'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.damageTitle}>Reported Damages:</Text>
      <Text style={styles.damageDescription}>{item.damages}</Text>
      
      <TouchableOpacity 
        style={styles.viewButton}
        onPress={() => handleEventPress(item.id)}
      >
        <Text style={styles.viewButtonText}>View Full Details</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>
        No Damage Reports Found
      </Text>
      <Text style={styles.emptyText}>
        {filter === 'all' 
          ? 'Start by recording power outages to track their impacts.'
          : 'There are no events with reported damages yet.'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Damage Reports" />
      
      <Animated.View 
        style={styles.filterContainer}
        entering={FadeInUp.duration(400)}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && styles.activeFilter
          ]}
          onPress={() => applyFilter('all')}
        >
          <Text 
            style={[
              styles.filterText,
              filter === 'all' && styles.activeFilterText
            ]}
          >
            All Events ({events.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'damaged' && styles.activeFilter
          ]}
          onPress={() => applyFilter('damaged')}
        >
          <Text 
            style={[
              styles.filterText,
              filter === 'damaged' && styles.activeFilterText
            ]}
          >
            With Damages ({events.filter(e => e.damages && e.damages.trim() !== '').length})
          </Text>
        </TouchableOpacity>
      </Animated.View>
      
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderDamageItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
  },
  activeFilter: {
    backgroundColor: '#1E3A8A',
  },
  filterText: {
    color: '#4B5563',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  damageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  damageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  damageDescription: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 22,
  },
  viewButton: {
    marginTop: 16,
    paddingVertical: 8,
    alignSelf: 'flex-end',
  },
  viewButtonText: {
    color: '#60A5FA',
    fontWeight: '600',
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