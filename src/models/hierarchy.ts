/// <reference lib="es2017.object" />

type Primitive = null | number | boolean | string;
type JsonValue = Primitive | JsonArray | JsonObject;
type JsonArray = JsonValue[];
type JsonObject = {
    [key: string]: JsonValue
};

type Relationship = {
    parentId: string,
    fractionalIndex: number
};

interface EntityInterface {
    id: string,
    relationship: Relationship,
    properties: JsonObject
}

class Entity implements EntityInterface {
    /**
     * id - object id which is a derivative of the client id that created it
     * relationship - atomic object w/ parent & fractional index properties
     * properties - property value pairs.
     */
    id: string;
    relationship: Relationship;
    properties: JsonObject;


    constructor(id: string, relationship: Relationship, properties: JsonObject) {
        this.id = id;
        this.relationship = relationship;
        this.properties = properties;
    }

    /**
     * TODO -
     * Sync object state over the network
     * Optimize & send only the delta state
     * Serialize data w/ protobuf & deserialize on the other end
     */
}

/**
 * Server data model is governed entirely by its tree representation
 */
interface HierarchyInterface {
    rootId: string,
    entities: {
        [key: string]: Entity
    },
    addEntity(entity: Entity): boolean,
    deleteEntity(ids: string[]): void,
    weakReparent(id: string, newParentId: string): boolean,
    strongReparent(id: string, newParentId: string): void,
    getData(id?: string): string
}

class Hierarchy implements HierarchyInterface {
    /**
     * objects - array of all objects within the document fractionally indexed
     * documentGraph - 2D array representation of the hierarchical structure of the document
     */
    rootId: string;
    entities: {
        [key: string]: Entity
    };

    constructor(rootId: string) {
        // Initialize document w/ a mapping of document objects
        this.rootId = rootId;
        this.entities = {};
        this.entities[rootId] = new Entity(
            rootId,
            {
                parentId: rootId,
                fractionalIndex: 0.0
            },
            {}
        );
    }

    /**
     * Object creation & destruction
     */
    addEntity(entity: Entity): boolean {
        if (entity.id in this.entities) {
            return false;
        }

        if (entity.id === entity.relationship.parentId || entity.id === entity.relationship.parentId) {
            return false;
        }

        this.entities[entity.id] = new Entity(entity.id, entity.relationship, entity.properties);
        return true;
    }

    // Entirely server authoritative
    deleteEntity(ids: string[]): void {
        for (const id of ids) {
            delete this.entities[id];
        }
    }

    // Detach from hierarchy
    weakReparent(id: string, newParentId: string): boolean {
        if (!(id in this.entities) || !(newParentId in this.entities)) {
            return false;
        }

        if (id === this.rootId || id === newParentId) {
            return false;
        }

        this.entities[id].relationship = {
            parentId: newParentId,
            fractionalIndex: 0.0
        };
        return true;
    }

    // Entirely server authoritative
    strongReparent(id: string, newParentId: string): void {
        if (!(id in this.entities) || !(newParentId in this.entities)) {
            throw new Error("ID on server not on client. Entities out of sync.");
        }

        this.entities[id].relationship = {
            parentId: newParentId,
            fractionalIndex: 0.0
        };
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