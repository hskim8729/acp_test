<template>
  <swiper
    ref="mySwiper"
    :loop="true"
    :autoplay="{ delay: 10000 }"
    navigation
    :pagination="{ clickable: true }"
  >
    <swiper-slide v-for="(item, index) in fromHeadFile" :key="index">
      <div class="banner">
        <img
          :src="
            url +
            '/v1/common/getImage?param1=' +
            item.filePath +
            '&param2=' +
            item.fileNm
          "
        />
      </div>
    </swiper-slide>
    <!-- <swiper-slide>
      <div class="banner">
        <img src="/upload/2306/2023/12/testimg_tomok.jpg" />
      </div>
    </swiper-slide>
    <swiper-slide>
      <div class="banner">
        <img src="/upload/2306/2023/12/무료_elelel(1).jpg" />
      </div>
    </swiper-slide> -->
  </swiper>
</template>

<script setup>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper styles
import "swiper/swiper-bundle.min.css";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";

import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { onMounted, ref, defineProps, inject } from "vue";
SwiperCore.use([Autoplay, Navigation, Pagination]);

const url = import.meta.env.VITE_APP_API_DEV_URL;
const props = defineProps(["fromHeadFile"]);
</script>

<style scoped>
.swiper-container {
  border-radius: 0px 0px 8px 8px;
}
.banner {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 480px;
  margin: 0px auto;
  overflow: hidden;
}
.banner img {
  height: 100%;
}
</style>
