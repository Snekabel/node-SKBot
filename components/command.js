class Command {

  constructor() {
    this.helpDescription="No helptext for this command";
    this.shortDescription="No helptext for this command";
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
        //console.log("OLD");
      }
      else {
        others.push(s);
      }
    }
    return others;
  }
}

export default Command;