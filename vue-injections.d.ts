import Vue from 'vue'
declare module 'vue/types/vue' {
    interface Vue {
        $redrawVueMasonry (id:string): void
        $redrawVueMasonry (): void
    }
}
