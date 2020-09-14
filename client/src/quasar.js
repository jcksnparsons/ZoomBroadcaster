import Vue from "vue";

import "./styles/quasar.scss";
import "@quasar/extras/material-icons/material-icons.css";
import {
  Quasar,
  QLayout,
  QHeader,
  QDrawer,
  QPageContainer,
  QPage,
  QBtn,
  QIcon,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QSplitter,
  QTabPanels,
  QTabPanel,
  QDate,
  QInput,
  QForm,
  Notify,
  QSkeleton,
  QDialog,
  Loading,
} from "quasar";

Vue.use(Quasar, {
  config: {},
  components: {
    QLayout,
    QHeader,
    QDrawer,
    QPageContainer,
    QPage,
    QBtn,
    QIcon,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QSplitter,
    QTabPanels,
    QTabPanel,
    QDate,
    QInput,
    QForm,
    QSkeleton,
    QDialog,
    Loading,
  },
  directives: {},
  plugins: {
    Notify,
    Loading,
  },
});
