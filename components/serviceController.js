import commandController from './commandController';

class ServiceController {
  constructor() {
    this.services = {};
    //this.cc = cc;
  }

  loadService(name, hostConfig) {
    var service = require('./services/'+name).default;
    //console.log(service);
    if(hostConfig.disabled !== true) {
      this.services[name] = (new service(hostConfig, this.cc));
    }
  }

  getServices(service) {
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
}

var serviceController = new ServiceController();
export default serviceController;
