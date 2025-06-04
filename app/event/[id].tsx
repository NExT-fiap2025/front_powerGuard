import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { format } from 'date-fns';

import Header from '../../src/components/Header';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import { getEvent, updateEvent } from '../../src/storage/eventsStorage';
import { EventData } from '../../src/types/Event';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [actualDuration, setActualDuration] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      if (typeof id !== 'string') {
        router.back();
        return;
      }
      
      setLoading(true);
      const eventData = await getEvent(id);
      
      if (!eventData) {
        Alert.alert('Error', 'Event not found');
        router.back();
        return;
      }
      
      setEvent(eventData);
      if (eventData.actualDuration) {
        setActualDuration(eventData.actualDuration.toString());
      }
      setLoading(false);
    };
    
    loadEvent();
  }, [id, router]);

  const handleResolve = async () => {
    if (!event) return;
    
    if (!actualDuration.trim()) {
      setError('Please enter the actual outage duration');
      return;
    }

    const durationValue = Number(actualDuration);
    if (isNaN(durationValue) || durationValue <= 0) {
      setError('Please enter a valid duration');
      return;
    }
    
    setUpdating(true);
    
    try {
      const updatedEvent = {
        ...event,
        resolved: true,
        actualDuration: durationValue,
      };
      
      await updateEvent(updatedEvent);
      Alert.alert('Success', 'Power outage event has been marked as resolved');
      setEvent(updatedEvent);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update the event. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !event) {
    return (
      <View style={styles.container}>
        <Header title="Event Details" showBackButton />
        <View style={styles.loadingContainer}>
          <Text>Loading event details...</Text>
        </View>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
  };

  return (
    <View style={styles.container}>
      <Header title="Event Details" showBackButton />
      
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInUp.duration(400)}>
          <View style={styles.header}>
            <Text style={styles.title}>Power Outage Event</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: event.resolved ? '#10B981' : '#F97316' }
            ]}>
              <Text style={styles.statusText}>
                {event.resolved ? 'Resolved' : 'Active'}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>{event.location}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reported On:</Text>
              <Text style={styles.detailValue}>{formatDate(event.date)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Est. Duration:</Text>
              <Text style={styles.detailValue}>
                {event.estimatedDuration} hours
              </Text>
            </View>
            
            {event.resolved && event.actualDuration && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Actual Duration:</Text>
                <Text style={styles.detailValue}>
                  {event.actualDuration} hours
                </Text>
              </View>
            )}
            
            {event.damages && (
              <View style={styles.damageSection}>
                <Text style={styles.detailLabel}>Reported Damages:</Text>
                <Text style={styles.damageText}>{event.damages}</Text>
              </View>
            )}
            
            {event.causes && event.causes.length > 0 && (
              <>
                <Text style={styles.detailLabel}>Probable Causes:</Text>
                <View style={styles.causesContainer}>
                  {event.causes.map((cause, index) => (
                    <View key={index} style={styles.causeBadge}>
                      <Text style={styles.causeText}>{cause}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </Animated.View>
        
        {!event.resolved && (
          <Animated.View 
            style={styles.resolveContainer}
            entering={FadeInUp.duration(400).delay(200)}
          >
            <Text style={styles.resolveTitle}>Mark Outage as Resolved</Text>
            
            <Input
              label="Actual Duration (hours)"
              placeholder="e.g., 2.5"
              keyboardType="decimal-pad"
              value={actualDuration}
              onChangeText={(text) => {
                setActualDuration(text);
                setError('');
              }}
              error={error}
              required
            />
            
            <Button
              title="Mark as Resolved"
              onPress={handleResolve}
              loading={updating}
              fullWidth
            />
          </Animated.View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    width: 120,
  },
  detailValue: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  damageSection: {
    marginTop: 8,
    marginBottom: 12,
  },
  damageText: {
    fontSize: 16,
    color: '#1F2937',
    marginTop: 8,
    lineHeight: 22,
  },
  causesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  causeBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  causeText: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '500',
  },
  resolveContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  resolveTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 16,
  },
});