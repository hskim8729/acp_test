// import { useSampleStore } from '@/stores/sample/sample-store';
//import { useIncidentStandardStore } from '@/stores/inc/incident-standard-store';

export default [
  // === Incident Management ===
  {
    path: '/inc/not-found',
    name: 'NotFoundPage',
    // component: NotFoundPage,
    component: () =>
      import(
        /* webpackChunkName: 'publish' */ '@/views/common/NotFoundPage.vue'
      ),
    // meta: { auth: true },
    // props: true,
  },
];
