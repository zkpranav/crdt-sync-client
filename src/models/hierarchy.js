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
    }
    /**
     * Object creation & destruction
     */
    Hierarchy.prototype.addEntity = function (entity) {
        if (entity.id in this.entities) {
            return false;
        }
        if (entity.id === entity.relationship.parentId || entity.id === entity.relationship.parentId) {
            return false;
        }
        this.entities[entity.id] = new Entity(entity.id, entity.relationship, entity.properties);
        return true;
    };
    // Entirely server authoritative
    Hierarchy.prototype.deleteEntity = function (ids) {
        for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
            var id = ids_1[_i];
            delete this.entities[id];
        }
    };
    // Detach from hierarchy
    Hierarchy.prototype.weakReparent = function (id, newParentId) {
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
    };
    // Entirely server authoritative
    Hierarchy.prototype.strongReparent = function (id, newParentId) {
        if (!(id in this.entities) || !(newParentId in this.entities)) {
            throw new Error("ID on server not on client. Entities out of sync.");
        }
        this.entities[id].relationship = {
            parentId: newParentId,
            fractionalIndex: 0.0
        };
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
        return JSON.stringify(res);
    };
    return Hierarchy;
}());
exports.Hierarchy = Hierarchy;
