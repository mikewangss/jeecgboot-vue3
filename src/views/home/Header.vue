<template>
  <a-layout-header class="header">
    <a-row>
      <a-col :span="6" class="logo-col"
        ><div class="logo"><img src="/resource/img/logo.png" /><h1>供应商协同平台</h1></div></a-col
      >
      <a-col :span="18">
        <a-row justify="end">
          <a-menu mode="horizontal" theme="light" style="">
            <a-menu-item key="home"> <router-link to="/home">首页</router-link></a-menu-item>
            <a-menu-item key="bids"><router-link to="/newsList">企业招投标信息</router-link></a-menu-item>
            <a-menu-item key="settlement"> <router-link to="/settlement">结算平台</router-link></a-menu-item>
            <a-menu-item key="recruitment"><router-link to="/register">招募入驻</router-link></a-menu-item>
            <a-menu-item key="about"> <router-link to="/about">关于我们</router-link></a-menu-item>
          </a-menu></a-row
        ></a-col
      >
    </a-row>
  </a-layout-header>
</template>

<script lang="ts">
  export default {
    name: 'Header',
  };
</script>

<style scoped>
  .header {
    position: fixed;
    z-index: 1000;
    width: 100%;
    border-bottom: 1px solid #f0f0f0;
  }
  /* 在需要适应小屏幕的情况下添加媒体查询 */
  @media screen and (max-width: 768px) {
    .logo h1 {
      display: none;
    }
  }
  .logo img {
    max-width: 100%;
    height: auto;
    margin-right: 10px; /* 可根据需要调整图标和标题之间的间距 */
  }

  .logo h1 {
    margin: 0;
    font-size: 1.5em; /* 根据需要调整标题的字体大小 */
  }
  .logo-col {
    display: flex;
    align-items: center;
  }
  .ant-layout-header {
    background-color: #fff;
    /*display: flex;*/
    padding: 0 30px;
    font-weight: 700;
  }

  .logo {
    height: 40px;
    line-height: 40px;
    display: flex;
  }
</style>
