"use strict";
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
    function Entity(id, value) {
        this.id = id;
        this.value = value;
    }
    return Entity;
}());
exports.Entity = Entity;
var Hierarchy = /** @class */ (function () {
    function Hierarchy(rootId) {
        this.rootId = rootId;
        this.entities = {};
        var root = new Entity(rootId, undefined);
        root.parentId = rootId;
        this.entities[rootId] = root;
    }
    Hierarchy.prototype.reqAddEntity = function (socket, id, value) {
        if (this.entities[id] !== undefined) {
            return;
        }
        var data = JSON.stringify([{ id: id, value: value }]);
        socket.emit("createEntity", data, function (res) {
            console.log(res.status);
        });
    };
    Hierarchy.prototype.reqDeleteEntity = function (socket, id) {
        if (this.entities[id] === undefined) {
            return;
        }
        socket.emit("deleteEntity", id);
    };
    Hierarchy.prototype.reqReparent = function (socket, id, newParentId) {
        if (this.entities[id] === undefined ||
            this.entities[newParentId] === undefined ||
            id === this.rootId ||
            id === newParentId) {
            return;
        }
        socket.emit("reparentEntity", { id: id, newParentId: newParentId });
    };
    Hierarchy.prototype.ackAddEntity = function (entity) {
        if (this.entities[entity.id] !== undefined) {
            throw new Error("Entity: ".concat(entity.id, " should not exist, but does."));
        }
        var e = new Entity(entity.id, entity.value);
        e.parentId = this.rootId;
        this.entities[entity.id] = e;
    };
    Hierarchy.prototype.ackDeleteEntity = function (id) {
        if (this.entities[id] === undefined) {
            throw new Error("Entity: ".concat(id, " should exist, but doesn't."));
        }
        delete this.entities[id];
    };
    Hierarchy.prototype.ackReparent = function (id, newParentId) {
        if (this.entities[id] === undefined ||
            this.entities[newParentId] === undefined) {
            throw new Error("Entities: ".concat(id, " & ").concat(newParentId, " should exist, but dont."));
        }
        this.entities[id].parentId = newParentId;
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
