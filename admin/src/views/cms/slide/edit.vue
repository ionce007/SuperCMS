<template>
  <div class="bg-fff pd-20 radius-6">
    <el-form ref="formRef" :model="params" label-width="84px" class="mt-20">
      <el-form-item
        label="轮播标题"
        :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]"
        prop="title"
      >
        <el-input v-model="params.title"></el-input>
      </el-form-item>

      <el-form-item class="flex" label="轮播图">
        <el-upload
          class="avatar-uploader"
          :http-request="upload"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <el-popover
            placement="top-start"
            title="上传"
            :width="200"
            trigger="hover"
            content="上传图片作为封面图，大小 10M 内"
          >
            <template #reference>
              <el-icon class="avatar-uploader-icon">
                <MostlyCloudy />
              </el-icon>
            </template>
          </el-popover>
        </el-upload>

        <el-popover
          v-if="params.imgUrl"
          placement="right"
          :width="600"
          trigger="hover"
        >
          <template #reference>
            <el-image
              class="avatar-uploader-icon pointer ml-10"
              :src="params.imgUrl"
            />
          </template>
          <el-image style="width: 100%" :src="params.imgUrl" />
        </el-popover>

        <el-input class="ml-10 flex-1" v-model="params.imgUrl"></el-input>
      </el-form-item>

      <el-form-item label="轮播链接">
        <el-input v-model="params.linkUrl"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { update, detail } from '@/api/slide.js';
import { upload as uploadApi } from '@/api/upload.js';

const route = useRoute();
const router = useRouter();
const formRef = ref(null);

// 数据初始化
const params = reactive({
  id: 0,
  title: "",
  imgUrl: "",
  linkUrl: "",
});

// 生命周期钩子
onMounted(async () => {
  params.id = parseInt(route.params.id, 10);
  await fetchDetail();
});

// 获取详情信息
async function fetchDetail() {
  try {
    let res = await detail(params.id);
    const { id, title, imgUrl, linkUrl } = res.data;
    if (res.code === 200) {
      Object.assign(params, { id, title, imgUrl, linkUrl });
    } else {

      // eslint-disable-next-line no-undef
      ElMessage({
        message: res.msg,
        type: "error",
      });
    }
  } catch (error) {
    console.error(error);
  }
}

// 文件上传前检查
function beforeUpload(rawFile) {
  if (rawFile.type.indexOf("image") === -1) {
    // eslint-disable-next-line no-undef
    ElMessage("上传文件只能是图片格式");
    return false;
  }
  if (rawFile.size / 1024 > 10240) {
    // eslint-disable-next-line no-undef
    ElMessage("上传图片必须小于10M");
    return false;
  }
  return true;
}

// 自定义文件上传方法
async function upload(file) {
  const formData = new FormData();
  formData.append("file", file.file);

  try {
    let res = await uploadApi(formData);
    if (res.code === 200) {
      params.imgUrl = res.data.path;
    }
  } catch (error) {
    console.error(error);
  }
}

// 更新轮播信息
async function updateSlide() {
  try {
    let res = await update(params);
    if (res.code == 200) {
      // eslint-disable-next-line no-undef
      ElMessage({
        message: "更新成功^_^",
        type: "success",
      });
      router.go(-1);
    } else {
      // eslint-disable-next-line no-undef
      ElMessage({
        message: res.msg,
        type: "error",
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// 提交表单
function submit() {
  formRef.value.validate((valid) => {
    if (valid) {
      updateSlide();
    } else {
      console.log("error submit!!");
      return false;
    }
  });
}
</script>

<style scoped></style>
