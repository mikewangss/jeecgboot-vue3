<template>
  <div class="step3">
    <a-result status="success" title="感谢您的注册！" sub-title="审核通过后您会收到短信提醒">
      <template #extra>
        <a-button type="primary" @click="login"> 去登录 </a-button>
        <a-button @click="back"> 返回首页 </a-button>
      </template>
    </a-result>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Result, Descriptions } from 'ant-design-vue';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    components: {
      [Result.name]: Result,
      [Descriptions.name]: Descriptions,
      [Descriptions.Item.name]: Descriptions.Item,
    },
    emits: ['redo'],
    setup(_, { emit }) {
      const router = useRouter();
      const back = () => {
        router.push('/');
      };
      const login = () => {
        router.push('/login');
      };
      return {
        login,
        back,
      };
    },
  });
</script>
<style lang="less" scoped>
  .step3 {
    width: 600px;
    margin: 0 auto;
  }

  .desc-wrap {
    padding: 24px 40px;
    margin-top: 24px;
    background-color: @background-color-light;
  }
</style>
