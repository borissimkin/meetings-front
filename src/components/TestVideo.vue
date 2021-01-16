<template>
    <div>
        <video id="localVideo" autoplay playsinline></video>
        <video id="remoteVideo" autoplay playsinline></video>

        <div>
            <button id="startButton" @click="startAction">Start</button>
            <button id="callButton" @click="callAction">Call</button>
            <button id="hangupButton" @click="hangupAction">Hang Up</button>
        </div>
    </div>
</template>

<script>
    // import adapter from 'webrtc-adapter'
    export default {
        name: "TestVideo",
        data() {
            return {
                "localStream": null,
                "mediaStreamConstraints": {
                    video: true
                },
                // Set up to exchange only video
                "offerOptions": {
                    offerToReceiveVideo: 1,
                },
                // Define initial start time of the call (defined as connection between peers).
                startTime: null,
                remoteStream: null,

                localPeerConnection: null,
                remotePeerConnection: null,



            }
        },
        methods: {
            gotLocalMediaStream(mediaStream) {
                document.getElementById('localVideo').srcObject = mediaStream;
                this.localStream = mediaStream;
                console.log('Received local stream.');
                document.getElementById('callButton').disabled = false;  // Enable call button.
            },

            handleLocalMediaStreamError(error) {
                console.log('navigator.getUserMedia error: ', error);
            },
            // Handles remote MediaStream success by adding it as the remoteVideo src.
            gotRemoteMediaStream(event) {
                const mediaStream = event.stream;
                document.getElementById('remoteVideo').srcObject.srcObject = mediaStream;
                this.remoteStream = mediaStream;
                this.trace('Remote myPeer connection received remote stream.');
            },

            // Add behavior for video streams.

            // Logs a message with the id and size of a video element.
            logVideoLoaded(event) {
                const video = event.target;
                this.trace(`${video.id} videoWidth: ${video.videoWidth}px, ` +
                    `videoHeight: ${video.videoHeight}px.`);
            },

            // Logs a message with the id and size of a video element.
            // This event is fired when video begins streaming.
            logResizedVideo(event) {
                this.logVideoLoaded(event);

                if (this.startTime) {
                    const elapsedTime = window.performance.now() - this.startTime;
                    this.startTime = null;
                    this.trace(`Setup time: ${elapsedTime.toFixed(3)}ms.`);
                }
            },

            //Define RTC myPeer connection behavior

            //connects with new myPeer candidate
            handleConnection(event) {
                const peerConnection = event.target;
                const iceCandidate = event.candidate;

                if (iceCandidate) {
                    const newIceCandidate = new RTCIceCandidate(iceCandidate);
                    const otherPeer = this.getOtherPeer(peerConnection);

                    otherPeer.addIceCandidate(newIceCandidate)
                        .then(() => {
                            this.handleConnectionSuccess(peerConnection);
                        }).catch((error) => {
                        this.handleConnectionFailure(peerConnection, error);
                    });

                    this.trace(`${this.getPeerName(peerConnection)} ICE candidate:\n` +
                        `${event.candidate.candidate}.`);
                }
            },

            // Logs that the connection succeeded.
            handleConnectionSuccess(peerConnection) {
                this.trace(`${this.getPeerName(peerConnection)} addIceCandidate success.`);
            },

            handleConnectionFailure(peerConnection, error) {
                this.trace(`${this.getPeerName(peerConnection)} failed to add ICE Candidate:\n`+
                    `${error.toString()}.`);
            },

            // Logs changes to the connection state.
            handleConnectionChange(event) {
                const peerConnection = event.target;
                console.log('ICE state change event: ', event);
                this.trace(`${this.getPeerName(peerConnection)} ICE state: ` +
                    `${peerConnection.iceConnectionState}.`);
            },

            // Logs error when setting session description fails.
            setSessionDescriptionError(error) {
                this.trace(`Failed to create session description: ${error.toString()}.`);
            },

            // Logs success when setting session description.
            setDescriptionSuccess(peerConnection, functionName) {
                const peerName = this.getPeerName(peerConnection);
                this.trace(`${peerName} ${functionName} complete.`);
            },

            // Logs success when localDescription is set.
            setLocalDescriptionSuccess(peerConnection) {
                this.setDescriptionSuccess(peerConnection, 'setLocalDescription');
            },

            //Logs success when remoteDescription is set.
            setRemoteDescriptionSuccess(peerConnection) {
                this.setDescriptionSuccess(peerConnection, 'setRemoteDescription');
            },

            //Logs offer creation and sets myPeer connection session descriptions.
            createdOffer(description) {
                this.trace(`Offer from localPeerConnection:\n${description.sdp}`);

                this.trace('localPeerConnection setLocalDescription start.');
                this.localPeerConnection.setLocalDescription(description)
                    .then(() => {
                        this.setLocalDescriptionSuccess(this.localPeerConnection);
                    }).catch(this.setSessionDescriptionError);

                this.trace('remotePeerConnection setRemoteDescription start.');
                this.remotePeerConnection.setRemoteDescription(description)
                    .then(() => {
                        this.setRemoteDescriptionSuccess(this.remotePeerConnection);
                    }).catch(this.setSessionDescriptionError);

                this.trace('remotePeerConnection createAnswer start.');
                this.remotePeerConnection.createAnswer()
                    .then(this.createdAnswer)
                    .catch(this.setSessionDescriptionError);
            },

            // Logs answer to offer creation and sets myPeer connection session descriptions.
            createdAnswer(description) {
                this.trace(`Answer from remotePeerConnection:\n${description.sdp}.`);

                this.trace('remotePeerConnection setLocalDescription start.');
                this.remotePeerConnection.setLocalDescription(description)
                    .then(() => {
                        this.setLocalDescriptionSuccess(this.remotePeerConnection);
                    }).catch(this.setSessionDescriptionError);

                this.trace('localPeerConnection setRemoteDescription start.');
                this.localPeerConnection.setRemoteDescription(description)
                    .then(() => {
                        this.setRemoteDescriptionSuccess(this.localPeerConnection);
                    }).catch(this.setSessionDescriptionError);
            },

            startAction() {
                document.getElementById('startButton').disabled = true;
                navigator.mediaDevices.getUserMedia(this.mediaStreamConstraints)
                    .then(this.gotLocalMediaStream).catch(this.handleLocalMediaStreamError);
                this.trace('Requesting local stream.');
            },

            callAction() {
                document.getElementById('callButton').disabled = true;
                document.getElementById('hangupButton').disabled = true;

                this.trace('Starting call.');
                this.startTime = window.performance.now();

                // Get local media stream tracks.
                const videoTracks = this.localStream.getVideoTracks();
                const audioTracks = this.localStream.getAudioTracks();
                if (videoTracks.length > 0) {
                    this.trace(`Using video device: ${videoTracks[0].label}.`);
                }
                if (audioTracks.length > 0) {
                    this.trace(`Using audio device: ${audioTracks[0].label}.`);
                }

                const servers = null;  // Allows for RTC server configuration.

                // Create myPeer connections and add behavior.
                this.localPeerConnection = new RTCPeerConnection(servers);
                this.trace('Created local myPeer connection object localPeerConnection.');

                this.localPeerConnection.addEventListener('icecandidate', this.handleConnection);
                this.localPeerConnection.addEventListener(
                    'iceconnectionstatechange', this.handleConnectionChange);

                this.remotePeerConnection = new RTCPeerConnection(servers);
                this.trace('Created remote myPeer connection object remotePeerConnection.');

                this.remotePeerConnection.addEventListener('icecandidate', this.handleConnection);
                this.remotePeerConnection.addEventListener(
                    'iceconnectionstatechange', this.handleConnectionChange);
                this.remotePeerConnection.addEventListener('addstream', this.gotRemoteMediaStream);

                // Add local stream to connection and create offer to connect.
                this.localPeerConnection.addStream(this.localStream);
                this.trace('Added local stream to localPeerConnection.');

                this.trace('localPeerConnection createOffer start.');
                this.localPeerConnection.createOffer(this.offerOptions)
                    .then(this.createdOffer).catch(this.setSessionDescriptionError);

            },

            // Gets the name of a certain myPeer connection.
            getPeerName(peerConnection) {
                return (peerConnection === this.localPeerConnection) ?
                    'localPeerConnection' : 'remotePeerConnection';
            },

            //Gets the "other" myPeer connection.
            getOtherPeer(peerConnection) {
                return (peerConnection === this.localPeerConnection) ?
                    this.remotePeerConnection : this.localPeerConnection;
            },

            // Handles hangup action: ends up call, closes connections and resets peers.
            hangupAction() {
                this.localPeerConnection.close();
                this.remotePeerConnection.close();
                this.localPeerConnection = null;
                this.remotePeerConnection = null;
                document.getElementById('hangupButton').disabled = true;
                document.getElementById('callButton').disabled = false;
                this.trace('Ending call.');
            },



            trace(text) {
                text = text.trim();
                const now = (window.performance.now() / 1000).toFixed(3);

                console.log(now, text);
            },



        },

        created() {
            navigator.mediaDevices.getUserMedia(this.mediaStreamConstraints)
                .then(this.gotLocalMediaStream).catch(this.handleLocalMediaStreamError);
            document.getElementById('localVideo').addEventListener('loadedmetadata', this.logVideoLoaded);
            document.getElementById('remoteVideo').addEventListener('loadedmetadata', this.logVideoLoaded);
            document.getElementById('remoteVideo').addEventListener('onresize', this.logResizedVideo);
            document.getElementById('callButton').disabled = true;
            document.getElementById('hangupButton').disabled = true;

        }


    }
</script>

<style scoped>
    video {
        max-width: 100%;
        width: 320px;
    }
</style>