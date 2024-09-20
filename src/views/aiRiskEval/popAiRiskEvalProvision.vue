<template>
  <v-dialog persistent min-width="500px" max-width="500px">
    <v-card class="h-80vh ai-main rounded-lg">
      <v-app-bar
        scroll-behavior="elevate"
        app
        dark
        density="compact"
        rounded="lg"
        style="top: 0"
        class="ai-toolbar">
        <v-app-bar-title class="title"> 유의사항 </v-app-bar-title>
        <v-btn icon="mdi-close" variant="text" @click="close" />
      </v-app-bar>
      <div class="page">
        <v-container class="pa-0 h-100">
          <v-list lines="ten" class="provision_list">
            <v-list-item v-for="(item, index) in provisionList" :key="index">
              <v-list-item-title>
                {{ `${index + 1}. ${item.title}` }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ item.content }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-btn color="primary" @click="close" class="close_btn">확인</v-btn>
        </v-container>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { defineEmits, ref } from "vue";
//Design CSS- rim
import "@/assets/scss/page.scss";

const emits = defineEmits(["close"]);
const close = () => {
  emits("close");
};

const provisionTitle = ref("AI 위험성평가 활용 면책 조항");
const provisionList = ref([
  {
    title: "정보 제공 목적",
    content: `본 AI 위험성평가 시스템은 정보 제공 및 지원을 목적으로 설계되었으며, 전문적인 조언(법률, 의료, 금융 등)을 대체하지 않습니다. 사용자는 AI가 제공하는 정보를 참조하되, 최종 결정을 내리기 전에 반드시 관련 분야의 전문가와 상의해야 합니다.`,
  },
  {
    title: "정확성 및 신뢰성",
    content: `AI 위험성평가 시스템은 최신 데이터를 바탕으로 정보를 제공하려고 노력하지만, 모든 정보의 정확성, 완전성 및 신뢰성을 보장하지 않습니다. AI가 제공하는 정보나 예측에 대한 신뢰는 사용자의 책임이며, AI 위험성평가 시스템의 사용으로 인해 발생하는 어떠한 결과에 대해서도 책임을 지지 않습니다.`,
  },
  {
    title: "책임 한계",
    content: `AI 위험성평가 시스템의 사용으로 인한 직접적, 간접적, 부수적, 특수적 또는 결과적 손해에 대해 회사는 책임을 지지 않습니다. 여기에는 정보의 사용 또는 사용 불가능으로 인해 발생한 손해도 포함됩니다.`,
  },
  {
    title: "데이터 및 개인정보 보호",
    content: `AI 위험성평가 시스템은 사용자의 데이터를 처리할 때 개인정보 보호법 및 관련 규정을 준수합니다. 그러나, 사용자 스스로 민감한 개인정보를 입력하지 않도록 주의해야 하며, AI 시스템 사용 시 발생할 수 있는 데이터 유출 등에 대해 회사는 책임을 지지 않습니다.`,
  },
  {
    title: "서비스 변경 및 중단",
    content: `회사는 AI 위험성평가 시스템의 기능, 데이터베이스, 서비스 등을 사전 예고 없이 변경, 중단 또는 중지할 수 있는 권한을 보유합니다. 이러한 변경, 중단 또는 중지로 인해 발생하는 손해에 대해서는 책임을 지지 않습니다.`,
  },
  {
    title: "사용자의 책임",
    content: `사용자는 AI 위험성평가 시스템을 사용할 때 관련 법률 및 규정을 준수해야 하며, AI 시스템을 불법적이거나 부적절한 목적으로 사용하지 않아야 합니다. 사용자의 부적절한 사용으로 인해 발생하는 모든 책임은 사용자에게 있습니다.`,
  },
  {
    title: "제3자 링크",
    content: `AI 위험성평가 시스템이 제공하는 정보에는 제3자 웹사이트 또는 리소스에 대한 링크가 포함될 수 있습니다. 회사는 이러한 외부 사이트나 리소스의 내용, 정확성 또는 이용 가능성에 대해 책임지지 않습니다.`,
  },
]);
</script>

<style scoped></style>
