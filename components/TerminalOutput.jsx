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
