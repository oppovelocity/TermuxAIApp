import React, { useContext } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useTailwind } from 'tailwindcss-react-native';
import GlobalControls from '../components/GlobalControls';
import { AppContext } from '../App';

const HomeScreen = () => {
  const tailwind = useTailwind();
  const { isDarkMode, projects } = useContext(AppContext);

  const bgColor = isDarkMode ? 'bg-dark-bg' : 'bg-gray-100';
  const textColor = isDarkMode ? 'text-gray-50' : 'text-gray-900';
  const headerBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  const totalProjects = projects.length;
  const installedProjects = projects.filter(p => p.installStatus === 'installed').length;
  const runningProjects = projects.filter(p => p.isRunning).length;
  const projectsWithError = projects.filter(p => p.error).length;

  return (
    <SafeAreaView style={tailwind(`flex-1 ${bgColor}`)}>
      <View style={tailwind(`py-4 px-6 ${headerBg} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`)}>
        <Text style={tailwind(`text-3xl font-bold ${textColor}`)}>Dashboard</Text>
        <Text style={tailwind(`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`)}>Overview of your AI operations</Text>
      </View>
      <ScrollView style={tailwind('flex-1 p-6')}>
        <GlobalControls />

        <View style={tailwind(`rounded-xl p-4 mb-4 shadow-lg ${isDarkMode ? 'bg-dark-card' : 'bg-white'} border ${isDarkMode ? 'border-dark-border' : 'border-gray-300'}`)}>
          <Text style={tailwind(`font-bold text-lg mb-3 ${textColor}`)}>Project Summary</Text>
          <View style={tailwind('flex-row justify-between mb-2')}>
            <Text style={tailwind(`text-base ${textColor}`)}>Total Projects:</Text>
            <Text style={tailwind(`text-base font-semibold text-neon-blue`)}>{totalProjects}</Text>
          </View>
          <View style={tailwind('flex-row justify-between mb-2')}>
            <Text style={tailwind(`text-base ${textColor}`)}>Installed:</Text>
            <Text style={tailwind(`text-base font-semibold text-neon-green`)}>{installedProjects}</Text>
          </View>
          <View style={tailwind('flex-row justify-between mb-2')}>
            <Text style={tailwind(`text-base ${textColor}`)}>Running:</Text>
            <Text style={tailwind(`text-base font-semibold ${runningProjects > 0 ? 'text-neon-green' : 'text-gray-500'}`)}>{runningProjects}</Text>
          </View>
          <View style={tailwind('flex-row justify-between')}>
            <Text style={tailwind(`text-base ${textColor}`)}>With Errors:</Text>
            <Text style={tailwind(`text-base font-semibold ${projectsWithError > 0 ? 'text-red-500' : 'text-gray-500'}`)}>{projectsWithError}</Text>
          </View>
        </View>

        {/* You can add more summary cards here, e.g., recent activity, notifications */}
        <View style={tailwind(`rounded-xl p-4 shadow-lg ${isDarkMode ? 'bg-dark-card' : 'bg-white'} border ${isDarkMode ? 'border-dark-border' : 'border-gray-300'}`)}>
          <Text style={tailwind(`font-bold text-lg mb-3 ${textColor}`)}>Recent Activity</Text>
          <Text style={tailwind(`text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`)}>
            No recent activity to display.
          </Text>
          {/* Example: List last 3 log entries from any running project */}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
