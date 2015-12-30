


var MainToolbar = {

 controller: function(arg){
      return {window:arg.window}
  },

  view: function(ctrl){
    var detail_link = "/window/"+ctrl.window+"/"
    var list_link = "/window/"+ctrl.window+"/list/"
    console.log("window is:.. ", ctrl.window);
    return m(".main_toolbar--inplaced", {id:"main_toolbar"},

      [ m("div.toolbar_header.hidden", {id:"toolbar_header"},
          [m("a.mdl-button.mdl-js-button.mdl-button--colored.mdl-js-ripple-effect",ctrl.window)]
        ),
        m("div", [
              m("a.mdl-button.mdl-js-button.mdl-button--colored.mdl-js-ripple-effect.main_toolbar--icon", {config:upgrade_and_route, href:detail_link, id:"insert_form"}, m("i.fa.fa-file-o.fa-2x.toolbar_icon")),
              m(".mdl-tooltip", {for:"insert_form", config:upgrade}, "Insert in form"),

              m("a.mdl-button.mdl-js-button.mdl-button--colored.mdl-js-ripple-effect.main_toolbar--icon", {config:upgrade_and_route, href:list_link, id:"insert_row"}, m("i.fa.fa-list.fa-2x.toolbar_icon")),
              m(".mdl-tooltip", {for:"insert_row", config:upgrade}, "Insert Row"),

              m("a.mdl-button.mdl-js-button.mdl-button--colored.mdl-js-ripple-effect.main_toolbar--icon", {config:upgrade, href:"#", id:"save"}, m("i.fa.fa-floppy-o.fa-2x.toolbar_icon")),
              m(".mdl-tooltip", {for:"save", config:upgrade}, "Save"),

              m("a.mdl-button.mdl-js-button.mdl-button--colored.mdl-js-ripple-effect.main_toolbar--icon", {config:upgrade, href:"#", id:"close"}, m("i.fa.fa-times-circle-o.fa-2x.toolbar_icon")),
              m(".mdl-tooltip", {for:"close", config:upgrade}, "Close"),


              m("a.mdl-button.mdl-js-button.mdl-button--colored.mdl-js-ripple-effect.main_toolbar--icon", {config:upgrade, href:"#", id:"refresh"}, m("i.fa.fa-refresh.fa-2x.toolbar_icon")),
              m(".mdl-tooltip", {for:"refresh", config:upgrade}, "Refresh"),

              m("a.mdl-button.mdl-js-button.mdl-button--colored.mdl-js-ripple-effect.main_toolbar--icon", {config:upgrade, href:"#", id:"delete"}, m("i.fa.fa-trash.fa-2x.toolbar_icon.danger")),
              m(".mdl-tooltip", {for:"delete", config:upgrade}, "Delete"),

              m("a.mdl-button.mdl-js-button.mdl-button--colored.mdl-js-ripple-effect.main_toolbar--icon", {config:upgrade, href:"#", id:"attachment"}, m("i.fa.fa-paperclip.fa-2x.toolbar_icon")),
              m(".mdl-tooltip", {for:"attachment", config:upgrade}, "Attachment")
        ])

    ]);
  }
}



var MiniToolbar = {

  controller: function(arg){

  },

  view: function(ctrl){
    return m(".mini_toolbar", [
        m("a.mdl-button.mdl-js-button.mdl-js-ripple-effect.mdl-button--colored.mini_icon", {config:upgrade, href:"#", id:"mini_insert_form"},
          m("i.fa.fa-file-o.toolbar_icon")
        ),
        m(".mdl-tooltip", {for:"mini_insert_form", config:upgrade}, "Insert in form"),

        m("a.mdl-button.mdl-js-button.mdl-js-ripple-effect.mdl-button--colored.mini_icon", {config:upgrade, href:"#", id:"min_insert_row"},
            m("i.fa.fa-list.fa-fw.toolbar_icon")
        ),
        m(".mdl-tooltip", {for:"min_insert_row", config:upgrade}, "Insert Row"),

    ]);
  }
}

