import { io } from "socket.io-client";
import { Hierarchy, HierarchyInterface, EntityInterface, Entity } from "./models/hierarchy";

/**
 * Types
 */

/**
 * Globals
 */
let entityCounter = 0;
let hierarchy: HierarchyInterface;

// Establish connection
const socket = io("ws://localhost:3000");

/**
 * Socket.io event handlers
 */
socket.on("connect", () => {
    // Flush internal buffer
    socket.sendBuffer = [];
});

socket.on("init", (data) => {
    initializeHierarchy(JSON.parse(data));
});

socket.on("createEntity", (data) => {
    const entityData = JSON.parse(data)[0];

    const res = hierarchy.addEntity(new Entity(
        entityData.id, {
            parentId: entityData.relationship.parentId, 
            fractionalIndex: entityData.relationship.fractionalIndex
        }, 
        entityData.properties
    ));
    if (!res) {
        throw new Error("Failed to add server entity");
    }
});

socket.on("deleteEntity", (ids: string[]) => {
    hierarchy.deleteEntity(ids);

    console.log(hierarchy.getData());
});

socket.on("reparent", (reparentData: {
    id: string,
    newParentId: string
}) => {

});

function initializeHierarchy(entities: EntityInterface[]) {
    hierarchy = new Hierarchy(entities[0].id);
    
    for (let i = 1; i < entities.length; i++) {
        hierarchy.addEntity(entities[i]);
    }
}

/**
 * User event handlers
 */
function handleUserCreateEntity() {
    const id = `${socket.id}#${entityCounter}`;
    const entity: EntityInterface = {
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
        const entityData = hierarchy.getData(id);
        socket.emit("createEntity", entityData, (res) => {
            if (res.status !== "Ok") {
                // Rollback
            }
        });
    }
}

function handleUserDeleteEntity() {
    const id: string = "";
    socket.emit("deleteEntity", id);
}

function handleUserReparentEntity() {

}