module.exports = {
  packagerConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['linux', 'win32']
    },
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'melser',
        description: 'tiktok interactive app',
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          bin: 'obswebapp',
          maintainer: 'melser',
          homepage: 'https://github.com/nglmercer',
        },
      },
    },
  ],
};