import dayjs from "dayjs";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSafeActionResultStore = defineStore(
  "safeActionResultStore",
  () => {
    // 키값 메뉴아이디
    const dataDB = {
      9001200: [
        {
          id: "1",
          date: "20240801",
          details: "게시판에 붙임",
          note: "3일간 부착",
          files: [
            {
              id: 1,
              fileNm: "부착.png",
              src: "123",
            },
            {
              id: 2,
              fileNm: "회의 사진.jpg",
              src: "1234",
            },
          ],
        },
        {
          id: "2",
          date: "20240802",
          details: "대표님 보고 완료",
          note: "",
          files: [
            {
              id: 1,
              fileNm: "보고서.pdf",
              src: "123",
            },
          ],
        },
        {
          id: "3",
          date: "20240803",
          details: "안전관리 위탁기관 점검 및 조치결과",
          note: "",
          files: [
            {
              id: 1,
              fileNm: "보고서2.pdf",
              src: "123",
            },
          ],
        },
      ],
      9001600: [
        {
          id: "1",
          date: "20240811",
          details: "최초 위험성 평가 보고",
          note: "현장소장 작성",
          files: [
            {
              id: 1,
              fileNm: "보고서_최종.pdf",
              src: "123",
            },
          ],
        },
      ],
      9002250: [
        {
          id: "1",
          date: "20240803",
          details: "재해대응 메뉴얼 24년 하반기 점검",
          note: "",
          files: [
            {
              id: 1,
              fileNm: "보고서_최종.pdf",
              src: "123",
            },
          ],
        },
      ],
      9002400: [
        {
          id: "1",
          date: "20240804",
          details: "안전 업체 A 평가 보고서",
          note: "",
          files: [
            {
              id: 1,
              fileNm: "A 평가 보고서.pdf",
              src: "123",
            },
          ],
        },
        {
          id: "2",
          date: "20240807",
          details: "보건 업체 B 평가 보고서",
          note: "",
          files: [
            {
              id: 1,
              fileNm: "B 평가 보고서.pdf",
              src: "123",
            },
          ],
        },
      ],
      9002600: [
        {
          id: "1",
          date: "20240804",
          details: "A세라믹 평가 보고서",
          note: "",
          files: [
            {
              id: 1,
              fileNm: "A 평가 보고서.pdf",
              src: "123",
            },
          ],
        },
        {
          id: "2",
          date: "20240817",
          details: "B클린 평가 보고서",
          note: "",
          files: [
            {
              id: 1,
              fileNm: "B 평가 보고서.pdf",
              src: "123",
            },
          ],
        },
      ],
    };

    /**
     * 연도별 예산
     */
    const results = ref([]);

    const getResults = async (menuId) => {
      results.value = dataDB[menuId];
    };

    const addRow = async () => {
      const newId = generateUniqueId();
      const today = dayjs().format("YYYYMMDD");
      const empty = {
        id: newId,
        date: today,
        details: "",
        note: "",
        files: [],
      };
      results.value.push(empty);
    };

    const deleteRow = async (seletedRows) => {
      // Set을 사용하여 선택된 행의 id 값을 수집
      const selectedIndices = new Set(seletedRows.map((row) => row.id));
      // filter를 통해 원본 배열에서 선택된 항목을 제거
      results.value = results.value.filter(
        (data) => !selectedIndices.has(data.id)
      );
    };

    // 행 추가시 임시 id 생성
    function generateUniqueId() {
      return `${dayjs().format("YYYYMMDDHHmmss")}-${Math.floor(
        Math.random() * 1000
      )}`;
    }

    return {
      results,
      getResults,
      addRow,
      deleteRow,
    };
  }
);
