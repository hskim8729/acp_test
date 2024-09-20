import dayjs from "dayjs";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSafeExpertsStore = defineStore("safeExpertsStore", () => {
  // 키값 safeExpert.vue 탭의 value
  const dataDB = {
    safeMngr: [
      {
        id: "1",
        name: "김안전",
        birthDate: "19950522",
        vendrNm: "A 컨설팅",
        crryTelNo: "01011112222",
        certificateNo: "12345678",
        assignedDate: "20240801",
        email: "safe@A.com",
        roleType: "single",
        career: [
          {
            id: 1,
            organization: "abc회사",
            detail: "",
            from: "20240101",
            to: "20240501",
          },
        ],
        education: [
          {
            id: 1,
            organization: "idt 대학",
            detail: "경영학과",
            from: "20200301",
            to: "20230822",
          },
          {
            id: 2,
            organization: "플랜투두 고등학교",
            detail: "인문계",
            from: "20180101",
            to: "20191231",
          },
        ],
      },
    ],
    healthMngr: [
      {
        id: "1",
        name: "박건강",
        birthDate: "19900212",
        vendrNm: "B헬스",
        crryTelNo: "01011112222",
        certificateNo: "12345678",
        assignedDate: "20240401",
        email: "health@B.com",
        roleType: "multi",
        career: [
          {
            id: 1,
            organization: "센트로폴리스 회사",
            detail: "",
            from: "20180101",
            to: "20180101",
          },
        ],
        education: [
          {
            id: 1,
            organization: "idt 대학",
            detail: "보건학과",
            from: "20180101",
            to: "20180101",
          },
          {
            id: 2,
            organization: "종로 고등학교",
            detail: "인문계",
            from: "20180101",
            to: "20180101",
          },
        ],
      },
    ],
    // OHP: Occupational Health Physician
    ohpDoctor: [
      {
        id: "1",
        name: "최의사",
        birthDate: "19760222",
        vendrNm: "B헬스",
        crryTelNo: "01011112222",
        certificateNo: "12345678",
        assignedDate: "20240401",
        email: "doctor@B.com",
        roleType: "multi",
        career: [
          {
            id: 1,
            organization: "시스템 병원",
            detail: "",
            from: "20240101",
            to: "20240501",
          },
        ],
        education: [
          {
            id: 1,
            organization: "idt 대학",
            detail: "의학과",
            from: "20180101",
            to: "20180101",
          },
          {
            id: 2,
            organization: "플랜투두 고등학교",
            detail: "인문계",
            from: "20180101",
            to: "20180101",
          },
        ],
      },
    ],
  };

  /**
   * 전문가 목록
   */
  const selectedExpert = ref(null);
  const expertsList = ref([]);
  const expertDetail = ref(null);

  const getExpertsList = (keyVal) => {
    expertsList.value = dataDB[keyVal];
    selectedExpert.value = null;
  };

  // 새로운 빈 항목을 추가
  const addRow = async (expType) => {
    const empty = getEmpty(expType);
    const list = getListByType(expType);

    if (expType === "expert") {
      selectedExpert.value = empty;
    }
    list.push(empty);
    setListByType(expType, list);

    return empty.id;
  };

  // 선택된 행을 삭제
  const deleteRow = async (selectedRows, expType) => {
    const selectedIndices = new Set(selectedRows.map((row) => row.id));
    const list = getListByType(expType);

    const updatedList = list.filter((data) => !selectedIndices.has(data.id));
    setListByType(expType, updatedList);

    // 선택된 전문가가 삭제되면 선택 값 초기화
    if (expType === "expert" && selectedIndices.has(selectedExpert.value?.id)) {
      selectedExpert.value = null;
    }
  };

  // 행 추가시 임시 id 생성
  function generateUniqueId() {
    return `${dayjs().format("YYYYMMDDHHmmss")}-${Math.floor(
      Math.random() * 1000
    )}`;
  }

  // 빈 객체 반환
  function getEmpty(expType) {
    const newId = generateUniqueId();
    const today = dayjs().format("YYYYMMDD");

    const templates = {
      expert: {
        id: newId,
        name: "",
        birthDate: today,
        vendrNm: "",
        crryTelNo: "",
        certificateNo: "",
        assignedDate: today,
        email: "",
        roleType: "single",
        career: [],
        education: [],
      },
      default: {
        id: newId,
        organization: "",
        detail: "",
        from: today,
        to: today,
      },
    };

    return templates[expType] || templates.default;
  }

  // 공통 함수: 특정 타입에 따라 리스트를 가져옴
  function getListByType(expType) {
    if (expType === "expert") {
      return expertsList.value;
    } else if (expType === "career") {
      return selectedExpert.value.career;
    } else if (expType === "education") {
      return selectedExpert.value.education;
    }
    return [];
  }

  // 공통 함수: 특정 타입에 따라 리스트를 설정함
  function setListByType(expType, newList) {
    if (expType === "expert") {
      expertsList.value = newList;
    } else if (expType === "career") {
      selectedExpert.value.career = newList;
    } else if (expType === "education") {
      selectedExpert.value.education = newList;
    }
  }

  return {
    expertsList,
    selectedExpert,
    expertDetail,
    getExpertsList,
    addRow,
    deleteRow,
  };
});
