import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

interface Props {
  label: string;
  image: ImageSourcePropType;
  onPress: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
}

export default function CategoryButton({
  label,
  image,
  onPress,
  onLongPress,
  isSelected = false,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.touchWrapper, isSelected && styles.selectedWrapper]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.gradientCircle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Image source={image} style={styles.icon} resizeMode="contain" />
      </LinearGradient>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchWrapper: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  selectedWrapper: {
    borderWidth: 2,
    borderColor: '#ff5252',
  },
  gradientCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 45,
    height: 45,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
});
