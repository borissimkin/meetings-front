<template>
    <div>
        <video id="localVideo" autoplay playsinline></video>
        <video id="removeVideo" autoplay playsinline></video>

        <div>
            <button id="startButton">Start</button>
            <button id="callButton">Call</button>
            <button id="hangupButton">Hang Up</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TestVideo",

        data() {
            return {
                "localStream": null,
                "mediaStreamConstraints": {
                    video: true
                }
            }
        },
        methods: {
            gotLocalMediaStream(mediaStream) {
                this.localStream = mediaStream;
                document.getElementById('localVideo').srcObject = mediaStream;
            },

            handleLocalMediaStreamError(error) {
                console.log('navigator.getUserMedia error: ', error);
            }

        },

        created() {
            navigator.mediaDevices.getUserMedia(this.mediaStreamConstraints)
                .then(this.gotLocalMediaStream).catch(this.handleLocalMediaStreamError);
        }


    }
</script>

<style scoped>

</style>