import IRCService from "./Protocols/IRCService"
import MumbleService from "./Protocols/MumbleService"
import PluginsService from "../Plugins/PluginsService";
import SQLService from "./SQLService";

var fs = require('fs');
import {NAME, VERSION, CONFIG_FILE, PROTOCOLS} from "../Constants";

class MainService {
    constructor() {
        this.configuration = {};
        this.trigger = '';
        this.servers = [];
        this.sqlService = null;
        this.getServers = this.getServers.bind(this);
        this.getSQLService = this.getSQLService.bind(this);
        this.createServers = this.createServers.bind(this);
        this.createServer = this.createServer.bind(this);
        this.createSQLService = this.createSQLService.bind(this);
        this.createTriggerString = this.createTriggerString.bind(this);

        console.log(`========== STARTING ${NAME} v ${VERSION} ==========`);
        console.log(`Loading configuration file ${CONFIG_FILE}...`);
        this.configuration = this.loadConfiguration();
        if (!this.configuration) {
            console.log('No configuration found! Exiting...');
            process.exit(1);
        }

        console.log('Loading SQL service...')
        this.createSQLService();

        console.log('Loading plugins...');
        this.createTriggerString();
        this.pluginsService = new PluginsService(this, this.trigger);

        console.log('Creating server services...');
        this.createServers();

    }

    createServers() {
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

    createSQLService() {
        if (this.configuration.mysql) {
            this.sqlService = new SQLService(this.configuration.mysql);
        }
    }

    createTriggerString() {
        if (this.configuration.trigger) {
            this.trigger = this.configuration.trigger;
        }
    }

    getServers() {
        return this.servers;
    }

    getSQLService() {
        return this.sqlService;
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