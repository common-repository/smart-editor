var smarteditor_window = function(option, util) {
	// @formatter:off
	var publicMethod = {},
			// DEFALT
			defaultOption ={
				id:"SmartEditor-Window",
				width:300,
				height:"auto",
				title:"Smart Editor Window",
				actions:[
					//{id:"SmartEditor-Window-CloseBtn",hook:"click",func:closeWindow},
					0
				],
				items:[0],
				initAction:function(){}
			},
			defaultItem = {
				id:null,
				type:"text",
				content:"Welcome to SmartEditor",
				style:{none:true}
			},
			// 
			se_window,
			contents;
			
	// @formatter:on

	function init(o) {
		var i;
		util = util || smart_editor_element_utilty();
		option = extend(defaultOption, o);

		makeWindow();
		makeTitle();
		makeContentField();
		makeCloseBtn();
		makeBtn();

		//console.log(o);
		if (option.items) {
			for ( i = 0; i < option.items.length; i += 1) {
				addItem(option.items[i]);
			}
		}
		if(option.initAction){
			option.initAction();
		}
		if (option.actions) {
			for ( i = 0; i < option.actions.length; i += 1) {
				addHookEvent(option.actions[i]);
			}
		}
		//console.log(option);
	}

	// Public Method -------------------
	publicMethod.addHook = function(o) {
		addHook(o);
	};
	publicMethod.reRwrite = function(o) {
		reRwrite(o);
	};
	publicMethod.close = function() {
		closeWindow();
	}
	// Private Method -------------------

	// Make Element ---
	function makeWindow() {
		var i, left, top;
		if (se_window) {
			left = se_window.style.left;
			top = se_window.style.top;
			// Remove
			se_window.parentNode.removeChild(se_window);
		}
		se_window = document.createElement('div');
		document.getElementsByTagName("body").item(0).appendChild(se_window);
		if(option.id){ se_window.id = option.id;}
		se_window.style.width = option.width + "px";
		se_window.style.height = option.height + ((option.height==="auto")? "":"px");
		se_window.style.display = "block";
		se_window.style.left = left || "100px";
		se_window.style.top = top || "100px";
	}

	function makeTitle() {
		var te = document.createElement('div');
		te.id = "SmartEditor-Window-Title";
		te.innerHTML = option.title;
		se_window.appendChild(te);
		util.addGrabbing(te, se_window);
	}

	function makeCloseBtn() {
		var closeBtn = document.createElement('div');
		closeBtn.id = "SmartEditor-Window-CloseBtn";
		closeBtn.innerHTML = "X";
		se_window.appendChild(closeBtn);
		option.actions.push({
			id : "SmartEditor-Window-CloseBtn", hook : "click", func : closeWindow
		});
	}

	function makeContentField() {
		contents = document.createElement('div');
		contents.id = "SmartEditor-Window-Content";
		se_window.appendChild(contents);
	}

	function makeBtn() {
		var ok_btn = document.createElement('div');
		ok_btn.id = "SmartEditor-Window-OKBtn";
		ok_btn.innerText = "OK";
		util.addClass(ok_btn, "smarteditor-window-btn");
		contents.appendChild(ok_btn);
		option.actions.push({
			id : "SmartEditor-Window-OKBtn", hook : "click", func : closeWindow
		});
	}

	// /Make Element ---

	// Window
	function reRwrite(o) {
		for ( i = 0; i < option.actions.length; i += 1) {
			removeHookEvent(option.actions[i]);
		}
		init(o);
	}

	function closeWindow(e) {
		var i;
		se_window.style.opacity = 0;
		se_window.style.display = "none";
		for ( i = 0; i < option.actions.length; i += 1) {
			removeHookEvent(option.actions[i]);
		}
	}

	// Hook ---
	function addHook(o) {
		option.actions.push(o);
		addHookEvent(o);
	}

	function addHookEvent(o) {
		if(o.hook !== "init"){
			document.getElementById(o.id).addEventListener(o.hook, o.func);
		}
		else {
			o.func(document.getElementById(o.id));
		}
	}

	function removeHookEvent(o) {
		document.getElementById(o.id).removeEventListener(o.hook, o.func);
	}

	// Item ---
	function addItem(o) {
		var e, tag, sKey;
		o = extend(defaultItem, o);

		if (o.type === "text") {
			tag = "div";
		}
		else if(o.type ==="select"){
			tag = "select"
		}
		else {
			tag = o.type;
		}
		e = document.createElement(tag);
		e.id = o.id;
		if(o.attr){
			for(var k in o.attr){
				e.setAttribute(t,o.attr[k]);
			}
		}
		e.innerHTML = o.content;
		if (!o.style.none) {
			for (sKey in o.style) {
				e.style[sKey] = o.style[sKey];
			}
		}
		contents.appendChild(e);
	}

	function extend(o1, o2) {
		var k, r = [];
		for (k in o1) {
			r[k] = o2[k] || o1[k];
		}
		return r;
	}

	init(option);
	return publicMethod;
};
