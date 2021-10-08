import Command from '../classes/command.js';
import serviceController from '../controllers/serviceController.js';
import Answer from '../classes/answer.js';

export default class Memes extends Command {

  constructor(settings, sliceKey) {
    super(settings, sliceKey);

    this.helpDescription = "Fresh memes";
    this.shortDescription= "Memetown USA";

    this.triggers = this.makeMemeTriggers();
    //console.log("Triggers: ", this.triggers);
  }

  addMeme(newMemes) {
    console.log("New tasty meme: ", newMemes);
    let memes = this.settings.memes;
    //console.log("Old Memes: ", memes);
    //memes.push(newMeme);
    //memes[]
    Object.assign(memes,newMemes);
    this.saveSetting("memes", memes);
  }

  next() {
    console.log("Done");
  }

  makeMemeTriggers() {
    let triggers = {};
    let meme_settings = this.settings.memes;
    for(let m in meme_settings) {
      if(meme_settings.hasOwnProperty(m)) {
        triggers[m] = {
          "desc": "Meme",
          "func": function(meme, input) {console.log("MEME INPUT", meme, input); return new Answer(input.to, meme.text || null, meme.audio || null, meme.image || null)}.bind(this, this.settings.memes[m])
        }
      }
    }
    return triggers;
  }
}
