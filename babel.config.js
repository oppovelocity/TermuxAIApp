module.exports = function(api) {
 api.cache(true);
 
 return {
  presets: [
   '@babel/preset-env', // Transpile modern JS based on your target environments
   '@babel/preset-react', // If using React JSX
  ],
  plugins: [
   '@babel/plugin-transform-runtime', // Helps with code reuse, async/await, etc.
  ],
 };
};