import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventData, EventSummary } from '../types/Event';
import { v4 as uuidv4 } from 'uuid';

const EVENTS_STORAGE_KEY = '@PowerGuard:events';

export const addEvent = async (event: Omit<EventData, 'id' | 'date'>): Promise<EventData> => {
  try {
    const newEvent: EventData = {
      ...event,
      id: uuidv4(),
      date: new Date().toISOString(),
    };
    
    const existingEvents = await getAllEvents();
    const updatedEvents = [...existingEvents, newEvent];
    
    await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    return newEvent;
  } catch (error) {
    console.error('Error adding event:', error);
    throw new Error('Failed to save event data');
  }
};

export const getAllEvents = async (): Promise<EventData[]> => {
  try {
    const eventsJson = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    return eventsJson ? JSON.parse(eventsJson) : [];
  } catch (error) {
    console.error('Error retrieving events:', error);
    return [];
  }
};

export const getEvent = async (id: string): Promise<EventData | null> => {
  try {
    const events = await getAllEvents();
    return events.find(event => event.id === id) || null;
  } catch (error) {
    console.error('Error getting event:', error);
    return null;
  }
};

export const updateEvent = async (updatedEvent: EventData): Promise<void> => {
  try {
    const events = await getAllEvents();
    const updatedEvents = events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    
    await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error('Failed to update event data');
  }
};

export const removeEvent = async (id: string): Promise<void> => {
  try {
    const events = await getAllEvents();
    const filteredEvents = events.filter(event => event.id !== id);
    
    await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(filteredEvents));
  } catch (error) {
    console.error('Error removing event:', error);
    throw new Error('Failed to remove event');
  }
};

export const getEventSummary = async (): Promise<EventSummary> => {
  try {
    const events = await getAllEvents();
    
    if (events.length === 0) {
      return {
        totalEvents: 0,
        resolvedEvents: 0,
        averageDuration: 0,
        mostAffectedLocation: '',
        latestEventDate: '',
      };
    }

    // Calculate total and resolved events
    const totalEvents = events.length;
    const resolvedEvents = events.filter(e => e.resolved).length;
    
    // Calculate average duration for resolved events
    const resolvedEventsWithDuration = events.filter(e => e.resolved && e.actualDuration);
    const totalDuration = resolvedEventsWithDuration.reduce(
      (sum, event) => sum + (event.actualDuration || 0), 
      0
    );
    const averageDuration = resolvedEventsWithDuration.length > 0 
      ? totalDuration / resolvedEventsWithDuration.length 
      : 0;
    
    // Find most affected location
    const locationCounts: Record<string, number> = {};
    events.forEach(event => {
      locationCounts[event.location] = (locationCounts[event.location] || 0) + 1;
    });
    
    let mostAffectedLocation = '';
    let highestCount = 0;
    
    Object.entries(locationCounts).forEach(([location, count]) => {
      if (count > highestCount) {
        mostAffectedLocation = location;
        highestCount = count;
      }
    });
    
    // Get latest event date
    const latestEvent = events.reduce((latest, current) => 
      new Date(latest.date) > new Date(current.date) ? latest : current
    );
    
    return {
      totalEvents,
      resolvedEvents,
      averageDuration,
      mostAffectedLocation,
      latestEventDate: latestEvent.date,
    };
  } catch (error) {
    console.error('Error generating summary:', error);
    return {
      totalEvents: 0,
      resolvedEvents: 0,
      averageDuration: 0,
      mostAffectedLocation: '',
      latestEventDate: '',
    };
  }
};