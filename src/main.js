import './input.css'
// import './assets/build.css'
import 'animate.css';
import router from './router'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";
import App from './App.vue'


const pinia = createPinia()
const app = createApp(App)


app.use(pinia)
app.use(router)
app.use(VueAwesomePaginate)
app.mount('#app')
