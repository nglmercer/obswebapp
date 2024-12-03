module.exports = {
    publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'nglmercer',
          name: 'Twitch-Minecraft-TTS'
        },
        release: true
      }
    }
  ],
  packagerConfig: {
    asar: true,
    icon: './assets/icon.ico'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'melser',
        description: 'tiktok interactive app',
        options: {
          icon: '/assets/icon.ico'
        }
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['linux']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: '/assets/icon.ico'
        },
        arch: ['arm64'] // Specify ARM64 architecture
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    }
  ],
  editors: {
    "melser": "/" // Replace with your editor info
  }
};