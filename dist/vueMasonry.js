/*!
 * Vue.js plugin for Masonry layouts 
 *  https://github.com/shershen08/vue-masonry/ 
 *  file:vueMasonry.js
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VueMasonryPlugin = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _masonryLayout = require('masonry-layout');

var _masonryLayout2 = _interopRequireDefault(_masonryLayout);

var _imagesloaded = require('imagesloaded');

var _imagesloaded2 = _interopRequireDefault(_imagesloaded);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var attributesMap = {
  'column-width': 'columnWidth',
  'transition-duration': 'transitionDuration',
  'item-selector': 'itemSelector',
  'origin-left': 'originLeft',
  'origin-top': 'originTop',
  'fit-width': 'fitWidth',
  'stamp': 'stamp',
  'gutter': 'gutter'
};
var EVENT_ADD = 'vuemasonry.itemAdded';
var EVENT_REMOVE = 'vuemasonry.itemRemoved';
var EVENT_IMAGE_LOADED = 'vuemasonry.imageLoaded';

var stringToBool = function stringToBool(val) {
  return (val + '').toLowerCase() === 'true';
};

var collectOptions = function collectOptions(attrs) {
  var res = {};
  var attributesArray = Array.prototype.slice.call(attrs);
  attributesArray.forEach(function (attr) {
    if ((0, _keys2.default)(attributesMap).indexOf(attr.name) > -1) {
      res[attributesMap[attr.name]] = attr.name.indexOf('origin') > -1 ? stringToBool(attr.value) : attr.value;
    }
  });
  return res;
};

var Events = new _vue2.default({});

var VueMasonryPlugin = exports.VueMasonryPlugin = function VueMasonryPlugin() {};

VueMasonryPlugin.install = function (Vue, options) {

  Vue.redrawVueMasonry = function () {
    Events.$emit(EVENT_ADD);
  };

  Vue.directive('masonry', {
    props: ['transitionDuration', ' itemSelector'],

    inserted: function inserted(el, nodeObj) {
      if (!_masonryLayout2.default) {
        throw new Error('Masonry plugin is not defined. Please check it\'s connected and parsed correctly.');
      }
      var masonry = new _masonryLayout2.default(el, collectOptions(el.attributes));
      var masonryDraw = function masonryDraw() {
        masonry.reloadItems();
        masonry.layout();
      };
      Vue.nextTick(function () {
        masonryDraw();
      });

      Events.$on(EVENT_ADD, function (eventData) {
        masonryDraw();
      });
      Events.$on(EVENT_REMOVE, function (eventData) {
        masonryDraw();
      });
      Events.$on(EVENT_IMAGE_LOADED, function (eventData) {
        masonryDraw();
      });
    }
  });

  Vue.directive('masonryTile', {

    inserted: function inserted(el) {
      Events.$emit(EVENT_ADD, {
        'element': el
      });

      new _imagesloaded2.default(el, function () {
        Events.$emit(EVENT_IMAGE_LOADED, {
          'element': el
        });
      });
    },
    beforeDestroy: function beforeDestroy(el) {
      Events.$emit(EVENT_REMOVE, {
        'element': el
      });
    }
  });
};