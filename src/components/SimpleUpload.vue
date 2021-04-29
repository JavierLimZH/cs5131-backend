<template>
<v-card>
  <v-card-title class="py-0">
    {{title}}
  </v-card-title>

  <v-card-text>
    <v-file-input
        accept="image/*"
        v-model="files"
        chips
        truncate-length="20"
        :placeholder="placeholder"
    />

    <v-btn :disabled="files === null" color="success" v-on:click="upload">Upload</v-btn>

  </v-card-text>


</v-card>
</template>

<script>
import {fileToAPI, fileToBase64} from "@/uploader";


export default {
  name: "SimpleUpload",

  props: {
    postUrl: {
      type: String,
    },
    title: {
      type: String,
      default: "Upload!",
    },
    placeholder: {
      type: String,
      default: "Click to upload"
    },
    emitTag: {
      type: String,
      default: "upload"
    },

    params: {
      type: Object,
      default: ()=>{}
    },
  },

  methods: {
    upload() {
      if (typeof this.postUrl === 'undefined') {
        var _this = this;

        fileToBase64(this.files)
        .then((data) => {
          this.$emit(this.emitTag, {
            src: data.target.result
          })
          _this.files = null;
        })

        return
      }

      fileToAPI(this.$API_URL+'/upload', this.files)
      .then((mess) => {
        console.log(mess.data);
        this.$emit(this.emitTag, mess.data);
        this.files = null;
      }).catch((e) => {
        console.log(e);
      });
    }
  },

  data: () => ({
    files: null,
  })

}
</script>

<style scoped>

</style>