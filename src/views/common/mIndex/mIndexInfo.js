import bg1Url from "@/assets/img/mIndex/bg1.png";
import bg10Url from "@/assets/img/mIndex/bg10.png";
import bg2Url from "@/assets/img/mIndex/bg2.png";
import bg3Url from "@/assets/img/mIndex/bg3.png";
import bg4Url from "@/assets/img/mIndex/bg4.png";
import bg5Url from "@/assets/img/mIndex/bg5.png";
import bg6Url from "@/assets/img/mIndex/bg6.png";
import bg7Url from "@/assets/img/mIndex/bg7.png";
import bg8Url from "@/assets/img/mIndex/bg8.png";
import bg9Url from "@/assets/img/mIndex/bg9.png";
import appDownloadBtns from "@/views/common/mIndex/appDownloadBtns.vue";
import mIndexPriceTab from "@/views/common/mIndex/mIndexPriceTab.vue";

const cardInfoList = [
  {
    title:
      "쉽고 간단한 위험성 평가로<br/> 당신의 산업 현장을<br/> 안전하게 보호하세요.",
    titleShadow: true,
    gradientStart: "rgba(217, 229, 252, 1)",
    gradientEnd: "#ffffff",
    detailList: [],
    bgUrl: bg1Url,
    subComponent: appDownloadBtns,
  },
  {
    title: "최소한의 안전보건 자원 투입",
    titleShadow: true,
    gradientStart: "#ffffff",
    gradientEnd: "#ffffff",
    detailList: [
      "여력이 부족하다고 중요한 위험성평가를 포기하거나, <br/> 번거롭고 귀찮은 서류 작업으로 시간을 낭비하지 마세요.",
      "<span class='text-subtitle-6'>꼭 필요한 위험성평가를 계획하고<br/> 시스템이 알려주는 것을 실행만 하면 됩니다.</span>",
    ],
    bgUrl: bg2Url,
  },
  {
    title: "간단한 위험성평가 절차",
    titleShadow: false,
    gradientStart: "#7E6121",
    gradientEnd: "#7E6121",
    detailList: [
      "위험성평가 절차가 너무 복잡하다고요? <br/> <span class='text-subtitle-6 text-gray600'>그 복잡함은 <span class='text-subtitle-6 text-gray900'>Plan2Do</span>가 쉽게 도와드립니다.</span>",
    ],
    bgUrl: bg3Url,
  },
  {
    title: "쉬운 위험성 추정",
    titleShadow: false,
    gradientStart: "rgba(77, 123, 198, 1)",
    gradientEnd: "rgba(77, 123, 198, 0.5)",
    detailList: [
      "새로운 상/중/하 3단계 평가법을 이용하면 어렵지 않습니다. <br/>과거 사례를 통해 AI가 더 쉬운 위험성 추정을 도와드립니다.",
      "<font class='text-caption-3 text-gray400'>* AI 기능은 추후 제공 예정</font>",
    ],
    bgUrl: bg4Url,
  },
  {
    title: "효율적인 위험 감소대책 수립",
    titleShadow: true,
    gradientStart: "#FFFFFF",
    gradientEnd: "#FFFFFF",
    detailList: [
      "<font class='text-white'>AI가 위험요인에 적합한 감소 대책을 추천드립니다. <br />최신 안전보건공단 빅데이터와 Plan2Do 축적 데이터를 <br /> 이용하여 감소대책을 수립할 수 있습니다.</font>",
      "<font class='text-caption-3 text-gray100'>* AI 기능은 추후 제공 예정</font>",
    ],
    bgUrl: bg5Url,
  },
  {
    title: "시각적 현황판을 이용한<br/> 전 현장 관리",
    titleShadow: false,
    gradientStart: "rgba(57, 60, 84, 1)",
    gradientEnd: "rgba(151, 123, 39, 1)",
    detailList: [
      "<font class='text-gray600'>흩어져 있는 현장의 관리가 어려우셨죠?<br/> 회사의 모든 건설 현장의 안전관리 진행상황을<br/> 한 눈에 파악하고 관리할 수 있습니다.</font>",
    ],
    bgUrl: bg6Url,
  },
  {
    title: "협력업체와 위험을 함께 제거",
    titleShadow: true,
    gradientStart: "#ffffff",
    gradientEnd: "#ffffff",
    detailList: [
      "<font class='text-white'>원/하청이 함께 Plan2Do를 사용하여 <br /> 위험성평가를 실시할 수 있습니다. </font>",
      "<font class='text-white'>공정을 담당하는 협력업체가 위험성평가를 직접 실시하여<br />근로자의 안전은 높아지고 원청의 업무 부담은 낮아집니다.</font>",
      "<font class='text-white'>외국인 근로자도 다국어 서비스를 통해 <br />함께 TBM에 참여할 수 있습니다.</font>",
    ],
    bgUrl: bg7Url,
  },
  {
    title: "다양한 단말기를 통해<br/> 언제 어디서든 사용",
    titleShadow: true,
    gradientStart: "#ffffff",
    gradientEnd: "#ffffff",
    detailList: [
      "<font class='text-white'>컴퓨터, 스마트폰/태블릿(안드로이드, IOS) 등 <br/>다양한 장비를 지원합니다. <br/>본사, 현장 사무소, 작업현장, 이동 중 <br/>어디서든 위험 관리가 가능합니다. </font>",
    ],
    bgUrl: bg8Url,
  },
  {
    title: "중대재해 예방은 <br/>근로자 안전 그 이상의 것",
    titleShadow: true,
    gradientStart: "#ffffff",
    gradientEnd: "#ffffff",
    detailList: [
      "<span class='text-white'>회사와 근로자 그리고 우리 가족 모두의 안전입니다. <br/>현장이 안전하면 회사의 생산성도 올라갑니다.</span>",
    ],
    bgUrl: bg9Url,
  },
  {
    title: "부담없는 가격으로 <br/>모두의 안전을 지키세요.",
    titleShadow: false,
    gradientStart: "#111827",
    gradientEnd: "#111827",
    detailList: [],
    bgUrl: bg10Url,
    subComponent: mIndexPriceTab,
    height: "fit-content",
  },
];

export default cardInfoList;
