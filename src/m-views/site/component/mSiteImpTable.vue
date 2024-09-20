<template>
  <v-table density="compact" class="my-2 border border-e-0 border-s-0">
    <!-- 제목행 -->
    <thead :class="[color ? 'bg-' + color + '_bg' : 'bg-blue-grey-lighten-5']">
      <tr>
        <th
          :class="[isHeaderCenter ? 'text-center' : '']"
          class="border-e-sm text-subtitle-4 text-gray700"
          style="border-bottom: 1px solid #384251"
          width="120px">
          {{ headerTitle }}
        </th>
        <!-- props.color 따라서 text색 변하게 class 줌 -->
        <th
          class="text-subtitle-4"
          :class="[
            color ? 'text-' + color : 'text-gray700',
            isHeaderCenter ? 'text-center' : '',
          ]"
          style="border-bottom: 1px solid #384251">
          {{ headerContent }}
        </th>
      </tr>
    </thead>
    <!-- 바디 -->
    <tbody>
      <tr v-for="data in dataList" :key="data.title + data.content">
        <td class="border-e-sm">
          {{ data.title }}
        </td>
        <td v-if="isEnter">
          <div v-for="strs in data.content.split('\n')" class="d-flex">
            <div>{{ "- " }}</div>
            <div>{{ strs }}</div>
          </div>
        </td>
        <td v-else>{{ data.content }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
const props = defineProps({
  headerTitle: {
    type: String,
    default: "오른쪽 타이틀",
  },
  headerContent: {
    type: String,
    default: "왼쪽 타이틀",
  },
  dataList: {
    type: Array,
    default: [
      { title: "타이틀1", content: "설명1" },
      { title: "타이틀2", content: "설명2" },
    ],
  },
  isHeaderCenter: {
    type: Boolean,
    default: false,
  },
  isEnter: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
td {
  padding: 8px 16px;
}
</style>
