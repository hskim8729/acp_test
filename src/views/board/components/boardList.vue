<template>
  <comp-ag-grid
    pagination
    :paginationPageSize="props.readOnly ? 5 : 10"
    :columnDefs="props.readOnly ? readOnlyColDefs : colDefs"
    :rowData="bbsList"
    @row-clicked="getBoardDetail" />
</template>

<script setup>
// 라이브러리
import { watch } from "vue";
// 스토어
import { useBbsStore } from "@/stores/board/bbs-store.js";
import { storeToRefs } from "pinia";
// 컴포넌트
import compAgGrid from "@/components/grid/compAgGrid.vue";

/**
 * 게시글 컬럼 정의
 */
const colDefs = [
  {
    headerName: "No",
    field: "rowNum",
    width: 80,
  },
  {
    headerName: "제목",
    field: "ttl",
    flex: 5,
    minWidth: 300,
  },
  {
    headerName: "작성자",
    field: "writeNm",
    flex: 1,
    maxWidth: 200,
  },
  {
    headerName: "작성일",
    field: "regDate",
    flex: 1,
    maxWidth: 200,
  },
  {
    headerName: "첨부파일",
    field: "file",
    width: 100,
  },
  {
    headerName: "조회수",
    field: "inqNum",
    width: 80,
  },
];

const readOnlyColDefs = [
  {
    headerName: "No",
    field: "rowNum",
    width: 80,
  },
  {
    headerName: "제목",
    field: "ttl",
    flex: 5,
    minWidth: 100,
  },
  {
    headerName: "작성일",
    field: "regDate",
    flex: 1,
    maxWidth: 100,
  },
];

/**
 * 게시글 목록 조회하기
 */
const getBbsList = async () => {
  const bbsList = await bbsStore.boardSelectList(props.bbsClsCd);
  if (props.readOnly) {
    await bbsStore.boardDetailSearch(bbsList[0].bbsSeq);
  }
};
const bbsStore = useBbsStore();
const { bbsList, isModalOpen } = storeToRefs(bbsStore);

const props = defineProps({
  bbsClsCd: {
    type: String,
    default: "",
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});
// 게시판 타입 토글해서 바뀌면 게시글 목록 재조회
watch(() => props.bbsClsCd, getBbsList, { immediate: true });

/**
 * 게시글 상세조회 후 팝업열기
 */
const getBoardDetail = async (row) => {
  await bbsStore.boardDetailSearch(row.data.bbsSeq);
  if (!props.readOnly) {
    isModalOpen.value = true;
  }
};
</script>

<style lang="scss" scoped></style>
