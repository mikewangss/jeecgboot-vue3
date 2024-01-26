<template>
  <div class="step3">
    <a-result status="success" title="恭喜您~申报成功！" sub-title="审核通过后您会收到短信提醒" v-if="props.result">
      <template #extra>
        <a-button type="primary" @click.prevent="redo"> 再次申报 </a-button>
        <a-button @click.prevent="getApplyList"> 查看申报记录 </a-button>
      </template>
    </a-result>
    <a-result status="error" title="抱歉~申报失败！" sub-title="请返回重新填写后再次尝试" v-if="!props.result">
      <template #extra>
        <a-button type="primary" @click.prevent="back"> 上一步 </a-button>
      </template>
    </a-result>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Result, Descriptions } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { propTypes } from '@/utils/propTypes';

  export default defineComponent({
    components: {
      [Result.name]: Result,
      [Descriptions.name]: Descriptions,
      [Descriptions.Item.name]: Descriptions.Item,
    },
    props: { result: propTypes.bool.def(true) },
    emits: ['redo'],
    setup(props, { emit }) {
      console.log(props.result);
      const router = useRouter();
      const getApplyList = () => {
        router.push('/settlement/applyInfo/list');
      };
      const back = () => {
        emit('prev');
      };
      return {
        redo: () => {
          emit('redo');
        },
        back,
        getApplyList,
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
