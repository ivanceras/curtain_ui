
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

/// Main window tab list down the table that is focused
var MainWindowTab = {

    controller: function(args){
        var tab = args.tab;
        var schema = tab.schema;
        var table = tab.table;
        var complete_table = schema+"."+table;
        args.data = Data.from_table(complete_table);
        args.table = complete_table;
        return args
    },

    /// table listing of the records
    view: function(ctrl){
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
                    ])
                  ]
                )
              ]);
    },


}


// extension table, has_one
var ExtensionTab = {

    controller: function(args){
        var tab = args.tab;
        var schema = tab.schema;
        var table = tab.table;
        var complete_table = schema+"."+table;
        args.data = Data.from_table(complete_table);
        args.table = complete_table;
        return args
    },

    /// table listing of the records
    view: function(ctrl){
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
                    ])
                  ]
                )
              ]);
    },


}

/// has many tab direct/indirect
var HasManyTab = {

    controller: function(args){
        var tab = args.tab;
        var schema = tab.schema;
        var table = tab.table;
        var complete_table = schema+"."+table;
        args.data = Data.from_table(complete_table);
        args.table = complete_table;
        return args
    },

    /// table listing of the records
    view: function(ctrl){
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
                    ])
                  ]
                )
              ]);
    },


}


var HasManyContent = {

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
                                          m.component(HasManyTab, {tab:tab, list_view:args.list_view})
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
var ExtensionContent = {

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
                                    m.component(ExtensionTab, {tab:tab, list_view:args.list_view})
                                )
                            ]
                         )
                    ]
          })
        ]);
    }
}
