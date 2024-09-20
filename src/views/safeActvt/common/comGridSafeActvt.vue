<template></template>
<script>
import dayjs from "dayjs";

const defaultColumnSafeActvt = [
  {
    headerName: "공종명",
    field: "contyNm",
    cellStyle: { textAlign: "center" },
    width: 100,
  },
  {
    headerName: "작업명",
    field: "wrkNm",
    cellStyle: { textAlign: "left" },
    width: 300,
  },
  {
    headerName: "위험요인",
    field: "rskFctr",
    cellStyle: { textAlign: "left" },
    width: 400,
  },
  {
    headerName: "감소대책",
    field: "rskMsr",
    cellStyle: { textAlign: "left" },
    width: 400,
    cellRenderer: (params) => {
      return params.value.replaceAll("\n", "<br/>");
    },
  },
  {
    headerName: "작업위치/인원",
    field: "wrkLocPsnNum",
    cellStyle: { textAlign: "center" },
    width: 150,
  },
  {
    headerName: "위험물",
    field: "hrmrskMtr",
    cellStyle: { textAlign: "center" },
    width: 100,
  },
  {
    headerName: "상태",
    field: "inspRstNm",
    cellStyle: { textAlign: "center" },
    width: 100,
  },
  {
    headerName: "결재상태",
    field: "statsNm",
    cellStyle: { textAlign: "center" },
    width: 100,
  },
  {
    headerName: "점검일",
    field: "inspDt",
    cellStyle: { textAlign: "center" },
    width: 120,
    cellRenderer: (params) => {
      const dt = dayjs(params.data.inspDt);
      return dt.isValid() ? dt.format("YYYY-MM-DD") : "";
    },
  },
  {
    headerName: "점검자",
    field: "inspNm",
    cellStyle: { textAlign: "center" },
    width: 120,
  },
];

const defaultColDef = {
  editable: false,
  sortable: true,
  flex: 0,
  minWidth: 50,
  filter: false,
  resizable: false,
  headerClass: "centered",
  cellClass: "centered",
};

const defaultGridOptionSafeActvt = {
  defaultColDef: defaultColDef,
  undoRedoCellEditing: true,
  singleClickEdit: true,
  undoRedoCellEditingLimit: 20,
  stopEditingWhenCellsLoseFocus: true,
  rowSelection: "single",
};

export { defaultColumnSafeActvt, defaultGridOptionSafeActvt };
</script>
