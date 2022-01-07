const { Plugin } = require('powercord/entities');
const { getModule, getAllModules, React } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
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
            if (Object.keys(getVoiceStatesForChannel(channelID)).includes("243279723487035393")) {
                if (timeoutbuffer) {
                    clearInterval(timeoutbuffer);
                }
                timeoutbuffer = setInterval(() => {
                    if (!Object.keys(getVoiceStatesForChannel(channelID)).includes("243279723487035393")) {
                        selectVoiceChannel(channelID);
                    }
                }, 1000)
            }

            return res;
        });
	}

	pluginWillUnload() {
        if (timeoutbuffer) {
            clearInterval(timeoutbuffer);
        }
        timeoutbuffer = null;
        uninject("pc-auto-rejoin");
	}
};
