<template>
    <v-container class="ma-0 pa-0 bg-primary h-100">
        <Topnavbar :title="title"/>
        <v-container>
            <div class="text-right mb-8">
                <v-btn color="secondary" rounded @click="handleAddCard">Add New Card</v-btn>
            </div>
            <div class="card">
                <div class="card__front card__part">
                    <div class="d-flex justify-space-between align-center">
              
                        <img class="chip" :src="type" alt="type">
                        <span class="default">Default</span>
                    </div>
                    <p class="card_numer">**** **** **** 6258</p>
                    <div class="card__space-75">
                    <span class="card__label">Card holder</span>
                    <p class="card__info">John Doe</p>
                    </div>
                    <div class="card__space-25">
                    <span class="card__label">Expires</span>
                    <p class="card__info">10/25</p>
                    </div>
                </div>

                <div class="card__back card__part">
                    <div class="card__black-line"></div>
                    <div class="card__back-content">
                    <div class="card__secret">
                        <p class="card__secret--last">420</p>
                    </div>
                    <!-- <img class="card__back-square card__square" src="https://image.ibb.co/cZeFjx/little_square.png"> -->
                    <!-- <img class="card__back-logo card__logo" src="https://www.fireeye.com/partners/strategic-technology-partners/visa-fireeye-cyber-watch-program/_jcr_content/content-par/grid_20_80_full/grid-20-left/image.img.png/1505254557388.png"> -->

                    </div>
                </div>

            </div>
            <CardAdd :dialogAddCard="modalAddCard" @close="handleClose" @submit="handleNew"/>
        </v-container>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBack'
import CardAdd from './CardAdd'
import chip from './chip.png'
import type from './visa.png'
export default {
    name:'CardOnFile',
    data() {
        return {
            title:'Cards',
            chip,
            type,
            modalAddCard:false,
            cards:[
                {1:'Lekh Raj Rai', card_number:'1111 1111 1111 1111',cvv:'123',month:'02',year:'2023'},
            ],
        }
    },
    components: {
        Topnavbar,
        CardAdd
    },
    methods: {
        handleNew(aa) {
            console.log(aa);
            this.cards.push(aa);
            console.log(this.cards);
        },
        handleClose() {
            this.modalAddCard = false;
        },
        handleAddCard() {
            this.modalAddCard = true;
        },
        navigatePage(route) {
            this.$router.push('/'+route);
        }
    }
}
</script>
<style lang="scss" scoped>
.default{
    color: #fff;
    font-style: italic;
    font-size: 0.8rem;
}
// @import url('https://fonts.googleapis.com/css?family=Space+Mono:400,400i,700,700i');

*{
  box-sizing:border-box;
//   font-family: 'Space Mono', monospace;
}

