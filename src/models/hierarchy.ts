/// <reference lib="es2017.object" />
import { io, Socket } from "socket.io-client";

type Primitive = null | number | boolean | string;
type JsonValue = Primitive | JsonArray | JsonObject;
type JsonArray = JsonValue[];
type JsonObject = {
	[key: string]: JsonValue;
};

interface EntityInterface {
	id: string;
	parentId: string;
	value: number;
}

interface HierarchyInterface {
    rootId: string;
    entities: {
        [key: string]: EntityInterface;
    };

    reqAddEntity(socket, id: string, value: number): void;
    reqDeleteEntity(socket, id: string): void;
    reqReparent(socket, id: string, newParentId: string): void;

    ackAddEntity(entity: EntityInterface): void;
    ackDeleteEntity(id: string): void;
    ackReparent(id: string, newParentId: string): void;
}

class Entity implements EntityInterface {
    id: string;
    parentId: string;
    value: number;

    constructor(id: string, value: number) {
        this.id = id;
        this.value = value;
    }
}

class Hierarchy implements HierarchyInterface {
    rootId: string;
    entities: {
        [key: string]: EntityInterface;
    };

    constructor(rootId: string) {
        this.rootId = rootId;
        this.entities = {};

        const root = new Entity(rootId, undefined);
        root.parentId = rootId;
        this.entities[rootId] = root;
    }

    reqAddEntity(socket: any, id: string, value: number): void {
        if (this.entities[id] !== undefined) {
            return;
        }

        socket.emit("createEntity", [{id: id, value: value}], (res) => {
            console.log(res.status);
        });
    }

    reqDeleteEntity(socket: any, id: string): void {
        if (this.entities[id] === undefined) {
            return;
        }

        socket.emit("deleteEntity", id);
    }

    reqReparent(socket: any, id: string, newParentId: string): void {
        if (
            this.entities[id] === undefined ||
            this.entities[newParentId] === undefined ||
            id === this.rootId ||
            id === newParentId
        ) {
            return;
        }

        socket.emit("reparentEntity", { id: id, newParentId: newParentId });
    }

    ackAddEntity(entity: EntityInterface): void {
        if (this.entities[entity.id] !== undefined) {
            throw new Error(`Entity: ${entity.id} should not exist, but does.`);
        }

        const e = new Entity(entity.id, entity.value);
        e.parentId = this.rootId;
        this.entities[entity.id] = e;
    }

    ackDeleteEntity(id: string): void {
        if (this.entities[id] === undefined) {
            throw new Error(`Entity: ${id} should exist, but doesn't.`);
        }

        delete this.entities[id];
    }

    ackReparent(id: string, newParentId: string): void {
        if (
            this.entities[id] === undefined ||
            this.entities[newParentId] === undefined
        ) {
            throw new Error(`Entities: ${id} & ${newParentId} should exist, but dont.`);
        }

        this.entities[id].parentId = newParentId;
    }

    getData(id?: string): string {
        const res = [];
        if (id) {
            res.push({...this.entities[id]});
        } else {
            for (const [key, value] of Object.entries(this.entities)) {
                res.push({...value});
            }
        }

        return JSON.stringify(res);
    }
}

export {
    EntityInterface,
    Entity,
    HierarchyInterface,
    Hierarchy
}