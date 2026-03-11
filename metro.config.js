const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure GIF and PNG are handled
config.resolver.assetExts.push('gif');

module.exports = config;
