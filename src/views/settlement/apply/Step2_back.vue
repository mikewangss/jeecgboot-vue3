<template>
  <div class="step2">
    <a-alert message="请上传正确的格式，否则流程审批不通过" show-icon />
    <a-divider />
    <BasicForm :labelWidth="200" @register="register" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { step2Schemas } from './data';
  import { Alert, Divider, Descriptions } from 'ant-design-vue';

  export default defineComponent({
    components: {
      BasicForm,
      [Alert.name]: Alert,
      [Divider.name]: Divider,
      [Descriptions.name]: Descriptions,
      [Descriptions.Item.name]: Descriptions.Item,
    },
    emits: ['next', 'prev', 'commit'],
    setup(_, { emit }) {
      debugger;
      const [register, { validate, setProps, getFieldsValue }] = useForm({
        labelWidth: 200,
        schemas: step2Schemas,
        actionColOptions: {
          span: 24,
        },
        resetButtonOptions: {
          text: '上一步',
        },
        submitButtonOptions: {
          text: '下一步',
        },
        resetFunc: customResetFunc,
        submitFunc: customSubmitFunc,
      });
      async function customSubmitFunc() {
        const values = await validate();
        emit('next', values);
        // emit('commit');
      }
      async function customResetFunc() {
        emit('prev');
      }

      return { register };
    },
  });
</script>
<style lang="less" scoped>
  .step2 {
    width: 550px;
    margin: 0 auto;
  }
</style>
