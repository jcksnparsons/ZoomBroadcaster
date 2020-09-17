import Vue from "vue";
import VueRouter from "vue-router";
import CohortRecordings from "../views/CohortRecordings.vue";
import RecordingSummaryForm from "../views/RecordingSummaryForm.vue";
import NotFound from "../views/NotFound.vue";
import { auth, usersCollection } from "../firebase";

Vue.use(VueRouter);

export const routes = [
  {
    path: "/404",
    name: "NotFound",
    component: NotFound,
  },
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
    beforeEnter: verifyAuthorizedUser,
  },
  {
    path: "/approval_request",
    name: "ApprovalRequest",
    component: () =>
      import(/* webpackChunkName: "admin" */ "../views/ApprovalRequest.vue"),
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
    beforeEnter: verifyAuthorizedUser,
  },
  {
    path: "/",
    name: "Home",
    beforeEnter: (to, from, next) => {
      if (auth.currentUser) {
        next({ path: `/users/${auth.currentUser.uid}` });
      } else {
        next({ path: "/404" });
      }
    },
  },
];

const verifyAuthorizedUser = async (_to, _from, next) => {
  if (!auth.currentUser) {
    next({ path: "/404" });
    return;
  }
  const userId = auth.currentUser.uid;
  const userSnap = await usersCollection.doc(userId).get();
  const user = await userSnap.data();

  if (user.isApproved) {
    next();
  } else {
    next({ path: "/404" });
  }
};

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
