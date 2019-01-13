const express = require('express')
const bodyParser = require('body-parser');

class Api {
  constructor(cc, sc, set) {
    this.cc = cc;
    this.sc = sc;
    this.set = set;
    console.log(set.settings.api_port);
    this.versionnumber = 1;

    if(set.settings.api_port != null) {
      const app = express();
      var router = express.Router();

      /*app.get('/', (req, res) => res.send('Hello World!'));*/

      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
          extended: true
      }));
      //app.use(express.json());
      router.all('/api/v'+this.versionnumber, function (req, res, next) {
        console.log('Someone made a request!');
        next();
      });
      router.get('/test', function(req, res) {
        res.send("Test");
      });
      router.post('/api/v'+this.versionnumber+'/gameserver/playerJoined', function(req, res) {
        console.log("Player Joined");
        console.log(req.body);
        //console.log(this.sc);
        let line = req.body.username+" joined Snekabel "+req.body.game+" server";
        console.log(line);
        //this.sc.services["mumble"].writeLine("Snekabel", line);
        this.sc.services["discord"].writeLine("skitsnack", line);
        res.send(JSON.stringify({status:"ok", playerName: req.body.username}));
      }.bind(this))
      router.post('/api/v'+this.versionnumber+'/gameserver/playerDisconnected', function(req, res) {
        console.log("Player Disconnected");
        console.log(req.body);
        //console.log(this.sc);
        let line = req.body.username+" left Snekabel "+req.body.game+" server";
        console.log(line);
        //this.sc.services["mumble"].writeLine("Snekabel", line);
        this.sc.services["discord"].writeLine("skitsnack", line);
        res.send(JSON.stringify({status:"ok", playerName: req.body.username}));
      }.bind(this))

      app.use(router);

      app.listen(set.settings.api_port, () => console.log('SKBot listening on port '+set.settings.api_port+'!'));
    }

  }
}

export default Api;
