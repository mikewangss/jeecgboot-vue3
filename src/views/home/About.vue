<template>
  <a-layout class="layout">
    <Header />
    <a-layout-content>
      <div :style="{ background: '#fff', padding: '80px', minHeight: '280px' }">
        <div class="mt-225"> 我们是雨润，很开心为您服务 </div>
      </div></a-layout-content
    >
    <Footer />
  </a-layout>
</template>
<script setup lang="ts">
  import Footer from '@/views/home/Footer.vue';
  import Header from '@/views/home/Header.vue';
</script>
