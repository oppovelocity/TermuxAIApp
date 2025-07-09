# TermuxAIApp
As your dedicated AI mobile app developer and UI/UX designer, I'm thrilled to present the blueprint for your **Termux AI Business Suite** mobile application. This design embodies a "hacker-luxury AI suite" aesthetic, blending the sleekness of Notion and Linear with a distinct dark theme, neon accents, and terminal-inspired elements.

I've chosen **React Native with NativeWind (Tailwind CSS)** for this project. This combination offers unparalleled flexibility for rapid UI development, responsive styling, and custom animations, perfectly aligning with your vision for a stunning, performant, and highly customizable application. For local state management, **AsyncStorage** will be used, providing a simple yet effective solution.

Below is the complete project structure and code for a fully functional UI skeleton, ready to be wired into your Termux backend.

---

### **Project Structure:**

```
TermuxAIApp/
├── App.js
├── tailwind.config.js
├── babel.config.js
├── package.json
├── assets/
│   └── logo.png
├── components/
│   ├── ProjectCard.jsx
│   ├── TerminalOutput.jsx
│   ├── GlobalControls.jsx
│   ├── TabBar.jsx
│   └── SplashScreen.jsx
│   └── ToggleSwitch.jsx
├── screens/
│   ├── HomeScreen.jsx
│   ├── ProjectsScreen.jsx
│   ├── LogsScreen.jsx
│   └── SettingsScreen.jsx
├── services/
│   ├── termuxApi.js
│   ├── projectData.js
│   └── storage.js
├── hooks/
│   └── useTermuxShell.js
└── context/
    └── AppContext.js
```

---

### **1. `App.js`**

This is the main entry point, handling navigation, global state (light/dark mode), and the splash screen.

```javascript
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

```

### **2. `tailwind.config.js`**

Configure Tailwind CSS for NativeWind.

```javascript
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#8B5CF6',
        'neon-blue': '#3B82F6',
        'neon-green': '#10B981',
        'dark-bg': '#0F172A',
        'dark-card': '#1E293B',
        'dark-border': '#334155',
        'terminal-green': '#34D399',
        'terminal-text': '#D1D5DB',
      },
      fontFamily: {
        mono: ['monospace'], // Or a specific monospace font like 'Menlo', 'CascadiaCode'
      },
    },
  },
  plugins: [],
}

```

### **3. `components/SplashScreen.jsx`**

An animated splash screen for a premium feel.

```javascript
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

```

### **4. `components/TerminalOutput.jsx`**

A sleek component for displaying terminal-style logs.

```javascript
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTailwind } from 'tailwindcss-react-native';
import { AppContext } from '../App';
import { useContext } from 'react';

const TerminalOutput = ({ logs, height = 150 }) => {
  const tailwind = useTailwind();
  const { isDarkMode } = useContext(AppContext);

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-200';
  const textColor = isDarkMode ? 'text-terminal-text' : 'text-gray-800';

  return (
    <View
      style={tailwind(`rounded-lg p-3 mt-3 overflow-hidden ${bgColor}`)}
      className="border border-gray-700" // Subtle border
      >
      <ScrollView
        style={{ height: height }}
        contentContainerStyle={tailwind('font-mono')}
        showsVerticalScrollIndicator={false}
      >
        {logs.map((log, index) => (
          <Text key={index} style={tailwind(`${textColor} text-xs leading-5`)}>
            <Text style={tailwind('text-terminal-green')}>{'> '}</Text>{log}
          </Text>
        ))}
        {logs.length === 0 && (
          <Text style={tailwind(`${textColor} text-xs leading-5 italic`)}>
            No logs available.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default TerminalOutput;

```

### **5. `components/ProjectCard.jsx`**

The core component for each AI project, featuring status, controls, and logs.

```javascript
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

```

### **6. `components/GlobalControls.jsx`**

For global actions like "Run All" and Telegram bot status.

```javascript
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

```

### **7. `components/ToggleSwitch.jsx`**

A simple toggle switch for settings.

```javascript
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

```

### **8. `screens/HomeScreen.jsx`**

A dashboard-like home screen.

```javascript
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

```

### **9. `screens/ProjectsScreen.jsx`**

Displays all AI projects as cards.

```javascript
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

```

### **10. `screens/LogsScreen.jsx`**

Centralized view of all project logs.

```javascript
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

```

### **11. `screens/SettingsScreen.jsx`**

Allows toggling light/dark mode and other app settings.

```javascript
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

```

### **12. `services/projectData.js`**

Mock data for your AI projects.

