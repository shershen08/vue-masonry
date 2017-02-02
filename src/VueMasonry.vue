<script>
    import Vue from 'vue';
    const attributesMap = {
        'column-width': 'columnWidth',
        'transition-duration': 'transitionDuration',
        'item-selector': 'itemSelector'
    };
    const delay = 500;
    const EVENT_ADD = 'vuemasonry.itemAdded';
    const EVENT_REMOVE = 'vuemasonry.itemRemoved';

    var Events = new Vue( {});

    export const masonry = Vue.directive( 'masonry', {
        props: [ 'transitionDuration', ' itemSelector' ],
        mounted: function () {
            console.log( this )
        },
        inserted: function ( el, nodeObj ) {

            var options = {};
            var attrsrray = Array.prototype.slice.call( el.attributes );

            attrsrray.forEach( function ( attr ) {
                if ( Object.keys( attributesMap ).indexOf( attr.name ) > -1 ) {
                    options[ attributesMap[ attr.name ] ] = attr.value;
                }
            })
            console.log(options);

            var masonry = new Masonry( el, options );
            var masonryDraw = () => {
                masonry.reloadItems();
                masonry.layout();
            }

            setTimeout( function () {
                masonryDraw()
                //el.children( options.itemSelector ).css( 'visibility', 'visible' );
            }, delay );

            
            Events.$on( EVENT_ADD, function ( eventData ) {
                masonryDraw()
                
            })
            Events.$on( EVENT_REMOVE, function ( eventData ) {
                masonryDraw()
            })
        }
    })

    export const masonryTile = Vue.directive( 'masonryTile', {

        inserted: function ( el ) {
            Events.$emit( EVENT_ADD, { 'element': el });
            //el.style.visibility = 'hidden';
        },
        beforeDestroy: function () {
            Events.$emit( EVENT_REMOVE, { 'element': el });
        }
    })

</script>