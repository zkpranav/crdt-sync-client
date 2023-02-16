import { io } from "socket.io-client";
import { Hierarchy, HierarchyInterface, EntityInterface } from "./models/hierarchy";

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

function initializeHierarchy(entities: EntityInterface[]) {
    hierarchy = new Hierarchy(entities[0].id);
    
    for (let i = 1; i < entities.length; i++) {
        hierarchy.addEntity(entities[i]);
    }
}

/**
 * User event handlers
 */
function handleCreateEntity() {
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

function handleDeleteEntity() {
    const id: string = "";
    if (hierarchy.deleteEntity(id)) {
        // Notify server
        socket.emit("deleteEntity", id);
    }
}

function handleReparentEntity() {

}