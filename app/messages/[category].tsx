import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    useFocusEffect,
    useLocalSearchParams,
    useNavigation,
} from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Keyboard,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

export default function MessageScreen() {
  const { category } = useLocalSearchParams();
  const navigation = useNavigation();
  const [messages, setMessages] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMessages, setSelectedMessages] = useState<Set<number>>(new Set());

  const STORAGE_KEY = `messages_${category}`;

  useFocusEffect(() => {
    navigation.setOptions({
      title: `${category} Folder`,
    });
  });

  useEffect(() => {
    loadMessages();
  }, [category]);

  const loadMessages = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.log('Failed to load messages:', error);
    }
  };

  const saveMessages = async (updated: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.log('Failed to save messages:', error);
    }
  };

  const handleAddMessage = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) {
      Alert.alert('Message cannot be empty.');
      return;
    }
    const updated = [...messages, trimmed];
    setMessages(updated);
    saveMessages(updated);
    setNewMessage('');
    setModalVisible(false);
  };

  const toggleSelect = (index: number) => {
    const newSet = new Set(selectedMessages);
    newSet.has(index) ? newSet.delete(index) : newSet.add(index);
    setSelectedMessages(newSet);
  };

  const handleDelete = () => {
    const updated = messages.filter((_, i) => !selectedMessages.has(i));
    setMessages(updated);
    saveMessages(updated);
    setSelectedMessages(new Set());
  };

  const isSelectionMode = selectedMessages.size > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>{category} Messages</Text>
        {isSelectionMode && (
          <TouchableOpacity onPress={handleDelete}>
            <MaterialIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onLongPress={() => toggleSelect(index)}
            onPress={() => isSelectionMode && toggleSelect(index)}
            style={[
              styles.messageItem,
              selectedMessages.has(index) && styles.selectedMessage,
            ]}
          >
            <Text style={styles.messageText}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>New Message</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter message"
                  value={newMessage}
                  onChangeText={setNewMessage}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddMessage}>
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E90FF',
    flex: 1,
  },
  messageItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 2,
  },
  selectedMessage: {
    backgroundColor: '#ffe4e1',
    borderColor: 'red',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#2575fc',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#2575fc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
