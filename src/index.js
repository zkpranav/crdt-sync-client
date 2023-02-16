"use strict";
exports.__esModule = true;
var socket_io_client_1 = require("socket.io-client");
var hierarchy_1 = require("./models/hierarchy");
/**
 * Types
 */
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
    var entityData = JSON.parse(data)[0];
    var res = hierarchy.addEntity(new hierarchy_1.Entity(entityData.id, {
        parentId: entityData.relationship.parentId,
        fractionalIndex: entityData.relationship.fractionalIndex
    }, entityData.properties));
    if (!res) {
        throw new Error("Failed to add server entity");
    }
});
socket.on("deleteEntity", function (ids) {
    hierarchy.deleteEntity(ids);
    console.log(hierarchy.getData());
});
socket.on("reparent", function (reparentData) {
});
function initializeHierarchy(entities) {
    hierarchy = new hierarchy_1.Hierarchy(entities[0].id);
    for (var i = 1; i < entities.length; i++) {
        hierarchy.addEntity(entities[i]);
    }
    handleUserCreateEntity();
    handleUserDeleteEntity("".concat(socket.id, "#").concat(entityCounter - 1));
}
/**
 * User event handlers
 */
function handleUserCreateEntity() {
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
            console.log("Create entity status: " + res.status);
            if (res.status !== "Ok") {
                // Rollback
            }
        });
    }
}
function handleUserDeleteEntity(temp) {
    var id = temp;
    socket.emit("deleteEntity", id);
}
function handleUserReparentEntity() {
}
