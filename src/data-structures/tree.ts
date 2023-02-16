interface TreeNodeInterface {
    id: string,
    parentId: string,
    children: string[],
    addChild(id: string): boolean,
    removeChild(id: string): boolean
}

class TreeNode implements TreeNodeInterface{
    id: string;
    parentId: string;
    children: string[] = [];

    constructor(id, parentId) {
        this.id = id;
        this.parentId = parentId;
    }

    /**
     * Methods to add & remove an immediate child
     */
    addChild(id: string): boolean {
        if (this.children.indexOf(id) != -1) {
            return;
        }

        this.children.push(id);
        return true;
    }

    removeChild(id: string): boolean {
        const index = this.children.indexOf(id);
        if (index != -1) {
            this.children = this.children.splice(index, 1);
            return true;
        }

        return false;
    }
}

interface TreeInterface {
    rootId: string,
    tree: {
        [key: string]: TreeNodeInterface
    },
    createNode(id: string): boolean,
    deleteNode(id: string): string[],
    recDeleteNode(id: string, nodes: string[]): boolean,
    reparent(id: string, newParentId: string): boolean,
    depthFirstSearch(rootId: string, searchId: string)
}

class Tree implements TreeInterface {
    rootId: string;
    tree: {
        [key: string]: TreeNodeInterface
    };

    constructor(rootId: string) {
        this.rootId = rootId;
        this.tree = {};
        this.tree[rootId] = new TreeNode(rootId, rootId);
    }

    // Defaults to root as the parent
    createNode(id: string): boolean {
        if (id in this.tree) {
            return false;
        }

        this.tree[id] = new TreeNode(id, this.rootId);
        this.tree[this.rootId].addChild(id);
        return true;
    }

    deleteNode(id: string): string[] {
        const nodes = [];
        this.recDeleteNode(id, nodes);
        return nodes;
    }

    recDeleteNode(id: string, nodes: string[]): boolean {
        if (id in this.tree) {
            const node = this.tree[id];

            // Remove as child from parent
            this.tree[node.parentId].removeChild(id);

            // Recursively delete children
            if (node.children.length > 0) {
                for (let i = 0; i < node.children.length; i++) {
                    this.recDeleteNode(node.children[i], nodes);
                }
            }
            
            // Delete node
            nodes.push(id);
            delete this.tree[id];
            return true;
        }

        return false;
    }

    /**
     * Checks if a direct or an indirect cycle is created and rejects operation
     */
    reparent(id: string, newParentId: string): boolean {
        if (!(newParentId in this.tree) || !(id in this.tree)) {
            return false;
        }

        if (id === this.rootId) {
            return false;
        }

        if (id === newParentId) {
            return false;
        }

        // Perform DFS to check for cycles
        if (this.depthFirstSearch(id, newParentId)) {
            return false;
        }

        const node = this.tree[id];
        this.tree[node.parentId].removeChild(id);
        this.tree[newParentId].addChild(id);
        node.parentId = newParentId;
        return true;
    }

    /**
     * Utilities
     */
    depthFirstSearch(rootId: string, searchId: string): boolean {
        if (rootId == searchId) {
            return true;
        }

        const node = this.tree[rootId];
        if (node.children.length > 0) {
            for (let i = 0; i < node.children.length; i++) {
                if (this.depthFirstSearch(node.children[i], searchId)) {
                    return true;
                }
            }
        }

        return false;
    }
}

export {
    TreeInterface,
    Tree
}