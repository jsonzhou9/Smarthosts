'use strict'; 

//share main context
var gui = require('nw.gui'); 
global.gui = gui;
global.mainWindow = gui.Window.get();
global.jQuery = jQuery;
global.$ = jQuery;
global.EJS = EJS;
global.localStorage = localStorage;

//cache current active project 
global.activeProject = '';

//distinguish between different platforms
$('body').addClass(process.platform);

//Application initialization
require('./js/app.js').init();