import store from '@/store'
store.subscribe((mutation) => {
    switch(mutation.type) {
        case 'auth/SET_TOKEN':
            if(mutation.payload){
                localStorage.setItem('id_token', mutation.payload);
            }else{
                localStorage.removeItem('id_token');
            }
            break;
    }
});