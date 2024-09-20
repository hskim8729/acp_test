const menuState = {
  menuList: [
    {
      menuId: "5003000",
      link: "/SITE/m-siteImpRegulation",
      menuName: "현장 실시규정 표준",
      preIcon: "",
    },
    {
      menuId: "300000",
      link: "/SAFE_ACTVT/m-toolBoxMeeting",
      menuName: "TBM",
      preIcon: "",
    },
    {
      menuId: "4001000",
      link: "/ADTN_RISK/m-additionalRisk",
      menuName: "추가위험발굴",
      preIcon: "",
    },
    {
      menuId: "3000000",
      link: "",
      menuName: "안전활동",
      childrens: [
        {
          menuId: "3002000",
          link: "/SAFE_ACTVT/m-majorInspectionActivity",
          menuName: "중점점검",
          preIcon: "",
        },
        {
          menuId: "3003000",
          link: "/SAFE_ACTVT/m-majorActionActivity",
          menuName: "중점점검 조치",
          preIcon: "",
        },
        {
          menuId: "3004000",
          link: "/SAFE_ACTVT/m-majorActionApprove",
          menuName: "중점점검 승인",
          preIcon: "",
        },
        {
          menuId: "3006000",
          link: "/SAFE_ACTVT/m-dailyInspectionActivity",
          menuName: "일상점검",
          preIcon: "",
        },
        {
          menuId: "3007000",
          link: "/SAFE_ACTVT/m-dailyActionActivity",
          menuName: "일상점검 조치",
          preIcon: "",
        },
        {
          menuId: "3008000",
          link: "/SAFE_ACTVT/m-dailyActionApprove",
          menuName: "일상점검 승인",
          preIcon: "",
        },
      ],
    },
  ],
  noSiteMenuList: [
    {
      menuId: "helpPage",
      link: "https://plan2do.craft.me/help",
      menuName: "도움말",
      apndIcon: "mdi-open-in-new",
    },
  ],
};

export default menuState;
