import store from './store'
// import { ApiService } from '@/core/services/api.service'
store.subscribe((mutation) => {
    console.log({mutation});
})