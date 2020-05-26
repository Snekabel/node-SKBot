class Service {
    constructor(hostConfig) {
      //this.cc = commandController;
      this.hostConfig = hostConfig;
    }

    quit(reason) {
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
