<template>
  <div class="step3">
    <a-result status="success" title="恭喜您~申报成功！" sub-title="审核通过后您会收到短信提醒">
      <template #extra>
        <a-button type="primary" @click="redo"> 再次申报 </a-button>
        <a-button @click="getApplyList"> 查看申报记录 </a-button>
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
      const getApplyList = () => {
        router.push('/settlement/applyInfo/list');
      };
      return {
        redo: () => {
          emit('redo');
        },
        getApplyList,
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
