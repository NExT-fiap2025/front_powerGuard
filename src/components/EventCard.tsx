import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { format } from 'date-fns';
import { EventData } from '../types/Event';
import { Calendar, Clock, MapPin, AlertTriangle } from 'lucide-react-native';

interface EventCardProps {
  event: EventData;
  onPress: (eventId: string) => void;
}

export default function EventCard({ event, onPress }: EventCardProps) {
  const formattedDate = format(new Date(event.date), 'MMM dd, yyyy');
  
  const getDurationText = () => {
    if (event.resolved && event.actualDuration) {
      const hours = Math.floor(event.actualDuration);
      const minutes = Math.round((event.actualDuration - hours) * 60);
      return `${hours}h ${minutes}m (actual)`;
    } else {
      const hours = Math.floor(event.estimatedDuration);
      const minutes = Math.round((event.estimatedDuration - hours) * 60);
      return `${hours}h ${minutes}m (est.)`;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(event.id)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.date}>{formattedDate}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: event.resolved ? '#10B981' : '#F97316' }
        ]}>
          <Text style={styles.statusText}>
            {event.resolved ? 'Resolved' : 'Active'}
          </Text>
        </View>
      </View>
      
      <View style={styles.detailRow}>
        <MapPin color="#60A5FA" size={18} />
        <Text style={styles.detailText}>{event.location}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Clock color="#60A5FA" size={18} />
        <Text style={styles.detailText}>{getDurationText()}</Text>
      </View>
      
      {event.damages && (
        <View style={styles.detailRow}>
          <AlertTriangle color="#F97316" size={18} />
          <Text style={styles.detailText} numberOfLines={2}>
            {event.damages}
          </Text>
        </View>
      )}
      
      {event.causes && event.causes.length > 0 && (
        <View style={styles.causesContainer}>
          {event.causes.map((cause, index) => (
            <View key={index} style={styles.causeBadge}>
              <Text style={styles.causeText}>{cause}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  causesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  causeBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  causeText: {
    color: '#1E3A8A',
    fontSize: 12,
    fontWeight: '500',
  },
});