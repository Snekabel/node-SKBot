class Command {

  constructor(commandController, commandSettings) {
    this.helpDescription="No helptext for this command";
    this.shortDescription="No helptext for this command";
    this.settings = commandSettings;
  }

  evaluateMessage(input) {
  }

  evaluateFile(input) {
  }
}

export default Command;
