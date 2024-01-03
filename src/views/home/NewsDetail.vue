<!-- Details.vue -->
<template>
  <Header />
  <a-layout>
    <a-layout-content :style="{ padding: '70px 214px 0' }">
      <div v-if="details" style="background-color: #fff; padding: 0px 34px">
        <h1 class="title">{{ details.title }}</h1>
        <div v-html="details.content"></div>
      </div> </a-layout-content
  ></a-layout>
  <Footer />
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import { getNewsById } from '@/views/home/home.api';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '@/components/Page';
  import Header from '@/views/home/Header.vue';
  import Footer from '@/views/home/Footer.vue';

  export default defineComponent({
    name: 'NewsDetail',
    components: { Footer, Header, PageWrapper },
    setup() {
      const details = ref({});
      const route = useRoute();

      onMounted(() => {
        // 在组件被挂载后，获取路由参数并调用接口获取数据
        fetchDetails();
      });

      const fetchDetails = async () => {
        // 获取路由参数
        const itemId = route.query.id;

        details.value = await getNewsById({ id: itemId });
      };

      return {
        details,
      };
    },
  });
</script>

<style scoped>
  .title {
    text-align: center;
    font-weight: 500;
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }
  /* 可以添加一些组件的样式 */
</style>
