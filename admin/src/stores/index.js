import { createPinia } from "pinia";
import piniaPluginPersist from "pinia-plugin-persist";
// store持久化，缓存到session中
const store = createPinia();
store.use(piniaPluginPersist); // 持久化插件
export default store;