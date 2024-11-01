var smarteditor_css_editor = function(editor) {
	// @formatter:off
	var CSS_ID = "SMARTEDITOR_CSS_STYLE",
			CSS_TYPE = "text/css",
			publicFunction = {},
			cssEditor = null,
			cssStyleElement = null,
			textArea;
	// @formatter:on

	function init() {
		cssStyleElement = document.getElementById(CSS_ID);
		// style element
		if (cssStyleElement) {
			editStylePropaty(cssStyleElement);
		}
		else {
			cssStyleElement = document.createElement('style');
			editStylePropaty(cssStyleElement);
			editor.appendChild(cssStyleElement);
		}

		view_contenteditable(true);
	}

	// Public Method
	publicFunction.getRegistObj = function() {
		// @formatter:off
		var obj = {
			title : "CSS of a POST",
			width : 400,
			items : [{type : "textarea", id : "SmartEditor-Window-CSSEditor"}],
			actions : [
				{	id : "SmartEditor-Window-CSSEditor",
					hook : "init",
					func : online,
				},
				{	id : "SmartEditor-Window-CSSEditor",
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
	
	function online(e){
		e.value = cssStyleElement.innerText;
		textArea = e;
	}
	function keydownHandler(e){
		cssStyleElement.textContent = textArea.value;
	}
	

	function editStylePropaty(v) {
		v.id = CSS_ID;
		v.type = CSS_TYPE;
	}

	function editEditorPropaty(v) {
		v.id = EDITOR_ID;
	}

	function view_contenteditable(boo) {
		cssStyleElement.contentEditable = boo;
	}

	init();
	return publicFunction;
};
