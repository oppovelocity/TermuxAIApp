import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, ActivityIndicator } from 'react-native';
import { useTailwind } from 'tailwindcss-react-native';

const SplashScreen = () => {
  const tailwind = useTailwind();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={tailwind('flex-1 justify-center items-center bg-gray-900')}>
      <Animated.View
        style={[
          tailwind('p-8 rounded-xl'),
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Placeholder for your actual logo image */}
        <View style={tailwind('w-24 h-24 bg-neon-purple rounded-full mb-4 justify-center items-center')}>
          <Text style={tailwind('text-white text-3xl font-bold')}>🧠</Text>
        </View>
        <Text style={tailwind('text-white text-4xl font-extrabold text-center mb-4')}>
          Termux AI
        </Text>
        <Text style={tailwind('text-neon-blue text-lg text-center')}>
          Business Suite
        </Text>
        <View style={tailwind('mt-8')}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
