<template>
  <span>
    <a-button :type="btnType" @click="history()">{{ text }}</a-button>
    <a-modal title="流程预览" :visible="modalLsVisible" @cancel="handleCancel()" width="60%" :footer="null">
      <div v-if="modalLsVisible">
        <WorkflowDefination ref="workflowDetail" :data-id="dataId" />
      </div>
    </a-modal>
  </span>
</template>
<script>
  import WorkflowDefination from '@/views/flowable/components/WorkflowDefination.vue';

  export default {
    name: 'WorkflowDetail',
    components: { WorkflowDefination },
    props: {
      btnType: { type: String, default: 'link', required: false },
      /**/
      dataId: {
        type: String,
        default: '',
        required: true,
      },
      text: {
        type: String,
        default: '流程预览',
        required: false,
      },
    },
    data() {
      return {
        modalLsVisible: false,
      };
    },
    watch: {},
    created() {},
    methods: {
      handleCancel() {
        this.modalLsVisible = false;
      },
      history() {
        if (!this.dataId) {
          this.$message.error('流程实例ID不存在');
          return;
        }
        this.modalLsVisible = true;
        console.log(this.modalLsVisible);
      },
    },
  };
</script>

<style lang="less"></style>
