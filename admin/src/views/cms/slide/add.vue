<template>
  <div class="bg-fff pd-20 radius-6">
    <el-form :model="params" :rules="rules" ref="formRef" label-width="84px" class="mt-20">
      <el-form-item label="轮播标题" prop="title">
        <el-input v-model="params.title"></el-input>
      </el-form-item>

      <el-form-item class="flex" label="轮播图">
        <el-upload class="avatar-uploader" :http-request="handleUpload" :show-file-list="false" :before-upload="beforeUpload">
          <el-popover placement="top-start" title="上传" :width="200" trigger="hover" content="上传图片作为封面图，大小200k内">
            <template #reference>
              <el-icon class="avatar-uploader-icon">
                <MostlyCloudy />
              </el-icon>
            </template>
          </el-popover>
        </el-upload>

        <el-popover v-if="params.imgUrl" placement="right" :width="600" trigger="hover">
          <template #reference>
            <el-image class="avatar-uploader-icon pointer ml-10" :src="params.imgUrl" />
          </template>
          <el-image style="width: 100%" :src="params.imgUrl" />
        </el-popover>

        <el-input class="ml-10 flex-1" v-model="params.imgUrl"></el-input>
      </el-form-item>

      <el-form-item label="轮播链接">
        <el-input v-model="params.linkUrl"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { create } from "@/api/slide.js";
import { upload } from "@/api/upload.js";

const router = useRouter();
const formRef = ref(null);

const rules = {
  title: [
    {
      required: true,
      message: '请输入标题',
      trigger: 'blur',
    },
  ],
};

const params = reactive({
  title: "",
  imgUrl: "",
  linkUrl: "",
});

const beforeUpload = (rawFile) => {
  if (rawFile.type.indexOf("image") === -1) {
    ElMessage("上传文件只能是图片格式");
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 0.2) {
    ElMessage("上传图片必须小于200k");
    return false;
  }
  return true;
};

const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file.file);
  const response = await upload(formData);
  if (response.code === 200) {
    params.imgUrl = response.data.path;
  }
};

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await create(params);
        if (res.code === 200) {
          ElMessage({
            message: "新增成功^_^",
            type: "success",
          });
          router.back();
        } else {
          ElMessage({
            message: res.msg,
            type: "error",
          });
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("error submit!!");
    }
  });
};
</script>

<style scoped>
/* Add any specific styles here */
</style>