```javascript
export const projectData = [
  {
    id: 'ai_pdf_gen',
    name: 'AI PDF Generator',
    icon: '🧾',
    description: 'Generates professional PDF documents from various data sources using AI.',
    installStatus: 'installed', // 'installed', 'not_installed', 'installing'
    isRunning: false,
    isLoading: false,
    error: null,
    scriptName: 'pdf_generator',
    logs: [
      'PDF Generator v1.0 initialized.',
      'Ready to process requests.',
      'Last run: 2023-10-27 10:30:15',
    ],
  },
  {
    id: 'resume_gen',
    name: 'Resume Generator',
    icon: '📄',
    description: 'Crafts tailored resumes and cover letters based on job descriptions and user profiles.',
    installStatus: 'not_installed',
    isRunning: false,
    isLoading: false,
    error: null,
    scriptName: 'resume_gen',
    logs: [],
  },
  {
    id: 'meme_bot',
    name: 'Meme Bot',
    icon: '🎭',
    description: 'Generates topical and humorous memes on demand for social media.',
    installStatus: 'installed',
    isRunning: false,
    isLoading: false,
    error: null,
    scriptName: 'meme_bot',
    logs: [
      'Meme Bot activated. Listening for commands.',
      'Generated "AI takes over the world" meme.',
    ],
  },
  {
    id: 'tiktok_predictor',
    name: 'TikTok Predictor',
    icon: '🔮',
    description: 'Analyzes TikTok trends and predicts viral content potential.',
    installStatus: 'installed',
    isRunning: true, // Example of a running project
    isLoading: false,
    error: null,
    scriptName: 'tiktok_predictor',
    logs: [
      'TikTok Predictor service started.',
      'Analyzing hashtag #AIArt. Predicted virality: 85%',
      'New trend detected: "Retro Futurism".',
      'Prediction complete for "Dancing Robots".',
    ],
  },
  {
    id: 'voiceover_studio',
    name: 'Voiceover Studio',
    icon: '🗣️',
    description: 'Converts text to natural-sounding speech with various voice options.',
    installStatus: 'not_installed',
    isRunning: false,
    isLoading: false,
    error: null,
    scriptName: 'voiceover_studio',
    logs: [],
  },
  {
    id: 'seo_listicle_builder',
    name: 'SEO Listicle Builder',
    icon: '🧠',
    description: 'Generates SEO-optimized listicle articles based on keywords and topics.',
    installStatus: 'installed',
    isRunning: false,
    isLoading: false,
    error: null,
    scriptName: 'seo_listicle_builder',
    logs: [
      'SEO Listicle Builder ready.',
      'Last article: "Top 10 AI Tools for Small Businesses".',
    ],
  },
  {
    id: 'ai_bio_page_gen',
    name: 'AI Bio Page Generator',
    icon: '🔗',
    description: 'Creates personalized, engaging bio pages for professionals and creatives.',
    installStatus: 'not_installed',
    isRunning: false,
    isLoading: false,
    error: null,
    scriptName: 'bio_page_gen',
    logs: [],
  },
  {
    id: 'career_glowup_bot',
    name: 'Career Glow-Up Bot',
    icon: '📬',
    description: 'Provides personalized career advice, interview prep, and networking tips.',
    installStatus: 'installed',
    isRunning: false,
    isLoading: false,
    error: 'Failed to connect to LinkedIn API.', // Example of an error
    scriptName: 'career_bot',
    logs: [
      'Career Glow-Up Bot initializing...',
      'Error: Could not authenticate with LinkedIn API. Please check credentials.',
    ],
  },
  {
    id: 'cybersec_newsletter_bot',
    name: 'Cybersecurity Newsletter Bot',
    icon: '🧑‍💻',
    description: 'Curates and summarizes daily cybersecurity news for a tailored newsletter.',
    installStatus: 'installed',
    isRunning: true,
    isLoading: false,
    error: null,
    scriptName: 'cybersec_bot',
    logs: [
      'Cybersecurity Newsletter Bot running.',
      'Fetching latest threats from Dark Web monitors.',
      'Compiling daily digest...',
    ],
  },
];

```

### **13. `services/termuxApi.js` (Placeholder)**

This file would contain the actual bridge to Termux commands. For the UI skeleton, these are just placeholders.

