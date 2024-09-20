<template>
  <div class="errorWrap">
    <h2>페이지를 찾을 수 없습니다.<br />404 Not Found</h2>
    <p>
      페이지가 존재하지 않거나, 사용할 수 없는 페이지입니다.<br />입력하신
      주소가 정확한지 다시한 번 확인해 주시기 바랍니다.
    </p>

    <!-- 버튼 필요 없을 시, 삭제해 주세요 -->
    <!-- <div class="flex mt20">
      <el-button type="info" plain>돌아가기</el-button>
      <el-button class="ml5" type="primary" plain>홈으로가기</el-button>
    </div> -->
  </div>
</template>

<!-- <script setup>
// icon import 후 바로 template에서 사용하기 위한 경우에만 script setup을 사용
import { Search } from '@element-plus/icons-vue';
</script> -->

<script>
export default {
  // 1.Global Awareness
  name: 'NotFoundPage',

  // 3.Components Dependecny
  components: {},

  // 5.Interface
  props: {},
  emits: [],

  // 7.local State(로컬 반응형 속성)
  data() {
    return {
      //
    };
  },

  // 계산된 속성
  computed: {
    // paging 처리
    // page가 바뀔때 해당 페이지 데이터를 표시하는 처리
  },

  // 8.Events(반응형 이벤트에 의해 트리거된 콜백)
  watch: {},

  // Lifecycle Events
  created() {},
  mounted() {},
  unmounted() {},

  // 9.Non-Reactive Properties(반응성 시스템과 무관한 인스턴스 속성)
  methods: {},
};
</script>
