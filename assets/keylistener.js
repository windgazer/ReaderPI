/**
 * A listener that reacts on keypress in the document.body.
 * It then checks to see if the key value of that
 * keypress has a handler in the KeyListener, if so that
 * handler is called upon, if not the keypress is ignored.
 * It's easy to add new handlers for a specific page,
 * just call upon
 * KeyListener.addHandler(String, function);
 *
 * @version 1.0.070721
 * @author: Martin Reurings - http://www.windgazer.nl
 * @see Events
 * depends on: events.js
 */

var KeyListener = {
	/**
	 * @private
	 */
	KEYS:{
		KEY_LEFTARROW:37,
		KEY_UPARROW:38,
		KEY_RIGHTARROW:39,
		KEY_DOWNARROW:40
	},
	/**
	 * @private
	 */
	handles: {
	},
	/**
	 * @private
	 */
	handler:function(e){
		var e = e||event;
		var target = e.target||e.srcElement;
		if (!target.nodeName) target = target.parentNode; //Old mozilla's and Safari's
		var key = (e.shiftKey?"shift_":"") +
			(e.ctrlKey?"ctrl_":"") +
			(e.altKey?"alt_":"") +
			(e.metaKey?"meta_":"") +
			e.keyCode||e.button;
		if (key && this.handles[key]) {
			if (!this.handles[key](target)) return Events.cancel(e);
			else return true;
		}
		return true;
	},
	/**
	 * Add an extra handler to the listener.
	 * Use this method to add an extra handler for
	 * a key that hasn't been defined by default.
	 * 
	 * @param {String} id The value of the key on which you want to react.
	 * @param {function} handler A function to handle the event, takes the target-node as a parameter.
	 */
	addHandler:function(id, handler) {
		this.handles[id] = handler;
	}
};

Events.attach( window, "load", function() {
	//Attach the keylistener
	var KeyListenerClick = Events.attach(document.getElementsByTagName("body")[0], "keydown", function(e) {
		KeyListener.handler(e);
	});
});
