var Pointer = require('./');

describe('.Pointer', function() {

  // Get new object for each test
  var o;
  beforeEach(function() {
    o = {};
  });

  describe('constructor()', function() {
    it('Should bridge setRoot',function(done) {
      var fx = Pointer.prototype.setRoot;
      Pointer.prototype.setRoot = function() {
        Pointer.prototype.setRoot = fx;
        done();
      };
      new Pointer();
    });
  });

  describe('setRoot()', function() {

    it('Should set new root object', function() {
      var p = new Pointer({});
      var newObj = {};
      p.setRoot(newObj);
      p._root.should.equal(newObj);
      p._loc.should.eql([]);
      p._pointerRoot.should.eql({});
    });

    it('Should set new root object with location', function() {
      var newObj = {};
      var p = new Pointer(newObj, ['test']);
      p._root.should.equal(newObj);
      p._loc.should.eql(['test']);
      (p._pointerRoot === undefined).should.be.true;

      var o2 = {test: {}};
      p.setRoot(o2, ['test']);
      p._root.should.equal(o2);
      p._loc.should.eql(['test']);
      p._pointerRoot.should.equal(o2.test);
    });

    it.skip('Should hook to root pointer changes', function() {

    });

    it.skip('Should unhook previous root pointer', function() {

    });

  });

  describe('getRoot()', function() {
    it('Should get the root', function() {
      var newObj = {};
      var p1 = new Pointer(newObj);
      var p2 = new Pointer(p1);
      p2.getRoot().should.eql(newObj);
    });
  });

  describe('setLocation()', function() {

  });

  describe('getLocationObject()', function() {

  });

  describe('create()', function() {

    var o, p;
    beforeEach(function() {
      o = {};
      p = new Pointer(o, ['test']);
    });

    it('Should return a new object', function() {
      var r = p.create(['location']);
      r.should.eql({});
      o.should.eql({test:{location:{}}});
    });

  });

  describe('set()', function() {

    var o, p;
    beforeEach(function() {
      o = {};
      p = new Pointer(o, ['test']);
    });

    it('Should set a value', function() {
      p.set('test', 'testValue');
      o.should.eql({
        test: {
          test:'testValue'
        }
      });
    });

    it('Should set a nested value', function() {
      p.set(['test', 'nested'], 'testValue');
      o.should.eql({
        test: {
          test: {
            nested: 'testValue'
          }
        }
      });
    });

  });

  describe('get()', function() {
    var o, p;
    beforeEach(function() {
      o = {};
      p = new Pointer(o, ['test']);
    });

    it('Should return undefined', function() {
      (p.get('test') === undefined).should.be.true;
    });

    it('Should return default value', function() {
      p.get('test', 'default').should.equal('default');
    });

    it('Should return the value', function() {
      p.set('t', 'test');
      p.set(['test', 't'], 'test');
      p.get('t').should.equal('test');
      p.get(['test', 't']).should.equal('test');
    });
  });

  describe('clear()', function() {

    var o, p;
    beforeEach(function() {
      o = {dummy:{
        data: {
          key: true
        }
      }};
      p = new Pointer(o);
    });

    it('Should delete the location', function() {
      p.clear('dummy');
      o.should.eql({});
    });

    it('Should delete thenested location', function() {
      p.clear(['dummy', 'data']);
      o.should.eql({
        dummy: {}
      });
    });

  });

  describe('Pointer Root', function() {

    var obj = {};
    var op = new Pointer(obj);
    var np = new Pointer(op, 'test');

    it('Should have the pointer set as root', function() {
      np._root.should.equal(op);
      np._loc.should.eql(['test']);
      np._masterPointer.should.be.true;
      (np._pointerRoot === undefined).should.be.true;
    });

    it('Should return undefined when retrieving pointer root', function() {
      (np.getLocationObject() === undefined).should.be.true;
    });

    it('Should return the actual object when retrieving pointer root', function() {
      np.getLocationObject(true).should.eql({});
    });

    it('Should hook to pointer modifications', function() {
      var o = {};
      op.setRoot(o);
      np.set('test', 'test');
      o.should.eql({
        test: {
          test: 'test'
        }
      })
    });

    it('Should unhook to pointer modifications', function() {
      op.setRoot({});
      np.setRoot({});
      np.set('test', 'non test');

      // from previous test
      op._root.should.eql({});
      np._root.should.eql({
        test: 'non test'
      })
    });

  });

});
