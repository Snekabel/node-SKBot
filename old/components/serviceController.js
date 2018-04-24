class ServiceController {
  constructor(cc) {
    this.services = {};
    this.cc = cc;
  }

  loadService(name, hostConfig) {
    var service = require('./services/'+name).default;
    //console.log(service);
    this.services[name] = (new service(hostConfig, this.cc));
  }
}

export default ServiceController;
