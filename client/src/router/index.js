import Vue from "vue";
import VueRouter from "vue-router";
import CohortRecordings from "../views/CohortRecordings.vue";
import RecordingSummaryForm from "../views/RecordingSummaryForm.vue";

Vue.use(VueRouter);

export const routes = [
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/users/:userId",
    name: "ClassroomManager",
    component: () =>
      import(/* webpackChunkName: "admin" */ "../views/ClassroomManager.vue"),
  },
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
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
