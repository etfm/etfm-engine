<template>
  <div :class="b()">
    <div :class="e('header')" class="-enter-x">
      <img :src="logo" :class="e('logo')" />
      <div :class="e('appname')">
        {{ appName }}
      </div>
    </div>

    <div :class="e('slogan')">
      <div :class="e('content')">
        <img :alt="appName" :src="loginSloganSvg" class="-enter-x w-2/5" />
        <div :class="e('title')" class="-enter-x">
          {{ title }}
        </div>
        <div :class="e('desc')" class="-enter-x">
          {{ description }}
        </div>
      </div>
    </div>
    <div :class="e('form')">
      <LoginForm class="w-1/2" :login-func="handleLogin" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { loginBgSvg, loginSloganSvg, logoImage } from '@/assets';
  import { useUserStore } from '@/store/user';
  import { useNamespace } from '@etfm/hooks';
  import { computed } from 'vue';
  import LoginForm from './LoginForm.vue';
  import { useMessage } from '@etfm/element-ui';

  defineOptions({
    name: 'LoginPage',
  });

  interface Props {
    /**
     * @description 应用名
     */
    appName?: string;
    /**
     * @description 介绍标题
     */
    title?: string;
    /**
     * @description 描述
     */
    description?: string;
    /**
     * @description logo图片
     */
    logo?: string;
  }

  withDefaults(defineProps<Props>(), {
    logo: logoImage,
    appName: 'vue-etfm-admin',
    title: '开箱即用的中后台管理系统',
    description: '输入您的个人详细信息开始使用！',
  });

  const { b, e } = useNamespace('login');
  const userStore = useUserStore();
  const { notification, createErrorModal } = useMessage();

  async function handleLogin(data) {
    if (!data) return;
    try {
      const userInfo = await userStore.login({
        password: data.password,
        username: data.username,
      });

      if (userInfo) {
        notification.success({
          title: '登陆成功',
          message: `欢迎回来：${userInfo.realName}`,
        });
      }
    } catch (error) {
      createErrorModal({
        title: '错误提示',
        message: (error as unknown as Error).message || '网络异常，请检查您的网络连接是否正常!',
      });
    } finally {
    }
  }

  // TODO: 黑暗模式
  const loginBackagroundImage = computed(() => {
    return `url(${loginBgSvg})`;
  });
</script>

<style lang="scss" module>
  @include b('login') {
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 100%;
    background: #fff;

    @include e('header') {
      position: absolute;
      display: flex;
      align-items: center;
      width: 100%;
      height: 100px;
      padding: 0 100px;
      text-align: left;
      cursor: pointer;
    }

    @include e('logo') {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }

    @include e('appname') {
      margin-left: 8px;
      font-size: 30px;
      color: #fff;
    }

    @include e('slogan') {
      flex: 1;
      height: 100%;
      background-image: v-bind('loginBackagroundImage');
      background-repeat: no-repeat;
      background-position: 100%;
      background-size: auto 100%;
    }

    @include e('content') {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    @include e('title') {
      margin: 50px 0 0;
      font-size: 28px;
      color: #fff;
    }

    @include e('desc') {
      margin-top: 16px;
      font-size: 14px;
      color: #fff;
    }

    @include e('form') {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
    }
  }
</style>
