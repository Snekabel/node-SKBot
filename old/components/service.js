class Service {
    constructor(hostConfig, commandController) {
      this.cc = commandController;
      this.hostConfig = hostConfig;
    }

    /* All Things the Service needs to provide for the commands */
    writeLine(to, text) {
    }

    stopSound() {
    }

    playSound(url, onEnd) {
    }

    incrementVolume(addVolume) {
    }

    decreaseVolume(decreaseVolume) {
    }

    /* All eventhandlers that runs code when stuff happen */
    onMessage(data){
    }
}

export default Service;
