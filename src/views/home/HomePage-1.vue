<template>
    <v-container class="ma-0 pa-0 abc">
        <v-container>
            <div>
                <v-row>
                    <v-col cols="12" sm="6" md="4" lg="4" offset-lg="4" offset-md="4" offset-sm="3">
                        <!-- <div>
                            <v-img
                            style="margin: 0 auto;"
                            lazy-src="https://picsum.photos/id/11/10/6"
                            max-width="200"
                            min-width="200"
                            min-height="150"
                            :src="logo"
                            ></v-img>
                        </div> -->
                        <div>
                            <!-- <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi, delectus?</p> -->
                          
                            
                        </div>
                    </v-col>
                    <!-- <v-col cols="12">
                        <div class="footer-copyright">
                            <p>&copy; 2021 Buglobic</p>
                        </div>          
                    </v-col> -->
                </v-row>
            </div>
        </v-container>
        <v-container class="ma-0 pa-0 mt-13" style="height:100%;">
            <v-card class="custom-bs border-radius-10 pa-4" style="height:100%;">
                <div class="wrapper border-radius-10" v-for="(item,index) in dashboardItems" :key="index" @click="handleRoute(item)">
                    <div class="item-container">
                      <div class="">
                        <div class="icon-wrapper">
                            <v-icon>{{ item.icon }}</v-icon>
                        </div>
                        <div class="text-wrapper">
                            <p class="pa-0 ma-0 text-heading">{{ item.name }}</p>
                        </div>
                      </div>

                    </div>
              </div>
            </v-card>
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
// import axios from "axios"
export default {
    data: () => ({
        login_info: {
            email: "",
            password: "",
            pos_id: 12345,
        },
        indexValue:3,
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
            {id:2, name:'',route:'dashboard-customer',icon:'mdi-view-dashboard'},
            {id:3, name:'',route:'pest-control', icon:'mdi-calendar'},
            {id:4, name:'',route:'login', icon:'mdi-login'},
        ],
        lazy: false,
        logo:'https://www.mintformations.co.uk/blog/wp-content/uploads/2020/05/shutterstock_583717939.jpg',
        name:'Buglogic',
        dashboardItems:[
          {id:1, name:'Pest Control',route:'login', destination:'pest-control',icon:'mdi-spider'},
          {id:2, name:'Inspection',route:'login', destination:'inspection', icon:'mdi-clipboard-text-multiple'},
          {id:2, name:'Services',route:'login', destination:'inspection', icon:'mdi-clipboard-text-multiple'},
      ]
    }),
    components: {
        Bottomnavbar
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
.abc {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}
.footer-copyright{
    padding: 40px;
    bottom: 0;
    p{
        text-align: center;
        color: #4caf50;
        margin: 0;
        font-size: 0.9rem;
        bottom: 0;
        padding: 30px;
        font-weight: 500;
    }
}
.item-container {
   margin: 24px 0;
    padding: 14px 16px;
    border-radius: 10px;
    background: #75ab26;
    width: 220px;
  .icon-wrapper {
    padding: 10px;
    // background: #19477e26;
    // background: #19477ede;
    border-radius: 9px;
    i {
      color: #fff;
    }
  }
  .text-wrapper {
    padding: 0 12px;
    .text-heading {
      padding: 0 12px;
      color: #000;
      font-weight: 400;
      margin-bottom: 4px !important;
    }
    .text-sub-heading {
      font-size: 0.8rem;
    }
  }
  .footer-menu {
    position: fixed;
    width: 100%;
    bottom: 0;
    ul {
      list-style: none;
      display: flex;
      justify-content: space-around;
      background: #19477e;
      border: 1px solid #a0cbff91;
      padding: 12px;
      li {
        padding: 0;
        margin: 0;
      }
    }
  }
}
.service-item-container {
    display: flex;
    align-items: center;
    justify-content:space-between;
    margin: 24px 0;
    padding: 14px 16px;
    border-radius: 10px;
    // background: #a0cbff91;
      border: 1px solid #a0cbff91;
  .icon-wrapper {
    padding: 10px;
    // background: #19477e26;
    background: #19477ede;
    border-radius: 9px;
    i {
      color: #fff;
    }
  }
  .text-wrapper {
    padding: 0 12px;
    .text-heading {
      padding: 0 12px;
      color: #000;
      font-weight: 400;
      margin-bottom: 4px !important;
    }
    .text-sub-heading {
      font-size: 0.8rem;
    }
  }
  .footer-menu {
    position: fixed;
    width: 100%;
    bottom: 0;
    ul {
      list-style: none;
      display: flex;
      justify-content: space-around;
      background: #19477e;
      border: 1px solid #a0cbff91;
      padding: 12px;
      li {
        padding: 0;
        margin: 0;
      }
    }
  }
}
.service-counter{
    display:flex;
    justify-content:space-between;
    text-align: center;
    margin-top:20px;
    p.count{
        margin: 0;
        font-weight: 500;
        color: #055b1a;
        font-size: 1.3rem;
    }
    p.text {
        padding: 0;
        margin: 0;
        font-size: 0.9rem;
        color: #325c8f;
        // font-weight: 800;
    }
}
.banner {
  background: #dadada;
  border-radius: 10px;
  height: 200px;
  // margin:10px;
  // padding:12px;
  .banner-content {
    height: 100%;
    padding: 18px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    .tagline {
      color: #fff;
    }
  }
}
.color-primary {
  color: #19477e !important;
}
.color-secondary {
  color: #75ab26 !important;
}
.wrapper{
    // background: #a0cbff66;
    // border-radius: 10px;
    // padding: 14px 16px;
    // margin: 18px 0;
    text-align: center;
}
.item-container {
  display: flex;
  align-items: center;
  // background: #e4ffbc91;
  .icon-wrapper {
    padding: 10px;
    // background: #19477e26;
    // background: #19477ede;
    
    border-radius: 9px;
    i {
      color: #fff;
    }
  }
  .text-wrapper {
    padding: 0 12px;
    .text-heading {
      padding: 0 12px;
      font-weight: 600;
      font-size: 1.2rem;
      color: #000;
    }
    .text-sub-heading {
      font-size: 0.8rem;
    }
  }
  .footer-menu {
    position: fixed;
    width: 100%;
    bottom: 0;
    ul {
      list-style: none;
      display: flex;
      justify-content: space-around;
      background: #19477e;
      padding: 12px;
      li {
        padding: 0;
        margin: 0;
      }
    }
  }
}
</style>
