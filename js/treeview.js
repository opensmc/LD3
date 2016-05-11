
function Treeview(id)
{
  this.treeElementId = id;
  this.app = null;

  this.translations = {};
  this.language = 'English';
  this.navItems = [];

  this.tree = $('#' + this.treeElementId).jqxTree({ checkboxes: true, hasThreeStates: true });

  checkChange = this.checkChangeFactory(this)
  $('#' + this.treeElementId).on('checkChange', checkChange);
}

// Callback used by the app to tell the Treeview about the app
// itself.
Treeview.prototype.connectApp = function(app)
{
  this.app = app;
}

// Callback used by the app to tell the Treeview the
// translations to use. This will be a map based on
// language, then key: {language: {key:text}}, so expect
// something like translations['English']['site_name'] === 'Site Name'
// and translations['中文']['site_name'] === '网站名称'.
Treeview.prototype.connectTranslations = function(translations)
{
  this.translations = translations;
}

// Callback used by the app to tell the Treeview the user's
// language has changed. Expect this to be called at/near
// initialization time, and perhaps subsequently during
// translation-testing.
Treeview.prototype.languageChange = function(language)
{
  this.language = language;
  // TODO: use translations and language to translate text...
}

Treeview.prototype.checkChangeFactory = function(self)
{
  // Note use of 'self' in closure to capture the Treeview's 'this'.
  return (function(event) {
    var args = event.args;
    var element = args.element;
    var checked = args.checked;
    var updatedNode = $('#' + self.treeElementId).jqxTree('getItem', element);
    var id = updatedNode.id;
  
    $.each(self.navItems, function(key, value) {
      if (value.id === updatedNode.id) {
        if ((checked == true) && (updatedNode.selected == false)) {
          updatedNode.selected = true;
          if (self.app != null) {
            self.app.addLayer(value);
          }
        }
        else if ((checked == false) && (updatedNode.selected == true)) {
          updatedNode.selected = false;
          if (self.app != null) {
            self.app.removeLayer(value);
          }
        }
      }
    });
  });
}

// Function used by the app to tell the treeview about another
// record in the layers.csv file.
//
// was: function(parentNode, id, name, data, selected, callback)
Treeview.prototype.addNode = function(record)
{
  var itemData = new Object();
  itemData.id   = record.id;
  itemData.name = record.name;
  itemData.url  = record.url; // was 'http://datasource.xyz/' + id;
  itemData.layerId = record.name;
  itemData.description = 'an item called "' + record.name + '" with the id "' + record.id + '"';

  var navObj      = new Object();
  navObj.id       = record.id;
  navObj.name     = record.name;
  navObj.data     = itemData;
  navObj.selected = false; // everything starts un-selected. (Perhaps pull from an initiallySelected:value column in the record, if present?
  this.navItems.push(navObj);

  var parentNode = null;
  $('#' + this.treeElementId).jqxTree('addTo', {id: record.id, label: record.name}, parentNode);
  var element = $("#" + record.id)[0];
  var newNode = $('#' + this.treeElementId).jqxTree('getItem', element);
  return newNode;
}

// Callback the app uses to signal all the nodes have been loaded.
Treeview.prototype.addComplete = function()
{
  this.expandAll();
}

Treeview.prototype.expandAll = function()
{
  $('#' + this.treeElementId).jqxTree('expandAll');
}


