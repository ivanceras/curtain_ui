///a group of fields grouped together in for the UI display
/// used in single row view
/// arguments: {editable, compact}
var FieldGroup = {

	controller: function(args){
		return args;
	},

	view: function(ctrl){
		var field_row = ctrl.field_row;
		var data = ctrl.data;
		var dao = data ? data.dao[0]: null;
		var index = ctrl.index;

		return m("tr.field_group",
					field_row.map(function(field){
								return m.component(Field, {field:field, dao:dao, list_view:false, index: index})
							})
						)
	}

}



/// rougly equivalent to FieldGroup, this will display the rows of record in a list view table
/// only used in list view
var FieldRow = {

		controller: function(args){
				return args
		},

		view: function(ctrl){
				var fields = ctrl.fields;
				var dao = ctrl.dao;
				var index = ctrl.index;
				var table = ctrl.table;
				var key_fields = FieldRow.get_key_fields(fields);
				var key_values = FieldRow.get_key_values(key_fields, dao);
				return m("tr.records", {config: FieldRow.config, table:table, key_fields:JSON.stringify(key_fields), key_values:JSON.stringify(key_values)},
							[
								fields.map(function(field){
									return m.component(Field, {field:field, dao:dao, list_view:true, index:index});
								})
							]
						)
			},

		config: function(element, isInitialized, context){
				if(!isInitialized){
						element.onclick = function(e){ //record is selected, display the details on the other tabs
								e.preventDefault();
								var key_values = element.getAttribute("key_values");
								var key_fields = element.getAttribute("key_fields");
								var table = element.getAttribute("table");
								console.log(" clicked on row ", element);
								console.log("key_values: ", key_values);
								console.log("key_fields: ", key_fields);
								//return FieldRow.onselect({table: table, key_values:key_values, key_fields:key_fields});
						}
						element.ondblclick = function(e){// view to single_row_view
								e.preventDefault();
								console.log(" DOUBLE clicked on row ", element);
								var key_values = element.getAttribute("key_values");
								var key_fields = element.getAttribute("key_fields");
								var table = element.getAttribute("table");
								console.log("key_values: ", key_values);
								console.log("key_fields: ", key_fields);
								return FieldRow.on_focused_select({table: table, key_values:key_values, key_fields:key_fields});
						}
				}
		},

		onselect: function(arg){
			console.log("on select arg: ",arg)
			var key_values = JSON.parse(arg.key_values);
			var key_fields = JSON.parse(arg.key_fields);
			var table = arg.table;
			//console.log("key values: ", key_values);
			//console.log("key fields: ", key_fields);
			var data = Data.detail({table: table, key_values:key_values, key_fields:key_fields});
			console.log("got something: ", data);
			console.log("data(): ",data());
			data.then(function(ext){
				console.log("These are what is returned: ", ext);
				//route this to the displaying the details then
				var param = Data.build_param({key_fields:key_fields, key_values:key_values});
				m.route("/window/"+table+"/list/?"+param);
			});
		},

		on_focused_select: function(arg){
			console.log("on select arg: ",arg)
			var key_values = JSON.parse(arg.key_values);
			var key_fields = JSON.parse(arg.key_fields);
			var table = arg.table;
			//console.log("key values: ", key_values);
			//console.log("key fields: ", key_fields);
			var data = Data.detail({table: table, key_values:key_values, key_fields:key_fields});
			console.log("got something: ", data);
			console.log("data(): ",data());
			data.then(function(ext){
				console.log("These are what is returned: ", ext);
				//route this to the displaying the details then
				var param = Data.build_param({key_fields:key_fields, key_values:key_values});
				//m.route("/window/"+table+"/?"+param);
				//m.mount(document.body, DetailTab);//mount the detail tab next to the main tab
			});
		},


		// returns the array of the primary fields
		// Put in mind that key fields can be more than 1
		get_key_fields: function(fields){
		  console.log("getting key fields from: ");
		  var keys = fields.filter(function(field){
		      return field.is_keyfield
		  });

		  //console.log("keys: ", keys);
		  var key_fields = keys.map(function (key){
		    //console.log("key: ", key.column, key.complete_name);
				return key.column
		  });
			return key_fields
		},

		// there can be more than 1 column in a primary key
		get_key_values: function(key_fields, dao){
			var values = key_fields.map(function(key){
				var value = dao[key];
				//console.log("value: ",value);
				return value;
			});
			return values;
		},



}


var CompactWindowTabList = {

    controller: function(arg){
				var table = arg.table;
				return {window: Window.table(table), table:table};
    },

    view: function(ctrl){
			var table = ctrl.table;
			var window = ctrl.window();
			return m.component(WindowTab, {tab: window.tab, list_view:true, compact:true});
    }

}


