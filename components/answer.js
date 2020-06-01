class Answer {
  constructor(to, text, audio) {
    this.to = to;
    this.text = text;
    this.audio = audio;
  }

  setTo(to) {
    this.to = to;
  }
  setText(text) {
    this.text = text;
  }
  setAudio(audio) {
    this.audio = audio;
  }
}

export default Answer;
