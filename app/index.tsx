import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import CategoryButton from '../components/CategoryButton';
import messagesData from '../constants/messages';

const categoryImages: { [key: string]: any } = {
  You: require('../assets/images/you.png'),
  Home: require('../assets/images/home.png'),
  Love: require('../assets/images/love.png'),
  Family: require('../assets/images/family.png'),
  Friends: require('../assets/images/friends.png'),
  School: require('../assets/images/school.png'),
};

const defaultImage = require('../assets/images/newfolder.png');
const screenWidth = Dimensions.get('window').width;
const itemSpacing = 20;
const itemSize = (screenWidth - itemSpacing * 3) / 2;

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useFocusEffect(() => {
    navigation.setOptions({ title: 'Message Directory' });
  });

  const [messages, setMessages] = useState(messagesData);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(new Set());

  const allCategories = Object.keys(messages);

  const handleAddFolder = () => {
    const folderName = newFolderName.trim();
    if (!folderName) {
      Alert.alert('Folder name cannot be empty.');
      return;
    }
    if (messages[folderName]) {
      Alert.alert('Folder already exists.');
      return;
    }

    const updated = { ...messages, [folderName]: [] };
    setMessages(updated);
    setNewFolderName('');
    setModalVisible(false);
  };

  const handleDeleteFolders = async () => {
    const updatedMessages = { ...messages };
    const folderArray = Array.from(selectedFolders);
    for (const folder of folderArray) {
      delete updatedMessages[folder];
      await AsyncStorage.removeItem(`messages_${folder}`);
    }
    setMessages(updatedMessages);
    setSelectedFolders(new Set());
  };

  const toggleSelectFolder = (folder: string) => {
    const newSet = new Set(selectedFolders);
    newSet.has(folder) ? newSet.delete(folder) : newSet.add(folder);
    setSelectedFolders(newSet);
  };

  const isSelectionMode = selectedFolders.size > 0;

  const data = allCategories.map((category) => ({
    key: category,
    label: category,
    image: categoryImages[category] || defaultImage,
  }));

  return (
    <>
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(item) => item.key}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <View style={{ width: itemSize }}>
            <CategoryButton
              label={item.label}
              image={item.image}
              onPress={() =>
                isSelectionMode
                  ? toggleSelectFolder(item.label)
                  : router.push(`/messages/${item.label}`)
              }
              onLongPress={() => toggleSelectFolder(item.label)}
              isSelected={selectedFolders.has(item.label)}
            />
          </View>
        )}
      />

      {/* Floating Add Button */}
      {!isSelectionMode && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <AntDesign name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Floating Delete Button */}
      {isSelectionMode && (
        <TouchableOpacity
          style={[styles.fab, styles.deleteFab]}
          onPress={handleDeleteFolders}
        >
          <MaterialIcons name="delete" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Folder</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter folder name"
              value={newFolderName}
              onChangeText={setNewFolderName}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddFolder}>
              <Text style={styles.addButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: itemSpacing,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
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
  deleteFab: {
    backgroundColor: '#e53935',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