/// the unit component of the UI
var Field = {

	controller: function(args){
			return args;
	},

	view: function(ctrl){
			if (!ctrl.list_view){
				return Field.single_row_view(ctrl.field, ctrl.dao, ctrl.index);
			}else{
				return Field.list_view(ctrl.field, ctrl.dao, ctrl.index);
			}
	},

	get_field_id: function(field, index){
		return field.complete_name+"["+index+"]";
	},

	bool_field: function(arg){
			var field = arg.field;
			var value = arg.value;
			var editable = arg.editable;
			var index = arg.index;
			var field_id = Field.get_field_id(field, index);

			if (editable){
				return m("label.mdl-checkbox.mdl-js-checkbox.mdl-js-ripple-effect", {config:upgrade, for:field_id},
							[
								m("input.mdl-checkbox__input", {id:field_id, type:'checkbox', checked: value }),
								m("span.mdl-checkbox__label", field.name),
							]
						)
			}
			else{
				return m("label.mdl-checkbox.mdl-js-checkbox.mdl-js-ripple-effect", {config:upgrade, for:field_id},
							[
								m("input.mdl-checkbox__input", {id:field_id, type:'checkbox', checked: value, disabled:true }),
								m("span.mdl-checkbox__label", ""),
							]
						)
			}
	},

	text_field: function(arg){
		var field = arg.field;
		var value = arg.value;
		var editable =arg.editable;
		var index = arg.index;
		var field_id = Field.get_field_id(field, index);
		if (editable){
			return m(".mdl-textfield.mdl-js-textfield.mdl-textfield--floating-label", {config: upgrade},
						[
							m("input.mdl-textfield__input ", {type:'text', id: field_id, value: value}),
							m("label.mdl-textfield__label", {for:field_id}, field.name),
							(field.description ? m(".mdl-tooltip.mdl-tooltip--large", {for:field_id, config: upgrade}, field.description) : "")
						]
					)
		}
		else{
			return value;
		}
	},

	init_date_input: function(element, isInitialized, context){
		if (!isInitialized){
				new Pikaday({
						field: element,
						format: 'YYYY-MM-DD',
				});
		}
	},

	/// The field is a date value, therefore display a calendar
	date_field: function(arg){
		var field = arg.field;
		var value = arg.value;
		var editable = arg.editable;
		var index = arg.index;
		var field_id = Field.get_field_id(field, index);
		var formatted_value = moment(value).format('YYYY-MM-DD');
		if (editable){
			return m(".mdl-textfield.mdl-js-textfield.mdl-textfield--floating-label", {config: upgrade},
						[
							m("input.mdl-textfield__input ", {type:'text', id: field_id, value: (value ? formatted_value : ""), config: (value ? Field.init_date_input : "") }),
							m("label.mdl-textfield__label", {for: field_id}, field.name),
							(field.description ? m(".mdl-tooltip.mdl-tooltip--large", {for:field_id, config: upgrade}, field.description) : "")
						]
					)
		}
		else{
			return value;
		}
	},

	/// The field is a lookup value to a different table referenced by this table
	/// Use a menu to list down the value and select the appropiate selected value
	table_lookup_list: function(arg){
		var field = arg.field;
		var value = arg.value;
		var editable = arg.editable;
		var index = arg.index;
		var field_id = Field.get_field_id(field, index);

			function focus_text_field(element, isInitialized, context){
			    context.retain = true
			    if (!isInitialized){
							upgrade(element, isInitialized, context);
							var for_element =  element.getAttribute("for")
							var text_field = document.getElementById(for_element);
			        element.onclick = function(){
								text_field.click();
							}
			    }
			}

			function drop_down_content(arg){
					var table = arg.table;
					return m("ul.mdl-menu.mdl-menu--bottom-right.mdl-js-menu.mdl-js-ripple-effect", {for:field_id, config:upgrade}, [
						m.component(CompactWindowTabList, {table:table})
					])
			}

		return m(".mdl-textfield.mdl-js-textfield.mdl-textfield--floating-label", {config: upgrade},
					[
						m("input.mdl-textfield__input.lookup", {type:'text', id: field_id, value: value}),
						m("label.mdl-textfield__label", {for:field_id}, field.name),
						m("label.mdl-button.mdl-js-button.mdl-button--icon.mdl-js-ripple-effect.lookup_list_icon", {for:field_id, config:focus_text_field},
								[
									m("i.material-icons", "arrow_drop_down")
								]
						),
						(field.description ? m(".mdl-tooltip.mdl-tooltip--large", {for:field_id, config: upgrade}, field.description) : ""),
						drop_down_content({table:field.reference_value})
					]
				)
	},

	get_field_content: function(arg){
		var field = arg.field;
		var value = arg.value;
		var editable = arg.editable;
		var index = arg.index;
		var field_content
		if (field.reference == "Table"){
			field_content = Field.table_lookup_list({field:field, value:value, editable:editable, index:index})
		}
		else if (field.data_type == "bool"){
			field_content = Field.bool_field({field:field, value:value, editable:editable, index:index});
		}
		else if (field.data_type == "DateTime<UTC>"){
			field_content = Field.date_field({field:field, value:value, editable:editable, index:index});
		}
		else{
			field_content = Field.text_field({field:field, value:value, editable:editable, index:index});
		}
		return field_content;
	},

	single_row_view: function(field, dao, index){
		var value = dao ? dao[field.column] : "";
		var field_content = Field.get_field_content({field:field, value:value, editable:true, index:index});
		return m("td", field_content)

	},



	list_view: function(field, dao, index){
		var value = dao[field.column];
		var field_content = Field.get_field_content({field:field, value: value, editable:false, index:index});
		return m("td.mdl-data-table__cell--non-numeric", field_content)
	},

	editable_list_view: function(field){
		return m("td.records.mdl-data-table__cell--non-numeric",
					m(".mdl-textfield.mdl-js-textfield.mdl-textfield--floating-label", {config: upgrade},
							[
								m("input.mdl-textfield__input ", {type:'text', id: field.complete_name, value:""}),
								m("label.mdl-textfield__label", {for:field.complete_name}, field.name),
								(field.description ? m(".mdl-tooltip.mdl-tooltip--large", {for:field.complete_name, config: upgrade}, field.description) : "")
							]
						)
				);
	},



}
