import { PROTOCOLS, TRIGGER } from "../../Constants";
import pluginsService from "../PluginsService";

class IRCMumbleUsers {
    constructor(PluginsService) {
        this.pluginsService = PluginsService;
        this.reportFromIRCChannels = [{
            IRC: {
                hostname: "irc.oftc.net",
                channel: '#snekabel',
            },
            MUMBLE: {
                hostname: "mumble.0x5e.se",
                channel: 'mumble.0x5e.se',
            }
        }];
    }
    /**
     * Does this service support this action?
     * @param input
     * @param service [optional]
     * @return {boolean}
     */
    supportsAction(input, service) {
        for (const item of this.reportFromIRCChannels) {
            if (input.protocol === PROTOCOLS.IRC
                && input.message === TRIGGER+"mumble"
                && input.hostname === item.IRC.hostname
                && input.channel === item.IRC.channel) {
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
            let mumbleUsers = destinationServer.server.getUsers().map((user) => user.user);
            mumbleUsers = mumbleUsers.join(", ");
            service.say("Mumble users: "+mumbleUsers, input.channel);
        }
    }


    /**
     * Given an input object, attempt to find the server for the mumble server.
     * @param input
     */
    findServerTo(input) {
        let dReport = false;
        for (const reportIRC of this.reportFromIRCChannels) {
            const IRC = reportIRC.IRC;
            if (input.hostname === IRC.hostname
            && input.channel === IRC.channel) {
                dReport = reportIRC;
                break;
            }
        }
        if (!dReport) {
            return false;
        }

        const servers = this.pluginsService.getServers();
        for (const server of servers) {
            const sconfig = server.configuration;
            const mConfig = dReport.MUMBLE;
            if (sconfig.protocol === PROTOCOLS.MUMBLE
                && sconfig.hostname === mConfig.hostname) {
                return {
                    server: server,
                    to: dReport,
                }
            }
        }
        return false;
    }
}

export default IRCMumbleUsers;