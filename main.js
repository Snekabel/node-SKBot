import settings from './components/settings';
//import Test from './components/commands/test';
import commandController from './components/commandController';
import serviceController from './components/serviceController';
import api from './components/api';

var state = {};
console.log("Starting SKBot");

//var cc = new CommandController(state);
//var sc = new ServiceController(cc);
//cc.setSC(sc);
//var set = new Settings(cc,sc);
settings.readFile();

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

//export default sc;


//console.log(set.settings);
//console.log(cc.commands);
//cc.commands.test.evaluate("test");
/*for(var command in cc.commands) {
  cc.commands[command].evaluate("test");
}*/

/*var te = new Test();
commands.push(te);

var input = "test";
var input2 = "intetest";
for(var row in commands){
    commands[row].evaluate(input);
    commands[row].evaluate(input2);
    //console.log(commands[row].helpDescription);
}*/
