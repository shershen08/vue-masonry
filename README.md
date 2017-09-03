# vue-masonry

Vue.js directive for masonry blocks layouting. Original [masonry library](http://masonry.desandro.com/).

Plugin [DEMO](https://shershen08.github.io/vue-plugins-demo-static/index.html#/masonry) available 🎉

You can also clone the basic demo repository [vue-masonry + vue-cli webpack](https://github.com/shershen08/vue-masonry-plugin-demo).


![DEPENDENCIES status](https://david-dm.org/shershen08/vue-masonry/status.svg)


⚠️⚠️ **Minor API change** ⚠️⚠️

If you suddenly see error: `Uncaught TypeError: _vue2.default.redrawVueMasonry is not a function` - please upgrade your usage of the plugin's method `redrawVueMasonry` in component methods from 

```
Vue.redrawVueMasonry()
```
to 
```
this.$redrawVueMasonry();
``` 

[More details in #31 issue](https://github.com/shershen08/vue-masonry/issues/31)


## Install & Usage

 - Get from npm:  ```npm install vue-masonry --save ``` 
 
    or from bower ```bower install vue-masonry```
 - Make sure that the masonry library is included; for example using cdn link: ```<script async defer src="https://cdnjs.cloudflare.com/ajax/libs/masonry/4.0.0/masonry.pkgd.min.js"></script>``` or in other convenient way.
 - Use in component code
    ```
    import Vue from 'vue'
    import {VueMasonryPlugin} from 'vue-masonry';

    Vue.use(VueMasonryPlugin)

    <div v-masonry transition-duration="0.3s" item-selector=".item">
        <div v-masonry-tile class="item" v-for="(item, index) in blocks">
           <!-- block item markup -->
        </div>
    </div>
    ```


Properties currently available reproduce most of those on the [original masonry plugin](http://masonry.desandro.com/options.html):

 - ```item-selector=".item"``` - list element DOM item selector;
 - ```transition-duration="0.3s``` - duration of transitions;
 - ```column-width="#test"``` - element selector for column width;
 - ```origin-left="false"``` - set to group elements to the right instead of left by default
 - ```origin-top="false"``` - set to group elements to the bottom instead of top by default
 - ```stamp=".stamp"``` - specifies which elements are stamped within the layout
 - ```gutter=".gutter-block-selector"``` - specifies [horizontal space between item elements]
 (https://masonry.desandro.com/options.html#gutter). Set gutter to an Element or Selector String to use the outer width of the element.
 - ```fit-width="true"``` - sets the width of the container to fit the available number of columns


💡💡💡 If you need to manually trigger masonry layout redraw (for example in case if your tile elements amount or content has changed) you can now use `this.$redrawVueMasonry()` method. (If you use **old version** `< 0.10.11` it can still be `Vue.redrawVueMasonry()`, but please consider to upgrade)

### Questions, bugs

 - Check the [original masonry library docs](https://masonry.desandro.com/options.html)
 - Create [an issue](https://github.com/shershen08/vue-masonry/issues) or ping me on twitter [@legkoletat](https://twitter.com/legkoletat)


### License

 MIT
