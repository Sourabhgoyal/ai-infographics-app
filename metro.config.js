const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ensure GIF and PNG are handled
config.resolver.assetExts.push('gif');

// Intercept react-native bare imports on web → redirect to react-native-web
const rnwEntry = require.resolve('react-native-web');
const defaultResolver = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native') {
    return { filePath: rnwEntry, type: 'sourceFile' };
  }
  if (defaultResolver) return defaultResolver(context, moduleName, platform);
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
