import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Flashlight,
  Battery,
  Smartphone,
  ThermometerSnowflake,
  Droplet,
  ShieldAlert,
  HeartPulse,
  Info,
} from 'lucide-react-native';

import Header from '../src/components/Header';

const SAFETY_TIPS = [
  {
    id: '1',
    title: 'Before an Outage',
    icon: <ShieldAlert color="#60A5FA" size={24} />,
    tips: [
      'Create an emergency kit with flashlights, batteries, and first aid supplies',
      'Keep a supply of non-perishable food and bottled water',
      'Maintain a list of emergency contacts and important phone numbers',
      'Consider purchasing a backup power generator if you live in a high-risk area',
      'Sign up for emergency alerts from your local utility company',
    ],
  },
  {
    id: '2',
    title: 'During an Outage',
    icon: <Flashlight color="#60A5FA" size={24} />,
    tips: [
      'Use flashlights instead of candles to reduce fire risk',
      'Keep refrigerator and freezer doors closed to maintain temperature',
      'Unplug sensitive electronics to protect from power surges when electricity returns',
      'Use power banks to keep essential devices charged',
      'Stay informed about restoration efforts through battery-powered radios or mobile devices',
    ],
  },
  {
    id: '3',
    title: 'Protecting Electronics',
    icon: <Battery color="#60A5FA" size={24} />,
    tips: [
      'Use surge protectors for valuable electronics',
      'Turn off and unplug sensitive equipment',
      'Consider using a UPS (Uninterruptible Power Supply) for computers',
      'Keep battery packs fully charged when severe weather is forecast',
      'Back up important data regularly to cloud storage',
    ],
  },
  {
    id: '4',
    title: 'Communication',
    icon: <Smartphone color="#60A5FA" size={24} />,
    tips: [
      "Keep at least one corded phone that doesn't require electricity",
      'Conserve mobile phone battery by reducing screen brightness',
      'Use text messages instead of calls (they use less battery and bandwidth)',
      'Consider a hand-crank or solar charger for emergency use',
      'Keep car chargers available for mobile devices',
    ],
  },
  {
    id: '5',
    title: 'Food Safety',
    icon: <ThermometerSnowflake color="#60A5FA" size={24} />,
    tips: [
      'Keep refrigerator doors closed (food stays cold for about 4 hours)',
      'Freezers maintain temperature for about 48 hours if full and unopened',
      'Use a food thermometer to check items - discard anything above 40°F (4°C)',
      'Have coolers and ice ready to preserve important items',
      'Consume perishable items first before they spoil',
    ],
  },
  {
    id: '6',
    title: 'Water Safety',
    icon: <Droplet color="#60A5FA" size={24} />,
    tips: [
      'Store at least one gallon of water per person per day for several days',
      'If water supply is affected, use bottled water for drinking and cooking',
      'Know how to manually operate well pumps if applicable',
      'Fill bathtubs before a major storm for non-potable water reserves',
      'Have water purification tablets or filters available',
    ],
  },
  {
    id: '7',
    title: 'Medical Needs',
    icon: <HeartPulse color="#60A5FA" size={24} />,
    tips: [
      'Keep a backup supply of critical medications',
      'Have a plan for medical devices that require electricity',
      'Know the location of nearest medical facilities with backup power',
      'Consider registering with utility companies if you have critical medical equipment',
      'Maintain an up-to-date list of medications and medical contacts',
    ],
  },
  {
    id: '8',
    title: 'Important Contacts',
    icon: <Info color="#60A5FA" size={24} />,
    tips: [
      'Local Utility Emergency: Check your utility company website',
      'Emergency Services: 911',
      'FEMA: 1-800-621-3362',
      'American Red Cross: 1-800-733-2767',
      'National Weather Service: weather.gov',
    ],
  },
];

export default function TipsScreen() {
  return (
    <View style={styles.container}>
      <Header title="Safety Tips" />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={styles.introContainer}
          entering={FadeInUp.duration(400)}
        >
          <Text style={styles.introTitle}>Power Outage Safety</Text>
          <Text style={styles.introText}>
            Being prepared for power outages during natural disasters can help
            keep you and your family safe. Review these important safety tips
            and best practices.
          </Text>
        </Animated.View>

        {SAFETY_TIPS.map((section, index) => (
          <Animated.View
            key={section.id}
            style={styles.tipCard}
            entering={FadeInUp.duration(400).delay(100 * (index + 1))}
          >
            <View style={styles.tipHeader}>
              {section.icon}
              <Text style={styles.tipTitle}>{section.title}</Text>
            </View>

            <View style={styles.tipList}>
              {section.tips.map((tip, tipIndex) => (
                <View key={tipIndex} style={styles.tipItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        ))}

        <Animated.View
          style={styles.disclaimerContainer}
          entering={FadeInUp.duration(400).delay(900)}
        >
          <Text style={styles.disclaimerText}>
            These tips are provided as general guidance. Always follow
            instructions from local authorities and emergency services during an
            emergency situation.
          </Text>
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
  introContainer: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  introText: {
    fontSize: 16,
    color: '#E5E7EB',
    lineHeight: 22,
  },
  tipCard: {
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
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
    marginLeft: 12,
  },
  tipList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#60A5FA',
    marginTop: 8,
    marginRight: 8,
  },
  tipText: {
    fontSize: 15,
    color: '#4B5563',
    flex: 1,
    lineHeight: 22,
  },
  disclaimerContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
