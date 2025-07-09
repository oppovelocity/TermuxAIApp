import React, { useState, useEffect, createContext, useContext } from 'react';
import { View, Text, StatusBar, ActivityIndicator, Appearance } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TailwindProvider } from 'tailwindcss-react-native'; // Assuming NativeWind setup
import Ionicons from '@expo/vector-icons/Ionicons'; // Or any icon library

import SplashScreen from './components/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import LogsScreen from './screens/LogsScreen';
import SettingsScreen from './screens/SettingsScreen';
import { projectData as initialProjectData } from './services/projectData';
import { getStoredData, storeData } from './services/storage';

// --- Context for App-wide state (e.g., theme, project states) ---
export const AppContext = createContext();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
  const [appReady, setAppReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [projects, setProjects] = useState(initialProjectData); // Initial project data

  useEffect(() => {
    async function prepare() {
      try {
        // Simulate app initialization time
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Load theme preference
        const storedTheme = await getStoredData('theme');
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === 'dark');
        } else {
          // Default to system theme if no preference saved
          setIsDarkMode(Appearance.getColorScheme() === 'dark');
        }

        // Load project states if any
        const storedProjects = await getStoredData('projects');
        if (storedProjects) {
          setProjects(JSON.parse(storedProjects));
        }

      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    // Save theme preference whenever it changes
    storeData('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    // Save project states whenever they change
    storeData('projects', JSON.stringify(projects));
  }, [projects]);


  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const updateProjectStatus = (projectId, newStatus) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId ? { ...project, ...newStatus } : project
      )
    );
  };

  if (!appReady) {
    return <SplashScreen />;
  }

  const themeClass = isDarkMode ? 'bg-gray-900 text-gray-50' : 'bg-gray-100 text-gray-900';
  const headerBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const headerText = isDarkMode ? 'text-white' : 'text-gray-900';
  const iconColor = isDarkMode ? '#8B5CF6' : '#6366F1'; // Neon purple/indigo

  return (
    <AppContext.Provider value={{ isDarkMode, toggleTheme, projects, updateProjectStatus }}>
      <TailwindProvider>
        <NavigationContainer>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#111827' : '#F3F4F6'} />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Projects') {
                  iconName = focused ? 'cube' : 'cube-outline';
                } else if (route.name === 'Logs') {
                  iconName = focused ? 'terminal' : 'terminal-outline';
                } else if (route.name === 'Settings') {
                  iconName = focused ? 'settings' : 'settings-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: iconColor,
              tabBarInactiveTintColor: isDarkMode ? 'gray' : 'gray',
              tabBarStyle: {
                backgroundColor: isDarkMode ? '#1F2937' : '#E5E7EB', // Darker gray for dark mode tab bar
                borderTopWidth: 0,
                height: 60,
                paddingBottom: 5,
                paddingTop: 5,
              },
              headerShown: false, // Hide default header, custom headers in screens
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Projects" component={ProjectsScreen} />
            <Tab.Screen name="Logs" component={LogsScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </TailwindProvider>
    </AppContext.Provider>
  );
};

export default App;
