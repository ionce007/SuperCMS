<template>
  <div class="bg-fff pd-20 radius-6">
    <el-form ref="paramsForm" :model="params" label-width="84px">
      <el-form-item label="菜单配置">
        <JsonEditorVue
          :debounce="100"
          class="w-full vjs-tree"
          :show-btns="false"
          lang="zh"
          :mode="'text'"
          :expandedOnStart="false"
          v-model="params.content"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit(paramsForm)">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import JsonEditorVue from 'json-editor-vue';
import { find, update } from '@/api/menu.js';

const paramsForm = ref(null);
const params = ref({
  id: 0,
  content: {},
});

// 获取菜单配置
const fetchMenuConfig = async () => {
  try {
    const res = await find();
    if (res.code === 200) {
      const { id, content } = res.data;
      params.value = {
        id,
        content: JSON.parse(content),
      };
    }
  } catch (error) {
    console.error(error);
  }
};

// 更新菜单配置
const updateMenuConfig = async () => {
  try {
    const { id, content } = params.value;
    const paramsData = {
      id,
      content: content,
    };
    const res = await update(paramsData);
    if (res.code === 200) {
      ElMessage({
        message: '更新成功^_^',
        type: 'success',
      });
      location.reload();
    }
  } catch (error) {
    console.log(error);
  }
};


const submit = (paramsForm) => {
  paramsForm.validate((valid) => {
    if (valid) {
      updateMenuConfig();
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};

// 初始化时获取菜单配置
onMounted(async () => {
  await fetchMenuConfig();
});
</script>

<style scoped>
.vjs-tree {
  height: calc(100vh - 200px);
  overflow: auto;
  width: 100%;
}

::v-deep(.jse-menu) {
  display: none !important;
}

::v-deep(.cm-gutters, .cm-gutter-lint) {
  border: none !important;
}


::v-deep(.jse-outer.has-main-menu-bar) {
  margin-top: 0;
  padding-top: 0;
}

::v-deep(.cm-editor .cm-gutters) {
  background-color: #f2f2f2 !important;
}

::v-deep(.jse-text-mode.svelte-a0poeb .jse-contents.svelte-a0poeb) {
  border: none !important;
}

::v-deep(
  .jse-text-mode.svelte-a0poeb
    .jse-contents.svelte-a0poeb
    .cm-editor
    .cm-activeLine,
  .jse-text-mode.svelte-a0poeb
    .jse-contents.svelte-a0poeb
    .cm-editor
    .cm-activeLineGutter
) {
  background-color: #f6f6f6 !important;
}

::v-deep(.ͼ1 .cm-gutter-lint) {
  width: auto;
}

::v-deep(.ͼr) {
  color: #000;
  font-size: 15px;
  font-family: "microsoft yahei";
}

::v-deep(.ͼq) {
  color: #1a85f8;
}

::v-deep(.ͼo) {
  font-size: 15px;
  color: #999;
  font-family: "microsoft yahei";
}

::v-deep(.jse-status-bar.svelte-hhcn0f.svelte-hhcn0f) {
  border: none;
  background-color: #fafafa;
}

::v-deep(.jse-status-bar.svelte-hhcn0f.svelte-hhcn0f:last-child) {
  border: none;
}
</style>
