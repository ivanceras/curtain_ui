
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
