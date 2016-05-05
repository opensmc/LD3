var navItems = [];

var treeElementId;

function treeview_init(id) {
	treeElementId = id;
    var tree = $('#' + treeElementId).jqxTree({ checkboxes: true, hasThreeStates: true });

   	$('#' + treeElementId).on('checkChange', function (event) {
       var args = event.args;
       var element = args.element;
       var checked = args.checked;
       var updatedNode = $('#' + treeElementId).jqxTree('getItem', element);
       var id = updatedNode.id;

       $.each(navItems, function(key, value) {
       		if (value.id == updatedNode.id) {
       			if ((checked == true) && (updatedNode.selected == false)) {
       				updatedNode.selected = true;
       				fireSelectionEvent(value, true);
       			}
       			else if ((checked == false) && (updatedNode.selected == true)) {
       				updatedNode.selected = false;
       				fireSelectionEvent(value, false);
       			}
       		}
       });
   	});
}

function treeview_addNode(parentNode, id, name, data, selected, callback) {
	var navObj      = new Object();
	navObj.id       = id;
	navObj.name     = name;
	navObj.data     = data;
    navObj.selected = selected;
    navObj.callback = callback;
    navItems.push(navObj);

	$('#' + treeElementId).jqxTree('addTo', {id: id, label: name}, parentNode);
	var element = $("#" + id)[0];
	var newNode = $('#' + treeElementId).jqxTree('getItem', element);
	return newNode;
}

function treeview_expandAll() {
	$('#' + treeElementId).jqxTree('expandAll');
}

function fireSelectionEvent(item, selected) {
	if (item.callback != null) {
		item.callback(item.id, item.data, selected)
	}
}
