<template>
  <div class="bg-fff pd-20 radius-6">
    <el-form
      ref="formRef"
      :model="params"
      label-width="100px"
      class="mt-20"
    >
      <el-form-item label="中文名称" prop="cname" :rules="cnameRules">
        <el-input v-model="params.cname" placeholder="请输入字段中文名称"></el-input>
      </el-form-item>

      <el-form-item label="字段名称" prop="ename" :rules="enameRules">
        <el-input v-model="params.ename" placeholder="请输入英文小驼峰方式，例：bookName"></el-input>
      </el-form-item>

      <el-form-item label="字段类型" :rules="typeRules">
        <el-select v-model="params.type" placeholder="请选择">
          <el-option
            v-for="item in fieldTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="字段选项">
        <el-input
          v-model="params.defaultVal"
          :rows="2"
          type="textarea"
          placeholder="单选、多选、下拉框，请填写json格式。"
        />
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
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { update, detail } from '@/api/field.js';
import { hasUse } from '@/api/model.js';

const formRef = ref(null);

const params = reactive({
  id: '',
  mid: '',
  tableName: '',
  cname: '',
  ename: '',
  type: '',
  val: '',
  defaultVal: '',
  length: '',
  orderBy: '0',
});

const fieldTypeOptions = [
  { value: '1', label: '单行文本' },
  { value: '2', label: '多行文本 ' },
  { value: '3', label: '下拉菜单' },
  { value: '4', label: '单选' },
  { value: '5', label: '多选 ' },
  { value: '6', label: '时间和日期 ' },
  { value: '7', label: '数字 ' },
  { value: '8', label: '多图上传 ' },
  { value: '9', label: '富文本 ' },
];

const cnameRules = [{ required: true, message: '请输入中文名称', trigger: 'blur' }];
const enameRules = [{ required: true, message: '请输入英文名称', trigger: 'blur' }];
const typeRules = [{ required: true, message: '请选择类型', trigger: 'blur' }];

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const { fid, mid, tableName } = route.query;
  params.id = fid;
  params.mid = mid;
  params.tableName = tableName;

  await fetchDetail();
});

const fetchDetail = async () => {
  try {
    const res = await detail(params.id);
    if (res.code === 200) {
      Object.assign(params, res.data,{old_ename:res.data.ename});
      checkIfUsed(params.mid);
    }
  } catch (error) {
    console.error(error);
  }
};

const checkIfUsed = async (id) => {
  try {
    const res = await hasUse(id);
    if (res?.data?.has?.length > 0) {
      // 这里可以根据实际需求处理 disable 逻辑
      console.log('Field is used');
    } else {
      console.log('Field is not used');
    }
  } catch (error) {
    console.log(error);
  }
};

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await handleUpdate();
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};

const handleUpdate = async () => {
  try {
    const res = await update(params);
    if (res.code === 200) {
      ElMessage({
        message: '更新成功^_^',
        type: 'success',
      });
    } else {
      ElMessage({
        message: res.msg,
        type: 'error',
      });
    }
    router.go(-1);
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
