if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}

var dbSchema = "CREATE TABLE product_availability ( \
   --Each product has its own product availability which determines when can it be available for purchase\n\
    product_id uuid NOT NULL , --this is the id of the product\n\
    available boolean, \
    always_available boolean, \
    stocks numeric DEFAULT 1, \
    available_from timestamp with time zone, \
    available_until timestamp with time zone, \
    available_day json, \
    open_time time with time zone, \
    close_time time with time zone, --closing time\n\
    FOREIGN KEY(product_id) REFERENCES product(product_id) \
)";

var raw = dbSchema.match(/.*CREATE\s+TABLE\s+(\S+)\s*\(([^]+)\).*/m)[2].split(/[\n,]/);
var columns = [];
var comments = [];
var index = 0;
console.log("raw", raw);
for(i = 0;i < raw.length; i++) {
    console.log("["+i+"]", raw[i]);
    var line = raw[i].trim();
    if (line.startsWith("--")){
      console.log("is a line comment")
      comments[index] = line;
    }
    else if (line.startsWith("/*")){
      console.log("This is a multi line comment")
    }
    else{
      var splinters = line.split(/ /);
      var column_name = splinters[0];
      if (column_name.toUpperCase().startsWith("FOREIGN")){
          console.log("skipping foreign..")
      }
      else if (column_name.toUpperCase().startsWith("CHECK")){
          console.log("skipping check..")
      }
      else{
        columns[index] = column_name;
        console.log("column_name:", column_name)
        index += 1;
      }
    }
}
console.log("columns: ", columns)
console.log("comments:", comments)
