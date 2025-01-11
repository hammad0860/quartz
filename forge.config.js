const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon:  'src/main/icons/icon', 
    name: 'Myriade',

  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {authors: 'Myriade Inc.',
        description: 'Mine Some Crypto!'},
        setupIcon: 'src/main/icons/icon.ico', 
        iconUrl: 'src/main/icons/icon.ico', 
        shortcutName: 'Quartz',
        productName: 'Myriade'

    },
    {
      name: '@electron-forge/maker-zip',  
      platforms: ['darwin'],
    },

    {
      name: '@electron-forge/maker-dmg', 
      config: {
        icon: 'src/main/icons/icon.icns', 
        format: 'ULFO', 
        productName: 'Myriade',
      },
    },

    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'Myriade Team', 
          homepage: 'https://myriade.app', 
          icon: 'src/main/icons/icon-512x512.png', 
          categories: ['Utility'], 
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          maintainer: 'Myriade Team', 
          homepage: 'https://myriade.app', 
          icon: 'src/main/icons/icon-512x512.png', 
          categories: ['Utility'], 
        },
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },

    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
