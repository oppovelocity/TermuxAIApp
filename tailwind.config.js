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
