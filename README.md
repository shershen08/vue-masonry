# vue-masonry

Vue.js directive for masonry blocks layouting. Original [masonry library](http://masonry.desandro.com/).

Plugin [DEMO](https://shershen08.github.io/vue-plugins-demo-static/index.html#/masonry) available 🎉


![DEPENDENCIES status](https://david-dm.org/shershen08/vue-masonry/status.svg)


## Install & Usage

 - Get from npm:  ```npm install vue-masonry --save ``` 
 
    or from bower ```bower install vue-masonry```
 - Make sure that the masonry library is included; for example using cdn link: ```<script async defer src="https://cdnjs.cloudflare.com/ajax/libs/masonry/4.0.0/masonry.pkgd.min.js"></script>``` or in other convenient way.
 - Use in component code
    ```
    import Vue from 'vue'
    import VueMasonryPlugin from 'vue-masonry';

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


💡 **New** 💡 : If you need to manually trgiger masonry layout redraw (for example in case if your tile elements amount or content has changed) you can now use `Vue.redrawVueMasonry()` method.


### License

 MIT
