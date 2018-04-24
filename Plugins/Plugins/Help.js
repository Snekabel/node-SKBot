import {PROTOCOLS, TRIGGER, NAME, VERSION} from "../../Constants";

class Help {

    /**
     * Does this service support this action?
     * @param input
     * @param service [optional]
     * @return {boolean}
     */
    supportsAction(input, service) {
        return (input.message === `${TRIGGER}help`
            || input.message === `${TRIGGER}about`
            || input.message === `${TRIGGER}commands`);
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

        if (input.message === `${TRIGGER}help`) {
            service.say(`${NAME} V ${VERSION}. Contact 'Kira9204' or 'TB'`, input.channel);
        } else if (input.message === `${TRIGGER}about`) {
            service.say(`Hello! I am ${NAME}. I'm an IRC and Mumble bridge bot built by the Snekabel group.`, input.channel);
            service.say(`My job is to relay data between protocols/channels, give metadata about channels as well as retrive
        detailed information about everything from youtube/vimeo/twitch/SVT links to webhallen/tradera/blocket links.`, input.channel);
            service.say(`This is a Node.js bot in an early beta phase. If you have issues contact 'Kira9204' or 'TB'`, input.channel);
        } else if (input.message === `${TRIGGER}commands`) {
            service.say(`Almost all functionality are triggered passively by regexp. But there is ${TRIGGER}RELOAD for reloading the JS plugins and ${TRIGGER}mumble (If your protocol/channel is has crosstalk configured/allowed)`, input.channel);
        }
    }
}

export default Help;