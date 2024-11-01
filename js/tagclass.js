var wysipre_tag = function(btnElement){
	var pub = {},
			option,
			classList;
			
	init = function(){
		option = {
			element:btnElement,
			execCommand:"",
			tag:""
		};
		option.execCommand = option.element.getAttribute('data-command');
		option.tag = option.element.getAttribute('data-tag');
		classList = option.element.classList;
	};
	
	// switch
	pub.tagComparedSwitch = function(tagName){
		if(option.tag===tagName){
			pub.activates();
		}
		else {
			pub.notActivates();
			return false;
		}
		return true;
	};
	pub.activates = function(){
		pub.addClass("active");
	};
	pub.notActivates = function(){
		pub.removeClass("active");
	};
	
	// class
	pub.addClass = function(clsName){
		classList.add(clsName);
	};
	pub.removeClass = function(clsName){
		classList.remove(clsName);
	};
	pub.toggleClass = function(clsName){
		classList.toggle(clsName);
	};
	pub.isContainsClass = function(clsName){
		return classList.contains(clsName);
	};
	
	init();
	return pub;
};

var wysipre_tag_btn = function(btnElement){
	btnElement.wysipre = {		
		tagComparedSwitch:function(tagName){
			return tagName;
		},
		activates:function(){
			classList.add("active");
		},
		notActivates:function(){
			btnElement.classList.remove("active");
		},
		toggle:function(){
			btnElement.classList.toggle("active");
			return btnElement.classList.contains("active");
		}
	};
};
