<template>
  <a-layout class="layout">
    <Header />
    <a-layout-content style="margin-top: 90px; min-width: 1600px">
      <a-row :gutter="[16, 16]">
        <a-col :span="4" :offset="3">
          <div class="main-left">
            <a-card hoverable :bordered="false">
              <div class="main-nav-group"
                ><h3 class="group-title"
                  ><a href="https://jc.yzw.cn/portal/" target="_blank" style="cursor: pointer; display: flex; align-items: center">集采中心</a></h3
                ><div class="group-links"
                  ><a class="links-item" href="#" title="招标易" target="_blank" style="cursor: pointer">招标平台</a
                  ><a class="links-item" href="#" title="投标易" target="_blank" style="cursor: pointer">投标服务</a
                  ><a class="links-item" href="#" title="合同宝" target="_blank" style="cursor: pointer">造价咨询</a
                  ><a class="links-item" href="#" title="竞价单" target="_blank" style="cursor: pointer">竞价单</a></div
                ></div
              ></a-card
            >
            <a-card hoverable :bordered="false">
              <div class="main-nav-group"
                ><h3 class="group-title"><a href="#" target="_blank" style="cursor: pointer; display: flex; align-items: center">建渠中心</a></h3
                ><div class="group-links"
                  ><a class="links-item" href="#" title="MRO商城" target="_blank" style="cursor: pointer">找工程项目</a
                  ><a class="links-item" href="#" title="厂家直供" target="_blank" style="cursor: pointer">找施工材料</a
                  ><a class="links-item" href="#" title="办公物资" target="_blank" style="cursor: pointer">找施工队</a
                  ><a class="links-item" href="#" title="安防专区" target="_blank" style="cursor: pointer">安防专区</a></div
                ></div
              ></a-card
            ></div
          >
        </a-col>
        <a-col :span="10">
          <a-carousel arrows>
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
            <div class="imgDiv"><img src="/src/assets/images/home/home1.jpg" alt="Promo 2" /></div>
            <div class="imgDiv"><img src="/src/assets/images/home/home2.jpg" alt="Promo 3" /></div>
            <div class="imgDiv"><img src="/src/assets/images/home/home3.jpg" alt="Promo 4" /></div>
          </a-carousel>
        </a-col>
        <a-col :span="4">
          <div class="user-panel">
            <div>
              <a-avatar :size="64" src="/resource/img/avator.png" class="user-avator">
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
              <p class="user-welcome">欢迎来到润巣网</p>
            </div>
            <div class="user-btns">
              <a-button @click="login">登录</a-button>
              <a-button @click="login" type="primary">新用户注册</a-button>
            </div>
          </div>
          <div class="publish-entry-wrap">
            <a-card hoverable :bordered="false" style="padding: 0px">
              <div class="publish-item">
                <div class="icon"><img src="/resource/img/fly.png" alt="" /></div>
                <div class="desc">
                  <div style="font-weight: 500">发布招募需求</div>
                  <div style="margin-top: 2px; color: #7e8288">发布优质资源</div>
                </div>
              </div>
            </a-card>
            <a-card hoverable :bordered="false" style="padding: 5px">
              <div class="publish-item">
                <div class="icon"><img src="/resource/img/fly.png" alt="" /></div>
                <div class="desc">
                  <div style="font-weight: 500">找资源</div>
                  <div style="margin-top: 2px; color: #7e8288">寻找优质供应商资源</div>
                </div>
              </div>
            </a-card>
          </div>
        </a-col>
      </a-row>
      <!--      <a-row>-->
      <!--        <a-col :span="18" :offset="3">-->
      <!--          &lt;!&ndash; 新闻公告列表 &ndash;&gt;-->
      <!--          <div class="section">-->
      <!--            <h2>招标公示</h2>-->
      <!--            <Bids />-->
      <!--          </div>-->
      <!--        </a-col>-->
      <!--        <a-back-top />-->
      <!--      </a-row>-->
      <a-row>
        <a-col :span="18" :offset="3">
          <!-- 新闻公告列表 -->
          <div class="section">
            <h2>行业动态</h2>
            <News />
          </div>
        </a-col>
        <a-back-top />
      </a-row>
    </a-layout-content>
    <Footer />
  </a-layout>
