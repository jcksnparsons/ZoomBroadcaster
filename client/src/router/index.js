import Vue from "vue";
import VueRouter from "vue-router";
import CohortRecordings from "../views/CohortRecordings.vue";
import RecordingSummaryForm from "../views/RecordingSummaryForm.vue";

Vue.use(VueRouter);

export const routes = [
  {
    path: "/:cohort",
    name: "Recordings",
    component: CohortRecordings,
  },
  {
    path: "/:cohort/recordings/:recording/edit",
    name: "SummaryForm",
    component: RecordingSummaryForm,
  },
  // {
  //   path: "/login",
  //   name: "Login",
  //   component: () =>
  //     import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  // },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
