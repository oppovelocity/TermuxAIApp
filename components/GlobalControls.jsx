import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTailwind } from 'tailwindcss-react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../App';

const GlobalControls = () => {
  const tailwind = useTailwind();
  const { isDarkMode, projects, updateProjectStatus } = useContext(AppContext);
  const [telegramStatus, setTelegramStatus] = useState('Checking...');
  const [isTelegramChecking, setIsTelegramChecking] = useState(false);

  useEffect(() => {
    checkTelegramBotStatus();
  }, []);

  const checkTelegramBotStatus = async () => {
    setIsTelegramChecking(true);
    setTelegramStatus('Checking...');
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    const status = Math.random() > 0.5 ? 'Online' : 'Offline';
    setTelegramStatus(status);
    setIsTelegramChecking(false);
  };

  const runAllProjects = () => {
    projects.forEach(project => {
      if (!project.isRunning && project.installStatus === 'installed') {
        // Simulate running each project
        updateProjectStatus(project.id, { isLoading: true, isRunning: false, error: null, logs: [`Starting ${project.name}...`] });
        setTimeout(() => {
          updateProjectStatus(project.id, { isLoading: false, isRunning: true, logs: [...(project.logs || []), `${project.name} started successfully.`] });
        }, 1000 + Math.random() * 1000);
      }
    });
  };

  const stopAllProjects = () => {
    projects.forEach(project => {
      if (project.isRunning) {
        // Simulate stopping each project
        updateProjectStatus(project.id, { isLoading: true, isRunning: true, logs: [...(project.logs || []), `Stopping ${project.name}...`] });
        setTimeout(() => {
          updateProjectStatus(project.id, { isLoading: false, isRunning: false, logs: [...(project.logs || []), `${project.name} stopped.`] });
        }, 500 + Math.random() * 500);
      }
    });
  };

  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';
  const cardBg = isDarkMode ? 'bg-dark-card' : 'bg-white';
  const cardBorder = isDarkMode ? 'border-dark-border' : 'border-gray-300';
  const buttonBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-200';
  const buttonText = isDarkMode ? 'text-white' : 'text-gray-800';

  return (
    <View style={tailwind(`rounded-xl p-4 mb-4 shadow-lg ${cardBg} ${cardBorder}`)} className="border">
      <Text style={tailwind(`font-bold text-lg mb-3 ${textColor}`)}>Global Controls</Text>

      <View style={tailwind('flex-row justify-between mb-4')}>
        <TouchableOpacity
          onPress={runAllProjects}
          style={tailwind(`flex-1 py-3 mx-1 rounded-lg flex-row justify-center items-center bg-neon-green`)}
        >
          <Ionicons name="play-circle-outline" size={20} color="white" />
          <Text style={tailwind('text-white font-semibold ml-2')}>Run All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={stopAllProjects}
          style={tailwind(`flex-1 py-3 mx-1 rounded-lg flex-row justify-center items-center bg-red-600`)}
        >
          <Ionicons name="stop-circle-outline" size={20} color="white" />
          <Text style={tailwind('text-white font-semibold ml-2')}>Stop All</Text>
        </TouchableOpacity>
      </View>

      <View style={tailwind('flex-row justify-between items-center mt-2 p-3 rounded-lg border border-gray-700')}>
        <Text style={tailwind(`font-semibold ${textColor}`)}>Telegram Bot Status:</Text>
        <View style={tailwind('flex-row items-center')}>
          {isTelegramChecking ? (
            <ActivityIndicator size="small" color={isDarkMode ? '#8B5CF6' : '#6366F1'} />
          ) : (
            <Text
              style={tailwind(`font-bold ml-2 ${telegramStatus === 'Online' ? 'text-neon-green' : 'text-red-500'}`)}
            >
              {telegramStatus}
            </Text>
          )}
          <TouchableOpacity onPress={checkTelegramBotStatus} style={tailwind('ml-3')}>
            <Ionicons name="refresh-outline" size={20} color={isDarkMode ? 'gray' : 'gray'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default GlobalControls;
