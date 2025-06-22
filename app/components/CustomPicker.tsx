import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PickerItem {
  label: string;
  value: any;
}

interface CustomPickerProps {
  selectedValue: any;
  onValueChange: (value: any) => void;
  items: PickerItem[];
  placeholder?: string;
  style?: object;
}

export default function CustomPicker({ selectedValue, onValueChange, items, placeholder = "Select an item...", style }: CustomPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedItem = items.find(item => item.value === selectedValue);

  const renderItem = ({ item }: { item: PickerItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        onValueChange(item.value);
        setModalVisible(false);
      }}
    >
      <Text style={styles.itemText}>{item.label}</Text>
      {selectedValue === item.value && <Ionicons name="checkmark" size={24} color="#6A9FD1" />}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity style={[styles.pickerButton, style]} onPress={() => setModalVisible(true)}>
        <Text style={styles.pickerButtonText}>{selectedItem ? selectedItem.label : placeholder}</Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
              <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.value?.toString()}
              />
            </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  pickerButtonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    width: '85%',
    maxHeight: '60%',
    elevation: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
  },
}); 