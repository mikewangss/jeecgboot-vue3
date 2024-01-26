<template>
  <a-list class="demo-loadmore-list" :loading="initLoading" item-layout="horizontal" :data-source="list">
    <template #loadMore>
      <div v-if="!initLoading && !loading" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
<!--        <a-button @click="onLoadMore">loading more</a-button>-->
      </div>
    </template>
    <template #renderItem="{ item }">
      <a-list-item>
        <template #actions>
          <a key="list-loadmore-more">注册报名</a>
        </template>
        <a-skeleton avatar :title="false" :loading="!!item.loading" active>
          <a-list-item-meta :description="item.title">
            <template #title>
              <a href="https://www.antdv.com/">{{ item.content }}</a>
            </template>
            <!--            <template #avatar>-->
            <!--              <a-avatar :src="item.picture.large" />-->
            <!--            </template>-->
          </a-list-item-meta>
          <a-list-item-meta style="text-align: right">
            <template #title>
              <a-tag color="red">{{ item.end_time }}</a-tag>
            </template>
            <!--            <template #avatar>-->
            <!--              <a-avatar :src="item.picture.large" />-->
            <!--            </template>-->
          </a-list-item-meta>
        </a-skeleton>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, nextTick } from 'vue';
  const count = 3;
  const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

  export default defineComponent({
    setup() {
      const initLoading = ref(true);
      const loading = ref(false);
      const data = ref([]);
      const list = ref([
        {
          title: '新建办公楼工程招标',
          content: '本公司计划新建办公楼，现面向有经验的建筑公司招标。欢迎有能力的公司参与，详细信息请参考附件招标文件。',
          end_time: '截止日期：12月15日 17:00',
          user: '王经理',
        },
        {
          title: '园区绿化工程承包',
          content: '为提升公司园区环境，拟进行绿化工程。现诚邀有经验的园林公司参与投标，详细信息请查看招标文件。',
          end_time: '截止日期：12月15日 17:00',
          user: '刘总监',
        },
        {
          title: 'IT系统升级招标',
          content: '公司决定对现有IT系统进行升级，现面向技术团队招标。招标文件已准备就绪，有兴趣的公司请查阅详细信息。',
          end_time: '截止日期：12月15日 17:00',
          user: '王经理',
        },
      ]);
      initLoading.value = false;
      // onMounted(() => {
      //   fetch(fakeDataUrl)
      //     .then((res) => res.json())
      //     .then((res) => {
      //       initLoading.value = false;
      //       data.value = res.results;
      //       list.value = res.results;
      //     });
      // });

      const onLoadMore = () => {
        loading.value = true;
        list.value = data.value.concat([...new Array(count)].map(() => ({ loading: true, name: {}, picture: {} })));
        // fetch(fakeDataUrl)
        //   .then((res) => res.json())
        //   .then((res) => {
        //     const newData = data.value.concat(res.results);
        //     loading.value = false;
        //     data.value = newData;
        //     list.value = newData;
        //     nextTick(() => {
        //       // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        //       // In real scene, you can using public method of react-virtualized:
        //       // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        //       window.dispatchEvent(new Event('resize'));
        //     });
        //   });
      };

      return {
        loading,
        initLoading,
        data,
        list,
        onLoadMore,
      };
    },
  });
</script>
<style scoped>
  .ant-list-split .ant-list-item {
    padding: 16px 24px;
  }

  .demo-loadmore-list {
    min-height: 350px;
  }
</style>
