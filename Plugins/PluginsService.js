import { TRIGGER } from "../Constants";

var reRequire = require('re-require-module').reRequire;

class PluginsService {

    constructor(mainService) {
        this.mainService = mainService;
        this.getServers = this.getServers.bind(this);

        this.plugins = this.loadPlugins();
    }

    loadPlugins() {
        return [
            (new (reRequire("./Plugins/WebTitlePlugin").default)(this)),
            (new (reRequire("./Plugins/CrosstalkPlugin").default)(this)),
            (new (reRequire("./Plugins/IRCMumbleUsers").default)(this)),
            (new (reRequire("./Plugins/Help").default)(this))
        ];
    }

    trigger(input, service) {
        if (input.message === TRIGGER+ "RELOAD") {
            this.plugins = this.loadPlugins();
            service.say("Plugins reloaded!", input.channel);
        }

        for (const key in this.plugins) {
            this.plugins[key].trigger(input, service);
        }
    }

    getServers() {
        return this.mainService.getServers();
    }
}

export default PluginsService;