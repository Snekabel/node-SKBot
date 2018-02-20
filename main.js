import Settings from './components/settings';
//import Test from './components/commands/test';
import CommandController from './components/commandController';
import ServiceController from './components/serviceController';
import Api from './components/api';

var cc = new CommandController();
var sc = new ServiceController(cc);
//cc.setSC(sc);
var set = new Settings(cc,sc);
var api = new Api(cc, sc, set);

export default sc;


//module.exports.main = main;
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
