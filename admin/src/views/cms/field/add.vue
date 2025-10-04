<template>
  <div class="bg-fff pd-20 radius-6">
    <el-form
      ref="paramsForm"
      :model="params"
      label-width="100px"
      class="mt-20"
    >
      <el-form-item label="中文名称" prop="cname" :rules="[{ required: true, message: '请输入中文名称', trigger: 'blur' }]">
        <el-input v-model="params.cname" placeholder="请输入字段中文名称"></el-input>
      </el-form-item>

      <el-form-item label="字段名称" prop="ename" :rules="[{ required: true, message: '请输入英文名称', trigger: 'blur' }]">
        <el-input v-model="params.ename" placeholder="请输入英文小驼峰方式，例：bookName"></el-input>
      </el-form-item>

      <el-form-item label="字段类型" :rules="[{ required: true, message: '请选择类型', trigger: 'blur' }]">
        <el-select v-model="params.type" placeholder="请选择">
          <el-option
            v-for="item in fieldTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="字段选项">
        <el-input
          v-model="params.defaultVal"
          :rows="2"
          type="textarea"
          placeholder="单选、多选、下拉框，请填写json格式。"
        ></el-input>
        <p class="f-12 c-999">例如：{"options":[{"label":"本地下载","value":"1"},{"label":"电信下载","value":"2"}]}</p>
      </el-form-item>

      <el-form-item label="默认值">
        <el-input v-model="params.val"></el-input>
      </el-form-item>

      <el-form-item label="排序">
        <el-input v-model="params.orderBy"></el-input>
      </el-form-item>

      <el-form-item label="字段长度">
        <el-input v-model="params.length"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { create } from '@/api/field.js';

const route = useRoute();
const router = useRouter();

const paramsForm = ref(null);
const params = ref({
  mid: '',
  cname: '',
  ename: '',
  type: '',
  val: '',
  defaultVal: '',
  length: '',
  orderBy: '0',
});

const fieldTypeOptions = ref([
  { value: '1', label: '单行文本' },
  { value: '2', label: '多行文本' },
  { value: '3', label: '下拉菜单' },
  { value: '4', label: '单选' },
  { value: '5', label: '多选' },
  { value: '6', label: '时间和日期' },
  { value: '7', label: '数字' },
  { value: '8', label: '多图上传' },
  { value: '9', label: '富文本' },
]);

onMounted(() => {
  const { mid, tableName } = route.query;
  params.value.mid = mid;
  params.value.tableName = tableName;
  // 可以在这里处理其他初始化逻辑
});

const createField = async () => {
  try {
    let res = await create(params.value);
    if (res.code == 200) {
      ElMessage({
        message: '新增成功^_^',
        type: 'success',
      });
      router.go(-1);
    } else {
      ElMessage({
        message: res.msg,
        type: 'error',
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const submit = () => {
  paramsForm.value.validate((valid) => {
    if (valid) {
      createField();
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};
</script>

<style scoped>
.f-12 {
  font-size: 12px;
}
.c-999 {
  color: #999;
}
</style>
