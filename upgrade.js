///requires material.js

/// component upgrade and other common functions
/// upgrade material elements upon mounted into the dom
function upgrade(element, isInitialized, context){
    context.retain = true
    if (!isInitialized){
        componentHandler.upgradeElement(element);
    }
}

/// upgrade material elements while also retain the routing
/// upgrading styled anchors will routing still works
function upgrade_and_route(element, isInitialized, context){
    if (!isInitialized){
      upgrade(element, isInitialized, context);
      element.onclick = function(e){
        e.preventDefault();
        m.route(element.getAttribute("href"))
      }
    }
}

/// tabs are noutiously hard to upgrade
function upgrade_ripple(element, isInitialized, context){
  context.retain = true
  if (!isInitialized){
    componentHandler.upgradeElement(element,  'MaterialButton');
    componentHandler.upgradeElement(element,  'MaterialRipple');
  }
}