</template>
<script lang="ts">
  import News from './News.vue';
  import Bids from './Bids.vue';

  import Header from '@/views/home/Header.vue';
  import Footer from '@/views/home/Footer.vue';
  import { defineComponent, reactive, toRefs } from 'vue';
  import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
  import type { MenuProps } from 'ant-design-vue';
  import {useGlobSetting} from "@/hooks/setting";
  const globSetting = useGlobSetting();
  const baseUrl = '';
  export default defineComponent({
    components: { LeftCircleOutlined, RightCircleOutlined, Footer, News, Bids, Header },
    setup() {
      const getImgUrl = (i: number) => {
        return `${baseUrl}/src/assets/images/home/home${i + 1}.jpg`;
      };
      const state = reactive({
        selectedKeys: [],
        openKeys: [],
      });
      function login(){
        window.location.href ='/login';
      }
      const handleClick: MenuProps['onClick'] = (menuInfo) => {
        console.log('click ', menuInfo);
      };
      return {
        ...toRefs(state),
        handleClick,
        getImgUrl,
        login,
      };
    },
  });

  function login() {
    throw new Error('Function not implemented.');
}
</script>
<style>
  /* 添加自定义样式 */
  .section {
    margin: 20px 0;
  }
  .imgDiv img {
    height: 463px;
    width: 100%;
    min-width: 760px;
  }
  .main-left {
    height: 463px;
    /*padding: 22px 10px;*/
    border-radius: 4px;
    background-color: #fff;
  }
  .main-left-menu {
    /*width: 256px;*/
  }
  .group-title {
    margin: 0;
    color: #31353b;
    font-size: 16px;
    font-weight: 450;
    line-height: 22px;
  }
  .group-links {
    display: flex;
    flex-wrap: wrap;
  }
  .description-info {
    position: absolute;
    padding: 32px;
    top: 0;
    right: -500px;
    width: 500px;
    height: 280px;
    z-index: 999;
    display: none;
    border-radius: 4px;
    background-color: #ffffffe6;
    border: 1px solid #ffffff;
    box-shadow: 0 4px 12px #0003;
    backdrop-filter: blur(5px);
  }
  .description-info-title {
    font-weight: 500;
    font-size: 24px;
  }
  .description-info-desc {
    width: 303px;
    margin-top: 20px;
    word-break: break-all;
    color: #6c6c6c;
    font-weight: 400;
    font-size: 12px;
    line-height: 24px;
  }
  .main-nav-group {
    padding: 10px 20px;
    margin-bottom: 24px;
    position: relative;
  }
  .main-nav-group .group-links .links-item {
    width: 33%;
    color: #7e8288;
    font-size: 14px;
    margin-top: 12px;
    line-height: 20px;
    text-decoration: none;
  }
  .main-nav-group .group-links .links-item:hover {
    color: #4848ccff;
    font-size: 15px;
  }
  .user-panel {
    height: 264px;
    padding: 50px 12px;
    text-align: center;
    border-radius: 4px;
    background-color: #fff;
    position: relative;
  }
  .publish-item {
    background: #fff;
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 8px 6px;
    margin: 10px 0px;
    cursor: pointer;
  }
  .publish-item:hover {
    color: #4848ccff;
    font-size: 14px;
  }
  .publish-entry-wrap {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    margin: 20px 0px;
    background: #f7f9ff;
    border-radius: 5px;
  }
  .user-btns {
    display: flex;
    padding: 0 30px;
    margin: 12px 0;
    align-items: center;
    justify-content: space-between;
  }
  .user-avator {
    width: 50px;
    height: 50px;
    display: block;
    margin: 0 auto 4px;
    border-radius: 50%;
  }
  .ant-card-body {
    padding: 0px;
  }
  .slick-slider slick-initialized {
    height: 400px;
  }
</style>
<style scoped>
  /* For demo */
  .ant-carousel :deep(.slick-slide) {
    text-align: center;
    height: 463px;
    line-height: 463px;
    background: #364d79;
    overflow: hidden;
  }

  .ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    background-color: rgba(31, 45, 61, 0.11);
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
