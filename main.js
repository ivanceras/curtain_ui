//m.route.mode = "pathname";
m.route.mode = "search";
//m.route.mode = "hash";




var Error = {
    view: function(){
      return m("h5", "There was an error talking to the server")
    }
}

function display_error(){
    console.log("mounting error");
    m.mount(document.body, Error)
}



function check_toolbar(){
  var do_check = true;
    if (do_check){
      var main_content = document.getElementById("main_content");
      var main_toolbar = document.getElementById("main_toolbar");
      var toolbar_header = document.getElementById("toolbar_header")
      console.log("scrolltop: ",main_content.scrollTop)

      if(main_content.scrollTop > 100){
        main_toolbar.classList.add("mdl-shadow--16dp", "main_toolbar--detached")
        main_toolbar.classList.remove("main_toolbar--inplaced")
        toolbar_header.classList.remove("hidden");
      }
      else{
        main_toolbar.classList.remove("mdl-shadow--16dp");
        main_toolbar.classList.remove("main_toolbar--detached");
        main_toolbar.classList.add("main_toolbar--inplaced")
        toolbar_header.classList.add("hidden");
      }
    }
}

var ViewCache = {}

var WindowList = {

    controller: function(arg){
        var view_style = m.route.param("view"); //list,detail,compact
        var record_id = m.route.param("record_id");
        console.log("view record", view_style, record_id);
        var list_view = view_style ? "list" : true;
        var compact = view_style ? "compact" : false;
        var table = m.route.param("table");
        var list =  Window.list();
        if (!table){
            return {window: Window.first(), list:list, list_view:list_view}

        }
        return {window: Window.table(table), list:list, list_view:list_view}
    },

    /// the window listing doesn't change much often, so this will be binded once
    /// optimization purposed to prevent the view being redrawn and get rid of the anoying scroll bar to scroll back to top.
    /// implemented using subtree directive
    /// https://lhorie.github.io/mithril/mithril.render.html
    window_listing: function(ctrl){
      if (!ViewCache['window_list']) {
          ViewCache['window_list'] = true
          return m(".mdl-layout__drawer",
            [
                m("span.mdl-layout-title", ""),
                m("nav.navigation.mdl-navigation",
                    [
                      ctrl.list().map(function(window){
                          return m("a", {class:'mdl-navigation__link', window:window.table, href: "/window/"+window.table, config:WindowList.display_window},
                                  [m("i.material-icons", "view_list"), window.name])
                      })
                    ]
                )
            ]
          )
      }
      else return {subtree: "retain"}

    },


    view: function(ctrl){
      return m(".mdl-layout.mdl-js-layout.mdl-layout--fixed-drawer.mdl-layout--overlay-drawer-button.mdl-shadow--16dp",  {config: upgrade},
        [
           /*
           m("header.mdl-layout__header", [
                m(".mdl-layout__header-row", [
                      m("span.mdl-layout-title", "Curtain UI"),
                      m(".mdl-layout-spacer"),
                      m("nav.mdl-navigation", [
                          m("a.mdl-navigation__link[href='/']", {config: m.route}, "Home"),
                          m("a.mdl-navigation__link[href='/new']", {config: m.route}, "New connection"),
                          m("a.mdl-navigation__link[href='/dc']",{config: m.route}, "Disconnect"),
                      ])
                ])
            ]),*/
            WindowList.window_listing(ctrl),
            m("main.mdl-layout__content", {id:"main_content", onscroll:function(){console.log("scrolled...");check_toolbar()}},
                [
                  m.component(WindowDetail, {list_view:ctrl.list_view, compact: ctrl.compact}),
                ]
            )
        ]);
    },

    display_window: function(element, isInitialized, context){
        var href = element.getAttribute("href");
        var window = element.getAttribute("window");
        element.onclick = function(e){
            e.preventDefault();
            console.log("display or route to: ", window);
            var main_content = document.getElementById("main_content");
            console.log("main content", main_content);
            m.route(href);
        }
    },



}



var Home = {

    controller: function(){
      ViewCache = {};//clear the view cache
    },

    view: function() {
        return m("html",
                [
                    m("h3", "Home"),
                    m("a", {href:"/window", config:m.route}, "Go to windows"),
                    m("br"),
                    m("a", {href:"/new", config:m.route}, "Connect to a server"),
                    m("p", "version 0.0.3")
                ]);
    }
}

