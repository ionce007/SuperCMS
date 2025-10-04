import { ref, computed } from "vue";
import { defineStore } from "pinia";

// export const useCounterStore = defineStore('counter', () => {
//   const count = ref(0)
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }

//   return { count, doubleCount, increment }
// })

export const mainStore = defineStore("main", {
  state() {
    return {
      title: "hello",
      count: 1,
    };
  },

  getters: {
    //类似computed 计算属性
    changeCount() {
      return this.count + 10;
    },
  },
  actions: {
    addCount() {
      this.count + 10;
    },
  },

  persist: {
    enabled: true, //开启
    strategies: [
      {
        key: "store",
        storage: sessionStorage,
        paths: ["count"],
      },
    ],
  },
});
