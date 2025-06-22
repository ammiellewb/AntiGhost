import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useMutation, useQuery } from 'convex/react';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getTopPriorityContacts } from '../../backend/getPriorityContacts';
import { api } from '../../convex/_generated/api';
import CustomPicker from '../components/CustomPicker';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingContact, setViewingContact] = useState<any>(null);
  
  const notes = useQuery(api.MaryContacts.getRecentNotes, { limit: 5 });
  const [newContactId, setNewContactId] = useState<any>('');
  const [newMessage, setNewMessage] = useState('');
  const [reminders, setReminders] = useState<{ contact: any; suggestion: string }[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const allContacts = useQuery(api.MaryContacts.getAllContacts);
  const updateLastContactedMutation = useMutation(api.MaryContacts.updateLastContacted);
  const updateLastConversationMutation = useMutation(api.MaryContacts.updateLastConversation);

  // Use environment variable for API key
  const API_KEY = process.env.EXPO_PUBLIC_PERPLEXITY_API_KEY;

  // Function to call Perplexity API directly from React Native (using axios)
  async function fetchPerplexitySuggestion(contact: any): Promise<string> {
    const prompt = `I last messaged ${contact.First_Name} ${contact.Days_since_last_contact} days ago and we talked about ${contact.Last_conversation}. In a simple 1 sentence prompt of maxiumum 30 words, what's something we could talk about today?`;

    try {
      const response = await axios.post(
        'https://api.perplexity.ai/chat/completions',
        {
          model: 'sonar',
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Perplexity API error:', (error as any).response?.data || (error as Error).message);
      return 'Could not fetch suggestion.';
    }
  }

  useEffect(() => {
    async function fetchReminders() {
      const topContacts = await getTopPriorityContacts(4);

      const contactsWithSuggestions = await Promise.all(
        topContacts.map(async (contact) => {
          const suggestion = await fetchPerplexitySuggestion(contact);
          return { contact, suggestion };
        })
      );

      setReminders(contactsWithSuggestions);
    }

    fetchReminders();
  }, [refreshTrigger]);

  const handleAddNote = async () => {
    if (!newContactId || !newMessage) return;
    
    await updateLastConversationMutation({
      id: newContactId,
      note: newMessage,
    });
    
    setNewContactId('');
    setNewMessage('');
    setModalVisible(false);
    setRefreshTrigger(prev => prev + 1); // Trigger a refresh
  };

  const handleCheckContact = async (id: any) => {
    await updateLastContactedMutation({ id });
    setRefreshTrigger((prev) => prev + 1);
  };
  
  const handleViewContact = (contact: any) => {
    if (contact) {
      setViewingContact(contact);
      setViewModalVisible(true);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
  };

  const getContactColor = (name: string) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getUrgencyColor = (index: number) => {
    const urgencyColors = ['#FF6B6B', '#FF8E6B', '#FFB06B', '#FFD26B'];
    return urgencyColors[index] || '#cccccc';
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>My Reminders</Text>
      <View style={styles.remindersContainer}>
        {reminders.map(({ contact, suggestion }, index) => {
          const initials = getInitials(contact.First_Name, contact.Last_Name);
          const contactColor = getContactColor(contact.First_Name + contact.Last_Name);

          return (
            <View
              key={contact._id}
              style={[
                styles.reminderCard,
                { borderLeftColor: getUrgencyColor(index), borderLeftWidth: 5 },
              ]}
            >
              <TouchableOpacity style={{ flex: 1, marginRight: 10 }} onPress={() => handleViewContact(contact)}>
                <View style={styles.itemHeader}>
                  <View style={[styles.contactImage, { backgroundColor: contactColor }]}>
                    <Text style={styles.contactInitials}>{initials}</Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.itemTitle}>
                      {`${contact.First_Name} ${contact.Last_Name}`}
                    </Text>
                    <Text style={styles.itemSubtitle}>
                      {`Last contacted ${contact.Days_since_last_contact} days ago`}
                    </Text>
                  </View>
                </View>
                <Text style={styles.suggestionText}>
                  💡 {suggestion}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleCheckContact(contact._id)}>
                <Ionicons name="checkbox-outline" size={24} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Notes Section */}
      <View style={styles.notesHeader}>
        <Text style={styles.notesTitle}>Quick Notes</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addNoteButton}>
          <Ionicons name="add" size={24} color="#6A9FD1" />
        </TouchableOpacity>
      </View>
      
      {notes?.map((item) => {
        // Find the contact to get Days_since_last_contact
        const contact = allContacts?.find(c => 
          `${c.First_Name} ${c.Last_Name}` === item.contact
        );
        
        // Calculate the actual date when contact was last contacted
        let contactDate = '';
        if (contact) {
          const today = new Date();
          const lastContactDate = new Date();
          lastContactDate.setDate(today.getDate() - (contact.Days_since_last_contact || 0));
          contactDate = lastContactDate.toLocaleDateString('en-GB');
        }
        
        return {
          item,
          contact,
          contactDate,
          daysSinceContact: contact?.Days_since_last_contact || 0
        };
      })
      .sort((a, b) => a.daysSinceContact - b.daysSinceContact) // Sort by days since contact (ascending)
      .map(({ item, contact, contactDate }) => (
        <View key={item.id} style={styles.noteItem}>
          <TouchableOpacity onPress={() => {
            if (contact) {
              handleViewContact(contact);
            }
          }}>
            <View style={styles.noteHeader}>
              <Text style={styles.noteContact}>{item.contact}</Text>
              {contactDate && (
                <Text style={styles.noteDate}>{contactDate}</Text>
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.noteMessage}>{item.message}</Text>
        </View>
      ))}

      {/* New Note Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Note</Text>
            <CustomPicker
              selectedValue={newContactId}
              onValueChange={(itemValue) => setNewContactId(itemValue)}
              items={allContacts?.map(contact => ({
                label: `${contact.First_Name} ${contact.Last_Name}`,
                value: contact._id,
              })) || []}
              placeholder="Select a contact..."
            />
            <TextInput
              placeholder="What did you talk about?"
              value={newMessage}
              onChangeText={setNewMessage}
              style={[styles.input, { height: 80 }]}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddNote}>
                <Text style={styles.saveButton}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* View Contact Modal */}
      <Modal
        visible={viewModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setViewModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setViewModalVisible(false)}>
          <Pressable style={styles.modalContent}>
            {viewingContact && (
              <>
                <View style={styles.viewModalHeader}>
                  <View style={[styles.contactImage, { backgroundColor: getContactColor(viewingContact.First_Name + viewingContact.Last_Name) }]}>
                    <Text style={styles.contactInitials}>{getInitials(viewingContact.First_Name, viewingContact.Last_Name)}</Text>
                  </View>
                  <View style={styles.contactInfo}>
                      <Text style={styles.modalTitle}>{`${viewingContact.First_Name} ${viewingContact.Last_Name}`}</Text>
                  </View>
                </View>
                <View style={styles.viewModalBody}>
                  <Text style={styles.detailText}><Ionicons name="mail-outline" size={16} /> {viewingContact.Email}</Text>
                  <Text style={styles.detailText}><Ionicons name="call-outline" size={16} /> {viewingContact.Phone_Number}</Text>
                  <Text style={styles.detailText}><Ionicons name="pricetag-outline" size={16} /> {viewingContact.Tag}</Text>
                  <Text style={styles.detailText}><Ionicons name="repeat-outline" size={16} /> {viewingContact.Frequency}</Text>
                </View>

                <View style={styles.viewModalFooter}>
                  <TouchableOpacity 
                    style={styles.markContactedButton}
                    onPress={() => {
                      handleCheckContact(viewingContact._id);
                      setViewModalVisible(false);
                    }}
                  >
                    <Ionicons name="checkbox-outline" size={20} color="#fff" />
                    <Text style={styles.markContactedButtonText}>Mark as Contacted</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  remindersContainer: {
    marginBottom: 20,
  },
  reminderCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInitials: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contactInfo: {
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  suggestionText: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#555',
    fontSize: 12,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  notesTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  addNoteButton: {
    padding: 5,
  },
  noteItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  noteContact: {
    fontWeight: 'bold',
  },
  noteDate: {
    fontSize: 12,
    color: '#888',
  },
  noteMessage: {
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
    marginTop: 10,
  },
  cancelButton: {
    color: '#888',
    fontWeight: '600',
  },
  saveButton: {
    color: '#6A9FD1',
    fontWeight: 'bold',
  },
  viewModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  viewModalBody: {
    paddingVertical: 20,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewModalFooter: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  markContactedButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  markContactedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
