module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        { jsxImportSource: "nativewind" }
      ],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            constants: "./constants",
            assets: "./assets",
            components: "./app/(tabs)/components",
            animations: "./app/(tabs)/components/animations", // <— optional for your animation folder
          },
        },
      ],

      // ⚠️ MUST ALWAYS BE LAST PLUGIN
      "react-native-reanimated/plugin",
    ],
  };
};
