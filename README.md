# vue-masonry 

![DEPENDENCIES status](https://david-dm.org/shershen08/vue-masonry/status.svg)
[![](https://data.jsdelivr.com/v1/package/npm/vue-masonry/badge)](https://www.jsdelivr.com/package/npm/vue-masonry)

**Current version: 0.11.8**

Vue.js directive for masonry blocks layouting. Original [masonry library](http://masonry.desandro.com/).

Plugin [DEMO](https://shershen08.github.io/vue-plugins-demo-static/index.html#/masonry) available 🎉, [JSFiddle DEMO](https://jsfiddle.net/jericopulvera/wq07brjs)

You can also clone the basic demo repository [vue-masonry + vue-cli webpack](https://github.com/shershen08/vue-masonry-plugin-demo).

## Usage

### Install via NPM

- Get from npm:  ```npm install vue-masonry --save ```

    or from bower ```bower install vue-masonry```
- Make sure that the masonry library is included; for example using cdn link: ```<script async defer src="https://cdnjs.cloudflare.com/ajax/libs/masonry/4.0.0/masonry.pkgd.min.js"></script>``` or in other convenient way.


### Usage with build tools

- In your Vue app you'll have the following code:

    ```
    import Vue from 'vue'

    // import ES6 style
    import {VueMasonryPlugin} from 'vue-masonry';

    // or using CJS 
    // const VueMasonryPlugin = require('vue-masonry').VueMasonryPlugin

    Vue.use(VueMasonryPlugin)

    <div v-masonry="containerId" transition-duration="0.3s" item-selector=".item">
        <div v-masonry-tile class="item" v-for="(item, index) in blocks">
           <!-- block item markup -->
        </div>
    </div>
    ```

### Usage directly in the browser

Since v 0.11.3 in-browser usage is available using a direct script inclusion on the page like so:

```
<script src="https://unpkg.com/vue-masonry@0.11.3/dist/vue-masonry-plugin-window.js"></script>
```

```
var VueMasonryPlugin = window["vue-masonry-plugin"].VueMasonryPlugin
Vue.use(VueMasonryPlugin)
```

### Properties

Properties that are currently available reproduce most of those on the [original masonry plugin](http://masonry.desandro.com/options.html):

 - ```item-selector=".item"``` - list element DOM item selector;
 - ```transition-duration="0.3s``` - duration of transitions;
 - ```column-width="#test"``` - element selector for column width. Can be a selector string or a number;
 - ```origin-left="false"``` - set to group elements to the right instead of left by default;
 - ```origin-top="false"``` - set to group elements to the bottom instead of top by default;
 - ```stamp=".stamp"``` - specifies which elements are stamped within the layout;
 - ```gutter=".gutter-block-selector"``` - specifies [horizontal space between item elements]. Can be a selector string or a number.
 (https://masonry.desandro.com/options.html#gutter). Set gutter to an Element or Selector String to use the outer width of the element;
 - ```fit-width="true"``` - sets the width of the container to fit the available number of columns;
 - ```horizontal-order="true"``` - lays out items to (mostly) maintain horizontal left-to-right order;
 - ```stagger="0.03s"``` - Staggers item transitions, so items transition incrementally after one another. Set as a CSS time format, '0.03s', or as a number in milliseconds, 30.

If you need to manually trigger masonry layout redraw (for example in case if your tile elements amount or content has changed) you can now use `this.$redrawVueMasonry('containerId')` method. As of [0.11.8](https://github.com/shershen08/vue-masonry/pull/89) your can pass id of the block where you want to trigger the redraw.

(If you use **old version** `< 0.10.11` it can still be `Vue.redrawVueMasonry()`, but please consider to upgrade)


### NUXT ssr implementation

The best way to impliment this is to use the [no-ssr plugin](https://github.com/egoist/vue-no-ssr).

1. Create a file in your plugins folder called vue-masonry.js with the following contents:

```
import Vue from 'vue'
import {VueMasonryPlugin} from 'vue-masonry'

Vue.use(VueMasonryPlugin)
```
2. Add this plugin to your `nuxt.config.js`

```
  plugins: [
    { src: '~/plugins/vue-masonry', ssr: false }
  ]
```

(NB make sure ssr is set to false)

3. Add no-ssr and the markup for your vue-masonry to a component:

HTML:
```
    <no-ssr>
      <div v-masonry transition-duration="3s" item-selector=".item" class="masonry-container">
        <div v-masonry-tile class="item" :key="index" v-for="(item, index) in blocks">
          <p>{{item}} - {{index}}</p>
        </div>
      </div>
    </no-ssr>
```

JS:
```
  import NoSSR from 'vue-no-ssr'

  export default {
    components: {
      'no-ssr': NoSSR
    },
    mounted () {
      if (typeof this.$redrawVueMasonry === 'function') {
        this.$redrawVueMasonry()
      }
    }
  }
```

An example implimentation of vue-masonry with nuxt ssr can be found here - https://github.com/richlloydmiles/example-vue-masonry-ssr

### Contributing

Thanks to all the [contributors](https://github.com/shershen08/vue-masonry/graphs/contributors) for making the plugin better!

### Questions, bugs

 - Check the [original masonry library docs](https://masonry.desandro.com/options.html)
 - Create [an issue](https://github.com/shershen08/vue-masonry/issues) or ping me on twitter [@legkoletat](https://twitter.com/legkoletat)

### Known issues

 - Minor API change (JAN 2018). If you suddenly see error: `Uncaught TypeError: _vue2.default.redrawVueMasonry is not a function` - please upgrade your usage of the plugin's method `redrawVueMasonry` in component methods from ```Vue.redrawVueMasonry()``` to ```this.$redrawVueMasonry();```. See [more details in #31 issue](https://github.com/shershen08/vue-masonry/issues/31)

### License

 MIT
