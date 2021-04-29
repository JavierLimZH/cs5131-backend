<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12s">
        <v-stepper v-model="stepDam">
          <v-stepper-header class="elevation-0">
            <v-stepper-step
                editable
                :complete="stepDam > 1"
                step="1">
              Upload
            </v-stepper-step>

            <v-divider/>

            <v-stepper-step
                :editable="stepDam > 2"
                :complete="stepDam > 2"
                step="2">
              Crop
            </v-stepper-step>
            <v-divider/>

            <v-stepper-step
                :complete="stepDam > 3"
                :editable="stepDam > 3"
                step="3">
              Mask
            </v-stepper-step>

            <v-divider/>

            <v-stepper-step
              :complete="stepDam > 4"
              :editable="stepDam > 4"
              step="4"
            >
              Mark
            </v-stepper-step>

          </v-stepper-header>

          <v-divider/>

          <v-stepper-items>

            <v-stepper-content step="1">
              <SimpleUpload
                  title="Upload a damaged image"
                  @upload="uploadHandler"
              />
            </v-stepper-content>

            <v-stepper-content step="2">
              <h2>Crop</h2>
              <SimpleCrop
                :src="file"
                :out-size="[128, 128]"
                emit-tag="dam_crop_finish"
                @dam_crop_finish="cropHandler"/>
            </v-stepper-content>

            <v-stepper-content step="3">

              <h2>Mark mask</h2>

              <v-row justify="center">
                <v-col cols="3">
                  <v-btn block color="secondary" v-on:click="autoMask">
                    Automask
                  </v-btn>
                </v-col>
              </v-row>


              <ImageMarker
                  ref="marker"
                  class="justify-center"
                  :src="cropped"
                  :thickness="8"
                  marker-id="damagemarker"
                  varthickness="true"
              />

              <v-container>
                <v-row justify="center">
                  <v-col cols="3">
                    <v-btn block color="success" v-on:click="maskHandler(0)">
                      Use
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>

            </v-stepper-content>

            <v-stepper-content step="4">
              <h2>Mark</h2>

              <v-container>

                <v-row v-for="x in parts" v-bind:key="x" justify="center">

                  <v-col cols="3">
                    <br/>
                    <h3 class="text-center">{{x.charAt(0).toUpperCase() + x.slice(1)}}</h3>
                    <br/>
                    <v-img :src="'static/'+x+'.jpg'"></v-img>
                  </v-col>

                  <v-col cols="6">
                    <ImageMarker
                      :src="cropped"
                      :ref="'marker'+x"
                      :marker-id="'marker'+x"
                      thickness="3"
                    ></ImageMarker>
                  </v-col>

                </v-row>

                <v-row justify="center">
                  <v-col cols="5">
                    <v-btn block color="success" v-on:click="finishHandler">
                      Finish
                    </v-btn>
                  </v-col>
                </v-row>

              </v-container>


            </v-stepper-content>

          </v-stepper-items>

        </v-stepper>

      </v-col>
    </v-row>

    <v-row>
      <v-card-title v-if="dams.length !== 0"> {{dams.length}} Uploaded reference{{dams.length===1?'':'s'}}</v-card-title>
      <v-card-title v-else>No uploaded damages yet!</v-card-title>
    </v-row>

    <v-row justify="center">
      <v-col
          v-for="img in dams.slice().reverse()"
          v-bind:key="img"
          sm="3"
          md="2"
      >
        <v-img
            :src="imgSrc(img)+'/main.png'"
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
import ImageMarker from "@/components/ImageMarker";
import {filesToAPI, fileToAPI} from "@/uploader";
import axios from "axios";

export default {
  name: "DamageTab",
  components: {ImageMarker, SimpleCrop, SimpleUpload},

  data: () => ({
    stepDam: 1,
    file: "",
    cropped: "",
    mask: "",
    dams: [],
    parts: ["eye", "nose", "lip", "chin"],
  }),

  mounted() {
    this.updateDams()
  },

  methods: {
    updateDams: function () {
      axios.get(this.$API_URL+'/listdirs/dam')
        .then((mess) => {
          console.log(mess);
          this.dams = mess.data.dirs;
        });
    },

    uploadHandler: function (data) {
      this.stepDam = 2;
      this.file = data.src;
      console.log(data);
    },

    cropHandler: function (canvas) {
      this.stepDam = 3;
      this.cropped = canvas.toDataURL();
    },

    autoMask: function () {
      this.cvt(this.cropped, "crop.png").then(e => {
        return fileToAPI(this.$API_URL+"/uploader", e, {subdir:"temp"})
      }).then(e => {
        console.log(e);
        return axios(this.$API_URL+"/getmask/"+e.data.src);
      }).then(e=>{
        console.log(e);
        this.$refs.marker.setDataURL(this.$API_URL+"/uploads/"+e.data.src);
      });
    },

    maskHandler: function (which) {
      this.stepDam = 4;
      this.mask = [this.$refs.marker.getDataURL()][which]
      console.log(this.mask);
    },

    imgSrc: function (name) {
      return this.$API_URL+'/uploads/'+name;
    },

    cvt: function (url, name) {
      return fetch(url)
          .then(e=>e.blob())
          .then(e=>new File([e], name));
    },

    finishHandler: function() {
      let cvt = this.cvt;

      let main = this.cropped;
      let mask = this.mask;

      let vals = [cvt(main), cvt(mask)];

      for (const part of this.parts) {
        vals.push(cvt(this.$refs['marker'+part][0].getDataURL()));
      }

      Promise.all(vals).then(files => {
        return files.map((val, ind) => {
          return [["main", "mask", "eye", "nose", "lip", "chin"][ind], val];
        })
      }).then(f => {
        console.log(f);
        return Object.fromEntries(f);
      }).then(files => {
        console.log(files);
        return filesToAPI(
            this.$API_URL+"/uploader/group",
            files
        ).then(mess => {
          console.log(mess);
          this.stepDam = 1;
          this.updateDams();
        })
      });
    }
  }
}
</script>

<style scoped>

</style>