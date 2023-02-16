# CRDT Multiplayer
Implementation of a CRDT based networking layer for a collaboration tool.
References -
1. https://www.figma.com/blog/how-figmas-multiplayer-technology-works/
2. https://github.com/pfrazee/crdt_notes/tree/68c5fe81ade109446a9f4c24e03290ec5493031f#portfolio-of-basic-crdts
3. https://en.wikipedia.org/wiki/Operational_transformation

Background context -
The framework is heavily inspired by Figma's implementation of their networking layer.
Although the framework can be used as a generic solution for any collaboration tool, the nomenclature used is similar to that of Figma.

A Document consists of a set of objects structured in a hierarchical tree-like structure.
Each Object has an associated ID which is globally unique, and a set of property-value pairs.
Each value is assumed to be atomic, and independent of its own previous state, and the state of any other object.
A solution is proposed for objects with non-atomic values, which have a corresponding isAtomic flag set.
Parent-Child relationships are maintained as a link from the child to its parent.

CRDTs used -

The multiplayer system -
