import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

import { Button, View, Text } from 'react-native';
import { useState } from 'react';

export default function TabTwoScreen() {
  const [result, setResult] = useState<string>('No workout yet');

  const callApi = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/generate_workout');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + String(error));
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Generate Workout" onPress={callApi} />
      <Text style={{ marginTop: 20 }}>{result}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
