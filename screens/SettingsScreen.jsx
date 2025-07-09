import React, { useContext } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useTailwind } from 'tailwindcss-react-native';
import ToggleSwitch from '../components/ToggleSwitch';
import { AppContext } from '../App';
import Ionicons from '@expo/vector-icons/Ionicons';
import { clearAllData } from '../services/storage';

const SettingsScreen = () => {
  const tailwind = useTailwind();
  const { isDarkMode, toggleTheme } = useContext(AppContext);

  const bgColor = isDarkMode ? 'bg-dark-bg' : 'bg-gray-100';
  const textColor = isDarkMode ? 'text-gray-50' : 'text-gray-900';
  const headerBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-white';
  const cardBorder = isDarkMode ? 'border-dark-border' : 'border-gray-300';
  const itemBorder = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const itemText = isDarkMode ? 'text-gray-100' : 'text-gray-800';

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to clear application cache? This will reset some settings and project states.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          onPress: async () => {
            await clearAllData();
            Alert.alert("Cache Cleared", "Application cache has been cleared. Please restart the app for full effect.");
            // Optionally, force app reload or state reset here
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={tailwind(`flex-1 ${bgColor}`)}>
      <View style={tailwind(`py-4 px-6 ${headerBg} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`)}>
        <Text style={tailwind(`text-3xl font-bold ${textColor}`)}>Settings</Text>
        <Text style={tailwind(`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`)}>Configure your app experience</Text>
      </View>
      <ScrollView style={tailwind('flex-1 p-6')}>
        <View style={tailwind(`rounded-xl p-4 mb-4 shadow-lg ${cardBg} border ${cardBorder}`)}>
          <Text style={tailwind(`font-bold text-lg mb-3 ${textColor}`)}>Appearance</Text>
          <ToggleSwitch
            label="Dark Mode"
            value={isDarkMode}
            onValueChange={toggleTheme}
          />
        </View>

        <View style={tailwind(`rounded-xl p-4 mb-4 shadow-lg ${cardBg} border ${cardBorder}`)}>
          <Text style={tailwind(`font-bold text-lg mb-3 ${textColor}`)}>Integrations</Text>
          <View style={tailwind(`flex-row justify-between items-center py-2 border-b ${itemBorder}`)}>
            <Text style={tailwind(`text-base ${itemText}`)}>Telegram Bot API Key</Text>
            <TouchableOpacity onPress={() => Alert.alert("Telegram Settings", "Open dialog to input/manage Telegram API key.")}>
              <Text style={tailwind('text-neon-blue text-base')}>Configure</Text>
            </TouchableOpacity>
          </View>
          <View style={tailwind(`flex-row justify-between items-center py-2`)}>
            <Text style={tailwind(`text-base ${itemText}`)}>Termux Bridge Settings</Text>
            <TouchableOpacity onPress={() => Alert.alert("Termux Bridge", "Open dialog to configure Termux Python bridge connection details.")}>
              <Text style={tailwind('text-neon-blue text-base')}>Configure</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={tailwind(`rounded-xl p-4 mb-4 shadow-lg ${cardBg} border ${cardBorder}`)}>
          <Text style={tailwind(`font-bold text-lg mb-3 ${textColor}`)}>Data & Storage</Text>
          <TouchableOpacity
            onPress={handleClearCache}
            style={tailwind(`flex-row items-center py-2`)}
          >
            <Ionicons name="trash-outline" size={20} color={isDarkMode ? 'gray' : 'gray'} style={tailwind('mr-2')} />
            <Text style={tailwind(`text-base ${itemText}`)}>Clear App Cache</Text>
          </TouchableOpacity>
        </View>

        <View style={tailwind(`rounded-xl p-4 mb-4 shadow-lg ${cardBg} border ${cardBorder}`)}>
          <Text style={tailwind(`font-bold text-lg mb-3 ${textColor}`)}>About</Text>
          <Text style={tailwind(`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`)}>
            Termux AI Business Suite v1.0.0
          </Text>
          <Text style={tailwind(`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`)}>
            Developed by Huminex Team
          </Text>
        </View>

        <View style={tailwind('h-10')}></View>{/* Spacer for bottom tab bar */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
