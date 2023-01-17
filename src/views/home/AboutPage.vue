<template>
    <v-container class="ma-0 pa-0 abc bg-primary">
		<Navbar :title="title"/>
        <v-container class="pb-0">
            <div>
                <div>
                  <div class="text-center">
                      <img :src="background" class="background-image"/>
                  </div>
                </div>
            </div>
        </v-container>
        <v-container class="ma-0 pa-0" style="height:100%;position:relative;">
            <div class="text-center">
                <img :src="bug" height="310"/>
            </div>
            <div class="pa-6" style="opacity: 0.8;height: 100%;position: absolute;width: 100%;top: 0;">
                <div class="content-wrapper">
                    <h3>Call or Text</h3>
                    <p>(301) 647-9099, (901) 878-9999</p>
                </div>
                <div class="content-wrapper">
                    <h3>Email</h3>
                    <p>admin@buglobic.com</p>
                    <p>support@buglobic.com</p>
                </div>
                <div class="content-wrapper">
                    <h3>Hours of Operation</h3>
                    <p>Monday-Friday (8:00AM - 6:00PM)</p>
                    <p>Saturday (8:00AM - 2:00PM)</p>
                    <p>Sunday (closed)</p>
                </div>
				<div>
					<p class="color-secondary text-center">*24 Hour Emergency Service Available</p>
				</div>
            </div>
        </v-container>
        <Bottomnavbar :items="items" :value="indexValue"/>
    </v-container>
</template>
<script>
// import { SET_AUTH } from "@/core/services/store/auth.module";
// import { GET_LOGO } from "@/core/services/store/default_company.module";
// import { mapGetters } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import JwtService from '@/core/services/jwt.service'
import Bottomnavbar from '@/components/layout/Bottomnavbar'
import logo from '@/assets/static/logo.png'
import background from '@/assets/static/about_banner.png'
import Navbar from '@/components/layout/TopnavbarBack'
import bug from '@/assets/static/bug.png'
// import axios from "axios"
export default {
    data: () => ({
      title:'About',
        background,
        logo,
        bug,
        login_info: {
            email: "",
            password: "",
            pos_id: 12345,
        },
        indexValue:1,
        loading: false,
        nameErrors: "",
        emailErrors: "",
        checkboxErrors: "",
        show_password: false,
        valid: true,
        activateAccount: false,
        accountActivated: false,
        rulesEmail: [
             v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        items: [
            {id:1, name:'',route:'',icon:'mdi-home', showText:false},
            // {id:2, name:'',route:'dashboard-customer',icon:'mdi-view-dashboard'},
            {id:2, name:'',route:'about',icon:'mdi-information'},
            {id:3, name:'',route:'contact', icon:'mdi-notebook-check'},
            {id:4, name:'',route:'login', icon:'mdi-login'},
        ],
        lazy: false,
        // logo:'https://www.mintformations.co.uk/blog/wp-content/uploads/2020/05/shutterstock_583717939.jpg',
        name:'Buglogic',
        dashboardItems:[
            {id:1, name:'Pest Control',route:'login', destination:'pest-control',icon:'mdi-spider'},
            {id:2, name:'Inspection',route:'login', destination:'inspection', icon:'mdi-clipboard-text-multiple'},
            {id:2, name:'Services',route:'login', destination:'inspection', icon:'mdi-clipboard-text-multiple'},
        ]
    }),
    components: {
        Bottomnavbar,
		Navbar
    },
    mounted() {
        // this.fetchLogo();
        // var navigator_info = window.navigator;
        // var screen_info = window.screen;
        // var uid = navigator_info.mimeTypes.length;
        // uid += navigator_info.userAgent.replace(/\D+/g, '');
        // uid += navigator_info.plugins.length;
        // uid += screen_info.height || '';
        // uid += screen_info.width || '';
        // uid += screen_info.pixelDepth || '';
        // console.log(uid);
    },

    methods: {
      handleRoute(route) {
      if(localStorage.getItem('login') && route.destination) {
        switch(localStorage.getItem('id_token')){
          case 'customer':
              this.$router.push("/"+route.destination).catch(()=>{});
              break;
          case 'technical':
          case 'admin':
              this.$router.push("/dashboard").catch(()=>{});
              break;
          default:
              this.$router.push("/").catch(()=>{});
              break;
        }
      }
      else{
        if(route.destination) {
          localStorage.setItem('destination',route.destination);
        }
        this.$router.push("/" + route.route).catch(()=>{});
      }
    },
        async fetchLogo() {
            this.$bus.$emit('SHOW_PAGE_LOADER')
            await ApiService.get("default-company/logo")
            .then((resp) => {
                this.logo = resp.logo;
                this.name = resp.name;
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError('Sorry, Something goes wrong');
            });
        },
        async submitAdmin() {
            JwtService.saveToken('admin');
            this.$router.push('/dashboard');
        },
        async submitTechnical() {
            JwtService.saveToken('technical');
            this.$router.push('/dashboard');
        },
        async submit() {
            await JwtService.saveToken('customer');
            // this.$bus.$emit('SHOW_PAGE_LOADER')
            // ApiService.post("staff/login", this.login_info)
            // .then((resp) => {
            //     let user = resp.user;
            //     resp.token ? user.token = resp.token :'';
            //     resp.pos_id ?JwtService.savePosId(resp.pos_id) :'';
            //     resp.pos_location_id ?JwtService.savePosLocationId(resp.pos_location_id) :'';
            //     resp.pos_reader_id ?JwtService.savePosReaderId(resp.pos_reader_id) :'';
            //     this.$store.commit(SET_AUTH, user);
            //     this.$router.push('/');
            //     this.$bus.$emit('HIDE_PAGE_LOADER')
            // })
            // .catch((error) => {
            //     this.$bus.$emit('HIDE_PAGE_LOADER');
            //     this.messageError(error.response.data.message);
            // });
            // this.$router.push("/dashboard");
            if(localStorage.getItem('destination')){
                localStorage.setItem('login',true);
                this.$router.push('/'+localStorage.getItem('destination'));
            }else{
                localStorage.setItem('login',true);
                this.$router.push('/dashboard-customer');
            }
        },
        reset() {
            this.$refs.formLogin.reset();
        },
        resetValidation() {
            this.$refs.formLogin.resetValidation();
        },
        encryptPassword(event) {
            this.login_info.password = window.btoa(event.target.value);
        }
    },
    computed: {
        // ...mapGetters(['logo'])
    }
};
</script>
<style lang="scss" scoped>
.background-image{
    max-width:100%;
    min-height:150px;
	height: 150px;
}
.content-wrapper{
	color:#fff;
	margin-bottom:20px;
	text-align:center;
	p{
		margin:0;
		font-size:0.9rem;
	}
}
.wrapper{
  text-align: center;
  display: flex;
  justify-content: space-around;
}
.item-container {
      border-radius: 10px;
      background: #9bce17;
      width: 220px;
      margin-bottom: 20px;
      text-align: center;
      color: #fff;
    .icon-wrapper {
      padding: 10px;
      border-radius: 9px;
      i {
        color: #fff;
      }
    }
}
.abc {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

</style>
