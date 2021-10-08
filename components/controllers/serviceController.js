import commandController from './commandController.js';


class ServiceController {
  constructor() {
    this.services = {};
    //this.cc = cc;
  }

  loadService(name, hostConfig) {
    console.log("Loading: ", name);
    //var service = require('../services/'+name).default;
    /*import('../services/'+name+".js").then(
      function(service) {
        console.log(service);
        if(hostConfig.disabled !== true) {
          this.services[name] = (new service(hostConfig, this.cc));
        }
      }.bind(this)
    )*/
    import('../services/'+name+".js").then(
      function(service) {
        let s = service.default;
        //console.log(name, "Service: ", s);
        if(hostConfig.disabled !== true) {
          this.services[name] = new s(hostConfig, this.cc);
        }
        //this.commands[commandName] = new c(commandSettings, commandName);
      }.bind(this)
    ).catch(
      function(err) {
        console.error("Error loading service "+name,err);
      }
    )

  }

  getOtherServices(service) {
    //var sc = require("../main").default.services;
    var others = [];
    //console.log(sc);
    for(var i in this.services) {
      if(this.services.hasOwnProperty(i)) {
        var s = this.services[i];
        if(s == service) {
          //console.log("OLD");
        }
        else {
          others.push(s);
        }
      }
    }
    return others;
  }

  getServices(service) {
    return this.services;
  }
}

var serviceController = new ServiceController();
export default serviceController;
