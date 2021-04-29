<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-stepper non-linear v-model="stepRef">
          <v-stepper-header class="elevation-0">
            <v-stepper-step
                editable
                :complete="stepRef>1"
                step="1">
              Upload
            </v-stepper-step>

            <v-divider/>

            <v-stepper-step
                step="2">
              Crop
            </v-stepper-step>
          </v-stepper-header>
          <v-divider/>



          <v-stepper-items>
            <v-stepper-content step="1">
              <SimpleUpload
                  title="Upload a reference image"
                  @upload="uploadHandler"
              />
            </v-stepper-content>

            <v-stepper-content step="2">
              <SimpleCrop
                  :src="file"
                  emit-tag="ref_crop_finish"
                  @ref_crop_finish="finishHandler"/>
            </v-stepper-content>
          </v-stepper-items>

        </v-stepper>
      </v-col>
    </v-row>

    <v-row>
      <v-card-title v-if="refs.length !== 0"> {{refs.length}} Uploaded reference{{refs.length===1?'':'s'}}</v-card-title>
      <v-card-title v-else>No uploaded references yet!</v-card-title>
    </v-row>

    <v-row justify="center">
      <v-col
        v-for="img in refs.slice().reverse()"
        v-bind:key="img"
        sm="3"
        md="2"
      >
        <v-img
          :src="imgSrc(img)"
          class="rounded-lg"
          contain
        />
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import SimpleUpload from "@/components/SimpleUpload";
import SimpleCrop from "@/components/SimpleCrop";
import {fileToAPI} from "@/uploader";
import axios from "axios";

export default {
  name: "ReferenceTab",
  components: {SimpleCrop, SimpleUpload},
  data: () => ({
    stepRef: 1,
    file: "",
    refs: [],
  }),

  mounted() {
    this.updateRefs();
  },

  methods: {
    uploadHandler: function (data) {
      this.stepRef = 2;
      this.file = data.src;
      console.log(this.file);
    },

    finishHandler: function (canvas) {
      let canvas128 = document.createElement("canvas");
      canvas128.width = 128;
      canvas128.height = 128;
      canvas128.getContext("2d").drawImage(canvas, 0,0,128,128);

      var _this = this;

      canvas128.toBlob((blob)=> {
        let file = new File([blob], "cropped.png");
        console.log(file);
        fileToAPI(
            this.$API_URL+'/uploader',
            file,
            {
              subdir: "ref"
            }
        ).then((data) => {
          console.log(data);
          _this.stepRef = 1;
          _this.file = "";
          _this.updateRefs();
        }).catch((e) => {
          console.log(e);
        })
      }, "image/png", 100);
    },

    updateRefs: function () {
      axios.get(this.$API_URL+'/listuploads/ref')
      .then((mess) => {
        console.log(mess);
        this.refs = mess.data.files;
      });
    },

    imgSrc: function (name) {
      return this.$API_URL+'/uploads/'+name;
    }
  }
}
</script>

<style scoped>

</style>