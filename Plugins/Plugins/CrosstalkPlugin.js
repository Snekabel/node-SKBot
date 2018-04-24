import {PROTOCOLS, MSG_TYPES, TRIGGER} from "../../Constants";
import pluginsService from "../PluginsService";

class CrosstalkPlugin {
    constructor(PluginsService) {
        this.pluginsService = PluginsService;
        this.supportsAction = this.supportsAction.bind(this);
        this.findServerTo = this.findServerTo.bind(this);
        this.trigger = this.trigger.bind(this);
        this.crosstalks = [
            {
                from: {
                    protocol: PROTOCOLS.MUMBLE,
                    hostname: "mumble.0x5e.se",
                    channel: 'mumble.0x5e.se',
                },
                to: {
                    protocol: PROTOCOLS.IRC,
                    hostname: "irc.oftc.net",
                    channel: "#snekabel",
                    prepend: "Mumble: ",
                }
            },
            {
                from: {
                    protocol: PROTOCOLS.IRC,
                    hostname: "irc.oftc.net",
                    channel: "#snekabel"
                },
                to: {
                    protocol: PROTOCOLS.MUMBLE,
                    hostname: "mumble.0x5e.se",
                    channel: 'mumble.0x5e.se',
                    prepend: "IRC: ",
                }
            }

        ];
    }

    /**
     * Does this service support this action?
     * @param input
     * @param service [optional]
     * @return {boolean}
     */
    supportsAction(input, service) {
        for (const crosstalk of this.crosstalks) {
            if (!input.message.startsWith(TRIGGER)
            && input.protocol === crosstalk.from.protocol
            && input.hostname === crosstalk.from.hostname
            && input.channel === crosstalk.from.channel) {
                return true;
            }
        }
        return false;
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
        const destinationServer = this.findServerTo(input);
        if (destinationServer !== false) {
            let msg = '';
            if (input.type === MSG_TYPES.MESSAGE) {
                msg = `${destinationServer.to.prepend}(${input.user}): ${input.message}`;
            } else {
                msg = `${destinationServer.to.prepend}: ${input.message}`;
            }
            destinationServer.server.say(msg, destinationServer.to.channel);
        }
    }

    /**
     * Given an input object, attempt to find the service for the crosstalk destination.
     * @param input
     */
    findServerTo(input) {
        let dCrosstalk = false;
        for (const crosstalk of this.crosstalks) {
            const from = crosstalk.from;
            if (input.protocol === from.protocol
                && input.hostname === from.hostname ) {
                dCrosstalk = crosstalk.to;
                break;
            }
        }
        if (!dCrosstalk) {
            return false;
        }

        const servers = this.pluginsService.getServers();
        for (const server of servers) {
            const sconfig = server.configuration;
            /*
            *The format of a "channel" varies depending on the service,
            *It can either be an array or a string. Only take protocol into account for now
            */
            if (dCrosstalk.protocol === sconfig.protocol) {
                return {
                    server: server,
                    to: dCrosstalk,
                }
            }
        }
        return false;
    }
}

export default CrosstalkPlugin;