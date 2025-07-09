import React, { useContext } => 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useTailwind } from 'tailwindcss-react-native';
import ProjectCard from '../components/ProjectCard';
import { AppContext } from '../App';

const ProjectsScreen = () => {
  const tailwind = useTailwind();
  const { isDarkMode, projects } = useContext(AppContext);

  const bgColor = isDarkMode ? 'bg-dark-bg' : 'bg-gray-100';
  const textColor = isDarkMode ? 'text-gray-50' : 'text-gray-900';
  const headerBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  return (
    <SafeAreaView style={tailwind(`flex-1 ${bgColor}`)}>
      <View style={tailwind(`py-4 px-6 ${headerBg} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`)}>
        <Text style={tailwind(`text-3xl font-bold ${textColor}`)}>AI Projects</Text>
        <Text style={tailwind(`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`)}>Manage your Termux-powered AI microservices</Text>
      </View>
      <ScrollView style={tailwind('flex-1 p-6')}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        <View style={tailwind('h-10')}></View>{/* Spacer for bottom tab bar */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProjectsScreen;
