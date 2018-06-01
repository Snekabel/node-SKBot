import WebService from '../WebService';
import PriceTitleService from "./PluginServices/PriceTitleService";
import SteamTitleService from "./PluginServices/SteamTitleService";
import SVTPlayTitleService from "./PluginServices/SVTPlayTitleService";
import TwitchTitleService from "./PluginServices/TwitchTitleService";
import VimeoTitleService from "./PluginServices/VimeoTitleService";
import YoutubeTitleService from "./PluginServices/YoutubeTitleService";

class WebTitlePlugin {
    constructor(PluginsService) {
        this.pluginsService = PluginsService;
        this.webService = new WebService();
        this.sqlService = this.pluginsService.getSQLService();
        this.childServices = [
            new PriceTitleService(),
            new SteamTitleService(),
            new SVTPlayTitleService(),
            new TwitchTitleService(),
            new VimeoTitleService(),
            new YoutubeTitleService()
        ];
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
        let parts = input.message.split(' ');
        for (const part of parts) {
            if (this.webService.isValidUrl(part)) {
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
        const parts = input.message.split(' ');
        const channel = input.channel;
        for (const part of parts) {
            if (this.webService.isValidUrl(part)) {
                for (const key in this.childServices) {
                    if (this.childServices[key].supportsAction(part, channel, service)) {
                        this.childServices[key].trigger(part, channel, service);
                        return;
                    }
                }
                this.webService.downloadTitle(part).then((data) => {
                    const hasTitle = data.length > 0;
                    if (hasTitle) {
                        this.sendTitle(input, service, part, data);
                    }
                    if (!hasTitle) {
                        this.webService.downloadTitle(part, true).then((data) => {
                            this.sendTitle(input, service, part, data);
                        });
                    }
                });
            }
        }
    }

    sendTitle(input, service, part, title) {
        const hasTitle = title.length > 0;
        if (part.length > 80) {
            this.sqlService.query('INSERT INTO links_short (link) VALUES (?)', [part]).then((result) => {
                const [OkPacket] = result;
                const num = OkPacket.insertId;
                const base36 = num.toString(36);
                const shortLink = `http://s.erikwelander.se/${base36}`;

                if (hasTitle) {
                    service.say(`Title: (${shortLink}) ${title}`, input.channel);
                } else {
                    service.say(`Short: ${shortLink}`, input.channel);
                }
            }).catch((err) => {
                console.log('Failed to insert link!', err);
            })
        } else if (hasTitle) {
            service.say(`Title: ${title}`, input.channel);
        }
    }
}

export default WebTitlePlugin;