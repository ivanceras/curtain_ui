// window_content.js
// Main window handles the data from the main table
// The main window allows editing of each data field
// allows deleting of records, by default


/// the record listing can be deleted
/// each field on each record is not editable
/// 
var WindowContent = {

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

        var ext_tabs = window.tab.ext_tabs;
        var has_many_tabs = window.tab.has_many_tabs;
        var has_many_indirect_tabs = window.tab.has_many_indirect_tabs;
        var unified_tabs = has_many_tabs.concat(has_many_indirect_tabs);

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
                        m.component(MainWindowTab, {tab: window.tab, list_view:list_view}),
                        m.component(ExtensionContent, {tabs:ext_tabs, list_view:false}), 
                        m(".many_tabs",
                            [
                              m.component(HasManyContent, {tabs:unified_tabs, list_view:true})
                            ]
                        )
                      ]
                ),
               ])

        ]);
    }
}

