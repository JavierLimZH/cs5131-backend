<template>

  <v-container>

    <v-row justify="center">
      <v-col
          v-for="[i, val] of choices.slice().reverse().entries()"
          v-bind:key="i"
          sm="3"
          md="2"
      >
        <button v-on:click="setChosen(val)">
          <v-img
              :src="images.slice().reverse()[i]"
              class="rounded-lg"
              contain
          />
        </button>
      </v-col>

      <v-card-title v-if="choices.length === 0">
        You have nothing uploaded yet!
      </v-card-title>
    </v-row>

  </v-container>

</template>

<script>
export default {
  name: "SimplePicker",

  data: () => ({
  }),

  props: {
    emitTag: {
      type: String,
      required: true,
    },
    choices: {
      type: Array,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    }
  },

  methods: {
    setChosen: function (item) {
      this.$emit(this.emitTag, item);
    }
  }

}
</script>

<style scoped>

</style>