const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// adiciona suporte ao .tflite
config.resolver.assetExts.push("tflite");

module.exports = config;