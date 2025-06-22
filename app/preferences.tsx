import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Preferences() {
  const router = useRouter();
  
  // Preference states
  const [contactSources, setContactSources] = useState<string[]>([]);
  const [notificationFrequency, setNotificationFrequency] = useState<string>('');
  const [aiStartersEnabled, setAiStartersEnabled] = useState<boolean>(true);
  const [dataStorageOption, setDataStorageOption] = useState<string>('metadata');

  const contactSourceOptions = [
    { id: 'Outlook / Microsoft 365', label: 'Email', icon: 'mail-outline' },
    { id: 'Phone Contacts (iOS / Android)', label: 'Phone Contacts', icon: 'call-outline' },
    { id: 'social', label: 'Social Media', icon: 'globe-outline' },
    { id: 'iCloud / Google Contacts (via OAuth)', label: 'Synced Contacts', icon: 'cloud-outline' },
    { id: 'Import CSV (1-time upload)', label: 'Import CSV', icon: 'document-text-outline' },
  ];

  const frequencyOptions = [
    { id: 'daily', label: 'Daily' },
    { id: 'every_two_days', label: 'Every 3 days' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'biweekly', label: 'Every 2 weeks' },
    { id: 'monthly', label: 'Monthly' },
  ];

  const toggleContactSource = (sourceId: string) => {
    setContactSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleSave = () => {
    // Simulate saving preferences (but not actually saving)
    console.log('Preferences saved:', {
      contactSources,
      notificationFrequency,
      aiStartersEnabled,
      dataStorageOption,
    });
    
    // Navigate to the main app
    // For new accounts, always go to home
    // For existing users, go back if possible
    if(router.canGoBack()){
        router.back();
    } else {
        router.replace('/(tabs)/home');
    }
  };

  return (
    <>
    <Stack.Screen options={{ 
        headerTitle: 'Preferences',
        headerBackTitle: 'Settings'
        }} />
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
        <Text style={styles.pageTitle}>Set Your Preferences</Text>
      <Text style={styles.sectionSubtitle}>
        Customize your experience to stay connected with your contacts
      </Text>

      {/* Contact Sources Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Sources</Text>
        <Text style={styles.sectionDescription}>
          Where should we look for your contacts?
        </Text>
        <View style={styles.optionsContainer}>
          {contactSourceOptions.map((source) => (
            <TouchableOpacity
              key={source.id}
              style={[
                styles.optionCard,
                contactSources.includes(source.id) && styles.selectedOption,
              ]}
              onPress={() => toggleContactSource(source.id)}
            >
              <View style={styles.optionContent}>
                <Ionicons 
                  name={source.icon as any} 
                  size={24} 
                  color={contactSources.includes(source.id) ? '#6A9FD1' : '#666'} 
                />
                <Text style={[
                  styles.optionLabel,
                  contactSources.includes(source.id) && styles.selectedOptionLabel,
                ]}>
                  {source.label}
                </Text>
              </View>
              {contactSources.includes(source.id) && (
                <Ionicons name="checkmark-circle" size={24} color="#6A9FD1" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notification Frequency Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How often should we nudge you?</Text>
        <View style={styles.optionsContainer}>
          {frequencyOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                notificationFrequency === option.id && styles.selectedOption,
              ]}
              onPress={() => setNotificationFrequency(option.id)}
            >
              <View style={styles.optionContent}>
                <Ionicons 
                  name="notifications-outline" 
                  size={24} 
                  color={notificationFrequency === option.id ? '#6A9FD1' : '#666'} 
                />
                <Text style={[
                  styles.optionLabel,
                  notificationFrequency === option.id && styles.selectedOptionLabel,
                ]}>
                  {option.label}
                </Text>
              </View>
              {notificationFrequency === option.id && (
                <Ionicons name="checkmark-circle" size={24} color="#6A9FD1" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* AI Conversation Starters Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Conversation Starters</Text>
        <View style={styles.switchCard}>
          <View style={styles.switchContent}>
            <Ionicons name="bulb-outline" size={24} color="#666" />
            <Text style={styles.switchLabel}>Enable AI suggestions</Text>
          </View>
          <Switch
            value={aiStartersEnabled}
            onValueChange={setAiStartersEnabled}
            trackColor={{ false: '#e0e0e0', true: '#6A9FD1' }}
            thumbColor={aiStartersEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Data Storage Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Storage</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              dataStorageOption === 'metadata' && styles.selectedOption,
            ]}
            onPress={() => setDataStorageOption('metadata')}
          >
            <View style={styles.optionContent}>
              <Ionicons 
                name="shield-checkmark-outline" 
                size={24} 
                color={dataStorageOption === 'metadata' ? '#6A9FD1' : '#666'} 
              />
              <Text style={[
                styles.optionLabel,
                dataStorageOption === 'metadata' && styles.selectedOptionLabel,
              ]}>
                Only metadata (dates, subject lines)
              </Text>
            </View>
            {dataStorageOption === 'metadata' && (
              <Ionicons name="checkmark-circle" size={24} color="#6A9FD1" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionCard,
              dataStorageOption === 'full' && styles.selectedOption,
            ]}
            onPress={() => setDataStorageOption('full')}
          >
            <View style={styles.optionContent}>
              <Ionicons 
                name="document-text-outline" 
                size={24} 
                color={dataStorageOption === 'full' ? '#6A9FD1' : '#666'} 
              />
              <Text style={[
                styles.optionLabel,
                dataStorageOption === 'full' && styles.selectedOptionLabel,
              ]}>
                Full message bodies (opt-in)
              </Text>
            </View>
            {dataStorageOption === 'full' && (
              <Ionicons name="checkmark-circle" size={24} color="#6A9FD1" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Preferences</Text>
          <Ionicons name="checkmark" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#f5f5f5',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    paddingTop: 70,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  optionsContainer: {
    gap: 10,
  },
  optionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedOption: {
    borderColor: '#6A9FD1',
    borderWidth: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  selectedOptionLabel: {
    color: '#6A9FD1',
    fontWeight: '600',
  },
  switchCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  switchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    paddingBottom: 50,
  },
  saveButton: {
    backgroundColor: '#6A9FD1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
}); 