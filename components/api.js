//const express = require('express')
import express from "express";
//const bodyParser = require('body-parser');
import bodyParser from "bodyParser";
//const formidable = require('formidable');
import formidable from "formidable";
//const fs = require('fs');
import fs from "fs";
//const mv = require('mv');
import mv from "mv";
//const parser = require('xml2json');
import parser from "xml2json";
const {distanceBetweenPoints, speedBetweenPoints, leaflet} = require("./mapLib");
import commandController from './controllers/commandController.js';
import serviceController from './controllers/serviceController.js';
import Service from './service.js';
import Answer from './classes/answer.js';

class Api {
  constructor() {
    this.versionnumber = 1;
    this.port = null;
  }

  setPort(port) {
    this.port = port;
  }
  setSettings(settings) {
    this.port = settings.port;
  }

  init() {
    if(this.port != null) {
      const app = express();
      var router = express.Router();

      /*app.get('/', (req, res) => res.send('Hello World!'));*/
      app.use(express.static('./static'));
      app.use(express.static('./gpx'));
      app.use(express.static('./audio'));
      app.use(express.static('./images'));

      //app.use(bodyParser.json());
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

      router.get('/api/question/', function(req, res) {
        let question = decodeURI(req.query.question);
        //let apiService = new ApiService(req,res);
        console.log("Question:",question);
        let input = {
          "message":question,
          "to":""
        }
        let commandPromises = [];
        for(var command in commandController.commands) {
          commandPromises.push(commandController.commands[command].evaluateMessage(input, null))
        }
        res.writeHead(200, {'Content-Type': 'text/html'});

        Promise.all(commandPromises).then(function(values) {
          console.log("Promise Values",values);
          for(let v in values) {
            if(values.hasOwnProperty(v)) {
              // Loop all the answeres we got from different commands
              let promiseResult = values[v];


              for(let o in promiseResult) {
                if(promiseResult.hasOwnProperty(o) && promiseResult[o]) {
                  // If an command gives multiple answers loop them too
                  let answer = promiseResult[o];
                  if(answer.text) { res.write("<p>"+answer.text+"</p>") }
                  if(answer.audio) {
                    res.write("<audio autoplay controls src=\"/"+answer.audio+"\"/>");
                  }
                }
              }
            }
          }
          res.end();
        }.bind(this))
      });
      router.post('/api/v'+this.versionnumber+'/gameserver/playerJoined', function(req, res) {
        console.log("Player Joined");
        console.log(req.body);
        //console.log(serviceController);
        let line = req.body.username+" joined "+req.body.game+" server";
        console.log(line);
        //serviceController.services["mumble"].writeLine("Snekabel", line);
        //serviceController.services["discord"].writeLine("skbot", line);
        let answer = new Answer("skbot", line);
        serviceController.services["discord"].evaluateAnswer(answer);
        res.send(JSON.stringify({status:"ok", playerName: req.body.username}));
      }.bind(this))
      router.post('/api/v'+this.versionnumber+'/gameserver/playerDisconnected', function(req, res) {
        console.log("Player Disconnected");
        console.log(req);
        //console.log(serviceController);
        let line = req.body.username+" left "+req.body.game+" server";
        console.log(line);
        //serviceController.services["mumble"].writeLine("Snekabel", line);
        //serviceController.services["discord"].writeLine("skbot", line);
        let answer = new Answer("skbot", line);
        serviceController.services["discord"].evaluateAnswer(answer);
        res.send(JSON.stringify({status:"ok", playerName: req.body.username}));
      }.bind(this))

      router.get('/api/v'+this.versionnumber+'/map/distance/:lat1/:lon1/:lat2/:lon2', function(req, res) {
        if (req.params.lat1 && req.params.lon1 && req.params.lat2 && req.params.lon2) {
            let pos1 = {lat: req.params.lat1, lon: req.params.lon1};
            let pos2 = {lat: req.params.lat2, lon: req.params.lon2};
  		      res.send(JSON.stringify(distanceBetweenPoints(pos1, pos2)+"m"));
	       }
         else {
           res.send("Nothing");
         }
      })
      router.get('/api/v'+this.versionnumber+'/map/distance/:lat1/:lon1/:lat2/:lon2/:time1/:time2', function(req, res) {
        if (req.params.lat1 && req.params.lon1 && req.params.time1 && req.params.lat2 && req.params.lon2 && req.params.time2) {
            let pos1 = {lat: req.params.lat1, lon: req.params.lon1};
            let pos2 = {lat: req.params.lat2, lon: req.params.lon2};
            res.send(JSON.stringify(speedBetweenPoints(pos1, req.params.time1, pos2, req.params.time2)+"km/h"));
         }
         else {
           res.send("Nothing");
         }
      })
      router.get('/html/map/', function(req, res) {
        var token = "pk.eyJ1IjoidGJ0aGVncjgxIiwiYSI6ImNqdG80YTFnNzA1cHg0OXF0ZW81eDBtemkifQ.zdnYP1ufAPburgumLeECFw";
        leaflet(res, token);
      });
      router.get('/html/map/:gpxfile', function(req, res) {
        var token = "pk.eyJ1IjoidGJ0aGVncjgxIiwiYSI6ImNqdG80YTFnNzA1cHg0OXF0ZW81eDBtemkifQ.zdnYP1ufAPburgumLeECFw";
        leaflet(res, token, req.params.gpxfile);
      });

      router.post('/api/gpx', function(req, res) {
        // Handle uploading of GPX file
        console.log("Uploading GPX file!");
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
          for (var file in files) {
            if (files.hasOwnProperty(file)) {
              //console.log(files[file]);
              var oldpath = files[file].path;
              var newpath = '/mnt/raid/node/skbot/gpx/' + files[file].name;
              mv(oldpath, newpath, function(err) {
                if (err) {
                  error.log(err);
                  res.write("Error");
                }
                else {
                    res.write('File uploaded and moved!');
                }
                res.end();
              });
            }
          }
        });
      });

      router.get('/api/gpx/:gpxfile', function(req, res) {
        fs.readFile('gpx/'+req.params.gpxfile, 'utf8', function(err, contents) {
          if (err) {
            error.log(err);
            res.write("Error");
          }
          else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(parser.toJson(contents));
          }
          res.end();
        });
      });

      router.get('/*', (req, res) => {
          console.log("Request");
          //res.send("Nothing");
          //console.log("Request: ", req);
      });

      app.use(router);

      app.listen(this.port, () => console.log('SKBot listening on port '+this.port+'!'));
    }
  }
}
var api = new Api();

export default api;