/// This is the main window of the table that list the records
/// the record listing can be deleted
/// each field on each record can be edited
/// only shows the detail, when a record is selected
var MainWindow = {

}

/// TODO: This will be renamed to WindowTabs
/// the record listing can be deleted
/// each field on each record is not editable
/// 
var WindowDetail = {

    controller: function(arg){
        var list_view = arg ? arg.list_view : false;
        var table = m.route.param("table");
        if (!table){
            var param = {window: Window.first()};
            return {window: Window.first(), list_view:list_view}

        }
        return {window: Window.table(table), list_view:list_view}
    },



    view: function(ctrl){
        var window = ctrl.window();
        var list_view = ctrl.list_view;
        var include_extension = true;
        var include_direct = true;
        var include_indirect = true;
        var unify_tabs = true;// unify the direct and indirect tabs to minimize clutter

        var ext_tabs = include_extension ? window.tab.ext_tabs : [];
        var has_many_tabs = include_direct ? window.tab.has_many_tabs : [];
        var has_many_indirect_tabs = include_indirect ? window.tab.has_many_indirect_tabs : [];
        var unified_tabs = unify_tabs ? has_many_tabs.concat(has_many_indirect_tabs) : [];

        return m(".mdl-tabs.mdl-js-tabs.mdl-js-ripple-effect.main_tab", {config:upgrade}, [
                m(".mdl-tabs__tab-bar.left_justified.main_tab--action", {config:upgrade},
                        [
                          m("a.mdl-tabs__tab.mdl-js-ripple-effect",{href:"#"+window.table, class:"is-active"}, window.name)
                        ]
                ),
                m(".mdl-tabs__panel", {id:window.table,class:"is-active"},
                [
                  m.component(MainToolbar, {window:window.table}),
                  m("p", window.description),
                  m("div.tab_detail_content",
                      [
                        m.component(WindowTab, {tab: window.tab, list_view:list_view}),
                        (list_view ? "" : m.component(ExtTabs, {tabs:ext_tabs, list_view:false}) ) , // do not show extension when in list_view
                        m(".many_tabs",
                            [
                              unify_tabs ? m.component(HeaderTabs, {tabs:unified_tabs, list_view:true}) :
                              (
                                [
                                  m.component(HeaderTabs, {tabs:has_many_tabs, list_view:true}),//direct has many
                                  m.component(HeaderTabs, {tabs:has_many_indirect_tabs, list_view:true}),// indirect has many ( can be hidden by default)
                                ]
                              )
                            ]
                        )
                      ]
                ),
               ])

        ]);
    }
}


function create_array(rows) {
    var arr = [];
    for (var i=0;i<rows;i++) {
        arr[i] = [];
    }
    return arr;
}

// group fields into 2 columns
// down to right
function group_fields(fields){
    var columns = 3;
    var top_bottom_right = false; // other is top_right_bottom
    var rows = ( Math.floor((fields.length - 1) / columns)) + 1;
    var group = create_array(rows);
    var index = 0;
    if(top_bottom_right){
        for (var c = 0; c < columns; c++){
            for (var r = 0; r < rows; r++){
                if(index < fields.length){
                      group[r][c] = fields[index];
                }
                index++;
            }
        }
    }else{
        for (var r = 0; r < rows; r++){
            for (var c = 0; c < columns; c++){
                if(index < fields.length){
                      group[r][c] = fields[index];
                }
                index++;
            }
        }
    }
    return group;
}



