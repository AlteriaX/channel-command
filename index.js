module.exports = function CmdChannel(mod) {
	
	const command = mod.command || mod.require.command,
		config = require('./config.json')

	let currentChannel = 0

	// command
    command.add(['ch', 'c'], (p) => {
		if (!isNaN(p)) changeChannel(p)
		// change to next channel
		else if (['n'].includes(p)) changeChannel(currentChannel.channel + 1)
		// change to previous channel
		else if (['b'].includes(p)) changeChannel(currentChannel.channel - 1)
		// hide UI
		else if (['ui'].includes(p)) { config.hideUI = !config.hideUI; send('Hide UI ' + (config.hideUI ? 'Enabled' : 'Disabled')) }
		else send('Invalid argument. Usage: c (num)')
	})

	// code
	mod.hook('S_CURRENT_CHANNEL', 2, event => {
		currentChannel = event
	})
	
	mod.hook('S_PREPARE_SELECT_CHANNEL', 1, event => {
		if(config.hideUI) return false
	})
	
	function changeChannel(newChannel) {
		if (currentChannel.channel > 20) return
		if (newChannel == 0) newChannel = 10
		if (newChannel == currentChannel.channel) {
			send('Same channel selected.')
			return
		}
		newChannel -= 1
		mod.send('C_SELECT_CHANNEL', 1, {
			unk: 1,
			zone: currentChannel.zone,
			channel: newChannel
		})
	}

	function send(msg) {
		command.message(msg)
	}
}