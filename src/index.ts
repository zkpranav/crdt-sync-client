import { io } from "socket.io-client";
import { Hierarchy, HierarchyInterface, EntityInterface, Entity } from "./models/hierarchy";

/**
 * Globals
 */
let entityCounter = 0;
let hierarchy: Hierarchy;

// Establish connection
const socket = io("ws://localhost:3000");

/**
 * Socket.io event handlers
 */
socket.on("connect", () => {
    // Flush internal buffer
    socket.sendBuffer = [];
});

socket.on("init", (data: string) => {
    initializeHierarchy(JSON.parse(data));
});

socket.on("createEntity", (data: string) => {
    // console.log("on createEntity: ");
    // console.log(`data: ${data}`);
    const entity = JSON.parse(data);
    hierarchy.ackAddEntity(entity[0]);
});

socket.on("deleteEntity", (ids: string[]) => {
    console.log("on deleteEntity: ");
    console.log(`data: ${ids}`);
});

socket.on("reparentEntity", (reparentData: {
    id: string,
    newParentId: string
}) => {
    console.log("on reparentEntity");
    console.log(`data: ${reparentData}`);
});

function initializeHierarchy(entities: EntityInterface[]) {
    hierarchy = new Hierarchy(entities[0].id);
    
    for (let i = 1; i < entities.length; i++) {
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
    const value = 0;
    const id = `${socket.id}#${entityCounter}`;
    entityCounter += 1;

    hierarchy.reqAddEntity(socket, id, value);
}

function handleUserDeleteEntity() {
    
}

function handleUserReparentEntity() {

}