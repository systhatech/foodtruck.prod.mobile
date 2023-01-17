<template>
    <div class="file-wrapper">
        <img v-if="image_url" :src="image_url">
        <div v-else-if="src" class="h-100">
            <img  :src="src">
        </div>
        <div v-else class="h-100 d-flex align-center justify-space-around">
            <p class="select-image">{{label}}</p>
        </div>
        <div style="margin: 0 auto;width: 100%;text-align: center;">
            <input type="file" />
            <label class="custom-file-upload">
                <input type="file"  @change="fileChanged" name="selected_image" id="image_file" accept="image/*"/>
                &nbsp;
            </label>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        src:{},
        type:{},
        label:{},
        remove:{},
        update_input_file:{},
        update_input_file_second:{},
        itemId:{}
    },
    data : () => ({
        image_url:'',
        image_file:'',
    }),
    watch: {
        update_input_file: function(){
            this.image_url = "";
        },
        update_input_file_second: function(){
            this.image_url = "";
        },
        src: function(newval) {
            this.image_url = newval;
        },
        remove(newval){
            if(newval) {
                this.image_url = "";
            }
        }
    },
    methods: {
        fileChanged(e){
            this.image_file= e.target.files[0]
            this.image_url = URL.createObjectURL(this.image_file);
            this.$emit('changeImage',{
                'file': this.image_file,
                'type': this.type,
                'itemId': this.itemId,
            });
        },
    }
}
</script>
<style lang="scss" scoped>
input[type="file"] {
    display: none;
}
.select-image{
    padding: 0;
    text-transform: uppercase;
    font-weight: 600;
    color: #c0c0c0;
    margin: 0;
}
.file-wrapper{
    border: 1px solid #c0c0c0;
    border-radius:10px;
    display: flex;
    align-items: center;
    width: 100%;
    flex-direction: column;
    position: relative;
    height: 100%;
    img{
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    .custom-file-upload {
        display: inline-block;
        padding: 6px 12px;
        width: 142px;
        cursor: pointer;
        font-size: 0.8rem;
        position: absolute;
        left: 0;
        width: 100%;
        bottom: 0px;
        height:100%;
        &:hover{
            border: 1px solid #ccc;
        }
    }
}
</style>