```javascript
// This file would handle the communication with Termux.
// In a real Termux app, you'd use a custom native module (e.g., Java for Android)
// or a webview bridge to execute Termux commands.

// For this UI skeleton, these are simulated functions.

export const executeTermuxCommand = async (command) => {
  console.log(`Simulating Termux command: ${command}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success rate
        const fakeOutput = [
          `Executing: ${command}`,
          `...processing...`,
          `Command "${command.split(' ')[0]}" completed successfully.`,
        ];
        resolve({ success: true, output: fakeOutput });
      } else {
        const errorMessage = `Error executing "${command.split(' ')[0]}": Permission denied or command not found.`;
        reject({ success: false, error: errorMessage });
      }
    }, 1000 + Math.random() * 2000); // Simulate network/processing delay
  });
};

export const stopTermuxProcess = async (pid) => {
  console.log(`Simulating stopping Termux process with PID: ${pid}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true, message: `Process ${pid} stopped.` });
    }, 500);
  });
};

// Example of a Python backend hook (conceptual)
// In Termux, you'd have a small Python Flask/FastAPI server
// listening on localhost, and this JS function would make an HTTP request to it.
export const callPythonBackend = async (endpoint, data) => {
  console.log(`Simulating calling Python backend endpoint: /${endpoint} with data:`, data);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (endpoint === 'run_script') {
        const scriptName = data.script;
        resolve({ success: true, message: `Python backend running ${scriptName}.py` });
      } else if (endpoint === 'get_status') {
        resolve({ success: true, status: 'online', uptime: '1h 30m' });
      } else {
        reject({ success: false, error: `Unknown endpoint: ${endpoint}` });
      }
    }, 800);
  });
};
```

### **14. `services/storage.js`**

A simple wrapper for AsyncStorage.

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Error saving data:', e);
  }
};

export const getStoredData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.error('Error reading data:', e);
    return null;
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared successfully.');
  } catch (e) {
    console.error('Error clearing data:', e);
  }
};

```

### **15. `hooks/useTermuxShell.js`**

A custom React hook to simulate shell command execution.

```javascript
import { useState, useRef, useEffect } from 'react';
import { executeTermuxCommand, stopTermuxProcess } from '../services/termuxApi';

export const useTermuxShell = () => {
  const [output, setOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const currentPid = useRef(null); // Simulate PID for stopping processes

  const runCommand = async (command) => {
    setIsLoading(true);
    setError(null);
    setOutput([]); // Clear previous output
    try {
      // Simulate command execution
      const result = await executeTermuxCommand(command);
      if (result.success) {
        setOutput(result.output);
        setIsRunning(true);
        currentPid.current = Math.floor(Math.random() * 10000) + 1; // Assign a fake PID
      } else {
        setError(result.error || 'Unknown error during command execution.');
        setIsRunning(false);
      }
    } catch (e) {
      setError(e.error || 'Failed to execute command.');
      setIsRunning(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCommand = async () => {
    if (isRunning && currentPid.current) {
      setIsLoading(true);
      try {
        const result = await stopTermuxProcess(currentPid.current);
        if (result.success) {
          setOutput(prev => [...prev, result.message]);
          setIsRunning(false);
          currentPid.current = null;
        } else {
          setError(result.error || 'Failed to stop process.');
        }
      } catch (e) {
        setError('Error stopping process.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    output,
    isLoading,
    isRunning,
    error,
    runCommand,
    stopCommand,
  };
};

```

---

### **Setup Instructions (Local Development):**

1.  **Initialize React Native Project:**
    ```bash
    npx create-expo-app TermuxAIApp
    cd TermuxAIApp
    ```
2.  **Install Dependencies:**
    ```bash
    npm install tailwindcss-react-native @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack @expo/vector-icons @react-native-async-storage/async-storage
    # For iOS:
    npx pod-install
    ```
3.  **Configure Tailwind CSS:**
    *   Create `tailwind.config.js` at the root (as provided above).
    *   Ensure your `babel.config.js` is set up for NativeWind (it usually is by default with `tailwindcss-react-native`).
4.  **Copy Files:**
    *   Place the provided code into their respective files and folders (`App.js`, `components/`, `screens/`, `services/`, `hooks/`, `context/`).
    *   You might need to manually create the `assets` folder and add a placeholder `logo.png` or remove the image component from `SplashScreen.jsx`.
5.  **Run the App:**
    ```bash
    npm start
    # Then press 'a' for Android emulator/device or 'i' for iOS simulator.
    ```

---

This comprehensive UI skeleton provides a stunning, responsive, and interactive experience for your Termux AI Business Suite. The dark theme, neon accents, and terminal-style logs create the desired "hacker-luxury" feel, while the modular design allows for easy integration of your Termux backend. You can expand `services/termuxApi.js` to implement the actual bridge to Termux using various methods (e.g., Termux API, Python HTTP server, or a custom native module if building a standalone APK).