var WindowTab = {

    controller: function(args){
        var tab = args.tab;
        var schema = tab.schema;
        var table = tab.table;
        var complete_table = schema+"."+table;
        args.data = Data.from_table(complete_table);
        args.table = complete_table;
        return args
    },

    view: function(ctrl, args){
      if (ctrl.list_view){
        if (ctrl.compact){
          return WindowTab.compact_list_view(ctrl);
        }else{
          return WindowTab.list_view(ctrl);
        }
      }
      else{
        return WindowTab.single_row_view(ctrl);
      }
    },

    /// table listing of the records
    list_view: function(ctrl){
        var fields = ctrl.tab.fields;
        var data = ctrl.data();
        var table = ctrl.table;
        return  m("div.list_view",
              [
                m("table.mdl-data-table.mdl-js-data-table", {config:upgrade},
                  [
                    m("thead",
                      m("tr",
                        [
                          fields.map(function(field){
                              return m("th", field.name);
                            })
                        ]
                      )
                    ),
                    m("tbody",
                      [
                      data.dao.map(function(dao, index){
                        return m.component(FieldRow, {fields:fields, dao:dao, index: index, table: table})
                      }),
                      //WindowTab.append_new_record(fields)
                    ])
                  ]
                )
              ]);
    },
    // a compact list view representation of the window,
    // used as a lookup from some other tab fields
    // displayed as menu
    compact_list_view: function(arg){
      var tab = arg.tab;
      var list_view = arg.list_view;
      var fields = tab.fields;
      var data = arg.data();
      return m("span",
                [
                    data.dao.map(function(dao){
                      return m("li.mdl-menu__item.compact_list_item", dao["name"])
                    })
                ]
            )
    },

    /// create an editable empty row at the bottom of the list, no need to press for new record
    append_new_record: function(fields){
        return m("tr",
          [
            fields.map(function(field){
                return Field.editable_list_view(field);
              })
          ]
        )
    },

    /// single row view of the records
    single_row_view: function(ctrl){
        var grouped_fields = group_fields(ctrl.tab.fields);
        var data = ctrl.data();
        var first_record
        if (data.dao.length > 0){
          first_record = data.dao[0];
        }
        return m("div",[
            m("table",
                m("tbody",
                [
                  grouped_fields.map(function(field_row, index){
                      return m.component(FieldGroup, {field_row:field_row, data:data, list_view:false, index:index})
                  })
              ])
            )
        ]);
    },



}



var HeaderTabs = {

    controller: function(args){
        return args.tabs;
    },

    view : function(ctrl, args){
        if (args.tabs.length == 0){return m(".no-content")};
        var header_index = 0;
        var tab_index = 0;
        return  m(".header_tabs.mdl-shadow--16dp",
                [
                    m(".mdl-tabs.mdl-js-tabs.mdl-js-ripple-effect", {config:upgrade},
                        [
                            m(".mdl-tabs__tab-bar.left_justified", [
                                args.tabs.map(function(tab){
                                    header_index++;
                                    return m("a.mdl-tabs__tab.mdl-js-ripple-effect",{config:upgrade_ripple, href:"#"+tab.table, class: header_index == 1 ? "is-active" : ""}, tab.name);
                                }),
                            ]),
                            args.tabs.map(function(tab){
                                tab_index++;
                                return m(".mdl-tabs__panel", {id:tab.table,  class: tab_index == 1 ? "is-active" : ""},
                                        [
                                          m.component(MiniToolbar),
                                          m.component(WindowTab, {tab:tab, list_view:args.list_view})
                                        ]
                                )
                            })
                        ]
                     ),

                ]
                );
    }
}


/// 1 for each tab
var ExtTabs = {

    controller: function(args){
        return args.tabs;
    },

    view : function(ctrl, args){
        if (args.tabs.length == 0){return m(".no-content")};
        var header_index = 0;
        var tab_index = 0;
        return m(".extension_tab.mdl-shadow--8dp",
            [
              args.tabs.map(function(tab){
              return [
                        m(".mdl-tabs.mdl-js-tabs.mdl-js-ripple-effect", {config:upgrade},
                            [
                                m(".mdl-tabs__tab-bar.left_justified", {config:upgrade},
                                    m("a.mdl-tabs__tab.mdl-js-ripple-effect.is-active",{config:upgrade_ripple, href:"#"+tab.table}, tab.name)
                                ),
                                m(".mdl-tabs__panel", {id:tab.table, class:"is-active"},
                                    m.component(WindowTab, {tab:tab, list_view:args.list_view})
                                )
                            ]
                         )
                    ]
          })
        ]);
    }
}
