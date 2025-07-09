import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager, ActivityIndicator } from 'react-native';
import { useTailwind } from 'tailwindcss-react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import TerminalOutput from './TerminalOutput';
import { AppContext } from '../App';
import { useTermuxShell } from '../hooks/useTermuxShell';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ProjectCard = ({ project }) => {
  const tailwind = useTailwind();
  const { isDarkMode, updateProjectStatus } = useContext(AppContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const { runCommand, stopCommand, output, isLoading, isRunning, error } = useTermuxShell();

  // Sync internal state with global project state
  useEffect(() => {
    // Only update if there's a real change to avoid unnecessary re-renders/loops
    if (isRunning !== project.isRunning || isLoading !== project.isLoading || error !== project.error || JSON.stringify(output) !== JSON.stringify(project.logs)) {
      updateProjectStatus(project.id, {
        isRunning: isRunning,
        isLoading: isLoading,
        error: error,
        logs: output,
      });
    }
  }, [isRunning, isLoading, error, output, project.id, updateProjectStatus]);


  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'installed':
        return tailwind('bg-neon-green text-white');
      case 'not_installed':
        return tailwind('bg-red-500 text-white');
      case 'installing':
        return tailwind('bg-yellow-500 text-gray-900');
      default:
        return tailwind('bg-gray-500 text-white');
    }
  };

  const getRunStatusBadge = (status) => {
    if (project.isLoading) return tailwind('bg-blue-500 text-white');
    if (project.isRunning) return tailwind('bg-green-500 text-white');
    if (project.error) return tailwind('bg-red-500 text-white');
    return tailwind('bg-gray-500 text-white');
  };

  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-white';
  const cardBorder = isDarkMode ? 'border-dark-border' : 'border-gray-300';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';
  const subTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const buttonBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-200';
  const buttonText = isDarkMode ? 'text-white' : 'text-gray-800';
  const buttonActiveBg = isDarkMode ? 'bg-neon-purple' : 'bg-indigo-600';

  const handleRunPress = async () => {
    if (!project.isRunning && !project.isLoading) {
      // Simulate installation if not installed
      if (project.installStatus === 'not_installed') {
        updateProjectStatus(project.id, { installStatus: 'installing' });
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate install time
        updateProjectStatus(project.id, { installStatus: 'installed' });
      }
      // Simulate running
      runCommand(`python ${project.scriptName}.py`);
    } else {
      stopCommand();
    }
  };

  return (
    <View style={tailwind(`rounded-xl p-4 mb-4 shadow-lg ${cardBg} ${cardBorder}`)} className="border">
      <TouchableOpacity onPress={toggleExpand} style={tailwind('flex-row justify-between items-center')}>
        <View style={tailwind('flex-row items-center')}>
          <Text style={tailwind(`text-2xl mr-3 ${textColor}`)}>{project.icon}</Text>
          <View>
            <Text style={tailwind(`font-bold text-lg ${textColor}`)}>{project.name}</Text>
            <View style={tailwind('flex-row items-center mt-1')}>
              <Text style={tailwind(`text-xs rounded-full px-2 py-1 ${getStatusBadge(project.installStatus)}`)}>
                {project.installStatus.replace('_', ' ').toUpperCase()}
              </Text>
              <Text style={tailwind(`text-xs rounded-full px-2 py-1 ml-2 ${getRunStatusBadge(project.isRunning)}`)}>
                {project.isLoading ? 'LOADING' : (project.isRunning ? 'RUNNING' : (project.error ? 'ERROR' : 'STOPPED'))}
              </Text>
            </View>
          </View>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={24}
          color={isDarkMode ? 'gray' : 'gray'}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={tailwind('mt-4 pt-4 border-t border-gray-700')}>
          <Text style={tailwind(`font-semibold text-base mb-2 ${textColor}`)}>Description:</Text>
          <Text style={tailwind(`text-sm mb-4 ${subTextColor}`)}>{project.description}</Text>

          <View style={tailwind('flex-row justify-around mb-4')}>
            <TouchableOpacity
              onPress={handleRunPress}
              disabled={project.isLoading}
              style={tailwind(`flex-1 py-3 mx-1 rounded-lg flex-row justify-center items-center
                ${project.isRunning ? 'bg-red-600' : 'bg-neon-green'}
                ${project.isLoading ? 'opacity-50' : ''}`)}
            >
              {project.isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name={project.isRunning ? 'stop' : 'play'} size={20} color="white" />
                  <Text style={tailwind('text-white font-semibold ml-2')}>
                    {project.isRunning ? 'Stop' : 'Run'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // Simulate install action
                if (project.installStatus === 'not_installed') {
                  updateProjectStatus(project.id, { installStatus: 'installing' });
                  setTimeout(() => {
                    updateProjectStatus(project.id, { installStatus: 'installed' });
                  }, 2000); // Simulate installation time
                } else if (project.installStatus === 'installed') {
                  // Simulate uninstall
                  updateProjectStatus(project.id, { installStatus: 'not_installed' });
                }
              }}
              disabled={project.isLoading || project.isRunning || project.installStatus === 'installing'}
              style={tailwind(`flex-1 py-3 mx-1 rounded-lg flex-row justify-center items-center
                ${project.installStatus === 'installed' ? 'bg-gray-600' : 'bg-blue-600'}
                ${project.isLoading || project.isRunning || project.installStatus === 'installing' ? 'opacity-50' : ''}`)}
            >
              <Ionicons name={project.installStatus === 'installed' ? 'trash' : 'download'} size={20} color="white" />
              <Text style={tailwind('text-white font-semibold ml-2')}>
                {project.installStatus === 'installed' ? 'Uninstall' : (project.installStatus === 'installing' ? 'Installing...' : 'Install')}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={tailwind(`font-semibold text-base mb-2 ${textColor}`)}>Logs:</Text>
          {project.error && (
            <Text style={tailwind('text-red-500 text-sm mb-2')}>Error: {project.error}</Text>
          )}
          <TerminalOutput logs={project.logs || []} />
        </View>
      )}
    </View>
  );
};

export default ProjectCard;
, 