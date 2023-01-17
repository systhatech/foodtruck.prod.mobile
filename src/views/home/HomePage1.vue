<template>
  <v-container class="pa-0 ma-0">
      <!-- <TopnavbarHome/> -->
      <v-container>
        <!-- <div>
          <div
            class="banner"
            :style="{'background-image':'url(https://brandedscreenprinting.com/wp-content/uploads/Social-Media-reno-nv.jpg)'}">
            <div class="banner-content">
              <p class="tagline">Our login, your solution</p>
              <v-btn small tile color="primary">Login</v-btn>
            </div>
          </div>
        </div> -->
        <div class="pb-9">
          <div class="wrapper custom-bs border-radius-10" v-for="(item,index) in dashboardItems" :key="index" @click="handleRoute(item)">
                <div class="item-container">
                  <div class="d-flex">
                    <div class="icon-wrapper">
                        <v-icon>{{ item.icon }}</v-icon>
                    </div>
                    <div class="text-wrapper">
                        <p class="pa-0 ma-0 text-heading">{{ item.name }}</p>
                        <p class="pa-0 ma-0 text-sub-heading">Tagline here</p>
                    </div>
                  </div>
                    <div>
                      <v-icon>
                        mdi-chevron-right
                      </v-icon>
                    </div>
                </div>
          </div>
            <h2>Services</h2>
            <div>
              <div class="service-item-container" v-for="(service, index) in services" :key="index" @click="handleView(index)">
                <div class="d-flex">
                  <div class="icon-wrapper">
                    <v-icon>mdi-account</v-icon>
                  </div>
                  <div class="text-wrapper">
                    <p class="pa-0 ma-0 text-heading">{{ service.name }}</p>
                    <p class="pa-0 ma-0 text-sub-heading">Tagline here</p>
                  </div>
                </div>
                <div>
                  <v-icon>
                    mdi-chevron-right
                  </v-icon>
                </div>
              </div>
            </div>
        </div>
      </v-container>
      <Bottomnavbar :items="items"/>
  </v-container>
</template>
<script>
// import TopnavbarHome from '@/components/layout/TopnavbarHome'
import Bottomnavbar from '@/components/layout/Bottomnavbar'
export default {
  data() {
    return {
      value: 1,
      logo: "https://www.mintformations.co.uk/blog/wp-content/uploads/2020/05/shutterstock_583717939.jpg",
      dashboardItems:[
          {id:1, name:'Pest Control',route:'login', destination:'pest-control',icon:'mdi-spider'},
          {id:2, name:'Inspection',route:'login', destination:'inspection', icon:'mdi-clipboard-text-multiple'},
      ],
      items: [
            {id:1, name:'About Us',route:'about',icon:'mdi-album'},
            {id:2, name:'Contact Us',route:'contact', icon:'mdi-file-phone'},
            {id:3, name:'Login',route:'login', icon:'mdi-login'},
        ],
        itemsLoggedIn: [
            {id:1, name:'About Us',route:'about',icon:'mdi-login'},
            {id:2, name:'Contact Us',route:'contact', icon:'mdi-content-paste'},
            {id:3, name:'Dashboard',route:'dashboard-customer', icon:'mdi-home'},
        ],
        services:[
            {id:1, name:'Interior General Pest Control'},
            {id:2, name:'Exterior General Pest Control'},
            {id:3, name:'Rodent Control'},
            {id:4, name:'Bed Bug Service'},
            {id:5, name:'Mosquitoes'},
            {id:6, name:'Moles & Groundhogs'},
            {id:7, name:'Snakes'},
            {id:8, name:'Flea and Tick'},
            {id:9, name:'Exclusions'},
            {id:9, name:'Attic Service'},
        ]
    };
  },
  mounted() {
    if(localStorage.getItem('login')){
      this.items = this.itemsLoggedIn;
    }
    
  },
  methods: {
    handleView(id){
      this.$router.push('/inspection/'+id);
    },
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
  },
  components: {
    Bottomnavbar,
    // TopnavbarHome,
  }
};
</script>
<style scoped lang="scss">
.item-container {
    display: flex;
    align-items: center;
    justify-content:space-between;
    margin: 24px 0;
    padding: 14px 16px;
    border-radius: 10px;
    background: #a0cbff91;
      // border: 1px solid #a0cbff91;
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
}
.item-container {
  display: flex;
  align-items: center;
  // background: #e4ffbc91;
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
