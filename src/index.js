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
function initializeHierarchy(entities) {
    hierarchy = new hierarchy_1.Hierarchy(entities[0].id);
    for (var i = 1; i < entities.length; i++) {
        hierarchy.addEntity(entities[i]);
    }
}
/**
 * User event handlers
 */
function handleCreateEntity() {
    var id = "".concat(socket.id, "#").concat(entityCounter);
    var entity = {
        id: id,
        relationship: {
            parentId: hierarchy.rootId,
            fractionalIndex: 0.0
        },
        properties: {}
    };
    entityCounter += 1;
    if (hierarchy.addEntity(entity)) {
        // Notify the server
        var entityData = hierarchy.getData(id);
        socket.emit("createEntity", entityData, function (res) {
            if (res.status !== "Ok") {
                // Rollback
            }
        });
    }
}
function handleDeleteEntity() {
    var id = "";
    if (hierarchy.deleteEntity(id)) {
        // Notify server
        socket.emit("deleteEntity", id);
    }
}
function handleReparentEntity() {
}
