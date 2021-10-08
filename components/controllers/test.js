import Command from '../classes/command.js';

export function hi() {
  console.log(`Hello`);
}

export function bye() {
  console.log(`Bye`);
}

export class poopo extends Command {
  constructor() {
    super();
    console.log("poopo");
  }
}
