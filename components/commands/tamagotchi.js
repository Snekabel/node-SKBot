import Command from '../classes/command.js';
import commandController from '../controllers/commandController.js';
import Answer from '../classes/answer.js';

class Tamagotchi extends Command {
  constructor(settings) {
    super(settings);

    this.hunger = 0;
    this.happy = 10;
    this.deathState = false;
    this.tickCounter = 0;

    this.tickInterval = setInterval(this.tick.bind(this), this.settings.tickrate);
    this.lastInput = null;
    this.service = null;
  }

  tick() {
    if(!this.deathState) {
      this.tickCounter++;
      if(this.tickCounter % 2) {
        //console.log("Tick");
        this.hunger++;
      }
      else {
        //console.log("Tock");
        this.happy--;
      }
      this.checkDeath();
    }
  }

  evaluateMessage(input,service){
    this.lastInput = input;
    this.service = service;
    let promise = new Promise((resolve, reject) => {
      var answers = [];
      var message = input.message;
      //console.log("services: ",services);

      let promise = new Promise((resolve, reject) => {
        message = message.toLowerCase();
        switch(message) {
          case "!feed": {
            if(!this.deathState) {answers.push(new Answer(input.to,this.feed()))};
            break;
          }
          case "!pet": {
            if(!this.deathState) {answers.push(new Answer(input.to,this.pet()))};
            break;
          }
          case "!kick": {
            if(!this.deathState) {answers.push(new Answer(input.to,this.kick()))};
            break;
          }
          case "!status": {
            answers.push(new Answer(input.to,this.status()));
            break;
          }
        }
      });

      resolve(answers);
      //this.service.playSound(this.settings.stations[i].url,null);
    });
    return promise;
  }

  feed() {
    this.hunger = this.hunger - 100;
    if(this.hunger<0) { this.hunger = 0; }
    return "Hunger now at: "+ this.hunger;
  }
  status() {
    if(!this.deathState) {
      return "Hunger: "+ this.hunger+ ", Happiness: "+ this.happy;
    }
    else {
      return "Dead...";
    }
  }
  pet() {
    this.happy = this.happy + 10;
    if(this.happy > 20) { this.happy = 20;}
    return "Happiness at: "+this.happy;
  }
  kick() {
    this.happy = this.happy - 10;
    return "Owee... Happiness at : "+this.happy;
  }
  die() {
    this.deathState = true;
    if(this.service) {
      this.service.writeLine(this.lastInput.to, "Dead...");
    }
  }
  checkDeath() {
    if(this.happy <= 0 || this.hunger >= 500) {
      this.die();
    }
    else {
      //console.log("Not dead yet");
    }
  }
}
export default Tamagotchi;
