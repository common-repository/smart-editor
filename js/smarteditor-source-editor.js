var smarteditor_source_editor = function(editor) {
	// @formatter:off
	var EDITOR_ID = "SmartEditor-Window-SourceEditor",
			publicFunction = {},
			sourceEditor,
			textArea;
	// @formatter:on

	function init() {
		console.log("SOURCE EDITOR INIT");
	}

	// Public Method
	publicFunction.getRegistObj = function() {
		// @formatter:off
		var obj = {
			title : "Source Editor",
			width : 700,
			items : [{type : "textarea", id : EDITOR_ID}],
			actions : [
				{	id :EDITOR_ID,
					hook : "init",
					func : online,
				},
				{	id : EDITOR_ID,
					hook : "keydown",
					func : keydownHandler
				},
				{
					id : "SmartEditor-Window-OKBtn", hook : "click", func : keydownHandler
				}
			]
		};
		// @formatter:on
		return obj;
	};
	// Private Method
	function online(e) {
		e.value = editor.innerHTML;
		textArea = e;
	}
	function keydownHandler(e){
		editor.innerHTML = textArea.value;
	}

	//init();
	return publicFunction;
};
