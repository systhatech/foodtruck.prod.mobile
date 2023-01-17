<template>
    <div class="file-wrapper">
        <v-btn color="primary" rounded><v-icon class="pr-2">{{ iconCamera }} </v-icon> &nbsp;&nbsp; {{ buttonTitle }}
            <div>
                <input type="file" />
                <label class="custom-file-upload">
                    <input type="file"  @change="fileChanged" name="selected_image" multiple id="image_file" accept="image/*"/>
                    &nbsp;
                </label>
            </div>
        </v-btn>
    </div>
</template>
<script>
import { mdiCamera } from '@mdi/js'
export default {
    props:{
        buttonTitle:{}
    },
    data : () => ({
        iconCamera: mdiCamera,
    }),
    methods: {
        fileChanged(e){
            this.$emit('changeImage',e);
        },
    }
}
</script>
<style lang="scss" scoped>
input[type="file"] {
    display: none;
}
.file-wrapper{
    .custom-file-upload {
        position: absolute;
        left: 0;
        width: 100%;
        bottom: 0px;
        height:100%;
    }
}
</style>
