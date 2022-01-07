const { Plugin } = require('powercord/entities');
const { getModule, getAllModules, React } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { findInReactTree, getOwnerInstance } = require('powercord/util');
const path = require('path');

const { SET_ACTIVITY } = getModule(['SET_ACTIVITY'], false);
const defaults = {
};

let channelIDBuffer = null;

module.exports = class customRPC extends Plugin {
	reloadRPC() {
	}

	game() {
		
	}

	async startPlugin() {
        console.log("hif")

        const { getVoiceStatesForChannel } = await getModule(['getVoiceStatesForChannel']);
        const { selectVoiceChannel } = await getModule([ 'selectVoiceChannel' ]);

        const ConnectedVoiceChannel = await getModule(m => m.default && m.default.displayName === 'ChannelItem');

        const renderCount = (args, res) => {
            console.log("detect change in vc!")

            if (!args[0].channel.isGuildVoice()) return res;

            if (Object.keys(getVoiceStatesForChannel(args[0].channel.id)).includes("243279723487035393")) {
                channelIDBuffer = args[0].channel.id;
                console.log("got it!")
            }

            else {
                if (channelIDBuffer) {
                    selectVoiceChannel(channelIDBuffer);
                }
            }            

            return res;
        };
        inject('pc-auto-rejoin', ConnectedVoiceChannel, 'default', renderCount);
	}

	pluginWillUnload() {
        uninject("pc-auto-rejoin");
	}
};
