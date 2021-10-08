class Answer {
  constructor(to, text = null, audio = null, image = null) {
    this.to = {"recipient": to, "service":false};
    this.text = text;
    this.audio = audio;
    this.image = image;
  }

  setTo(to, service = true) {
    this.to = {"recipient": to, "service": service};
    return this;
  }
  setText(text) {
    this.text = text;
    return this;
  }
  setAudio(audio) {
    this.audio = audio;
    return this;
  }
  setImage(image) {
    this.image = image;
    return this;
  }
  setFancy(fancyObject) {
    this.fancy = fancyObject;
    return this;
  }
}

export default Answer;
