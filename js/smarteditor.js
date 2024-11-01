var smart_editor = function(editorName, settings) {
	// @formatter:off
	var SMART_EDITOR_L_WIDTH = 800,
			SMART_EDITOR_S_WIDTH = 268,
			SMART_EDITOR_L_HEIGHT = 50,
			SMART_EDITOR_S_HEIGHT = 30,
			SHOW_SPEED = 500,
			
			editor = document.getElementById(editorName),
			tool = document.getElementById("SMART_EDITOR_TOOL"),
			tagPath = document.getElementById("SMART_EDITOR_TAG_PATH"),
			postTextArea = document.getElementById("SMART_EDITOR_POST_CONTENT"),
			//postTitleText = document.getElementById("WYSIPRE_POST_TITLE"),
			handArea = document.getElementById("SMART_EDITOR_HAND_AREA"),
			buttons = tool.querySelectorAll('a[data-command]'),
			flowMenuBtn = tool.getElementsByClassName('smarteditorFlowMenuBtn'),
			justifyMenu = tool.getElementsByClassName('smarteditor-align-menu'),
			mediauploaderBtn = document.getElementById("smarteditor-mediaupoaderBtn"),
			linkBtn = document.getElementById("smarteditor-linkBtn"),
			//cssBtn = document.getElementById("smarteditor-cssBtn"),
			sourceBtn = document.getElementById("smarteditor-sourceBtn"),
			elementBtn = document.getElementById("smarteditor-elementBtn"),
			caretTag = "",
			caretElement = null,
			custom_uploader = null,
			selectedElemtnt = null,
			isChange = false,
			
			// UTILITY
			util = smart_editor_element_utilty(),
			se_window,
			publicMethod = {},
			elementEditor,
			sourceEditor;
			
			// @formatter:on

	function init() {
		//Settings
		if (settings) {
			settings = settings;
		}
		else {
			settings = {
				justifyClass : {
					'justifyLeft' : 'alignleft', 'justifyCenter' : 'aligncenter', 'justifyRight' : 'alignright'
				},
			};
		}

		switchWrite("true");
		document.execCommand("styleWithCSS", false, false);
		util.addClass(document.getElementsByClassName("smarteditor-tool-write",tool)[0], 'active');

		//Content Event
		editor.addEventListener('mouseup', editorMUpHandler, false);
		editor.addEventListener('keydown', editorKeydownHandler, false);

		//Tool Event
		for ( i = 0; i < buttons.length; i += 1) {
			buttons[i].addEventListener('click', toolBtnClickHandler, true);
		}

		// Tool Move
		//handArea.addEventListener("mousedown", handBtnHandler, false);
		util.addGrabbing(handArea, tool);

		// Save Btn
		document.getElementById("SMART_EDITOR_SAVE_BTN").addEventListener("click", submitForm);

		// Media Uploader
		mediauploaderBtn.addEventListener("click", openImageUploader, false);

		//beforeunload
		window.addEventListener("beforeunload", beforeunload, false);

		// element editor
		elementBtn.addEventListener("click", clickElementEditorBtn, false);
		
		// source editor
		sourceBtn.addEventListener("click",clickSourceEditorBtn,false);

	}

	function checkCaretTag(target) {
		var activeTags = getActiveTags(target);
		toolBtnReset();
		toolBtnActive(activeTags);
		reWitePath(activeTags);
		menuCheckWord();
		tranceLinkBtn(activeTags);
		
		if(elementEditor){
			elementEditor.setElement(target);
		}
	}

	/* ----------------------------------------------
	 * Button Method
	 * ----------------------------------------------
	 */

	function editorMUpHandler(e) {
		if (editor.getAttribute("contenteditable") === "true") {
			isChange = true;
			checkCaretTag(getCaretElement(e));
		}
	}

	function editorKeydownHandler(e) {
		window.setTimeout(function() {
			isChange = true;
			checkCaretTag(getCaretElement());
		});
	}

	function toolBtnClickHandler(e) {
		if (this.getAttribute("data-command") === "write") {
			util.toggleClass(this, 'active');
			switchWrite(util.containsClass(this, 'active'));
		}
		else {
			tranceWord(this, !util.containsClass(this, 'active'));
		}
		e.preventDefault();
		return false;
	}

	function handBtnHandler(handE) {
		var startPoint = {
			top : handE.pageY, left : handE.pageX
		}, toolStartPoint = {
			top : tool.offsetTop, left : tool.offsetLeft
		}, mMoveHandler = function(moveE) {
			moveE.preventDefault();
			tool.style.top = toolStartPoint.top + moveE.pageY - startPoint.top + "px";
			tool.style.left = toolStartPoint.left + moveE.pageX - startPoint.left + "px";
		}, mUpHandler = function(mupE) {
			mupE.preventDefault();
			util.removeClass(handArea, "grabbing");
			document.removeEventListener("mousemove", mMoveHandler, false);
			document.removeEventListener("mouseup", mUpHandler, false);
		};

		handE.preventDefault();
		util.addClass(handArea, "grabbing");
		document.addEventListener("mousemove", mMoveHandler, false);
		document.addEventListener("mouseup", mUpHandler, false);
	}

	function toolBtnReset() {
		for ( i = 1; i < buttons.length; i += 1) {
			util.removeClass(buttons[i], 'active');
		}
	}

	function toolBtnActive(arr) {
		var btn, style, justify;
		// tag check
		for ( i = 0; i < arr.length; i += 1) {
			btn = tool.querySelectorAll('a[data-tag=' + arr[i].name + ']');
			for ( b = 0; b < btn.length; b += 1) {
				util.addClass(btn[b], "active");
			}
		}
		// justify check
		if (arr[0] && arr[0].element) {
			style = util.getCurrentStyle(arr[0].element);
			justify = style.textAlign;
			justify = "justify" + justify.charAt(0).toUpperCase() + justify.slice(1);
			if (justifyMenu[0].getElementsByClassName(justify)[0]) {
				util.addClass(justifyMenu[0].getElementsByClassName(justify)[0], "active");
			}

		}

	}

	// Editor
	function switchWrite(on) {
		editor.setAttribute('contenteditable', on);

		if(on||on==="true"){
			util.addClass(tool,"write-mode-on");
		}
		else {
			util.removeClass(tool,"write-mode-on");
		}
	}

	function tranceLinkBtn(tags) {
		if (getLinkTag_inTabs(tags)) {
			util.addClass(linkBtn, "active");
		}
	}

	function menuCheckWord() {
		var actives, style;
		for ( i = 0; i < flowMenuBtn.length; i += 1) {
			actives = flowMenuBtn[i].parentNode.parentNode.getElementsByClassName('active');
			if (actives.length > 0) {
				style = util.getCurrentStyle(actives[0]);
				flowMenuBtn[i].innerText = actives[0].innerText;
				flowMenuBtn[i].style.backgroundImage = style.backgroundImage;
			}
			else {
				flowMenuBtn[i].innerText = "";
				flowMenuBtn[i].style.backgroundImage = "";
			}
		}
	}

	function openImageUploader(e) {
		e.preventDefault();
		if (custom_uploader) {
			custom_uploader.open();
		}
		else {
			custom_uploader = wp.media({
				title : 'Choose Media', button : {
					text : 'Choose Media'
				}, multiple : true
			});
			custom_uploader.on('select', function() {
				var images = custom_uploader.state().get('selection');
				images.each(function(file) {
					var fileJson = file.toJSON();
					if (fileJson.type === "image") {
						tranceWord("insertImage", fileJson);
					}
					else if (fileJson.type === "application") {
						tranceWord("insertApplication", fileJson);
					}
				});
			});
			custom_uploader.open();
		}
		return false;
	}

	// Element Editor
	function clickElementEditorBtn(e) {
		// Make CSS EDITOR
		elementEditor = elementEditor || smarteditor_element_editor(editor,publicMethod);
		
		// Make Window
		if (se_window) {
			se_window.reRwrite(elementEditor.getRegistObj());
		}
		else {
			se_window = smarteditor_window(elementEditor.getRegistObj(), util);
		}
		elementEditor.setElement(getCaretElement());
		publicMethod.elementEditor = elementEditor;
	}
	
	
	// Source Editor
	function clickSourceEditorBtn(e){
		// Make Source EDITOR
		sourceEditor = sourceEditor || smarteditor_source_editor(editor);

		// Make Window
		if (se_window) {
			//console.log("reRwrite");
			se_window.reRwrite(sourceEditor.getRegistObj());
		}
		else {
			se_window = smarteditor_window(sourceEditor.getRegistObj(), util);
		}
	}

	/* ----------------------------------------------
	 * ExecCommand Method
	 * ----------------------------------------------
	 */
	function tranceWord(btnElement, o) {
		var dataWysipre;
		if ( typeof btnElement !== 'string') {
			dataWysipre = btnElement.getAttribute('data-command');
		}
		else {
			dataWysipre = btnElement;
		}
		caretElement = getCaretElement();

		if (dataWysipre === 'createLink') {
			publicMethod.createLink(caretElement, btnElement);
		}
		else if (dataWysipre === 'insertImage') {
			publicMethod.insertImage(caretElement, o);
		}
		else if (dataWysipre === 'insertApplication') {
			publicMethod.insertApplication(caretElement, o);
		}
		else if (dataWysipre === 'formatBlock') {
			publicMethod.formatBlock(caretElement, {
				tagName : btnElement.getAttribute('data-tag')
			});
		}
		else if (dataWysipre === 'justify') {
			publicMethod.justify(caretElement, btnElement.getAttribute('data-tag'));
		}
		// Inline is not supported (ExecCommand)
		else if (dataWysipre === 'em' || dataWysipre === 'strong') {
			publicMethod.inlineExecCommand_browser_not(caretElement, {
				tagName : dataWysipre
			});
		}
		// Support ExeCommant(inline)
		else {
			document.execCommand(dataWysipre, false);
		}

		caretElement = getCaretElement();
		checkCaretTag(caretElement);
	}


	publicMethod.createLink = function(cE, option) {
		var a = getLinkTag_inTabs(getActiveTags(cE)), link;
		if (a) {
			if (option.id === 'smarteditor-linkBtn') {
				// edit link
				link = prompt('Please specify the link.', a.getAttribute("href"));
				if (link || link !== "") {
					if(link!==null){
						a.setAttribute("href", link);
					}
					
				}
				else {
					a.outerHTML = a.innerHTML;
				}
			}
			else {
				a.outerHTML = a.innerHTML;
			}
		}
		else {
			if (option.id === 'smarteditor-linkBtn') {
				// new link
				link = prompt('Please specify the link.');
				if (link) {
					document.execCommand('createLink', false, link);
				}
			}
			else {
				console.log("link...");
			}
		}
	};
	publicMethod.insertImage = function(cE, option) {
		var html = '<img src="' + option.url + '" alt="' + (option.alt || option.caption || option.title) + '" />'
		//document.execCommand('insertImage', false, option.url);
		document.execCommand('inserthtml', false, html);
	};
	publicMethod.insertApplication = function(cE, option) {
		var html = '<a href="' + option.url + '">' + option.title + '</a>';
		document.execCommand('inserthtml', false, html);
	};
	publicMethod.justify = function(cE, option) {
		/*if (cE.tagName.toLowerCase() === 'img') {
			if (!util.containsClass(cE, settings.justifyClass)) {
				util.addClass(cE, settings.justifyClass[option]);
			}
			else {
				if (util.containsClass(cE, settings.justifyClass[option])) {
					util.removeClass(cE, settings.justifyClass);
				}
				else {
					util.removeClass(cE, settings.justifyClass);
					util.addClass(cE, settings.justifyClass[option]);
				}
			}
		}
		else {
			document.execCommand(option, false);
		}*/
		document.execCommand(option, false);
	};
	publicMethod.formatBlock = function(cE, option) {
		if(option.tagName==="blockquote"||option.tagName==="address"){
			document.execCommand('formatBlock', false, '<' + option.tagName + '>');
			var tags = getActiveTags(cE);
			tags[tags.length-2].element.outerHTML =tags[tags.length-2].element.innerHTML;
		}
		else {
			document.execCommand('formatBlock', false, '<' + option.tagName + '>');
		}
	};
	publicMethod.inlineExecCommand_browser_not = function(cE, option) {
		var activeTags = getActiveTags(cE), selection, tag, delFlg = false;

		for ( i = 0; i < activeTags.length; i += 1) {
			if (activeTags[i].name === option.tagName) {
				activeTags[i].element.outerHTML = activeTags[i].element.innerHTML;
				delFlg = true;
			}
		}
		if (!delFlg) {
			selection = window.getSelection();
			// chrome
			if (selection.type && selection.type === "Range") {
				text = selection.toString();
				if (text) {
					text = "<" + option.tagName + ">" + selection.toString() + "</" + option.tagName + ">";
					document.execCommand('insertHTML', false, text);
				}
			}
			else if(selection.getRangeAt){
				//firefox
				if(selection.rangeCount>=1){//Range
					anchorOffset = selection.anchorOffset;
					focusOffset = selection.focusOffset;
					text = selection.focusNode.nodeValue.substring(selection.anchorOffset,selection.focusOffset);
					if (text) {
						text = "<" + option.tagName + ">" + selection.toString() + "</" + option.tagName + ">";
						document.execCommand('insertHTML', false, text);
					}
				}
			}

		}
	}
	/* ----------------------------------------------
	 * Path Method
	 * ----------------------------------------------
	 */
	function reWitePath(arr) {
		var text = "";
		for ( i = arr.length - 1; i > 0; i -= 1) {
			text += '<a href="javascript:smartEditor.selectElement(' + i + ');">' + arr[i].name + '</a> &gt; ';
		}
		if (arr[0]) {
			text += ' <a href="javascript:smartEditor.selectElement(' + i + ');">' + arr[0].name + '</a>';
		}
		tagPath.innerHTML = text;
	}


	publicMethod.selectElement = function(i) {
		var tags = getActiveTags(getCaretElement());
		if (tags[i]) {
			tags[i].element.outerHTML = tags[i].element.innerHTML;
			checkCaretTag(getCaretElement());
		}
	};
	
	

	/* ----------------------------------------------
	 * SELECTION Method
	 * ----------------------------------------------
	 */
	function getActiveTags(element, a_arr) {
		var arr = a_arr || [], par;
		if (element) {
			if (element.id !== "SmartEditor") {
				arr.push({
					name : element.tagName.toLowerCase(), style : element.style, element : element
				});
			}

			par = element.parentElement;
			if (par && element.id !== "SmartEditor") {
				if (par.id !== "SmartEditor") {
					arr = getActiveTags(par, arr);
				}
			}
		}
		return arr;
	}


	publicMethod.getActiveTags = function(element, a_arr) {
		return getActiveTags(element, a_arr);
	};

	function getCaretElement(mouseEvent) {
		var target, sel = window.getSelection();

		if (mouseEvent) {
			if (mouseEvent.toElement) {
				if (mouseEvent.toElement.tagName.toLowerCase() === "img") {
					target = mouseEvent.toElement;
					setRange_SelectNode(target);
				}
				else {
					target = mouseEvent.toElement;
				}
			}
			else {
				target = mouseEvent.target;
			}
		}
		else if (sel && selectedElemtnt) {
			if (selectedElemtnt.tagName && selectedElemtnt.tagName.toLowerCase() === "img") {
				target = selectedElemtnt;
			}
			//chrome
			else if ((sel.type === "Caret" || sel.type === "Range") && sel.focusNode) {
				if(sel.focusNode.id !== "SmartEditor"){
					target = sel.focusNode.parentNode;
				}
				else {
					target = sel.focusNode;
				}
			}
			//firefox
			else if(sel.focusNode.nodeType){
				target = sel.focusNode.parentNode;
			}
			else {
				console.log(sel);
				console.log(sel.focusNode);
				console.log(sel.type);
				console.log(selectedElemtnt);
				console.log("Error");
			}
		}
		else {
			target = false;
		}
		selectedElemtnt = target;
		return target;
	}

	function getLinkTag_inTabs(tags) {
		var r = false;
		for ( i = 0; i < tags.length; i += 1) {
			if (tags[i].name === "a") {
				r = tags[i].element;
			}
		}
		return r;
	}


	publicMethod.getLinkTag_inTabs = function(tags) {
		return getLinkTag_inTabs(tags);
	};

	function setRange_SelectNode(element) {
		var s = window.getSelection(), r = document.createRange();
		r.selectNode(element);
		s.removeAllRanges();
		s.addRange(r);
	}
	

	/* ----------------------------------------------
	 * POST Method
	 * ----------------------------------------------
	 */
	function rewriteSubmitText() {
		postTextArea.value = editor.innerHTML.replace('<span id="more-118"></span>','<!--more-->');
		//postTitleText.value = titleEle.innerText
	}

	function submitForm() {
		rewriteSubmitText();
		isChange = false;
		document.post.submit();
	}

	function beforeunload(e) {
		if (isChange) {
			return "Under edit";
		}
	}

	init();
	return publicMethod;
}, smartEditor;

window.onload = function() {
	smartEditor = smart_editor("SmartEditor");
}

