<template>
  <Header />
  <a-layout>
    <a-layout-content :style="{ padding: '70px 150px 0 150px' }">
      <!-- 跑马灯 -->
      <a-carousel :autoplay="true" :dots="true" arrows>
        <template #prevArrow>
          <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
            <left-circle-outlined />
          </div>
        </template>
        <template #nextArrow>
          <div class="custom-slick-arrow" style="right: 10px">
            <right-circle-outlined />
          </div>
        </template>
        <div class="imgDiv"><img src="/src/assets/images/home/home0.jpg" alt="Promo 1" /></div>
        <div class="imgDiv"><img src="/src/assets/images/home/home1.jpg" alt="Promo 2" /></div>
        <div class="imgDiv"><img src="/src/assets/images/home/home2.jpg" alt="Promo 3" /></div>
        <div class="imgDiv"><img src="/src/assets/images/home/home3.jpg" alt="Promo 4" /></div>
        <!-- 添加更多宣传图片 -->
      </a-carousel>
      <a-layout style="padding: 24px 0; background: #fff">
        <a-layout-sider width="40%" style="background: #fff; min-height: 280px; margin: 20px 30px">
          <!-- 新闻公告列表 -->
          <div class="section">
            <h2>招标公示</h2>
            <Bids />
          </div>
        </a-layout-sider>
        <a-divider type="vertical" />
        <a-layout-content :style="{ minHeight: '280px', margin: '20px 20px' }">
          <!-- 新闻公告列表 -->
          <div class="section">
            <h2>行业动态</h2>
            <News />
          </div> </a-layout-content></a-layout></a-layout-content
  ></a-layout>
  <Footer />
</template>
<script lang="ts">
  import News from './News.vue';
  import Bids from './Bids.vue';
  import { Carousel } from 'ant-design-vue';
  import Header from '@/views/home/Header.vue';
  import Footer from '@/views/home/Footer.vue';
  export default {
    components: { Footer, Header, News, Bids, Carousel },
  };
</script>

<style scoped>
  /* 添加自定义样式 */
  .section {
    margin: 20px 0;
  }

  .imgDiv {
    width: 100%; /* 图片宽度占满父容器 */
    height: 340px;
  }

  .ant-carousel :deep(.slick-slide) {
    text-align: center;
    height: 100%;
    background: #364d79;
    overflow: hidden;
  }

  .ant-carousel .slick-slide img {
    height: 100%;
    width: 100%; /* 图片宽度占满父容器 */
    object-fit: fill;
  }

  .ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    background-color: rgba(51, 98, 152, 0.11);
    opacity: 0.3;
    z-index: 1;
  }

  .ant-carousel :deep(.custom-slick-arrow:before) {
    display: none;
  }

  .ant-carousel :deep(.custom-slick-arrow:hover) {
    opacity: 0.5;
  }

  .ant-carousel :deep(.slick-slide h3) {
    color: #fff;
  }
</style>
