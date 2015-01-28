"use strict";

var retrieveChild = require('retrieve-object-child')
  , inherits = require('util').inherits
  , EventEmitter = require('events').EventEmitter;

/**
 * This points to a certain position inside an object and allows you to read and
 * modify everything nested inside that position.
 *
 * @param {Object|Pointer} root - The root object of the Pointer
 * @param {null|string|array} location - The location inside the root object
 */
var Pointer = function Pointer(root, location) {
  this.setRoot(root, location);
};

inherits(Pointer, EventEmitter);

Pointer.prototype._parseLocation = function(key) {
  if (key instanceof Array) {
    var r = [];
    for (var i = 0; i < key.length; i++) {
      r[i] = key[i];
    }
    return r;
  } else if (typeof key === "string") {
    return [key];
  } else if (!key) {
    return [];
  } else {
    throw new  TypeError("Key pointer must be either a string or array");
  }
};

Pointer.prototype._refreshRoot = function() {
  this._pointerRoot = undefined;
  this._pointerRoot = this.getLocationObject();
};

Pointer.prototype._unhookPointer = function() {
  if (this._masterPointer) {
    this._root.removeListener('changed', this._pointerHook);
  }
};

Pointer.prototype._hookPointer = function(pointer) {
  this._pointerHook = function() {
    this._refreshRoot();
  }.bind(this);
  pointer.on('changed', this._pointerHook);
};

/**
 * This sets the root location of the Pointer
 *
 * @param {Object|Pointer} root - The root object of the Pointer
 * @param {null|string|array} location - The location inside the root object
 */
Pointer.prototype.setRoot = function(obj, loc) {
  if (!(obj instanceof Object)) {
    throw new TypeError("Expecting an instance of object");
  }

  // unhook the previous pointer
  if (obj instanceof Pointer) {
    this._unhookPointer();
    this._hookPointer(obj);
    this._masterPointer = true;
  } else {
    this._masterPointer = false;
  }

  this._root = obj;
  this.setLocation(loc, true);
  this._refreshRoot();

  this.emit('changed');
};

/**
 * Returns the root object recursively
 */
Pointer.prototype.getRoot = function() {
  if (this._masterPointer) {
    return this._root.getRoot();
  } else {
    return this._root;
  }
};

/**
 * Sets the location inside the master object to which this pointer points.
 * @param {null|string|array} location - The location inside the root object
 */
Pointer.prototype.setLocation = function(loc, suppress) {
  if (loc)
    this._loc = this._parseLocation(loc);
  else
    this._loc = [];

  this._refreshRoot();
  if (!suppress)
    this.emit('changed');
};

/**
 * This returns the root of the Pointer instance.
 * @param {boolean} force -  If root object doesn't exist, create it.
 */
Pointer.prototype.getLocationObject = function(force) {
  if (this._pointerRoot) {
    return this._pointerRoot;
  } else {
    if (this._masterPointer) {
      if (force) {
        // Must return the root object
        var obj = this._root.getLocationObject(true);
        var c = retrieveChild(obj, this._loc, force);

        if (c instanceof Object) {
          this._pointerRoot = c;
          return c;
        } else {
          return undefined;
        }
      } else {
        // Must return the root object or undefined
        var obj = this._root.getLocationObject();
        if (obj === undefined)
          return obj;

        var c = retrieveChild(obj, this._loc, force);
        if (c === undefined)
          return c;

        if (c instanceof Object) {
          this._pointerRoot = c;
          return c;
        } else {
          return undefined;
        }
      }
    } else {
      var c = retrieveChild(this._root, this._loc, force);
      if (c instanceof Object) {
        this._pointerRoot = c;
        return c;
      } else {
        return undefined;
      }
    }
  }
};

/**
 * This creates the nested objects up until the given location, and returns the
 * object.
 *
 * @param  {null|string|array} location
 * @return {Object}
 */
Pointer.prototype.create = function(location) {
  location = this._parseLocation(location);
  return retrieveChild(this.getLocationObject(true), location, true);
};

/**
 * Will set a value to the pointed object.
 *
 * @param {null|string|array} location - The location of the key, the final
 * element is the actual key.
 * @param {[type]} value
 */
Pointer.prototype.set = function(location, value) {
    location = this._parseLocation(location);
    if (location.length > 1) {
      var k = location.pop();
      var el = this.create(location);
      el[k] = value;
    } else if (location.length === 1) {
      this.getLocationObject(true)[location[0]] = value;
    } else {
      throw new Error('Cannot set the root property');
    }
};

/**
 * Will return a value from the pointed object
 *
 * @param  {null|string|array} location
 * @param  {mixed} defaultValue - The default value to return if value not
 * found.
 * @return {mixed}
 */
Pointer.prototype.get = function(location, defaultValue) {

  location = this._parseLocation(location);
  var obj = this.getLocationObject();

  if (obj === undefined)
    return defaultValue;

  if (location.length > 0) {
    var k = location.pop();
    if (location.length > 0) {
      obj = retrieveChild(obj, location);
      if (obj === undefined)
        return defaultValue;
    }
    if (obj[k] === undefined) {
      return defaultValue;
    } else {
      return obj[k];
    }
  } else {
    return obj;
  }

};

/**
 * Deletes the value at the given location.
 *
 * @param  {string|array} location
 */
Pointer.prototype.clear= function(location) {
  location = this._parseLocation(location);
  if (location.length === 0) {
    throw new Error("Clear must at least have one level of depth");
  } else {
    if (location.length === 1) {
      var k = location[0];
      var o = this.getLocationObject();
      if (o && o[k]) {
        delete o[k];
      }
    } else {

      var k = location.pop();
      var o = this.get(location);
      if (o && o[k]) {
        delete o[k];
        for (var key in o) {
          return;
        }
        this.clear(location);
      }
    }
  }
};

module.exports = Pointer;
