import React, { useContext } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useTailwind } from 'tailwindcss-react-native';
import TerminalOutput from '../components/TerminalOutput';
import { AppContext } from '../App';

const LogsScreen = () => {
  const tailwind = useTailwind();
  const { isDarkMode, projects } = useContext(AppContext);

  const bgColor = isDarkMode ? 'bg-dark-bg' : 'bg-gray-100';
  const textColor = isDarkMode ? 'text-gray-50' : 'text-gray-900';
  const headerBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  // Aggregate all logs from all projects
  const allLogs = projects.flatMap(project =>
    project.logs ? project.logs.map(log => `[${project.name}] ${log}`) : []
  );

  return (
    <SafeAreaView style={tailwind(`flex-1 ${bgColor}`)}>
      <View style={tailwind(`py-4 px-6 ${headerBg} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`)}>
        <Text style={tailwind(`text-3xl font-bold ${textColor}`)}>System Logs</Text>
        <Text style={tailwind(`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`)}>Real-time output from all AI services</Text>
      </View>
      <ScrollView style={tailwind('flex-1 p-6')}>
        <View style={tailwind(`rounded-xl p-4 shadow-lg ${isDarkMode ? 'bg-dark-card' : 'bg-white'} border ${isDarkMode ? 'border-dark-border' : 'border-gray-300'}`)}>
          <Text style={tailwind(`font-bold text-lg mb-3 ${textColor}`)}>Combined Project Output</Text>
          <TerminalOutput logs={allLogs} height={500} /> {/* Adjust height as needed */}
        </View>
        <View style={tailwind('h-10')}></View>{/* Spacer for bottom tab bar */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LogsScreen;
