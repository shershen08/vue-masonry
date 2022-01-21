import Masonry from 'masonry-layout'
import ImageLoaded from 'imagesloaded'
import { isVue2, Vue2, nextTick } from 'vue-demi'
import mitt from 'mitt'

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

export const VueMasonryPlugin = {}

VueMasonryPlugin.install = function (app, options) {
  const Events = isVue2 ? new Vue2() : mitt()
  const defaultId = 'VueMasonry'

  const appOrVue2 = (isVue2 ? Vue2 : app)

  appOrVue2.directive('masonry', {
    props: ['transitionDuration', ' itemSelector', 'destroyDelay'],

    [isVue2 ? 'inserted' : 'mounted']: function (el, binding) {
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

      if (isVue2) {
        Vue2.nextTick(function () {
          masonryDraw()
        })
      } else {
        nextTick(() => {
          masonryDraw()
        })
      }

      const masonryRedrawHandler = function (eventData) {
        masonryDraw()
      }

      const masonryDestroyHandler = function (eventData) {
        Events[`${isVue2 ? '$' : ''}off`](`${EVENT_ADD}__${masonryId}`, masonryRedrawHandler)
        Events[`${isVue2 ? '$' : ''}off`](`${EVENT_REMOVE}__${masonryId}`, masonryRedrawHandler)
        Events[`${isVue2 ? '$' : ''}off`](`${EVENT_IMAGE_LOADED}__${masonryId}`, masonryRedrawHandler)
        Events[`${isVue2 ? '$' : ''}off`](`${EVENT_DESTROY}__${masonryId}`, masonryDestroyHandler)
        const delay = destroyDelay && !Number.isNaN(destroyDelay) ? destroyDelay : 0
        setTimeout(function () {
          masonry.destroy()
        }, delay)
      }

      Events[`${isVue2 ? '$' : ''}on`](`${EVENT_ADD}__${masonryId}`, masonryRedrawHandler)
      Events[`${isVue2 ? '$' : ''}on`](`${EVENT_REMOVE}__${masonryId}`, masonryRedrawHandler)
      Events[`${isVue2 ? '$' : ''}on`](`${EVENT_IMAGE_LOADED}__${masonryId}`, masonryRedrawHandler)
      Events[`${isVue2 ? '$' : ''}on`](`${EVENT_DESTROY}__${masonryId}`, masonryDestroyHandler)
    },
    unbind: function (el, binding) {
      const masonryId = binding.value || defaultId
      Events[`${isVue2 ? '$' : ''}emit`](`${EVENT_DESTROY}__${masonryId}`)
    }
  })

  appOrVue2.directive('masonryTile', {

    [isVue2 ? 'inserted' : 'mounted']: function (el, binding) {
      const masonryId = binding.value || defaultId
      Events[`${isVue2 ? '$' : ''}emit`](`${EVENT_ADD}__${masonryId}`, {
        'element': el
      })
      // eslint-disable-next-line
      new ImageLoaded(el, function () {
        Events[`${isVue2 ? '$' : ''}emit`](`${EVENT_IMAGE_LOADED}__${masonryId}`, {
          'element': el
        })
      })
    },
    unbind: function (el, binding) {
      const masonryId = binding.value || defaultId
      Events[`${isVue2 ? '$' : ''}emit`](`${EVENT_REMOVE}__${masonryId}`, {
        'element': el
      })
    }
  })

  if (isVue2) {
    Vue2.prototype.$redrawVueMasonry = function (id) {
      const masonryId = id || defaultId
      Events[`${isVue2 ? '$' : ''}emit`](`${EVENT_ADD}__${masonryId}`)
    }
  } else {
    const redraw = function (id) {
      const masonryId = id || defaultId
      Events[`${isVue2 ? '$' : ''}emit`](`${EVENT_ADD}__${masonryId}`)
    }
    app.config.globalProperties.$redrawVueMasonry = redraw
    app.provide('redrawVueMasonry', redraw)
  }
}
