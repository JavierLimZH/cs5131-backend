<template>

  <v-container>
    <v-row justify="center">
      <v-card class="ma-2" style="position: relative">

        <v-card-text>

          <v-slider
              v-if="varthickness"
              class="ma-0"
              v-model="thickness"
              label="Thickness"
              :max="30"
              :min="1"
          >
            <template v-slot:append>
              <h4>{{thickness}}</h4>
            </template>
          </v-slider>

          <div :style="'position: relative; width: ' + this.width + 'px; height: ' + this.height + 'px'">
            <v-img
                :src="src"
                style="position: absolute; height: 100%; width: 100%; object-fit: cover"
            />
            <canvas
                :ref="markerId"
                :height="256"
                :width="256"
                style="position: absolute; z-index: 2"
            />
          </div>
        </v-card-text>

        <v-card-actions class="mx-2 mb-2">
          <v-btn block color="error" v-on:click="clear">Clear</v-btn>
        </v-card-actions>

      </v-card>
    </v-row>
  </v-container>

</template>

<script>

export default {
name: "ImageMarker",

  props: {
    markerId: {
      type: String,
      required: true
    },
    src: {
      type: String,
      required: true,
    },
    thickness: {
      type: Number,
      default: 2
    },
    height: {
      type: Number,
      default: 256,
    },
    width: {
      type: Number,
      default: 256  ,
    },
    varthickness: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    clear () {
      const canvas = this.$refs[this.markerId];
      const ctx = canvas.getContext('2d');
      let c_width = 256;
      let c_height = 256;
      ctx.clearRect(0, 0, c_width, c_height);
    },

    getDataURL() {
      const canvas = this.$refs[this.markerId];
      return canvas.toDataURL();
    },

    setDataURL(src) {
      const canvas = this.$refs[this.markerId];
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0,0,this.width, this.height);
      fetch(src)
      .then(e=>e.blob())
      .then(e=>URL.createObjectURL(e))
      .then(e=> {
        let img = new Image();
        img.src = e;
        img.onload = () => {
          ctx.scale(0.5, 0.5);
          ctx.drawImage(img, 0, 0, this.width, this.height);
          ctx.scale(2, 2);
        }
      });
    }
  },

  mounted() {
    // eslint-disable-next-line no-unused-vars

    let _this = this;

    let isDrawing = false;
    let x = 0;
    let y = 0;

    console.log(this.$refs);

    let canvas = this.$refs[this.markerId];
    let ctx = canvas.getContext("2d");
    ctx.scale(2, 2);

    canvas.addEventListener('mousedown', e => {
      x = e.offsetX/2;
      y = e.offsetY/2;
      isDrawing = true;
    });

    canvas.addEventListener('mousemove', e => {
      if (isDrawing === true) {
        drawLine(ctx, x, y, e.offsetX/2, e.offsetY/2);
        x = e.offsetX/2;
        y = e.offsetY/2;
      }
    });

    window.addEventListener('mouseup', e => {
      if (isDrawing === true) {
        drawLine(ctx, x, y, e.offsetX/2, e.offsetY/2);
        x = 0;
        y = 0;
        isDrawing = false;
      }
    });

    function drawLine(context, x1, y1, x2, y2) {
      context.beginPath();
      context.strokeStyle = '#00FF00';
      context.fillStyle = '#00FF00';
      context.lineCap = 'round';
      context.lineJoin = 'round';

      context.lineWidth = _this.thickness;
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
      context.closePath();
    }

  }
}
</script>

<style scoped>

</style>