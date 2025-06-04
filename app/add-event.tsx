import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

import Header from '../src/components/Header';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import { addEvent } from '../src/storage/eventsStorage';
import { EventData } from '../src/types/Event';

const NATURAL_CAUSES = [
  'Heavy Rain',
  'Thunderstorm',
  'Hurricane',
  'Tornado',
  'Flooding',
  'Landslide',
  'Strong Wind',
  'Snow/Ice',
  'Extreme Heat',
  'Earthquake',
];

export default function AddEventScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    estimatedDuration: '',
    causes: [] as string[],
    damages: '',
  });
  const [errors, setErrors] = useState({
    location: '',
    estimatedDuration: '',
  });

  const validateForm = () => {
    const newErrors = {
      location: '',
      estimatedDuration: '',
    };
    let isValid = true;

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
      isValid = false;
    }

    if (!formData.estimatedDuration.trim()) {
      newErrors.estimatedDuration = 'Estimated duration is required';
      isValid = false;
    } else if (isNaN(Number(formData.estimatedDuration)) || Number(formData.estimatedDuration) <= 0) {
      newErrors.estimatedDuration = 'Please enter a valid duration';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const newEvent: Omit<EventData, 'id' | 'date'> = {
        location: formData.location,
        estimatedDuration: Number(formData.estimatedDuration),
        actualDuration: null,
        damages: formData.damages,
        resolved: false,
        causes: formData.causes,
      };
      
      await addEvent(newEvent);
      Alert.alert('Success', 'Power outage event has been recorded successfully');
      router.push('/overview');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save the event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCause = (cause: string) => {
    setFormData(prev => {
      if (prev.causes.includes(cause)) {
        return {
          ...prev,
          causes: prev.causes.filter(c => c !== cause)
        };
      } else {
        return {
          ...prev,
          causes: [...prev.causes, cause]
        };
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Record Power Outage" showBackButton />
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={styles.formSection}
          entering={FadeInUp.duration(400)}
        >
          <Text style={styles.sectionTitle}>Event Details</Text>
          
          <Input
            label="Affected Location"
            placeholder="Neighborhood, City, or ZIP Code"
            value={formData.location}
            onChangeText={text => setFormData({...formData, location: text})}
            error={errors.location}
            required
          />
          
          <Input
            label="Estimated Duration (hours)"
            placeholder="e.g., 2.5"
            keyboardType="decimal-pad"
            value={formData.estimatedDuration}
            onChangeText={text => setFormData({...formData, estimatedDuration: text})}
            error={errors.estimatedDuration}
            required
          />
          
          <Input
            label="Caused Damages"
            placeholder="Describe any damages or affected infrastructure..."
            multiline
            numberOfLines={4}
            value={formData.damages}
            onChangeText={text => setFormData({...formData, damages: text})}
          />
        </Animated.View>
        
        <Animated.View 
          style={styles.formSection}
          entering={FadeInUp.duration(400).delay(200)}
        >
          <Text style={styles.sectionTitle}>Probable Causes</Text>
          <Text style={styles.sectionDescription}>
            Select all natural events that contributed to the outage:
          </Text>
          
          <View style={styles.causesContainer}>
            {NATURAL_CAUSES.map((cause) => (
              <Button
                key={cause}
                title={cause}
                variant={formData.causes.includes(cause) ? 'primary' : 'outline'}
                onPress={() => toggleCause(cause)}
                style={styles.causeButton}
              />
            ))}
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInUp.duration(400).delay(300)}>
          <Button
            title="Save Power Outage Event"
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            style={styles.submitButton}
          />
        </Animated.View>
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
  formSection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
  },
  causesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  causeButton: {
    marginRight: 8,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  submitButton: {
    marginTop: 16,
  },
});