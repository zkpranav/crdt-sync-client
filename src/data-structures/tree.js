"use strict";
exports.__esModule = true;
exports.Tree = void 0;
var TreeNode = /** @class */ (function () {
    function TreeNode(id, parentId) {
        this.children = [];
        this.id = id;
        this.parentId = parentId;
    }
    /**
     * Methods to add & remove an immediate child
     */
    TreeNode.prototype.addChild = function (id) {
        if (this.children.indexOf(id) != -1) {
            return;
        }
        this.children.push(id);
        return true;
    };
    TreeNode.prototype.removeChild = function (id) {
        var index = this.children.indexOf(id);
        if (index != -1) {
            this.children = this.children.splice(index, 1);
            return true;
        }
        return false;
    };
    return TreeNode;
}());
var Tree = /** @class */ (function () {
    function Tree(rootId) {
        this.rootId = rootId;
        this.tree = {};
        this.tree[rootId] = new TreeNode(rootId, rootId);
    }
    // Defaults to root as the parent
    Tree.prototype.createNode = function (id) {
        if (id in this.tree) {
            return false;
        }
        this.tree[id] = new TreeNode(id, this.rootId);
        this.tree[this.rootId].addChild(id);
        return true;
    };
    Tree.prototype.deleteNode = function (id) {
        var nodes = [];
        this.recDeleteNode(id, nodes);
        return nodes;
    };
    Tree.prototype.recDeleteNode = function (id, nodes) {
        if (id in this.tree) {
            var node = this.tree[id];
            // Remove as child from parent
            this.tree[node.parentId].removeChild(id);
            // Recursively delete children
            if (node.children.length > 0) {
                for (var i = 0; i < node.children.length; i++) {
                    this.recDeleteNode(node.children[i], nodes);
                }
            }
            // Delete node
            nodes.push(id);
            delete this.tree[id];
            return true;
        }
        return false;
    };
    /**
     * Checks if a direct or an indirect cycle is created and rejects operation
     */
    Tree.prototype.reparent = function (id, newParentId) {
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
        var node = this.tree[id];
        this.tree[node.parentId].removeChild(id);
        this.tree[newParentId].addChild(id);
        node.parentId = newParentId;
        return true;
    };
    /**
     * Utilities
     */
    Tree.prototype.depthFirstSearch = function (rootId, searchId) {
        if (rootId == searchId) {
            return true;
        }
        var node = this.tree[rootId];
        if (node.children.length > 0) {
            for (var i = 0; i < node.children.length; i++) {
                if (this.depthFirstSearch(node.children[i], searchId)) {
                    return true;
                }
            }
        }
        return false;
    };
    return Tree;
}());
exports.Tree = Tree;
