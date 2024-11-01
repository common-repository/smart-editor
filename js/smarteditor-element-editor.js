var smarteditor_element_editor = function(editor,smarteditor) {
	// @formatter:off
	var publicFunction = {},
			nodeNameElement,
			inputClass,
			inputStyle,
			targetElements,
			targetElement,
			classNameHtml;
	publicFunction.active = false;
	// @formatter:on

	function init() {
		var cnames_string,cnames_arr;
		publicFunction.active = true;
		
		// class to be used
		cnames_string = smart_editor_options_classnames||"";
		cnames_arr = (cnames_string!="")? cnames_string.split(",") : null;
		if(cnames_arr){
			classNameHtml = "<option>Add</option>";
			for(var k in cnames_arr){
				cnames_arr[k] = cnames_arr[k].replace(/ /g,"");
				classNameHtml += '<option value="'+cnames_arr[k]+'">'+cnames_arr[k]+'</option>';
			}
		}
		else {
			// defalt
			classNameHtml = "<option>Add</option>";
			classNameHtml += "<option value='clearfix'>clearfix</option>";
			classNameHtml += "<option value='align-right'>align-right</option>";
			classNameHtml += "<option value='align-left'>align-left</option>";
		}
	}

	// Public Method
	publicFunction.getRegistObj = function() {
		// @formatter:off
		var obj = {
			title : "Element Editor",
			width : 400,
			items : [
				{type : "text", content:"Node Name",id:"SmartEditor-Window-Element-NodeName"},
				{type : "text", content:"Class"},
				{type : "input", attr:{type:'text'} ,id:"SmartEditor-Window-Element-ClassVal"},
				{type : "select", id:"SmartEditor-Window-AddClass",content:classNameHtml},
				{type : "text", content:"Style"},
				{type : "input", attr:{type:'text'} ,id:"SmartEditor-Window-Element-StyleVal"},
			],
			actions : [
				{	id : "SmartEditor-Window-Element-ClassVal",
					hook : "keyup",
					func : changeValueHandler,
				},
				{	id : "SmartEditor-Window-Element-StyleVal",
					hook : "keyup",
					func : changeValueHandler,
				},
				{	id : "SmartEditor-Window-AddClass",
					hook : "change",
					func : addClassHandler,
				},
				
				{
					id : "SmartEditor-Window-OKBtn", hook : "click", func : okHandler
				}
			],
			initAction:initAction
		};
		// @formatter:on
		
		
		return obj;
	};
	publicFunction.setElement = function(element){
		setElement(element);
	};
	publicFunction.selectElement = function(i){
		targetElement = targetElements[i];
		setElement(targetElement.element,"NO");
		selectPathString(i);
	};
	
	// Private Method
	function initAction(){
		nodeNameElement = document.getElementById("SmartEditor-Window-Element-NodeName");
		inputClass = document.getElementById("SmartEditor-Window-Element-ClassVal");
		inputStyle = document.getElementById("SmartEditor-Window-Element-StyleVal");
	}
	function online(e){
		inputClass = e;
	}
	function setElement(element,getElementFlg){
		var b = getElementFlg || true;
		if(element){
			targetElement = element;
			if(b!=="NO"){
				nodeNameElement.innerHTML = getPathString(element);
				selectPathString(0);
			}
			inputClass.value = targetElement.className;
			inputStyle.value = targetElement.getAttribute('style');
		}
	}
	function changeValueHandler(e){
		var id = e.currentTarget.id;
		switch(id){
			case "SmartEditor-Window-Element-ClassVal":
				updateClass();
				break;
			case "SmartEditor-Window-Element-StyleVal":
				targetElement.setAttribute('style', inputStyle.value);
				break;
			default:
				console.log("error:"+id);
				break;
		}
	}
	function okHandler(e){
		if(targetElement){
			targetElement.className = inputClass.value;
		}
		publicFunction.active = false;
	}
	
	function getPathString(element){
		var text = "";
		targetElements = smarteditor.getActiveTags(element);
		
		for ( i = targetElements.length - 1; i > 0; i -= 1) {
			text += '<a class="path item'+i+'" href="javascript:smartEditor.elementEditor.selectElement(' + i + ');">' + targetElements[i].name + '</a> &gt; ';
		}
		if (targetElements[0]) {
			text += ' <a class="path item'+i+'" href="javascript:smartEditor.elementEditor.selectElement(' + i + ');">' + targetElements[0].name + '</a>';
		}
		return text;
	}
	function selectPathString(i){
		var h = document.getElementsByClassName("item"+i ,nodeNameElement);
		if(h.length){
			//reset
			var c = document.getElementsByClassName("path" ,nodeNameElement);
			for (ci=0; ci < c.length; ci+=1) {
				c[ci].classList.remove("active");
			}
			//set
			h[0].classList.add("active");
		}
	}
	
	function addClassHandler(e){
		//console.log(e.target.firstChild);
		if(e&&e.target&&e.target.value){
			inputClass.value = inputClass.value + " "+e.target.value;
		}
		e.target.firstChild.selected = true;
		updateClass();
	}

	function updateClass(){
		if(targetElement&&inputClass){
			targetElement.className = inputClass.value;
		}
	}



	init();
	return publicFunction;
};
