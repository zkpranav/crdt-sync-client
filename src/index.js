"use strict";
exports.__esModule = true;
var socket_io_client_1 = require("socket.io-client");
var hierarchy_1 = require("./models/hierarchy");
/**
 * Globals
 */
var entityCounter = 0;
var hierarchy;
// Establish connection
var socket = (0, socket_io_client_1.io)("ws://localhost:3000");
/**
 * Socket.io event handlers
 */
socket.on("connect", function () {
    // Flush internal buffer
    socket.sendBuffer = [];
});
socket.on("init", function (data) {
    initializeHierarchy(JSON.parse(data));
});
socket.on("createEntity", function (data) {
    // console.log("on createEntity: ");
    // console.log(`data: ${data}`);
    var entity = JSON.parse(data);
    hierarchy.ackAddEntity(entity[0]);
    console.log(hierarchy.getData());
    console.log("---------- ***** ----------");
});
socket.on("deleteEntity", function (ids) {
    console.log("on deleteEntity: ");
    console.log("data: ".concat(ids));
});
socket.on("reparentEntity", function (reparentData) {
    console.log("on reparentEntity");
    console.log("data: ".concat(reparentData));
});
function initializeHierarchy(entities) {
    hierarchy = new hierarchy_1.Hierarchy(entities[0].id);
    for (var i = 1; i < entities.length; i++) {
        hierarchy.ackAddEntity(entities[i]);
    }
    console.log(hierarchy.getData());
    console.log("---------- ***** ----------");
    handleUserCreateEntity();
}
/**
 * User event handlers
 */
function handleUserCreateEntity() {
    var value = 0;
    var id = "".concat(socket.id, "#").concat(entityCounter);
    entityCounter += 1;
    hierarchy.reqAddEntity(socket, id, value);
}
function handleUserDeleteEntity() {
}
function handleUserReparentEntity() {
}
