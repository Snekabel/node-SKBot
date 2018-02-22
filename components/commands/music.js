import Command from '../command';

class Music extends Command {

  constructor() {
    super();

    this.helpDescription = "Music component";
    this.shortDescription= "Template Short Help";

    this.playlist = [];
  }

  evaluate(input, service) {
    //console.log("service",service);
    var services = super.getServices(service);

    var message = input.message;
    var split = message.split(/\s+/);

    for(var i in split) {
      if(split[i].indexOf("http://"))
    }
  }

  addMusic(song) {
    this.template.push(song);
  }
}
export default Music;
