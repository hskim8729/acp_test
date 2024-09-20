import dayjs from "dayjs";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useSafeBudgetStore = defineStore("safeBudgetStore", () => {
  const detailDB = {
    "012-321": [
      {
        budgetItemId: 0,
        budgetItemNm: "헬멧",
        price: 10000,
        files: [
          {
            id: 1,
            fileNm: "헬멧-1.pdf",
            src: "123",
          },
        ],
      },
      {
        budgetItemId: 1,
        budgetItemNm: "벨트",
        price: 50000,
        files: [
          {
            id: 1,
            fileNm: "벨트-1.pdf",
            src: "123",
          },
          {
            id: 2,
            fileNm: "벨트2-1.pdf",
            src: "1234",
          },
          {
            id: 3,
            fileNm: "벨트3-1.pdf",
            src: "123",
          },
          {
            id: 4,
            fileNm: "벨트4-1.pdf",
            src: "1234",
          },
          {
            id: 5,
            fileNm: "벨트5-1.pdf",
            src: "123",
          },
          {
            id: 6,
            fileNm: "벨트6-1.pdf",
            src: "1234",
          },
          {
            id: 7,
            fileNm: "벨트7-1.pdf",
            src: "123",
          },
          {
            id: 8,
            fileNm: "벨트8-1.pdf",
            src: "1234",
          },
        ],
      },
    ],
    "1212-123": [
      {
        budgetItemId: 0,
        budgetItemNm: "abc 업체 비용 지불",
        price: 2000,
        files: [
          {
            id: 1,
            fileNm: "지불1.pdf",
            src: "123",
          },
          {
            id: 2,
            fileNm: "지불-2.pdf",
            src: "1234",
          },
        ],
      },
      {
        budgetItemId: 1,
        budgetItemNm: "d 용역 비용 지불",
        price: 50000,
        files: [],
      },
    ],
  };

  /**
   * 연도별 예산
   */
  const budgets = ref([]);
  let budgetGridApi;
  function getBudgetGridApi(api) {
    budgetGridApi = api;
  }

  const getBudgets = async () => {
    budgets.value = [
      {
        budgetCtgryId: "012-321",
        budgetCtgryNm: "안전보호구",
        allocatedBudget: 100000,
        executedBudget: 60000,
      },
      {
        budgetCtgryId: "1212-123",
        budgetCtgryNm: "시설정비",
        allocatedBudget: 80000,
        executedBudget: 52000,
      },
    ];
  };

  const addBudgetRow = async () => {
    const newId = generateUniqueId();
    const empty = {
      budgetCtgryId: newId,
      budgetCtgryNm: "",
      allocatedBudget: 0,
      executedBudget: 0,
    };
    detailDB[newId] = [];
    budgets.value.push(empty);
  };

  const updateExecutedBudget = async (result) => {
    // 배열을 순회하면서 조건에 맞는 객체를 찾아 executedBudget을 업데이트
    for (let i = 0; i < budgets.value.length; i++) {
      if (budgets.value[i].budgetCtgryId === selectedBudgetId.value) {
        const sum = budgets.value[i].executedBudget + result;
        const updateItem = {
          ...budgets.value[i],
          executedBudget: sum,
        };
        budgets.value[i] = updateItem; // executedBudget 업데이트

        const node = budgetGridApi.getRowNode(selectedBudgetId.value);
        node.updateData(updateItem); // 그리드 값 업데이트
        break; // 변경 후 루프 종료
      }
    }
  };

  const deleteBudgetRow = async (seletedRows) => {
    // Set을 사용하여 선택된 행의 id 값을 수집
    const selectedIndices = new Set(
      seletedRows.map((row) => row.budgetCtgryId)
    );
    // filter를 통해 원본 배열에서 선택된 항목을 제거
    budgets.value = budgets.value.filter(
      (data) => !selectedIndices.has(data.budgetCtgryId)
    );

    // 선택상태 행 삭제되면 선택 값도 null로 초기화
    if (selectedIndices.has(selectedBudgetId.value)) {
      selectedBudgetId.value = null;
    }
  };

  /**
   * 예산 집행 내역
   */
  const selectedBudgetId = ref(null); // 선택된 예산 항목 아이디
  const budgetsDetails = ref([]);

  const getBudgetDetails = async (budgetCtgryId) => {
    budgetsDetails.value = detailDB[budgetCtgryId];
  };

  // 선택된 예산 항목이 변하면 budgetDetail 교체
  watch(selectedBudgetId, (newVal) => {
    getBudgetDetails(newVal);
  });

  const addBudgetDetailRow = async () => {
    if (selectedBudgetId === null) {
      console.log("selectedBudgetId 이 null 입니다");
    }
    const empty = {
      budgetItemId: generateUniqueId(),
      budgetItemNm: "",
      price: 0,
      files: [],
    };
    budgetsDetails.value.push(empty);
    detailDB[selectedBudgetId] = budgetsDetails.value;
  };

  const deleteBudgetDetailRow = async (seletedRows) => {
    if (selectedBudgetId === null) {
      console.log("selectedBudgetId 이 null 입니다");
    }

    // 선택된 행의 가격을 모두 더하기
    const sum = seletedRows.reduce((acc, row) => acc + row.price, 0);
    // Set을 사용하여 선택된 행의 id 값을 수집
    const selectedIndices = new Set(seletedRows.map((row) => row.budgetItemId));
    // filter를 통해 원본 배열에서 선택된 항목을 제거
    budgetsDetails.value = budgetsDetails.value.filter(
      (data) => !selectedIndices.has(data.budgetItemId)
    );
    detailDB[selectedBudgetId] = budgetsDetails.value;
    await updateExecutedBudget(-sum);
  };

  // 행 추가시 임시 id 생성
  function generateUniqueId() {
    return `${dayjs().format("YYYYMMDDHHmmss")}-${Math.floor(
      Math.random() * 1000
    )}`;
  }

  return {
    budgets,
    getBudgetGridApi,
    getBudgets,
    addBudgetRow,
    updateExecutedBudget,
    deleteBudgetRow,
    selectedBudgetId,
    budgetsDetails,
    getBudgetDetails,
    addBudgetDetailRow,
    deleteBudgetDetailRow,
  };
});
