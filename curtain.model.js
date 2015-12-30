
//var default_db_url = "postgres://atperknxxnjadk:jpasCIjuPd3MW48DUnb579-imU@ec2-23-21-140-156.compute-1.amazonaws.com:5432/dd2fbo2kj0q9l"; //heroku
var default_db_url = "postgres://postgres:p0stgr3s@localhost:5432/bazaar_v7"; //local db

var session_db_url = sessionStorage.getItem('db_url');
var session_db_url = session_db_url ? session_db_url : default_db_url;
var db_url = m.prop(session_db_url);


//var api_endpoint = "http://45.55.7.231:8080";//production
//var api_endpoint = "http://localhost:8181"; //dev
var api_endpoint = "https://iron-curtain.herokuapp.com"; //heroku

function xhr_config(xhr){
    var value = db_url();
    console.log("using connection: ",value);
    xhr.setRequestHeader("db_url", value);
}


var Window = function(data) {
    data = data || {}
    this.table = m.prop(data.table)
    this.name = m.prop(data.name)
    this.description = m.prop(data.description)
}

Window.list = function() {
    return m.request({
            method: "GET",
            url: api_endpoint+"/window", //"window_list.json",
            config: xhr_config,
    }).then(function(list){
      console.log("Got list: ", list);
      return list
    });
}

/// whatever is the first window, will be used when no window is specified
Window.first = function(){
    return Window.list()
        .then(function(list){
                return Window.table(list[0].table)
            })
}

Window.table = function(table) {
    return m.request({
        method: "GET",
        url: api_endpoint+"/window/"+table, //"window.json"
        config: xhr_config,
    })
}


var Data = {

    from_table: function(table){
        return m.request({
            method: "GET",
            url: api_endpoint+"/data/"+table, //"product.json"
            config: xhr_config,
        })
    },
    // get data for each table related to this record
    detail: function(arg){
      console.log("Extracting details....")
      var table = arg.table;
      var key_values = arg.key_values;
      var key_fields = arg.key_fields;

        var param = Data.build_param(arg);
        var url = api_endpoint+"/detail/"+table+"?"+param;
        console.log("reqeusting detail: ", url);
        return m.request({
            method: "GET",
            url: url, //"product.json"
            config: xhr_config,
        }).then(function(data){
            console.log("detail data: ",data);
            return data;
        })
    },

    build_param: function(arg){
      var key_values = arg.key_values;
      var key_fields = arg.key_fields;
      var param  = "";
      var do_and = false;
      for (var i in key_fields){
          console.log(key_fields[i]+"="+key_values[i]);
          if(do_and){
              param.concat("&");
          }else{
              do_and=true;
          }
          param = param + key_fields[i]+"="+key_values[i]
      }
      console.log("PARAM: ",param);
      return param;
    },


}
