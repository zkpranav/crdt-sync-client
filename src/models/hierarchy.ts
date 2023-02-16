/// <reference lib="es2017.object" />

import { TreeInterface, Tree } from "../data-structures/tree.js";

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
    tree: TreeInterface,
    addEntity(entity: Entity): boolean,
    deleteEntity(id: string): boolean,
    reparent(id: string, newParentId: string): boolean,
    getData(id?: string): EntityInterface[]
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
    tree: TreeInterface;

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

        this.initializeTree();
    }

    initializeTree() {
        this.tree = new Tree(this.rootId);
    }

    /**
     * Object creation & destruction
     */
    addEntity(entity: Entity): boolean {
        if (
            this.tree.createNode(entity.id) &&
            this.tree.reparent(entity.id, entity.relationship.parentId)
        ) {
            this.entities[entity.id] = new Entity(entity.id, entity.relationship, entity.properties);
            return true;
        }

        return false;
    }

    deleteEntity(id: string): boolean {
        const nodes = this.tree.deleteNode(id);
        if (
            nodes.length
        ) {
            nodes.forEach((id) => {
                delete this.entities[id];
            })
            return true;
        }

        return false;
    }

    reparent(id: string, newParentId: string): boolean {
        // Perform reparenting in tree representation
        if (
            this.tree.reparent(id, newParentId)
        ) {
            // TODO: Implement logic for fractional index
            this.entities[id].relationship = {
                parentId: newParentId,
                fractionalIndex: 0.0
            }
            return true;
        }

        return false;
    }

    getData(id?: string): EntityInterface[] {
        const res = [];
        if (id) {
            res.push({...this.entities[id]});
        } else {
            for (const [key, value] of Object.entries(this.entities)) {
                res.push({...value});
            }
        }

        return res;
    }
}

export {
    EntityInterface,
    Entity,
    HierarchyInterface,
    Hierarchy
}