body, html{
  margin:0;
  padding:0;
  height: 100%;
  width: 100%;
}
body{
  display: flex;
  justify-content: center;
  align-items: center;
  display: -webkit-flex;
  -webkit-align-items: center;
  -webkit-justify-content: center;
   background-image: linear-gradient(to right top, #a2beeb, #8ecfee, #8edde5, #a4e7d5, #c7eec7);
  flex-direction: column;
  -webkit-flex-direction: column;
}
.title {
    margin-bottom: 30px;
    color: #162969;
}


.card{
width: 320px;
height: 190px;
  -webkit-perspective: 600px;
  -moz-perspective: 600px;
  perspective:600px;
  
}

.card__part{
    box-shadow: 1px 1px #aaa3a3;
    top: 0;
    position: absolute;
    z-index: 1000;
    left: 0;
    display: inline-block;
    width: 320px;
    height: 190px;
    background-image: url('https://image.ibb.co/bVnMrc/g3095.png'), linear-gradient(to right bottom, #e7edab, #cddc39, #8bc34a, #cddc39, #8bc34a);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 8px;
    -webkit-transition: all .5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    -moz-transition: all .5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    -ms-transition: all .5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    -o-transition: all .5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transition: all .5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
}
.card__front{
    padding: 18px;
    -webkit-transform: rotateY(0);
    -moz-transform: rotateY(0);
}

.card__back {
    padding: 18px 0;
    -webkit-transform: rotateY(-180deg);
    -moz-transform: rotateY(-180deg);
}

.card__black-line {
    margin-top: 5px;
    height: 38px;
    background-color: #303030;
}

.card__logo {
    height: 16px;
}

.card__front-logo{
      position: absolute;
    top: 18px;
    right: 18px;
}
.card__square {
    border-radius: 5px;
    height: 30px;
}

.card_numer {
    display: block;
    width: 100%;
    word-spacing: 4px;
    font-size: 20px;
    letter-spacing: 2px;
    color: #fff;
    text-align: center;
    margin-bottom: 20px;
    margin-top: 20px;
}

.card__space-75 {
    width: 75%;
    float: left;
}

.card__space-25 {
    width: 25%;
    float: left;
}

.card__label {
    font-size: 10px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.8);
    letter-spacing: 1px;
}

.card__info {
    margin-bottom: 0;
    margin-top: 5px;
    font-size: 16px;
    line-height: 18px;
    color: #fff;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.card__back-content {
    padding: 15px 15px 0;
}
.card__secret--last {
    color: #303030;
    text-align: right;
    margin: 0;
    font-size: 14px;
}

.card__secret {
    padding: 5px 12px;
    background-color: #fff;
    position:relative;
}

.card__secret:before{
  content:'';
  position: absolute;
top: -3px;
left: -3px;
height: calc(100% + 6px);
width: calc(100% - 42px);
border-radius: 4px;
  background: repeating-linear-gradient(45deg, #ededed, #ededed 5px, #f9f9f9 5px, #f9f9f9 10px);
}

.card__back-logo {
    position: absolute;
    bottom: 15px;
    right: 15px;
}

.card__back-square {
    position: absolute;
    bottom: 15px;
    left: 15px;
}

.card:hover .card__front {
    -webkit-transform: rotateY(180deg);
    -moz-transform: rotateY(180deg);

}

.card:hover .card__back {
    -webkit-transform: rotateY(0deg);
    -moz-transform: rotateY(0deg);
}


.chip{
    width:40px
}
.custom-bs{
    width: 320px;
}
.through{
    font-weight: 600;
    font-size: 0.7rem;
}
.number{
    padding:10px 0;
}
.card-holder{
    text-transform: uppercase;
}
.valid{
    display: flex;
    align-items: center;
}
// .card {
//   position: relative;
//   width: 508px;
//   height: 314px;
//   transform-style: preserve-3d;
//   perspective: 500px;
//   z-index: 2;
  
// }

// .card .face {
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   box-shadow: 0 15px 15px rgba(0, 0, 0, 0.5);
//   border-radius: 15px;
//   background: rgba(255, 255, 255, 0.05);
//   backdrop-filter: blur(28px);
//   transform-style: preserve-3d;
//   transition: 1s;
//   backface-visibility: hidden;
//   border-top: 1px solid rgba(255, 255, 255, 0.4);
//   border-left: 1px solid rgba(255, 255, 255, 0.4);
//   border-right: 1px solid rgba(255, 255, 255, 0.2);
//   border-bottom: 1px solid rgba(255, 255, 255, 0.2);
// }

// .card:hover .face.front {
//   transform: rotateY(180deg);
// }

// .card .face.back {
//   transform: rotateY(180deg);
// }

// .card:hover .face.back {
//   transform: rotateY(360deg);
// }

// .card .face.front::before {
//   content:'';
//   position: absolute;
//   bottom: 40px;
//   right: 40px;
//   width: 60px;
//   height: 60px;
//   background: #fff;
//   border-radius: 50%;
//   opacity: 0.5;
// }

// .card .face.front::after {
//   content:'';
//   position: absolute;
//   bottom: 40px;
//   right: 80px;
//   width: 60px;
//   height: 60px;
//   background: #fff;
//   border-radius: 50%;
//   opacity: 0.7;
// }

// .card .face.front .debit {
//   position: absolute;
//   left: 40px;
//   top: 30px;
//   color: #fff;
//   font-weight: 500;
// }

// .card .face.front .bank {
//   position: absolute;
//   right: 40px;
//   top: 25px;
//   color: #fff;
//   font-weight: 500;
//   font-style: italic;
//   font-size: 24px;
// }

// .card .face.front .chip {
//   position: absolute;
//   top: 80px;
//   left: 50px;
//   max-width: 64px;
// }

// .card .face.front .number {
//   position: absolute;
//   bottom: 130px;
//   left: 40px;
//   color: #fff;
//   font-weight: 500;
//   letter-spacing: 6px;
//   font-size: 18px;
//   text-shadow: 0 2px 1px #0005;
//   font-family: 'Orbitron', sans-serif;
// }

// .card .face.front .valid {
//   position: absolute;
//   bottom: 90px;
//   left: 40px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   color: #fff;
//   font-weight: 300;
//   line-height: 1em;
//   text-align: right;
// }

// .card .face.front .valid span:last-child {
//   margin-left: 20px;
//   font-size: 16px;font-weight: 400;
//   letter-spacing: 2px;
// }

// .card .face.front .card-holder {
//   position: absolute;
//   bottom: 40px;
//   left: 40px;
//   color: #fff;
//   font-weight: 300;
//   font-size: 16px;
//   letter-spacing: 2px;
//   text-transform: uppercase;
// }

// .card .face.back .blackbar {
//   position: absolute;
//   top: 40px;
//   width: 100%;
//   height: 60px;
//   background: #000;
// }

// .card .face.back .cvvtext {
//   position: absolute;
//   top: 120px;
//   left: 30px;
// }

// .card .face.back .cvvtext .white-bar {
//   position: relative;
//   width: 400px;
//   height: 40px;
//   background: #fff;
//   margin-top: 5px;
// }

// .card .face.back .cvvtext .cvv {
//   position: relative;
//   top: -35px;
//   left: 345px;
//   background: #ccc;
//   color: #111;
//   width: 50px;
//   height: 30px;
//   font-weight: 600;
//   letter-spacing: 3px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }

// .card .face.back .text {
//   position: absolute;
//   bottom: 30px;
//   left: 30px;
//   right: 30px;
//   color: #fff;
//   font-size: 10px;
//   line-height: 1.4em;
//   font-weight: 300;
// }
</style>