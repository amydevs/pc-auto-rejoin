const { Plugin } = require('powercord/entities');
const { getModule, getAllModules, React } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const Settings = require('./Settings');

const { getVoiceStatesForChannel } = getModule(['getVoiceStatesForChannel'], false);
const { selectVoiceChannel } = getModule(['selectVoiceChannel'], false);
const ConnectedVoiceChannel = getModule(m => m.default && m.default.displayName === 'ChannelItem', false);

const { SET_ACTIVITY } = getModule(['SET_ACTIVITY'], false);
const defaults = {
};

let timeoutbuffer = null;

module.exports = class customRPC extends Plugin {
	reloadRPC() {
	}

	game() {
		
	}

	startPlugin() {
        console.log("hif")      
        inject('pc-auto-rejoin', ConnectedVoiceChannel, 'default', (args, res) => {
            console.log("detect change in vc!")

            if (!args[0].channel.isGuildVoice()) return res;

            const channelID = args[0].channel.id
            console.log(channelID)
            if (Object.keys(getVoiceStatesForChannel(channelID)).includes(String(this.settings.get('discordUserID', '')))) {
                if (timeoutbuffer) {
                    clearInterval(timeoutbuffer);
                }
                timeoutbuffer = setInterval(() => {
                    if (!Object.keys(getVoiceStatesForChannel(channelID)).includes(String(this.settings.get('discordUserID', '')))) {
                        selectVoiceChannel(channelID);
                    }
                }, 1000)
            }

            return res;
        });

        powercord.api.settings.registerSettings(this.entityID, {
            category: this.entityID,
            label: this.manifest.name,
            render: Settings
        }); 
	}

	pluginWillUnload() {
        if (timeoutbuffer) {
            clearInterval(timeoutbuffer);
        }
        timeoutbuffer = null;
        powercord.api.settings.unregisterSettings(this.entityID);
        uninject("pc-auto-rejoin");
	}
};
