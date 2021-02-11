
const productionPeerConfig = {
  config: {
    iceServers: [
      {
        url: 'stun:stun.l.google.com:19302'
      }
    ]
  },
  host: `${process.env.VUE_APP_PEER_SERVER_PATH}`,
}

const developmentPeerConfig = {
  host: '/',
  port: 3001
}

export const getPeerConfig = () => {
  return process.env.NODE_ENV === 'development' ? developmentPeerConfig : productionPeerConfig;
}
