class Command {

  constructor() {
    this.helpDescription="";
    this.shortDescription="";
  }

  evaluate(input) {
  }

  getServices(service) {
    var sc = require("../main").default.services;
    var others = [];
    //console.log(sc);
    for(var i in sc) {
      var s = sc[i];
      if(s == service) {
        console.log("OLD");
      }
      else {
        others.push(s);
      }
    }
    /*for(var i in sc) {
      var service = sc[i];

      if(service.writeLine != null) {
        console.log("Write Line: ",service.writeLine);
      }
      if(service.playSound != null) {
        console.log("Play Sound: ", service.playSound);
      }
    }*/
    return others;
  }
}

export default Command;
