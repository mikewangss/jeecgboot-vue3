<template>
  <a-layout-footer :style="{ textAlign: 'center' }">
    <p>版权信息 © 2023 雨润集团</p>
    <p>联系电话：400123223</p>
    供应商结算平台 ©2023 Created by YuRun Group
  </a-layout-footer>
</template>

<script>
  export default {
    name: 'Footer',
  };
</script>

<style>
  .ant-layout-footer {
    margin-top:30px;
    padding: 24px 50px;
    /*color: rgb(225 233 225 / 85%);*/
    font-size: 14px;
    /*background: #3885cc;*/
  }
</style>
