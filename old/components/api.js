const express = require('express');

class Api {
  constructor(cc, sc, set) {
    this.cc = cc;
    this.sc = sc;
    this.set = set;
    console.log(set.settings.api_port);

    if(set.settings.api_port != null) {
      const app = express();
      var router = express.Router();

      /*app.get('/', (req, res) => res.send('Hello World!'));*/
      app.use(router);

      router.all('/', function (req, res, next) {
        console.log('Someone made a request!');
        next();
      });
      router.get('/test', function(req, res) {
        res.send("Test");
      });

      app.listen(set.settings.api_port, () => console.log('SKBot listening on port '+set.settings.api_port+'!'));
    }


  }
}

export default Api;
