import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { format } from 'date-fns';
import { EventSummary } from '../types/Event';
import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react-native';

interface SummaryCardProps {
  summary: EventSummary;
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  const formatDate = () => {
    if (!summary.latestEventDate) return 'No events recorded';
    return format(new Date(summary.latestEventDate), 'MMM dd, yyyy');
  };

  const formatDuration = () => {
    if (summary.averageDuration === 0) return 'N/A';
    const hours = Math.floor(summary.averageDuration);
    const minutes = Math.round((summary.averageDuration - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Power Outage Summary</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{summary.totalEvents}</Text>
          <Text style={styles.statLabel}>Total Events</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{summary.resolvedEvents}</Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatDuration()}</Text>
          <Text style={styles.statLabel}>Avg. Duration</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.detailSection}>
        <View style={styles.detailRow}>
          <MapPin color="#60A5FA" size={18} />
          <Text style={styles.detailLabel}>Most Affected:</Text>
          <Text style={styles.detailValue}>
            {summary.mostAffectedLocation || 'N/A'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Calendar color="#60A5FA" size={18} />
          <Text style={styles.detailLabel}>Latest Event:</Text>
          <Text style={styles.detailValue}>{formatDate()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  statLabel: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  detailSection: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
});