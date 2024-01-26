<template>
  <a-layout class="layout">
    <Header />
    <a-layout-content>
      <div :style="{ background: '#fff', padding: '80px', minHeight: '280px' }">
        <a-list item-layout="vertical" :pagination="pagination" size="large" :data-source="listData">
          <template #renderItem="{ item }">
            <a-list-item key="item.title">
              <template #actions>
                <span v-for="{ type, text } in actions" :key="type">
                  <component :is="type" style="margin-right: 8px" />
                  {{ text }}
                </span>
                <div style="padding-left: 60px"
                  ><span> 发布时间： {{ item.updateTime }} </span></div
                >
              </template>

              <template #extra>
                <img width="272" alt="logo" :src="`${glob.domainUrl}/sys/common/static/${item.img}`" />
              </template>
              <a-list-item-meta :description="item.description">
                <template #title>
                  <a @click="jumpToHandlePage(item.id)">{{ item.title }}</a>
                </template>
                <!--          <template #avatar><a-avatar :src="item.avatar" /></template>-->
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list></div
      ></a-layout-content
    >
    <Footer
  /></a-layout>
</template>
<script lang="ts">
  import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import Header from '@/views/home/Header.vue';
  import Footer from '@/views/home/Footer.vue';
  import { getNewsList } from '@/views/home/home.api';
  import { useGlobSetting } from '@/hooks/setting';
  export default defineComponent({
    components: {
      Header,
      Footer,
      StarOutlined,
      LikeOutlined,
      MessageOutlined,
    },
    setup() {
      const glob = useGlobSetting();
      const listData = ref([]);
      const pagination = {
        onChange: (page: number) => {
          console.log(page);
        },
        pageSize: 5,
      };
      function jumpToHandlePage(id) {
        window.open('/newsDetail?id=' + id, '_blank');
        // router.push({
        //   path: '/newsDetail',
        //   query: {
        //     // 传入当前的路由，登录成功后跳转到当前路由
        //     id: id,
        //   },
        // });
      }
      const actions: Record<string, string>[] = [
        { type: 'StarOutlined', text: '156' },
        { type: 'LikeOutlined', text: '156' },
        { type: 'MessageOutlined', text: '2' },
      ];

      onMounted(() => {
        // 在组件被挂载后，获取路由参数并调用接口获取数据
        fetchLists();
      });

      const fetchLists = async () => {
        const response = await getNewsList({});
        listData.value = response.records;
        console.log(listData.value);
      };
      return {
        listData,
        pagination,
        actions,
        jumpToHandlePage,
        glob,
      };
    },
  });
</script>
