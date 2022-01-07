const { React } = require('powercord/webpack');
const { TextInput, SwitchItem, SliderInput } = require('powercord/components/settings');

module.exports = ({ getSetting, updateSetting, toggleSetting }) => (
    <div>
        <TextInput
            note='Your Discord User ID'
            defaultValue={getSetting('discordUserID', '')}
            required={true}
            onChange={val => updateSetting('discordUserID', val)}
        >
            Discord User ID
        </TextInput>
    </div>
);
