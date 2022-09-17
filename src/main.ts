import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import lazyloadImgInit from 'vue3-lazyload-img'

createApp(App).use(lazyloadImgInit,{
    retryLoad:5
}).mount('#app')
