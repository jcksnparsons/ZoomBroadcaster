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
  },
  directives: {},
  plugins: {
    Notify,
  },
});
