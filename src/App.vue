<template>
  <v-app>
    <v-app-bar dark color="primary" app>
      
      <v-tabs centered  fixed-tabs icons-and-text v-model="page">
        <v-tab>Damaged Images <v-icon>mdi-image-broken-variant</v-icon></v-tab>
        <v-tab>Reference Images <v-icon>mdi-face-recognition</v-icon></v-tab>
        <v-tab>Restoration <v-icon>mdi-star-face</v-icon></v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="10">

          <v-tabs-items v-model="page">
            <v-tab-item
                v-for="item of items"
                :key="item"
            >
              <component :is="item"/>

            </v-tab-item>
          </v-tabs-items>

          </v-col>
        </v-row>
      </v-container>
    </v-main>


  </v-app>
</template>

<script>

import SimpleUpload from "@/components/SimpleUpload";
import DamageTab from "@/components/DamageTab";
import ReferenceTab from "@/components/ReferenceTab";
import RestoreTab from "@/components/RestoreTab";
import ImageMarker from "@/components/ImageMarker";

export default {
  name: 'App',

  components: {
    ImageMarker,
    RestoreTab,
    ReferenceTab,
    DamageTab,
    SimpleUpload
  },

  mounted() {
    document.title = "Restore"
  },

  data: () => ({
    page: 0,
    items: ["DamageTab", "ReferenceTab", "RestoreTab"],
    names: ["Damaged", "References", "Restoration"],
    stepper:0,
  }),
};
</script>