var NewConnection = {


    connect_to_server: function(element, isInitialized, context){
        ViewCache = {}; //clear the view cache
        if (!isInitialized){
            upgrade(element, isInitialized, context);
            element.onclick = function(e){
              console.log("connecting to server")
              e.preventDefault();
              NewConnection.set_db_url();
              m.route(element.getAttribute("href"))
            }
        }
    },


    set_db_url:function(){
      console.log("db_url:", db_url());
      sessionStorage.setItem('db_url', db_url());
    },

    build_db_url: function(){
        var platform = document.getElementById("platform").value;
        var host = document.getElementById("host").value;
        var port = document.getElementById("port").value;
        var database = document.getElementById("database").value;
        var user = document.getElementById("user").value;
        var password = document.getElementById("password").value;
        var url = platform+"://"+user+":"+password+"@"+host+":"+port+"/"+database
        db_url = m.prop(url);
        console.log("url: ", url);
    },

    view: function() {
        return m(".center_form.mdl-card.mdl-shadow--16dp",
                        [
                            m(".mdl-card__title",
                                m("h2.mdl-card__title-text", "Welcome")
                            ),
                            m(".mdl-card__supporting-text",
                                [
                                  m(".mdl-textfield.mdl-js-textfield.mdl-textfield--floating-label", {config:upgrade},
                                    [
                                        m("input.mdl-textfield__input", {type:"text", id:"platform", config:upgrade, onchange: NewConnection.build_db_url}),
                                        m("label.mdl-textfield__label",{config:upgrade}, "platform"),
                                        m("span.mdl-textfield__error", "postgres, mysql, sqlite"),
                                     ]
                                 ),
                                 m(".mdl-textfield.mdl-js-textfield.mdl-textfield--floating-label", {config:upgrade},
                                   [
                                       m("input.mdl-textfield__input", {type:"text", id:"host", config:upgrade, onchange: NewConnection.build_db_url}),
                                       m("label.mdl-textfield__label",{config:upgrade}, "host"),
                                       m("span.mdl-textfield__error", "host is invalid"),
                                    ]
                                ),

                                m(".mdl-textfield.mdl-js-textfield.mdl-textfield--floating-label", {config:upgrade},
                                  [
                                      m("input.mdl-textfield__input", {type:"text", id:"port", config:upgrade, onchange: NewConnection.build_db_url}),
                                      m("label.mdl-textfield__label",{config:upgrade}, "port"),
                                      m("span.mdl-textfield__error", "port"),
                                   ]
                                ),
                                m(".mdl-textfield.mdl-js-textfield.mdl-textfield--floating-label", {config:upgrade},
                                  [
                                      m("input.mdl-textfield__input", {type:"text", id:"database", config:upgrade, onchange: NewConnection.build_db_url}),
                                      m("label.mdl-textfield__label",{config:upgrade}, "database"),
                                      m("span.mdl-textfield__error", "database"),
                                   ]
                                ),
                                m(".mdl-textfield.mdl-js-textfield.mdl-textfield--floating-label", {config:upgrade},
                                  [
                                      m("input.mdl-textfield__input", {type:"text", id:"user", config:upgrade, onchange: NewConnection.build_db_url}),
                                      m("label.mdl-textfield__label",{config:upgrade}, "user"),
                                      m("span.mdl-textfield__error", "user"),
                                   ]
                                ),
                                m(".mdl-textfield.mdl-js-textfield.mdl-textfield--floating-label", {config:upgrade},
                                  [
                                      m("input.mdl-textfield__input", {type:"password", id:"password", config:upgrade, onchange: NewConnection.build_db_url}),
                                      m("label.mdl-textfield__label",{config:upgrade}, "password"),
                                      m("span.mdl-textfield__error", "password"),
                                   ]
                                ),
                                m("p", "-OR-"),
                                m("div",
                                    [
                                      m(".mdl-textfield.mdl-js-textfield.mdl-textfield--floating-label", {config:upgrade},
                                      [
                                      		m("input.mdl-textfield__input", {style:{width:"450px"}, type:"text", onchange: m.withAttr("value", db_url), value: db_url(), config:upgrade}),
                                      		m("label.mdl-textfield__label",{config:upgrade}, "DB url"),
                                      		m("span.mdl-textfield__error", "Unable to connect to db"),
                                  	   ])
                                    ]
                                ),
                              ]
                            ),
                            m(".mdl-card__actions",
                                [
                                    m(".mdl-grid", [
                                        m(".mdl-cell.mdl-cell--4-col", "\n"),
                                        m(".mdl-cell.mdl-cell--8-col", [
                                        m("a.mdl-button.mdl-button--colored.mdl-js-button.mdl-js-ripple-effect", {href:'/', config:upgrade_and_route}, "Cancel"),
                                        m("a.mdl-button.mdl-button--raised.mdl-js-button.mdl-js-ripple-effect.mdl-button--accent", {href:'/window', config:NewConnection.connect_to_server}, "Connect")
                                    ])])
                                ]
                            ),
                            m(".mdl-card__menu",
                                m("button.mdl-button.mdl-button--icon.mdl-js-button.mdl-js-ripple-effect", {config:upgrade, onclick: function(){NewConnection.build_db_url()}},
                                    m("i.fa.fa-bars", "")
                                )
                            ),

                        ]
                    )

    }
}

var Disconnect = {

    controller: function(){
        console.log("disconnecting...");
        ViewCache = {} //clear the cache
        sessionStorage.clear();
        var session_db_url = sessionStorage.getItem('db_url');
        var db_url = m.prop(session_db_url);
        m.route("/");
    }

}

//m.mount(document.body, WindowList);


m.route(document.body, "/", {
    "/": Home,
    "/new": NewConnection,
    "/dc": Disconnect,
    "/window": WindowList,
    "/window/:table": WindowList,
    "/window/:table/:view/": WindowList, //list view with focused record, display the details
    "/window/:table/:view/:record_id": WindowList, //list view with focused record, display the details

});

m.redraw.strategy('diff');
