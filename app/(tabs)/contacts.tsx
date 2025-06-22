import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import CustomPicker from "../components/CustomPicker";

export default function ListScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItemId, setEditingItemId] = useState<Id<"MaryContacts"> | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch data from Convex
  const contacts = useQuery(api.MaryContacts.getAllContacts);
  const frequencies = useQuery(api.MaryContacts.getUniqueFrequencies);
  const tags = useQuery(api.MaryContacts.getUniqueTags);
  const filteredContacts = useQuery(api.MaryContacts.getContactsByFilter, {
    frequency: selectedFrequency || undefined,
    tag: selectedTag || undefined,
  });

  // Debug logging
  console.log('Contacts from Convex:', contacts);
  console.log('Frequencies:', frequencies);
  console.log('Tags:', tags);
  console.log('Filtered Contacts:', filteredContacts);

  // Mutations
  const createContact = useMutation(api.MaryContacts.createContact);
  const updateContact = useMutation(api.MaryContacts.updateContact);

  const [form, setForm] = useState({
    First_Name: '',
    Last_Name: '',
    Birthday: '',
    Email: '',
    Phone_Number: '',
    Frequency: 'monthly',
    Tag: 'friend',
    Last_conversation: '',
    Days_since_last_contact: 0,
  });

  // Helper function to get initials for contact image
  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
  };

  // Helper function to get color for contact image
  const getContactColor = (name: string) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setForm({
        First_Name: item.First_Name || '',
        Last_Name: item.Last_Name || '',
        Birthday: item.Birthday || '',
        Email: item.Email || '',
        Phone_Number: item.Phone_Number || '',
        Frequency: item.Frequency || 'monthly',
        Tag: item.Tag || 'friend',
        Last_conversation: item.Last_conversation || '',
        Days_since_last_contact: item.Days_since_last_contact || 0,
      });
      setEditingItemId(item._id);
    } else {
      setForm({
        First_Name: '',
        Last_Name: '',
        Birthday: '',
        Email: '',
        Phone_Number: '',
        Frequency: 'monthly',
        Tag: 'friend',
        Last_conversation: '',
        Days_since_last_contact: 0,
      });
      setEditingItemId(null);
    }
    setModalVisible(true);
  };

  const handleSaveItem = async () => {
    if (!form.First_Name || !form.Last_Name) {
      Alert.alert("First Name and Last Name are required.");
      return;
    }

    try {
      if (editingItemId) {
        await updateContact({
          id: editingItemId,
          ...form,
        });
      } else {
        await createContact(form);
      }
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to save contact.");
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const initials = getInitials(item.First_Name, item.Last_Name);
    const contactColor = getContactColor(item.First_Name + item.Last_Name);
    
    return (
      <TouchableOpacity style={styles.item} onPress={() => handleOpenModal(item)}>
        <View style={styles.itemHeader}>
          <View style={[styles.contactImage, { backgroundColor: contactColor }]}>
            <Text style={styles.contactInitials}>{initials}</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.itemTitle}>{`${item.First_Name} ${item.Last_Name}`}</Text>
            <View style={styles.tagContainer}>
              <View style={[styles.tag, { backgroundColor: getTagColor(item.Tag) }]}>
                <Text style={styles.tagText}>{item.Tag}</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: getFrequencyColor(item.Frequency) }]}>
                <Text style={styles.tagText}>{item.Frequency}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Helper functions for tag colors
  const getTagColor = (tag: string) => {
    const tagColors: { [key: string]: string } = {
      'friend': '#4ECDC4',
      'family': '#FF6B6B',
      'work': '#45B7D1',
      'acquaintance': '#96CEB4'
    };
    return tagColors[tag] || '#DDA0DD';
  };

  const getFrequencyColor = (frequency: string) => {
    const frequencyColors: { [key: string]: string } = {
      'daily': '#FFEAA7',
      'weekly': '#98D8C8',
      'monthly': '#F7DC6F',
      'annually': '#BB8FCE'
    };
    return frequencyColors[frequency] || '#85C1E9';
  };

  const dataToDisplay = selectedFrequency || selectedTag ? filteredContacts : contacts;
  const frequencyItems = frequencies?.map(f => ({ label: f, value: f })) || [];
  const tagItems = tags?.map(t => ({ label: t, value: t })) || [];

  // Filter contacts based on search query
  const filteredBySearch = dataToDisplay?.filter(contact => {
    if (!searchQuery) return true;
    const fullName = `${contact.First_Name} ${contact.Last_Name}`.toLowerCase();
    const email = contact.Email?.toLowerCase() || '';
    const phone = contact.Phone_Number?.toLowerCase() || '';
    const searchLower = searchQuery.toLowerCase();
    
    return fullName.includes(searchLower) || 
           email.includes(searchLower) || 
           phone.includes(searchLower);
  }) || [];

  // Loading state
  if (contacts === undefined) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Contacts List</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      </View>
    );
  }

  // Empty state
  if (contacts && contacts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Contacts List</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No contacts found</Text>
          <Text style={styles.emptySubtext}>Add your first contact using the + button</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal()}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Contacts List</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by:</Text>
        
        <View style={styles.filterRow}>
          <Text style={styles.filterSubLabel}>Frequency:</Text>
          <CustomPicker
            selectedValue={selectedFrequency}
            onValueChange={(value) => setSelectedFrequency(value)}
            items={[{ label: "All Frequencies", value: "" }, ...frequencyItems]}
            placeholder="Select Frequency..."
            style={styles.pickerStyle}
          />
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterSubLabel}>Tag:</Text>
          <CustomPicker
            selectedValue={selectedTag}
            onValueChange={(value) => setSelectedTag(value)}
            items={[{ label: "All Tags", value: "" }, ...tagItems]}
            placeholder="Select Tag..."
            style={styles.pickerStyle}
          />
        </View>

        {(selectedFrequency || selectedTag || searchQuery) && (
          <TouchableOpacity 
            style={styles.clearFilterButton}
            onPress={() => {
              setSelectedFrequency('');
              setSelectedTag('');
              setSearchQuery('');
            }}
          >
            <Text style={styles.clearFilterText}>Clear All Filters</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredBySearch}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal()}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {editingItemId !== null ? "Edit Contact" : "Add Contact"}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={form.First_Name}
                onChangeText={(text) => setForm({ ...form, First_Name: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={form.Last_Name}
                onChangeText={(text) => setForm({ ...form, Last_Name: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Birthday"
                value={form.Birthday}
                onChangeText={(text) => setForm({ ...form, Birthday: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Email"
                value={form.Email}
                onChangeText={(text) => setForm({ ...form, Email: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={form.Phone_Number}
                onChangeText={(text) => setForm({ ...form, Phone_Number: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Last Conversation"
                value={form.Last_conversation}
                onChangeText={(text) => setForm({ ...form, Last_conversation: text })}
              />

              <Text style={styles.label}>
                <Ionicons name="pricetag-outline" size={16} color="#666" style={styles.inputIcon} /> Tag
                </Text>
              <CustomPicker
                selectedValue={form.Tag}
                onValueChange={(value) => setForm({ ...form, Tag: value })}
                items={[
                  { label: "Friend", value: "friend" },
                  { label: "Family", value: "family" },
                  { label: "Work", value: "work" },
                  { label: "Acquaintance", value: "acquaintance" },
                ]}
                placeholder="Select a tag..."
              />
              <Text style={styles.label}>
                <Ionicons name="repeat-outline" size={16} color="#666" style={styles.inputIcon} /> Frequency
                </Text>
              <CustomPicker
                selectedValue={form.Frequency}
                onValueChange={(value) => setForm({ ...form, Frequency: value })}
                items={[
                  { label: "Daily", value: "daily" },
                  { label: "Weekly", value: "weekly" },
                  { label: "Monthly", value: "monthly" },
                  { label: "Annually", value: "annually" },
                ]}
                placeholder="Select a frequency..."
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={handleSaveItem}>
                <Text style={styles.modalButtonText}>Save</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffff",
    position: "relative",
    paddingHorizontal: 5,
    paddingTop: 0,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 16,
  },
  filterContainer: {
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  filterSubLabel: {
    fontSize: 14,
    fontWeight: "500",
    width: 80,
  },
  picker: {
    flex: 1,
    height: 40,
  },
  pickerStyle: {
    flex: 1,
    height: 50,
  },
  clearFilterButton: {
    backgroundColor: "#ff6b6b",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  clearFilterText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listContainer: {
    padding: 16,
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 4,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  contactInfo: {
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemEmail: {
    fontSize: 14,
    color: "#555",
  },
  tagContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  tag: {
    padding: 4,
    borderRadius: 4,
    marginRight: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  itemDetails: {
    marginTop: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: "#555",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#6A9FD1",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  label: {
    marginTop: 5,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#6A9FD1",
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#555",
  },
  contactInitials: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
