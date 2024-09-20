<!-- 
  COPYRIGHT© ASIANA IDT INC. ALL RIGHTS RESERVED
-->

<template>
  <div class="chat_res_message">
    <div v-if="!tableComplete">
      <div
        v-for="(res, index) in messageContent?.split(splitWord)"
        :key="index">
        <br v-if="index" />
        {{ res }}
        <br v-if="res" />
      </div>
    </div>

    <div v-if="tableComplete">
      <div
        v-for="(res, index) in tableMessageContentUp?.split(splitWord)"
        :key="index">
        <br v-if="index" />
        {{ res }}
        <br v-if="res" />
      </div>
    </div>

    <div :class="`${tableComplete ? 'res_table ' : ''} table_area`" />

    <div v-if="tableComplete">
      <div
        v-for="(res, index) in tableMessageContentDown?.split(splitWord)"
        :key="index">
        <br />
        {{ res }}
        <br v-if="res" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUpdated } from "vue";

const props = defineProps({
  message_content: {
    type: String,
    default: "",
  },
  loading_comment: {
    type: String,
    default: "",
  },
  now_idx: {
    type: Number,
    default: 0,
  },
  res_complete: {
    type: Boolean,
    default: false,
  },
});

/** 전달받은 메시지 내용 */
const messageContent = ref("");

/** 테이블과 같이 있는 내용 */
const tableMessageContentUp = ref("");
const tableMessageContentDown = ref("");

/** 테이블 위치 */
const startTableIndex = ref(-1);
const endTableIndex = ref(-1);

// 줄바꿈용 변수
const splitWord = "<줄바꿈용 문자열입니다>";

/** 테이블 생성 완료 여부 */
const tableComplete = ref(false);

onMounted(() => {
  tableComplete.value = false;
  messageContent.value = textLineBreak(props.message_content);
});

onUpdated(() => {
  messageContent.value = textLineBreak(props.message_content);
  startTableIndex.value = props.message_content.indexOf("```html");
  endTableIndex.value = props.message_content.indexOf(
    "```",
    startTableIndex.value + 1
  );

  // 응답이 완료된 후 Table인 경우 Table 형식 추가
  if (props.res_complete && !tableComplete.value) {
    updateHTML(props.now_idx);
  }
});

/** 줄바꿈용 함수 */
const textLineBreak = (messageContent) => {
  // 로딩문자인 경우 필터링 x
  if (messageContent === props.loading_comment) {
    return messageContent;
  }

  return messageContent
    .replaceAll(".", "." + splitWord)
    .replaceAll("!", "!" + splitWord)
    .replaceAll("?", "?" + splitWord);
};

const tableToJson = (table) => {
  var data = [];
  var headers = [];
  for (var i = 0; i < table.rows[0].cells.length; i++) {
    headers[i] = table.rows[0].cells[i].innerHTML
      .toLowerCase()
      .replace(/ /gi, "");
  }
  for (var i = 1; i < table.rows.length; i++) {
    var tableRow = table.rows[i];
    var rowData = {};
    for (var j = 0; j < tableRow.cells.length; j++) {
      rowData[headers[j]] = tableRow.cells[j].innerHTML;
    }
    data.push(rowData);
  }
  return data;
};

/** 테이블 추가용 함수 */
const tableDt = ref("");
const updateHTML = (now_idx) => {
  if (startTableIndex.value === -1 || endTableIndex.value === -1) {
    return;
  }

  /** 테이블 데이터 */
  const tableData = props.message_content.slice(
    startTableIndex.value + 7,
    endTableIndex.value
  );
  tableDt.value = tableData;

  /** 테이블을 화면에 추가 */
  const controller = document.querySelectorAll(".table_area")[now_idx];
  controller.insertAdjacentHTML("beforeend", tableData);

  /** 테이블 스타일 적용 */
  setTableStyle(controller);

  tableComplete.value = true;

  /** 테이블 부분 문자열 삭제 */
  tableMessageContentUp.value = textLineBreak(
    props.message_content.slice(0, startTableIndex.value)
  );
  tableMessageContentDown.value = textLineBreak(
    props.message_content.slice(endTableIndex.value + 3)
  );

  /** 테이블 to json 예제 */
  const json = tableToJson(controller.children[0]);
  console.log(JSON.stringify(json));
};

const setTableStyle = (tableRef) => {
  const thRef = tableRef.querySelectorAll("th");
  const trRef = tableRef.querySelectorAll("tr");

  const columnStyles = {
    선택: { width: "40px", textAlign: "center" },
    위험요인: { width: "250px", textAlign: "left" },
    예상위험수준: { width: "85px", textAlign: "center" },
    감소대책: { width: "250px", textAlign: "left" },
  };

  const alignIndexes = [];

  const applyStyle = (element, styles) => {
    for (const [key, value] of Object.entries(styles)) {
      element.style[key] = value;
    }
  };

  /** th 스타일 적용 및 인덱스 수집 */
  thRef.forEach((th, index) => {
    const headerText = th.textContent.trim();
    if (columnStyles[headerText]) {
      th.style.width = columnStyles[headerText].width;
      th.style.textAlign = "center";
      alignIndexes.push(index);
    }
  });

  /** td style 설정 */
  trRef.forEach((row) => {
    const cells = row.querySelectorAll("td");
    alignIndexes.forEach((idx) => {
      const headerText = thRef[idx].textContent.trim();
      if (cells[idx] && columnStyles[headerText]) {
        applyStyle(cells[idx], {
          textAlign: columnStyles[headerText].textAlign,
        });
      }
    });
  });
};
</script>
<style scope>
.chat_res_message div {
  user-select: text !important;
}
</style>
