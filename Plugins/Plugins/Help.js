import {NAME, VERSION} from "../../Constants";

class Help {
    constructor(PluginsService, mTrigger) {
        this.pluginsService = PluginsService;
        this.mTrigger = mTrigger;

        this.supportsAction = this.supportsAction.bind(this);
        this.trigger = this.trigger.bind(this);
    }
    /**
     * Does this service support this action?
     * @param input
     * @param service [optional]
     * @return {boolean}
     */
    supportsAction(input, service) {
        return (input.message === `${this.mTrigger}help`
            || input.message === `${this.mTrigger}about`
            || input.message === `${this.mTrigger}commands`);
    }

    /**
     * Trigger this service, and send the output to the other service
     * @param input
     * @param service
     */
    trigger(input, service) {
        if (!this.supportsAction(input, service)) {
            return false;
        }

        if (input.message === `${this.mTrigger}help`) {
            service.say(`Hello! I am ${NAME} V ${VERSION}. Contact 'Kira9204'`, input.channel);
        } else if (input.message === `${this.mTrigger}about`) {
            service.say(`Hello! I am ${NAME}. I'm an IRC and Mumble bridge bot built by Kira9204.`, input.channel);
            service.say(`My job is to relay data between protocols/channels, keeping track of reminders and to give detailed information about everything from youtube/vimeo/twitch/SVT links to webhallen/tradera/blocket links.`, input.channel);
            service.say(`See available commands with ${this.mTrigger}commands.`, input.channel)
        } else if (input.message === `${this.mTrigger}commands`) {
            service.say(`Available commands are ${this.mTrigger}remind add date YYYY-MM-DD HH:mm:ss 'message'. ${this.mTrigger}remind add join 'username' 'message'. ${this.mTrigger}remind delete 'num'. ${this.mTrigger}mumble (If your protocol/channel is has crosstalk configured/allowed) and ${this.mTrigger}RELOAD for reloading the plugins.`, input.channel);
        }
    }
}

export default Help;