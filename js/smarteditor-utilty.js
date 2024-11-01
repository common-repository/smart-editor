var smart_editor_element_utilty = function() {
	// @formatter:off
	var pub = {},
			setStyles,
			pfx = ["webkit", "moz", "MS", "o", ""],
			tagsOption;
	
	tagsOption = {
		'html' : 'block', 'head' : 'block', 'title' : 'block',
		'meta' : 'block', 'body' : 'block', 'div' : 'block',
		'span' : 'inline', 'h1-h6' : 'block', 'address' : 'block',
		'em' : 'inline', 'strong' : 'inline', 'dfn' : 'inline', 'cite' : 'inline',
		'abbr' : 'inline', 'acronym' : 'inline', 'blockquote' : 'block',
		'q' : 'block', 'sub' : 'inline', 'sup' : 'inline', 'p' : 'block',
		'br' : 'inline', 'pre' : 'block', 'ins' : 'inline', 'del' : 'inline',
		'ul' : 'block', 'ol' : 'block', 'li' : 'block', 'dl' : 'block',
		'dt' : 'block', 'dd' : 'block', 'table' : 'block', 'caption' : 'block',
		'thead' : 'block', 'tbody' : 'block', 'tfoot' : 'block', 'colgroup' : 'block',
		'col' : 'block', 'tr' : 'block', 'td' : 'block', 'th' : 'block',
		'a' : 'inline', 'link' : 'block', 'img' : 'inline', 'style' : 'block',
		'hr' : 'block', 'form' : 'block', 'input' : 'inline', 'select' : 'inline',
		'option' : 'block', 'textarea' : 'block', 'label' : 'inline',
		'fieldset' : 'block', 'legend' : 'block', 'optgroup' : 'block'
	};
	// @formatter:on

	pub.addClass = function(ele, clsName) {
		ele.classList.add(clsName);
	};
	pub.removeClass = function(ele, clsName) {
		var i;
		if ( typeof clsName === 'string') {
			ele.classList.remove(clsName);
		}
		else {
			for (i in clsName) {
				ele.classList.remove(clsName[i]);
			}
		}
	};

	pub.toggleClass = function(ele, clsName) {
		ele.classList.toggle(clsName);
	};

	pub.containsClass = function(ele, clsName) {
		var re = false, i;
		if ( typeof clsName === 'string') {
			re = ele.classList.contains(clsName);
		}
		else if ( typeof clsName === 'object') {
			for (i in clsName) {
				if (ele.classList.contains(clsName[i])) {
					re = true;
				}
			}
		}
		return re;
	};
	pub.isBlock = function(ele) {
		if (tagsOption[ele.tagName.toLowerCase()] === "block") {
			return true;
		}
		else {
			return false;
		}
	};
	pub.getCurrentStyle = function(ele) {
		return ele.currentStyle || document.defaultView.getComputedStyle(ele, '');
	};

	pub.animate = function(ele, option) {
		var duration = option.duration || "0.5s",
				comp = option.complete || null,
				timingFun = option.timing || "ease-out",
				transform = option.transform || {};
		
		function compHandler(e){
			ele.style.webkitTransition = "";
			ele.style.MozTransition = "";
			//ele.removeEventListener("transitionend", compHandler);
			//prefixedremoveEvent(ele,"transitionend", compHandler);
			prefixedremoveEvent(ele,"TransitionEnd", compHandler);
			if (comp) {
				comp(e)
			};
		}
		prefixedaddEvent(ele,"AnimationEnd",compHandler)
		//ele.addEventListener("transitionend", compHandler, false);
		ele.style.webkitTransition = "all " + duration + " " + timingFun;
		ele.style.MozTransition = "all " + duration + " " + timingFun;
		
		setStyles(ele, transform);
	};

	pub.addGrabbing = function(hand, target) {
		hand.addEventListener("mousedown", grabbingHandler, false);
		function grabbingHandler(handE) {
			var startPoint = {
				top : handE.pageY, left : handE.pageX
			}, targetStartPoint = {
				top : target.offsetTop, left : target.offsetLeft
			}, mMoveHandler = function(moveE) {
				moveE.preventDefault();
				target.style.top = targetStartPoint.top + moveE.pageY - startPoint.top + "px";
				target.style.left = targetStartPoint.left + moveE.pageX - startPoint.left + "px";
			}, mUpHandler = function(mupE) {
				mupE.preventDefault();
				pub.removeClass(hand, "smarteditor-grabbing");
				document.removeEventListener("mousemove", mMoveHandler, false);
				document.removeEventListener("mouseup", mUpHandler, false);
			};

			handE.preventDefault();
			pub.addClass(hand,"smarteditor-grabbing");
			document.addEventListener("mousemove", mMoveHandler, false);
			document.addEventListener("mouseup", mUpHandler, false);
		}

	};
	prefixedaddEvent = function(element, type, callback) {
		for (var p = 0; p < pfx.length; p++) {
			if (!pfx[p]) type = type.toLowerCase();
			element.addEventListener(pfx[p]+type, callback, false);
		}
	};
	prefixedremoveEvent = function(element,type,callback){
		for (var p = 0; p < pfx.length; p++) {
			if (!pfx[p]) type = type.toLowerCase();
			element.removeEventListener(pfx[p]+type, callback);
		}
	};
	
	setStyles = function(ele, styles) {
		for (key in styles) {
			ele.style[key] = styles[key];
		}
	};
	pub.setStyles = setStyles;

	return pub;
};
