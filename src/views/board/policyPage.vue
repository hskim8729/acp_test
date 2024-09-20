<template>
  <compPage title="운영정책">
    <compPageCard isFillPage>
      <template #subTitle>
        <v-btn-toggle density="compact" v-model="bbsClsCd" rounded="0" group>
          <v-btn
            @click="bbsClsCd = item.bbsClsCd"
            v-for="item in bbsClsList"
            :key="item.bbsClsCd"
            :value="item.bbsClsCd"
            >{{ item.bbsClsNm }}</v-btn
          >
        </v-btn-toggle>
      </template>
      <template #subTitleBody>
        <popBoardWrite
          :bbsClsCd="bbsClsCd"
          :title="title"
          :btnText="title"></popBoardWrite>
      </template>
      <template #default><boardList :bbsClsCd="bbsClsCd" /></template>
    </compPageCard>
  </compPage>
</template>

<script setup>
import { computed, ref } from "vue";

// 컴포넌트
import compPage from "@/components/layout/compPage.vue";
import compPageCard from "@/components/layout/compPageCard.vue";
import boardList from "@/views/board/components/boardList.vue";
import popBoardWrite from "./components/popBoardWrite.vue";

//처음 조회되는 게시판 타입
const bbsClsCd = ref("T2310");
// 게시판 리스트
const bbsClsList = [
  { bbsClsCd: "T2310", bbsClsNm: "이용약관" },
  { bbsClsCd: "T2311", bbsClsNm: "개인정보처리방침" },
];

const title = computed(
  () => bbsClsList.find((item) => item.bbsClsCd === bbsClsCd.value).bbsClsNm
);
</script>

<style lang="scss" scoped></style>
