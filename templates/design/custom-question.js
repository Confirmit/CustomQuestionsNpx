(function() {
	var port = undefined,
		customQuestion = {
			onInit: function() {},
			onSettingsReceived: function() {},
			saveChanges: saveChanges
		};
	
	function onWindowMessage(e) {
		if (!e.data || e.data.type !== 'confirmit:custom-question:connect')
			return;
		
		port = e.ports[0];
		port.onmessage = onPortMessage;
		sendMessage('child:connect');
	}
	
	function onPortMessage(e) {
		var type = e.data.type,
			payload = e.data.payload;
			
		switch(type) {
			case 'parent:init':
				customQuestion.onInit(payload.options);
				break;
			case 'parent:settings': 
				customQuestion.onSettingsReceived(payload.settings);
				break;
			default:
				throw new Error('Unsupported message type: ' + type);
		}
	}
	
	function sendMessage(type, payload) {
		port.postMessage({type: type, payload: payload});
	}

	function saveChanges(settings, hasError) {
		sendMessage('child:saveChanges', {settings: settings, hasError: hasError});
	}

	window.customQuestion = customQuestion;
	window.onmessage = onWindowMessage;
})();
