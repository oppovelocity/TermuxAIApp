import React from 'react';
import { Switch, View, Text, Platform } from 'react-native';
import { useTailwind } from 'tailwindcss-react-native';
import { AppContext } from '../App';
import { useContext } from 'react';

const ToggleSwitch = ({ label, value, onValueChange }) => {
  const tailwind = useTailwind();
  const { isDarkMode } = useContext(AppContext);

  const trackColor = isDarkMode ? { false: '#71717A', true: '#8B5CF6' } : { false: '#BFDBFE', true: '#6366F1' };
  const thumbColor = isDarkMode ? (value ? '#F3F4F6' : '#E5E7EB') : (value ? '#FFFFFF' : '#F4F3F4');
  const iosBackgroundColor = isDarkMode ? '#374151' : '#E5E7EB';

  return (
    <View style={tailwind('flex-row justify-between items-center py-2')}>
      <Text style={tailwind(`text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`)}>{label}</Text>
      <Switch
        trackColor={trackColor}
        thumbColor={thumbColor}
        ios_backgroundColor={Platform.OS === 'ios' ? iosBackgroundColor : undefined}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
};

export default ToggleSwitch;
