import Command from '../command';
const stream = require("youtube-audio-stream");


class Music extends Command {

  constructor() {
    super();

    this.helpDescription = "Music component";
    this.shortDescription= "Template Short Help";

    this.playlist = [];

    var url = "http://youtube.com/watch?v=ZI-ol25RFws";
    const lame = require('lame');
    const Speaker = require('speaker');

    stream(url).pipe(new lame.Decoder).pipe(new Speaker);
  }

  evaluate(input, service) {
    //console.log("service",service);
    var services = super.getServices(service);

    var message = input.message;
    var split = message.split(/\s+/);

    /*for(var i in split) {
      if(split[i].indexOf("http://"))
    }*/
  }

  addMusic(song) {
    this.template.push(song);
  }
}
export default Music;
