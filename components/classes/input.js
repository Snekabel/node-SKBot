class Input {
  constructor(input, image = null) {
    this.from = input.from;
    this.to = input.to;
    this.message = input.message;
    this.image = image;

    this.message_split = this.splitMessage(input.message);
    this.parameters = this.getParams(this.message_split);
  }

  setTo(to, service = true) {
    this.to = {"recipient": to, "service": service};
  }
  setText(text) {
    this.text = text;
  }
  setAudio(audio) {
    this.audio = audio;
  }
  setImage(image) {
    this.image = image;
  }
  setFancy(fancyObject) {
    this.fancy = fancyObject;
  }

  splitMessage(message) {
    return message.toLowerCase().split(/\s+/);
  }
  getParams(message_split) {
    let params = [];
    for(let i = 1; i < message_split.length; i++) {
      let param = message_split[i].split("=");
      params.push(param);
    }
    return params;
  }
}

export default Input;
