<template>
  <div class="grid_search_result search_result_popup">
    <div class="table_head">
      <ul>
        <li>대분류</li>
        <li>중분류</li>
        <li>작업명</li>
      </ul>
    </div>
    <div class="table_body">
      <table>
        <tbody>
          <tr
            v-if="searchResult.length"
            v-for="row in highlightedSearchResult"
            @click="onRowClicked(row)"
            :key="row.lgCatCd + row.mdCatCd + row.wrkNmCd">
            <td class="result_td" v-dompurify-html="row.lgCatNm"></td>
            <td class="result_td" v-dompurify-html="row.mdCatNm"></td>
            <td class="result_td" v-dompurify-html="row.wrkNm"></td>
          </tr>
          <tr v-else>
            <td colspan="3">
              "{{ searchedWord }}"에 대한 검색결과가 없습니다.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="bottom_container">
      <button class="popup_close" @click="$emit('closePopup')"></button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const emit = defineEmits(["closePopup", "selectData"]);

const props = defineProps({
  searchedWord: {
    type: String,
    default: "",
  },
  searchResult: {
    type: Array,
    default: () => [],
  },
});

/**
 * searchedWord와 일치하는 텍스트를 하이라이트 처리
 */
const highlightedSearchResult = computed(() => {
  return props.searchResult.map((row) => {
    const regex = new RegExp(props.searchedWord, "gi");
    const highlightStartTag = '<span style="background-color: yellow;">';
    const highlightEndTag = "</span>";

    // replace 메서드를 활용하여 검색된 단어를 특정 HTML 태그로 감쌈
    const highlightedLgCatNm = row.lgCatNm.replace(
      regex,
      (match) => `${highlightStartTag}${match}${highlightEndTag}`
    );
    const highlightedMdCatNm = row.mdCatNm.replace(
      regex,
      (match) => `${highlightStartTag}${match}${highlightEndTag}`
    );
    const highlightedWrkNm = row.wrkNm.replace(
      regex,
      (match) => `${highlightStartTag}${match}${highlightEndTag}`
    );

    return {
      ...row,
      lgCatNm: highlightedLgCatNm,
      mdCatNm: highlightedMdCatNm,
      wrkNm: highlightedWrkNm,
    };
  });
});

/**
 * 검색 결과에서 행 클릭했을 때 emit함수로 원래 컴포넌트에 데이터 보내줌
 */
const onRowClicked = (row) => {
  const selected = {
    lgCatCd: row.lgCatCd,
    mdCatCd: row.mdCatCd,
    wrkNmCd: row.wrkNmCd,
  };
  emit("selectData", selected);
};
</script>

<style scoped>
.search_result_popup {
  z-index: 100;
  position: absolute;
  width: 900px;
  height: auto;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
}
</style>
