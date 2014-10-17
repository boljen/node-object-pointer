# object-pointer (NodeJS)

[![Build Status](https://travis-ci.org/boljen/object-pointer.svg)](https://travis-ci.org/boljen/object-pointer)

A class which points to a certain position inside an object and allows you to
modify everything relative to that position.

## Installation

First get the package from the npm registry

    npm install object-pointer

Then get the class in your application

    var Pointer = require('object-pointer');

## Example

Create an object and create a Pointer instance first:

    var obj = {};
    var p = new Pointer(obj, ['nested', 'object']);

You'll see your object is still unmodified

    obj.should.eql({});

Now lets set a new key-value:

    p.set('key', 'value');

Now your object has been modified

    obj.should.eql({
      nested: {
        object: {
          key: 'value'
        }
      }
    });

    // In other words:

    obj.nested.object.key === 'value';


## location-argument

A lot of times there's a location argument. A location can be nothing, a string or an
array and they point to a certain location inside an object.

Lets go over all the valid location arguments inside our "*rootObject*":

    // resolves to rootObject
    location = undefined;
    location = null;
    location = [];

    // resolves to rootObject.nested
    location = 'nested';

    // resolves to rootObject.nested.object
    location = ['nested', 'object'];

## Api

### new Pointer(root, rootLocation)
    /**
     * This points to a certain position inside an object and allows you to read and
     * modify everything nested inside that position.
     *
     * @param {Object|Pointer} root - The root object of the Pointer
     * @param {null|string|array} location - The location inside the root object
     */
    var Pointer = function Pointer(root, location)
Please refer to ***Pointer.setRoot*** as the constructor merely bridges that
function.

    var p = new Pointer(rootObject, location);

### Pointer.setRoot(root, location)

    /**
     * This points to a certain position inside an object and allows you to read and
     * modify everything nested inside that position.
     *
     * @param {Object|Pointer} root - The root object of the Pointer
     * @param {null|string|array} location - The location inside the root object
     */
    Pointer.prototype.setRoot = function(root, rootLocation)

### Pointer.setLocation(location)

    /**
     * Sets the location inside the master object to which this pointer points.
     * @param {null|string|array} location - The location inside the root object
     */
    Pointer.prototype.setLocation = function(location)

### Pointer.getLocationObject(force)

    /**
     * This returns the root of the Pointer instance.
     * @param {boolean} force -  If root object doesn't exist, create it.
     */
    Pointer.prototype.getLocationObject = function(force)

### Pointer.create(location)

***IMPORTANT:*** *The location is relative to the Pointer's root location, not the
 root object!*

    /**
     * This creates the nested objects up until the given location, and returns the
     * deepest object.
     *
     * @param  {null|string|array} location
     * @return {Object}
     */
    Pointer.prototype.create = function(location)

### Pointer.set(location, value)

***IMPORTANT:*** *The location is relative to the Pointer's root location, not the
 root object!*

    /**
     * Will set a value to the pointed object.
     *
     * @param {null|string|array} location - The location of the key, the final
     * element is the actual key.
     * @param {[type]} value
     */
    Pointer.prototype.set = function(location, value)

### Pointer.get(location, defaultValue)

***IMPORTANT:*** *The location is relative to the Pointer's root location, not the
 root object!*

    /**
     * Will return a value from the pointed object
     *
     * @param  {null|string|array} location
     * @param  {mixed} defaultValue - The default value to return if value not
     * found.
     * @return {mixed}
     */
    Pointer.prototype.get = function(location, defaultValue)


### Pointer.clear(location)

***IMPORTANT:*** *The location is relative to the Pointer's root location, not the
 root object!*

    /**
    * Deletes the value at the given location.
    *
    * @param  {string|array} location
    */
    Pointer.prototype.clear= function(location)

## Test

    grunt test

## License

MIT.
