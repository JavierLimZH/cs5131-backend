<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <v-slider
            style="min-width: 300px"
            class="mt-4"
            v-model="angle"
            label="Angle"
            :max="180"
            :min="-180"
        ></v-slider>

        <clipper-basic
            ref="clipper"
            :ratio="1"
            :rotate="angle"
            :src="src"/>
      </v-col>
    </v-row>
    <v-row justify="center" class="ma-0">
      <v-col cols="5">
        <v-btn color="success" block v-on:click="finishHandler">
          Finish
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "SimpleCrop",

  data: () => ({
    angle: 0
  }),

  props: {
    emitTag: {
      type: String,
      default: "crop_finish"
    },
    src: {
      type: String,
      required: true
    },
    outSize: {
      type: Array,
    },
  },

  methods: {
    finishHandler: function () {
      let canvas = this.$refs.clipper.clip();
      if (this.outSize) {
        canvas = this.resize(canvas, this.outSize);
      }
      this.angle = 0;
      this.$emit(this.emitTag, canvas)
    },
    resize: function (canvas, outSize) {
      let canvasR = document.createElement("canvas");
      canvasR.width = outSize[0];
      canvasR.height = outSize[1];
      canvasR.getContext("2d").drawImage(canvas, 0,0,outSize[0],outSize[1]);
      return canvasR;
    },
  }
}
</script>

<style scoped>

</style>