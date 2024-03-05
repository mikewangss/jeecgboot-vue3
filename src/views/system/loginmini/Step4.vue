<template>
  <div class="step3">
    <a-result status="success" title="感谢您的注册！" sub-title="审核通过后您会收到短信提醒">
      <template #extra>
        <a-button type="primary" @click.prevent="login"> 去登录 </a-button>
        <a-button @click.prevent="goHome"> 返回首页 </a-button>
      </template>
    </a-result>
    <!--    <a-result status="error" title="抱歉~注册失败！" sub-title="请返回重新填写后再次尝试" v-if="!props.result">-->
    <!--      <template #extra>-->
    <!--        <a-button type="primary" @click.prevent="back"> 上一步 </a-button>-->
    <!--      </template>-->
    <!--    </a-result>-->
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
    emits: ['prev'],
    setup(props, { emit }) {
      const router = useRouter();
      const goHome = () => {
        router.push('/home');
      };
      const back = () => {
        emit('prev');
      };
      const login = () => {
        router.push('/login');
      };
      return {
        login,
        back,
        goHome,
        props,
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
