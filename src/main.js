import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowDown,
  faCheckCircle,
  faChevronLeft,
  faChevronRight,
  faCog,
  faMusic,
  faRedoAlt,
  faSave,
  faSearch,
  faTimes,
  faTrash,
  faVideo,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createApp } from "vue";
import store from "./store/store";
import App from "./App.vue";

library.add(
  faVideo,
  faMusic,
  faArrowDown,
  faTrash,
  faCog,
  faCheckCircle,
  faSave,
  faChevronLeft,
  faChevronRight,
  faRedoAlt,
  faSearch,
  faWifi,
  faTimes
);

const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon);

app.use(store);
app.mount("#app");
