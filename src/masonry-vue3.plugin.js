import Masonry from 'masonry-layout'
import ImageLoaded from 'imagesloaded'

// Vue 3 Global API changed: nextTick import
import { nextTick } from 'vue';

const attributesMap = {
  'column-width': 'columnWidth',
  'transition-duration': 'transitionDuration',
  'item-selector': 'itemSelector',
  'origin-left': 'originLeft',
  'origin-top': 'originTop',
  'fit-width': 'fitWidth',
  'stamp': 'stamp',
  'gutter': 'gutter',
  'percent-position': 'percentPosition',
  'horizontal-order': 'horizontalOrder',
  'stagger': 'stagger',
  'destroy-delay': 'destroyDelay'
}
const EVENT_ADD = 'vuemasonry.itemAdded'
const EVENT_REMOVE = 'vuemasonry.itemRemoved'
const EVENT_IMAGE_LOADED = 'vuemasonry.imageLoaded'
const EVENT_DESTROY = 'vuemasonry.destroy'

const stringToBool = function (val) { return (val + '').toLowerCase() === 'true' }

const numberOrSelector = function (val) { return isNaN(val) ? val : parseInt(val) }

const collectOptions = function (attrs) {
  const res = {}
  const attributesArray = Array.prototype.slice.call(attrs)
  attributesArray.forEach(function (attr) {
    if (Object.keys(attributesMap).indexOf(attr.name) > -1) {
      if (attr.name.indexOf('origin') > -1) {
        res[attributesMap[attr.name]] = stringToBool(attr.value)
      } else if (attr.name === 'column-width' || attr.name === 'gutter') {
        res[attributesMap[attr.name]] = numberOrSelector(attr.value)
      } else {
        res[attributesMap[attr.name]] = attr.value
      }
    }
  })
  return res
}

export class VueMasonryPlugin {
  constructor() { }
  static install(app, options) {
    // Accessed mitt emitter from app instance 
    const emitter = app.config.globalProperties.emitter;
    const defaultId = 'VueMasonry'

    app.directive('masonry', {
      props: ['transitionDuration', ' itemSelector', 'destroyDelay'],

      // Global API: inserted -> mounted
      mounted(el, binding) {
        if (!Masonry) {
          throw new Error('Masonry plugin is not defined. Please check it\'s connected and parsed correctly.')
        }
        const options = collectOptions(el.attributes)
        const masonry = new Masonry(el, options)
        const masonryId = binding.value || defaultId
        const destroyDelay = options['destroyDelay'] ? parseInt(options['destroyDelay'], 10) : undefined
        const masonryDraw = function () {
          masonry.reloadItems()
          masonry.layout()
        }

        // Updated nextTick method
        nextTick(() => {
          masonryDraw()
        })

        const masonryRedrawHandler = function (eventData) {
          masonryDraw()
        }

        const masonryDestroyHandler = function (eventData) {
          emitter.off(`${EVENT_ADD}__${masonryId}`, masonryRedrawHandler)
          emitter.off(`${EVENT_REMOVE}__${masonryId}`, masonryRedrawHandler)
          emitter.off(`${EVENT_IMAGE_LOADED}__${masonryId}`, masonryRedrawHandler)
          emitter.off(`${EVENT_DESTROY}__${masonryId}`, masonryDestroyHandler)
          const delay = destroyDelay && !Number.isNaN(destroyDelay) ? destroyDelay : 0
          setTimeout(function () {
            masonry.destroy()
          }, delay)
        }

        emitter.on(`${EVENT_ADD}__${masonryId}`, masonryRedrawHandler)
        emitter.on(`${EVENT_REMOVE}__${masonryId}`, masonryRedrawHandler)
        emitter.on(`${EVENT_IMAGE_LOADED}__${masonryId}`, masonryRedrawHandler)
        emitter.on(`${EVENT_DESTROY}__${masonryId}`, masonryDestroyHandler)
      },
      // Global API: unbind -> unmounted
      unmounted(el, binding) {
        const masonryId = binding.value || defaultId
        emitter.emit(`${EVENT_DESTROY}__${masonryId}`)
      }
    })

    app.directive('masonryTile', {
      // Global API: inserted -> mounted
      mounted(el, binding) {
        const masonryId = binding.value || defaultId
        emitter.emit(`${EVENT_ADD}__${masonryId}`, {
          'element': el
        })
        // eslint-disable-next-line
        new ImageLoaded(el, function () {
          emitter.emit(`${EVENT_IMAGE_LOADED}__${masonryId}`, {
            'element': el
          })
        })
      },
      // Global API: unbind -> unmounted
      unmounted(el, binding) {
        const masonryId = binding.value || defaultId
        emitter.emit(`${EVENT_REMOVE}__${masonryId}`, {
          'element': el
        })
      }
    })

    app.config.globalProperties.$redrawVueMasonry = function (id) {
      const masonryId = id || defaultId
      emitter.emit(`${EVENT_ADD}__${masonryId}`)
    }
  }
}


