import Fileparser from "../fileparser.js";

class M3U extends Fileparser {
    constructor() {
    }

    // Takes one path to a potential file as input and evaluates if its something relevant to this fileparser
    // If its found to be interesting request it to be downloaded and then pass the data onto
    evaluatePath(input) {
      if(input.indexOf(".m3u") > -1) {
        fileLoader.request(input);
      }
    }

    // The parseData function where the file is actually parsed and returned
    parseData(data){
    }
}

export default Fileparser;
