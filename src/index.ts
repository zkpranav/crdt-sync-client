import { io } from "socket.io-client";
import { Hierarchy, EntityInterface, HierarchyInterface } from "./models/hierarchy";

/**
 * Globals
 */
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