import settingsController from './components/controllers/settingsController.js';
import commandController from './components/controllers/commandController.js';
import serviceController from './components/controllers/serviceController.js';
//import api from './components/api.js';

var state = {};
console.log("Starting SKBot");

settingsController.init();

// If the Node process ends, close the Mongoose connection
const sigs = ['SIGINT', 'SIGTERM', 'SIGQUIT']
sigs.forEach(sig => {
  process.on(sig, () => {
    // Stops the server from accepting new connections and finishes existing connections.
    console.log("End of the server", sig);
    let services = serviceController.getServices();
    for(let s in services) {
      if(services.hasOwnProperty(s)) {
        let service = services[s];
        if(service.quit) {
          service.quit();
        }
      }
    }
    process.exit(0);
  })
})
//console.log(settings);

//var api = new Api(cc, sc, set);
