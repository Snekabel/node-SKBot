import 'isomorphic-fetch';
const { JSDOM } = require("jsdom");

/*let promise = null;
let result = null;*/
let links = {

}

const Link = {
  getDomFromURL(url) {
    let href = url.href;
    console.log("Get Dom From URL");
    if(links[href] && links[href].results) {
      console.log("Result already exist send that");
      links[href].promise = Promise.resolve(links[href].results);
    }
    else {
      if(links[href] && links[href].promise) {
        console.log("Existing Promise return that");
        return links[href].promise;
      }
      else {
        console.log("No promise exist make a new one");
        /*promise = fetch(url)
        .then(res => {
            console.log("Fetch Done, reseting promise");
            promise = null;
            return res;
        })*/
        //console.log("URL: ",url.href);
        links[href] = {
          promise: JSDOM.fromURL.bind(this,url.href)()
          .then(dom => {
            console.log("JSDOM Done, reseting promise");
            links[href].promise = null;
            links[href].results = dom;
            return dom;
          })
        }
      }
    }
    return links[href].promise;
  }
}

Object.freeze(Link);

export default Link;
