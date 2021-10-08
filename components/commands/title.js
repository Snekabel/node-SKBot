import Command from '../classes/command.js';
import serviceController from '../controllers/serviceController.js';
import Link from '../LinkFactory.js';
import {findLinks,matchRuleShort} from '../lib.js';
import Answer from '../classes/answer.js';

class Title extends Command {

  constructor(settings,sliceKey) {
    super(settings,sliceKey);

    this.helpDescription = "Title Help";
    this.shortDescription= "TH";

    this.triggers = {
      "http://": {
        "desc": "catches HTTP",
        "func": this.getTitle.bind(this)
      },
      "https://": {
        "desc": "catches HTTPS",
        "func": this.getTitle.bind(this)
      }
    }

    this.sites = settings.sites;
  }

  evaluateMessage(input, service) {
    return super.evaluateMessage(input,service);
  }
  evaluateFile(link, file, input, service) {
    //console.log(file);
    let dom = file.content;
    /*var title = dom.window.document.querySelector("title").innerHTML;
    console.log("Title:",title);
    if(title != null) {
      service.writeLine(input.to, ("Title: "+title));
    }
    */
    var title = dom.window.document.querySelector("title").innerHTML;
    var price;

    console.log("W: ",link.href.indexOf("webhallen.com"));
    if(link.href.indexOf("webhallen.com") > -1) {
      console.log("Webhallen!");
      //price = dom.window.document.querySelector("#product_price").innerHTML;
      var pathname = link.href.split("/");
      var id = pathname[pathname.length-1].split("-")[0];

      /*if(data) {
        price = data.offer.price;
      }*/
    }

    if(title != null && title != "") {
      let lineToWrite = "Title: "+title;
      if(price) {
        lineToWrite += ", Price: "+price;
      }
      service.writeLine(input.to, lineToWrite);
    }
  }
  getTitle(input, service) {
    //console.log("Get Title!");
    var start = (new Date).getTime();
    var message = input.message;

    let promise = new Promise((resolve, reject) => {
      var links = findLinks(message);
      //console.log("Links: ",links);
      //resolve(new Answer(input.to, "lol"));

      let linkPromises = [];
      for(var i in links) {
        if(links.hasOwnProperty(i)) {

          console.log("Link: ", links[i]);

          linkPromises.push(Link.getDomFromURL(links[i]).then(dom => {
            let answerPromises = [];
            //console.log("GotDOMFromURL!");
            if(dom !== null) {
              //console.log("Looping DOM");
              for(let s in this.sites) {
                if(this.sites.hasOwnProperty(s)) {
                  let site = this.sites[s];
                  console.log("Site: ", site);
                  //console.log("Site: ", site, links[i].host, site.domains);

                  let siteMatch;
                  //console.log("Site Domains: ", site.domains);
                  for(let d in site.domains) {
                    //console.log("Checking: ", site.domains[d])
                    siteMatch = matchRuleShort(links[i].host, site.domains[d]);
                    //console.log("MatchRuleShort:",siteMatch);
                    if(siteMatch) {
                      //console.log("Breaking loop");
                      break;
                    }
                  }
                  //console.log("MatchRuleShort:",siteMatch);
                  if(siteMatch) {
                    //let scrapedData = [];

                    for(let sel in site.selectors) {
                      if(site.selectors.hasOwnProperty(sel)) {

                        let selector = site.selectors[sel];
                        console.log("Selector: ", selector);
                        let element = dom.window.document.querySelector(selector);
                        answerPromises.push(
                          Promise.resolve(sel + ": " + (element.innerHTML ? element.innerHTML : element.getAttribute("content")))
                        )
                      }
                    }
                    if(site.function) {
                      console.log("Call this function for site: ", site.function);
                      //console.log(this.plugins);
                      answerPromises.push(this.plugins[site.function](links[i], dom));
                    }

                    //console.log("Scraped Data: ",scrapedData);
                    //let title = scrapedData.join(" ");
                    //console.log("Title: ", title);
                    //return(new Answer(input.to, title))
                  } else {
                    console.log("No match here");
                    /*var title = dom.window.document.querySelector("title").innerHTML;
                    console.log("Title:",title);
                    if(title != null) {
                      //service.writeLine(input.to, ("Title: "+title));
                      console.log("TItle: ", title);
                      return(new Answer(input.to, "Title: "+title))
                    }*/

                  }
                }
              }
              return Promise.all(answerPromises).then(function(values) {
                console.log("Values: ", values);
                let title = values.join(" ");
                console.log("TITLE: ", title);
                return(new Answer(input.to, title))
              })
              if(answerPromises.length === 0) {
                //console.log("No matching site found, default behavior!");
                var title = dom.window.document.querySelector("title").innerHTML;
                //console.log("Title:",title);
                if(title != null) {
                  //service.writeLine(input.to, ("Title: "+title));
                  //console.log("Title: ", title);
                  return(new Answer(input.to, "Title: "+title))
                }
              }
            }
            //return;
          }));
        }
      }
      Promise.all(linkPromises).then(function(values) {
        //console.log("All Links Downloaded: ", values);
        resolve(values);
      }.bind(this));

    });
    return promise;

    //return answers;


    /*async.each(links, function(item, callback){
    },
    function() {
      //console.log("Answers",answers);
      var stop = (new Date).getTime();
      //answers.push({"text": ("Time: "+(stop-start))})
      //fulfill(answers);
    });*/
  }
}
export default Title;
