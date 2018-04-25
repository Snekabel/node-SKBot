import {PROTOCOLS, MSG_TYPES, TRIGGER} from '../../Constants';
const mumble = require('mumble');

const EVT_TEXT_MESSAGE = 'textMessage';
const EVT_USER_STATE = 'userState';
const EVT_USER_REMOVE = 'userRemove';
const EVT_USER_CONNECT = 'user-connect';
const EVT_CHANNEL_REMOVE = 'channelRemove';

class MumbleService {
    constructor(configuration, pluginsService) {
        console.log('Creating a new Mumble service...');
        console.log('Nick: ', configuration.nick);
        console.log('Hostname: ', configuration.hostname);
        console.log('Port: ', configuration.port);
        console.log('Channel: ', configuration.channel);
        console.log('Tokens: ', configuration.tokens);
        console.log('Mumble URL: ', this.generateMumbleUrl(configuration));
        console.log('');

        this.configuration = configuration;
        this.pluginsService = pluginsService;
        this.mumbleUrl = this.generateMumbleUrl(configuration);
        this.client = {};
        this.sessions = {};

        this.connect = this.connect.bind(this);
        this.getConfiguration = this.getConfiguration.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.loadUsers = this.loadUsers.bind(this);
        this.EVT_TEXT_MESSAGE = this.EVT_TEXT_MESSAGE.bind(this);
        this.EVT_USER_STATE = this.EVT_USER_STATE.bind(this);
        this.EVT_USER_REMOVE = this.EVT_USER_REMOVE.bind(this);
        this.EVT_USER_CONNECT = this.EVT_USER_CONNECT.bind(this);
        this.say = this.say.bind(this);

        this.connect(mumble)
    }
    generateMumbleUrl(configuration) {
        return `mumble://${configuration.nick.replace(' ','%20')}@${configuration.hostname}:${configuration.port}/${configuration.channel.replace(' ', '%20')}/?version=1.2.0`
    }

    getConfiguration() {
        return this.configuration;
    }

    connect(mumble) {
        mumble.connect(this.mumbleUrl, function( error, client ) {
            if (error) {
                throw new Error(error);
            }
            this.client = client;
            this.client.authenticate(this.configuration.nick, null, this.configuration.tokens);
            this.client.on(EVT_TEXT_MESSAGE, this.EVT_TEXT_MESSAGE);
            this.client.on(EVT_USER_STATE, this.EVT_USER_STATE);
            this.client.on(EVT_USER_REMOVE, this.EVT_USER_REMOVE);
            this.client.on(EVT_USER_CONNECT, this.EVT_USER_CONNECT);

        }.bind(this));
        setTimeout(this.loadUsers, 5000);
    }

    loadUsers() {
        for (const user of this.client.users()) {
            this.sessions[user.session] = {
                user: user.name,
                channel: user.channel.name
            }
        }
    }

    getUsers() {
        return this.client.users().map( user => ({
            user: user.name,
            channel: user.channel.name
        }));
    }

    EVT_TEXT_MESSAGE(data) {
        let userData = {};
        for (const user of this.client.users()) {
            if (data.actor === user.session) {
                userData = {
                    user: user.name,
                    channel: user.channel.name
                };
                break;
            }
        }
        if (userData === undefined) {
            return;
        }

        const msgObj = {
            protocol: PROTOCOLS.MUMBLE,
            type: MSG_TYPES.MESSAGE,
            hostname: this.configuration.hostname,
            user: userData.user,
            //channel: userData.channel,
            channel: this.configuration.channel,
            message: this.cleanMessage(data.message)
        };

        this.pluginsService.trigger(msgObj, this);
        this.triggerOwnCommands(msgObj);
    }
    EVT_USER_STATE(state) {
    }

    EVT_USER_REMOVE(data) {
        const userObj = this.sessions[data.session];
        if (userObj === undefined) {
            const msgObj = {
                protocol: PROTOCOLS.MUMBLE,
                type: MSG_TYPES.USER_LEFT,
                hostname: this.configuration.hostname,
                user: '',
                channel: this.configuration.channel,
                message: `A user left from the mumble server, but i had no client data associated with the client id: ${data.session}...`
            };
            this.pluginsService.trigger(msgObj, this);
            return;
        }
        const msgObj = {
            protocol: PROTOCOLS.MUMBLE,
            type: MSG_TYPES.USER_LEFT,
            hostname: this.configuration.hostname,
            user: userObj.user,
            channel: this.configuration.channel,
            message: `User left: ${userObj.user}`
        };
        this.pluginsService.trigger(msgObj, this);
    }

    EVT_USER_CONNECT(data) {
        this.sessions[data.session] = {
            user: data.name,
            channel: data.channel.name
        };

        const msgObj = {
            protocol: PROTOCOLS.MUMBLE,
            type: MSG_TYPES.USER_JOINED,
            hostname: this.configuration.hostname,
            user: data.name,
            channel: this.configuration.channel,
            message: `User joined: ${data.name}`
        };
        this.pluginsService.trigger(msgObj, this);
    }

    cleanMessage(message) {
        if (message.startsWith('<a href=') || message.startsWith('href=')) {
            return message.substring(message.indexOf('>')+1, message.lastIndexOf('<'));
        }
        return message;
    }

    triggerOwnCommands(input) {
        const msg = input.message;
        var split = msg.split(/\s+/);
        if (msg.startsWith(`${TRIGGER}music add`)) {
            if (split[3] !== undefined) {
                this.say("Adding music track..."+split[3]);
                this.playSound(this.cleanMessage(split[3]));
            }
        }
    }

    playSound(url) {
        var decoder = new lame.Decoder();
        if(this.stream != null) {
            this.stream.end();
            this.stream.unpipe();
            //this.stream.close();
        }

        decoder.on('format', function( format ) {
            //console.log( format );
            this.playing = true;
            this.stream.pipe(this.client.inputStream({
                    channels: format.channels,
                    sampleRate: format.sampleRate,
                    gain: this.volume
                })
            );
        }.bind(this));
        try {
            this.stream = streamy(url).pipe(decoder);
            //console.log(this.stream);
            this.stream.on('format', function(format) {
                console.log("FORMAT", format);
            })
            this.stream.on('close', function(g) {
                console.log("Close ",g);
            })
            this.stream.on('finish', function(finish) {
                console.log("Finish ",finish);
                if(onEnd != null) {
                    onEnd();
                }
            })
            this.stream.on('prefinish', function(prefinish) {
                console.log("Prefinish ",prefinish);
            })
            this.stream.on('end', function(end) {
                console.log("End ",end);
            })
            this.stream.on('error', function(error) {
                console.log("Error ",error);
            })
            //this.stream.on
            //console.log(decoder._events);
            console.log(this.stream._events);
        }
        catch(err) {
            console.error(err);
        }
        //stream(url).pipe(new lame.Decoder).pipe(this.client.inputStream());
    }

    say(text, to) {
        this.client.user.channel.sendMessage(text);
    }
}

export default MumbleService;