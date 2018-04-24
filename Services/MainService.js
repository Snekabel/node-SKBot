import IRCService from "./Protocols/IRCService"
import MumbleService from "./Protocols/MumbleService"
import PluginsService from "../Plugins/PluginsService";

var fs = require('fs');
import {NAME, VERSION, CONFIG_FILE, PROTOCOLS} from "../Constants";

class MainService {
    constructor() {
        this.configuration = {};
        this.servers = [];
        this.createServices = this.createServices.bind(this);
        this.createServer = this.createServer.bind(this);
        this.getServers = this.getServers.bind(this);

        console.log(`========== STARTING ${NAME} v ${VERSION} ==========`);
        console.log(`Loading configuration file ${CONFIG_FILE}...`);
        this.configuration = this.loadConfiguration();
        if (!this.configuration) {
            console.log('No configuration found! Exiting...');
            process.exit(1);
        }

        console.log('Loading plugins...');
        this.pluginsService = new PluginsService(this);
        console.log('Creating services...');
        this.createServices();
    }

    createServices() {
        if (this.configuration.servers != null) {
            let servers = this.configuration.servers;
            for (let server of servers) {
                this.createServer(server)
            }
        }
    }

    createServer(server) {
        switch (server.protocol) {
            case PROTOCOLS.IRC:
                (() => {
                    this.servers.push(new IRCService(server, this.pluginsService));
                })();
                break;
            case PROTOCOLS.MUMBLE:
                (() => {
                    this.servers.push(new MumbleService(server, this.pluginsService));
                })();
                break;
        }
    }

    getServers() {
        return this.servers;
    }

    loadConfiguration() {
        let configFile = (`${__dirname}/../Configuration/${CONFIG_FILE}`);
        if (!fs.existsSync(configFile)) {
            return false;
        }
        let fileString = fs.readFileSync(configFile, 'utf8');

        return JSON.parse(fileString);
    }
}


export default MainService;