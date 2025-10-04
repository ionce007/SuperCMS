<template>
  <div class="flex login-background">

    <div class="login-wrap flex justify-center items-center flex-col flex-1">
      <div class="login flex flex-col justify-center items-center /*w-full*/ pl-400">
        <IconLogo class="icon"></IconLogo>
        <h1>SuperCMS</h1>
        <el-form class="mt-20 login-form"
        :model="form"
        ref="formRef"
        label-width="70px"
          @keyup.enter="login">
          <el-form-item label="用户名" prop="username" label-position="left" :rules="[
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur',
            },
          ]">
            <el-input v-model="form.username" placeholder='请输入用户名' prefix-icon='User'></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" label-position="left" :rules="[
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur',
            },
          ]">
            <el-input type="password" v-model="form.password" placeholder='请输入密码' prefix-icon='Lock'
              show-password></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="w-full" type="primary" size="large" @click="login">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <footer class="w-full overflow-h">
        <p class="f-13 text-c mt-10">
          Copyright &copy; 2018 ~ <span id="curYear"></span>
          <a href="https://cms.foryet.com" class="mr-5 ml-10" target="_blank" title="SuperCMS">SuperCMS</a>
          ● 位于广州 服务全国
        </p>
      </footer>
    </div>
  </div>
  <Vcode :imgs="imgs" :show="isShow" @success="onSuccess" @fail="onFail" />

</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Vcode from "vue3-puzzle-vcode";
import { userStore } from "@/stores/user";
import IconLogo from "@/components/icons/IconLogo.vue";
import { create, getIp, del } from "@/api/login_log.js";
import { setCookie } from '@/utils/tool';
import Login from '@/api/Login';

const router = useRouter();
const route = useRoute();
const user = userStore();
const form = reactive({ username: "", password: "" });
const isShow = ref(false);
const position = reactive({
  ip: '',
  country: '',
  prov: "",
  city: '',
  district: '',
  isp: '',
  lat: '',
  lng: ''
});
const imgs = [
  "/public/cover/sea/01.png",
  "/public/cover/sea/02.png",
  "/public/cover/sea/03.png",
  "/public/cover/sea/04.png",
  "/public/cover/sea/05.png",
  "/public/cover/sea/06.png",
  "/public/cover/sea/07.png",
];
const formRef = ref(null);

const onSuccess = () => {
  toLogin();
};

const onFail = (e) => {
  console.log(e);
};

const login = async () => {
  formRef.value.validate((valid) => {
    if (valid) {
      isShow.value = true;
    } else {
      return false;
    }
  });
};

const toLogin = async () => {
  const { username, password } = form;
  const res = await Login.toLogin({ username, password });
  if (res.code === 200) {
    user.setToken(res.data.token);
    await getUserInfo();
    await del();
    await create(position);
    // eslint-disable-next-line no-undef
    ElNotification({
      title: "提示",
      message: "登录成功",
      duration: 900,
      type: "success",
    });
    router.push(route.query.redirect || "/");
  } else if (res.code === 201) {
    // eslint-disable-next-line no-undef
    ElNotification({
      title: "提示",
      message: "登录失败",
      type: "error",
    });
    isShow.value = false;
  }
};

const getIpData = async () => {
  try {
    let res = await getIp();
    if (res.code === 'Success') {
      const { country, prov, district, city, isp, lat, lng } = res.data;

      Object.assign(position, {
        ip: res.ip || 'localhost',
        country,
        prov,
        city,
        district,
        isp,
        lat,
        lng
      });

      setCookie('ip', res.ip);
      setCookie('city', city);
    }
  } catch (error) {
    console.log(error);
  }
};

const getUserInfo = async () => {
  try {
    const res = await Login.userInfo();
    if (res.code === 200) {
      let data = res.data;
      user.setUserInfo(data);
      user.setRole(data.value);
      user.getMenuList();
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  document.getElementById('curYear').innerHTML = new Date().getFullYear();
  getIpData();
});
</script>

<style lang="less" scoped>
.login-bg {
  background-image: linear-gradient(300deg, #778cca, #65de83);
  height: 100vh;
  border-right: 10px solid #efeffe;
  width: 360px;
}
.login-background{
  background: url('/src/assets/img/login-background.jpg') no-repeat;
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100vh;
}
.pl-400{padding-left:400px;}
.icon {
  width: 82px;
  height: 82px;
  padding: 4px;
  margin-right: 5px;
}
w-400{}
.login-wrap {
  width: calc(100vw - 360px);

  .login {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 130px);
    margin-bottom: 70px;

    .title {
      font-size: 36px;
      margin-bottom: 20px;
      color: #fff;
      text-align: center;
      font-weight: lighter;
    }

    .login-form {
      width: 400px;
    }
  }
}

.sends {
  height: calc(100vh - 120px);
}

.love {
  letter-spacing: 3px;
}


// .captcha {
//   height: 32px;
//   width: 100px;

//   svg {
//     width: 100%;
//   }
// }

@media screen and (max-width: 768px) {
  .login-bg {
    display: none;
  }
}
</style>
