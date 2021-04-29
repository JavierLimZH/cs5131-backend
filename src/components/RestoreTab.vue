<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-stepper v-model="stepRes">
          <v-stepper-header>
            <v-stepper-step
                :complete="stepRes > 1"
                :editable="stepRes > 1"
                step="1">
              Choose damaged
            </v-stepper-step>

            <v-divider/>

            <v-stepper-step
                :complete="stepRes > 2"
                :editable="stepRes > 2"
                step="2">
              Choose reference
            </v-stepper-step>
            <v-divider/>

            <v-stepper-step
                :complete="stepRes > 3"
                :editable="stepRes > 3"
                step="3">
              Restore
            </v-stepper-step>

          </v-stepper-header>

          <v-stepper-items>

            <v-stepper-content step="1">
              <h3>Choose which damaged to use</h3>

              <SimplePicker
                  emit-tag="damHandler"
                  @damHandler="damHandler"
                  :choices="dams"
                  :images="dams.map(e=>this.$API_URL+'/uploads/'+e+'/main.png')"
              />

            </v-stepper-content>

            <v-stepper-content step="2">
              <h3>Choose which reference to use</h3>

              <SimplePicker
                  emit-tag="refHandler"
                  @refHandler="refHandler"
                  :choices="refs"
                  :images="refs.map(e=>this.$API_URL+'/uploads/'+e)"
              />

            </v-stepper-content>

            <v-stepper-content step="3">
              <h3>Restored!</h3>

              <v-container>

                <v-row justify="center">
                  <v-col cols="6">
                    <img
                        :src="this.$API_URL+'/uploads/'+outimg"
                        style="height: 100%; width: 100%; object-fit: cover"
                    />
                  </v-col>

                </v-row>

              </v-container>


            </v-stepper-content>

          </v-stepper-items>

        </v-stepper>

      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import SimplePicker from "@/components/SimplePicker";
import axios from "axios";
export default {
  name: "RestoreTab",
  components: {SimplePicker},

  mounted() {
    this.updateDams();
    this.updateRefs();
  },

  data: () => ({
    stepRes: 1,
    dams: [],
    dam: null,
    refs: [],
    ref: null,
    outimg: ""
  }),

  methods: {
    updateDams: function () {
      axios.get(this.$API_URL+'/listdirs/dam')
        .then((mess) => {
          console.log(mess);
          this.dams = mess.data.dirs;
          console.log(this.dams);
        });
    },

    updateRefs: function () {
      axios.get(this.$API_URL+'/listuploads/ref')
          .then((mess) => {
            console.log(mess);
            this.refs = mess.data.files;
          });
    },

    damHandler: function (which) {
      console.log(which);
      this.dam = which;
      this.stepRes = 2;
    },

    refHandler: function(which) {
      console.log(which);
      this.ref = which;
      this.stepRes = 3;



      axios.get(this.$API_URL+'/restore', {
        params: {
          "ref": this.ref,
          "dam": this.dam,
        }
      }).then((mess) => {
          console.log(mess);
          this.outimg = mess.data.src;
        });
    }
  }
}
</script>

<style scoped>

</style>