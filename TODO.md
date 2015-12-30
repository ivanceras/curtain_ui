
Fields view:

view: function({in_list,editable, compact}){}

-- if in list, then it is inside a tr, td
-- if not in list, then its inside a div used in single row view,
-- if compact, then it is mangled with other fields, labels are ommited

Tab view:

single_row_view: function({editable, compact}){}

-- if editable, then fields presented in a textbox with the label on its side, else it can be in disabled textbox or just a div
-- if compact and editable, then the labels are floating text to their corresponding text boxes
-- if compact but not editable then the labels are ommited, and the fields are mangled with each other (This is unlikely)

list_view: function({editable, compact}){}
-- if editable, presented in a grid/table and the fields are presented in a textbox else it can be in disabled textbox or just a div, the labels are the column names
-- if compact and editable, same grid, but some columns are ommited, like the dates, and unimportant columns that are not specified as identifiers
-- if compact and non editable, the labels as columns in the grid are omiited and the identifier fields are mangled together to form a nice visual list


```
----------------------------------------------------------
|    /     `        |
|   /`---'- \       |   John jones
|  (_    _ \_\      |
|  `o'/ 'o` 7)      |
|   \`-     |       |
|    \`~'  /\       |   jan 1, 1990
|     `---'  \___   |
|     --`_---'   `` |
-----------------------------------------------------------
```

editable/read-only

Main tabs are editable, can add new records

	view: function(){ return widget.view({ editable:true, compact: false})}


Extension tabs are editable, but can not add new records
	view: function(){ return widget.view({editable:true, compact:false})}

HasMany Tabs are read only, but can add new records from a lookup.

	view: function(){return widget.view({editable:false, compact:true})}

HasMany Indirect tabs are read only, but can also add new records from a lookup.

	view: function(){return widget.view({editable:false, compact:true})}


	## Toolbars

	Detail View icon will be on each record
		-	There is a close button which will return to the list/grid view
		- next/previous record
		- maximize view will minimize all other tabs
	List View is the default view of everything
	Insert in Form,
	Insert Row

	Fields associated with a lookup has a lookup link that will open a window associated with the table lookup and the linked record is focused

	list views has Save/Cancel Button for each record as a toolbar

Main tab can have specialize toolbar functions at the right which can take actions on the selected record

## Each record has an
	- audit/history of the record changes
			- use badges of how many changes has occured to the record
	- Notes/additional info
	- Attachment, files/images attachments
			- could use badges here to show how many attched items
	- Linked items, which records refers to this record


## Context Menu:
	- Edit in Grid
	- Insert Row
	- Open in Form
	- Use as filter
	- Open in new tab

## Filters
	- Each column can be used as filtering of records
	- Clear filter at the cornder



## Caching and Offline
Use localforage for local storage and caching
https://github.com/mozilla/localForage

or sql.js

https://github.com/kripken/sql.js/

## Detail of a selected record
If no record is selected, select the first one.

function get_key_fields{

}


## September 11, 2015

* Grouping of rows by column name, kendo ui has some nice demos
* Simple Filtering like openbravo
	* advance filtering like kendo ui demo

## September 12, 2015
* click will display the records detail
* double click will expand the record in grid/form mode
* Since double click triggers a click, the record is automatically selected.

## September 13, 2015
* Convert the single_row_view tables into flex div, this will make it much more nicer on mobile devices
