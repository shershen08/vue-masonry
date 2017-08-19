import Vue from 'vue'
import Masonry from 'masonry-layout'
import ImageLoaded from 'imagesloaded'

const attributesMap = {
  'column-width': 'columnWidth',
  'transition-duration': 'transitionDuration',
  'item-selector': 'itemSelector',
  'origin-left': 'originLeft',
  'origin-top': 'originTop',
  'fit-width': 'fitWidth',
  'stamp': 'stamp',
  'gutter': 'gutter'
}
const EVENT_ADD = 'vuemasonry.itemAdded'
const EVENT_REMOVE = 'vuemasonry.itemRemoved'
const EVENT_IMAGE_LOADED = 'vuemasonry.imageLoaded'

const stringToBool = val => (val + '').toLowerCase() === 'true'

const collectOptions = attrs => {
  let res = {}
  let attributesArray = Array.prototype.slice.call(attrs)
  attributesArray.forEach(attr => {
    if (Object.keys(attributesMap).indexOf(attr.name) > -1) {
      res[attributesMap[attr.name]] = (attr.name.indexOf('origin') > -1) ? stringToBool(attr.value) : attr.value
    }
  })
  return res
}

const Events = new Vue({})

export const VueMasonryPlugin = function () {}

VueMasonryPlugin.install = function (Vue, options) {

  Vue.directive('masonry', {
    props: ['transitionDuration', ' itemSelector'],

    inserted: function (el, nodeObj) {
      if (!Masonry) {
        throw new Error('Masonry plugin is not defined. Please check it\'s connected and parsed correctly.')
      }
      const masonry = new Masonry(el, collectOptions(el.attributes))
      const masonryDraw = () => {
        masonry.reloadItems()
        masonry.layout()
      }
      Vue.nextTick(function () {
        masonryDraw()
      })

      Events.$on(EVENT_ADD, function (eventData) {
        masonryDraw()
      })
      Events.$on(EVENT_REMOVE, function (eventData) {
        masonryDraw()
      })
      Events.$on(EVENT_IMAGE_LOADED, function (eventData) {
        masonryDraw()
      })
    }
  })

  Vue.directive('masonryTile', {

    inserted: function (el) {
      Events.$emit(EVENT_ADD, {
        'element': el
      })

      new ImageLoaded(el, function () {
        Events.$emit(EVENT_IMAGE_LOADED, {
          'element': el
        })
      })
    },
    beforeDestroy: function (el) {
      Events.$emit(EVENT_REMOVE, {
        'element': el
      })
    }
  })

  Vue.prototype.$redrawVueMasonry = function () {
    Events.$emit(EVENT_ADD)
  }
}
