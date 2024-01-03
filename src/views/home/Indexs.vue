<template>
  <Header />
  <a-layout-content>
    <a-layout>
      <a-layout-content :style="{ padding: '0 30px', 'margin-top': '70px' }">
        <!-- 在这里添加其他页面内容 -->
        <!-- 根据选择的菜单项显示不同的内容 -->
        <div v-if="selectedMenuItem === 'home'">
          <Home />
        </div>
        <div class="sectionContent" v-if="selectedMenuItem === 'bids'">
          <Bids />
          >
        </div>
        <div v-if="selectedMenuItem === 'recruitment'">
          <Register />
        </div>
        <div v-if="selectedMenuItem === 'about'">
          <About />
        </div>
        <div v-if="selectedMenuItem === 'about'">
          <About />
        </div> </a-layout-content></a-layout
  ></a-layout-content>
  <Footer />
</template>

<script lang="ts">
  import Home from './Home.vue';
  import Footer from './Footer.vue';
  import Header from './Header.vue';
  import Register from '../system/loginmini/Register.vue';
  import About from './About.vue';
  import Bids from './Bids.vue';
  import { defineComponent, ref, reactive, toRefs } from 'vue';
  export default defineComponent({
    name: 'FormStepPage',
    components: {
      Home,
      About,
      Footer,
      Header,
      Bids,
      Register,
    },
    setup() {
      const onCollapse = (collapsed: boolean, type: string) => {
        console.log(collapsed, type);
      };

      const onBreakpoint = (broken: boolean) => {
        console.log(broken);
      };

      const selectedMenuItem = ref('home');
      const handleMenuClick = (info) => {
        // 更新选中的菜单项
        selectedMenuItem.value = info.key;
      };
      return {
        selectedMenuItem,
        handleMenuClick,
        selectedKeys: ref<string[]>(['4']),
        onCollapse,
        onBreakpoint,
      };
    },
  });
</script>

<style scoped>
  [data-theme='dark'] .site-layout-sub-header-background {
    background: #141414;
  }

  .site-layout .site-layout-background {
    background: #fff;
  }

  [data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
  }

  .sectionContent {
    padding: 0 50px;
  }
</style>
