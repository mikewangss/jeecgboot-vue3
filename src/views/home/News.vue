<template>
  <a-list item-layout="vertical" size="large" :data-source="listData">
    <template #renderItem="{ item }">
      <a-list-item key="item.title">
        <template #actions>
          <div> 发布时间： {{ item.updateTime }} </div>
        </template>
        <template #extra>
          <img width="272" alt="logo" :src="`${glob.domainUrl}/sys/common/static/${item.img}`" />
        </template>
        <a-list-item-meta :description="item.description">
          <template #title>
            <a href="#" @click="jumpToHandlePage(item.id)">{{ item.title }}</a>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts">
  import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { getNewsList } from '@/views/home/home.api';
  import { useGlobSetting } from '@/hooks/setting';

  export default defineComponent({
    components: {
      StarOutlined,
      LikeOutlined,
      MessageOutlined,
    },
    setup() {
      const glob = useGlobSetting();
      const listData = ref([]);
      function jumpToHandlePage(id) {
        window.open('/newsDetail?id=' + id, '_blank');
      }
      onMounted(() => {
        // 在组件被挂载后，获取路由参数并调用接口获取数据
        fetchLists();
      });

      const fetchLists = async () => {
        const response = await getNewsList({});
        listData.value = response.records.slice(0, 4);
        console.log(listData.value);
      };
      return {
        listData,
        jumpToHandlePage,
        glob,
      };
    },
  });
</script>
<style scoped>

</style>
