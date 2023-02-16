"use strict";
/// <reference lib="es2017.object" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Hierarchy = exports.Entity = void 0;
var tree_js_1 = require("../data-structures/tree.js");
var Entity = /** @class */ (function () {
    function Entity(id, relationship, properties) {
        this.id = id;
        this.relationship = relationship;
        this.properties = properties;
    }
    return Entity;
}());
exports.Entity = Entity;
var Hierarchy = /** @class */ (function () {
    function Hierarchy(rootId) {
        // Initialize document w/ a mapping of document objects
        this.rootId = rootId;
        this.entities = {};
        this.entities[rootId] = new Entity(rootId, {
            parentId: rootId,
            fractionalIndex: 0.0
        }, {});
        this.initializeTree();
    }
    Hierarchy.prototype.initializeTree = function () {
        this.tree = new tree_js_1.Tree(this.rootId);
    };
    /**
     * Object creation & destruction
     */
    Hierarchy.prototype.addEntity = function (entity) {
        if (this.tree.createNode(entity.id) &&
            this.tree.reparent(entity.id, entity.relationship.parentId)) {
            this.entities[entity.id] = new Entity(entity.id, entity.relationship, entity.properties);
            return true;
        }
        return false;
    };
    Hierarchy.prototype.deleteEntity = function (id) {
        var _this = this;
        var nodes = this.tree.deleteNode(id);
        if (nodes.length) {
            nodes.forEach(function (id) {
                delete _this.entities[id];
            });
            return true;
        }
        return false;
    };
    Hierarchy.prototype.reparent = function (id, newParentId) {
        // Perform reparenting in tree representation
        if (this.tree.reparent(id, newParentId)) {
            // TODO: Implement logic for fractional index
            this.entities[id].relationship = {
                parentId: newParentId,
                fractionalIndex: 0.0
            };
            return true;
        }
        return false;
    };
    Hierarchy.prototype.getData = function (id) {
        var res = [];
        if (id) {
            res.push(__assign({}, this.entities[id]));
        }
        else {
            for (var _i = 0, _a = Object.entries(this.entities); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                res.push(__assign({}, value));
            }
        }
        return res;
    };
    return Hierarchy;
}());
exports.Hierarchy = Hierarchy;
