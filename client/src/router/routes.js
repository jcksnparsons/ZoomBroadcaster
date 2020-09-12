import CohortRecordings from "./views/CohortRecordings.vue";

export const routes = [
  {
    path: "/:cohort",
    name: "Recordings",
    component: CohortRecordings,
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
];
