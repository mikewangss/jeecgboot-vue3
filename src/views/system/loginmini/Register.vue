<template>
  <PageWrapper title="供应商注册" contentBackground content=" 欢迎注册供应商结算平台。请仔细阅读注册说明~" contentClass="p-4">
    <div class="step-form-form">
      <a-steps :current="current">
        <a-step title="账号注册" />
        <a-step title="供应商基本信息" />
        <a-step title="完成注册" />
      </a-steps>
    </div>
    <div class="mt-5">
      <Step1 @next="handleStep1Next" v-show="current === 0" />
      <Step2 @prev="handleStepPrev" @next="handleStep2Next" @commit="commit" v-show="current === 1" v-if="initSetp2" />
      <Step3 v-show="current === 2" @redo="handleRedo" v-if="initSetp3" />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, toRefs } from 'vue';
  import Step1 from './Step1.vue';
  import Step2 from './Step2.vue';
  import Step3 from './Step3.vue';
  import { PageWrapper } from '/@/components/Page';
  import { Steps } from 'ant-design-vue';
  import { supplierRegister } from '@/views/system/loginmini/register.api';
  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();
  export default defineComponent({
    name: 'FormStepPage',
    components: {
      Step1,
      Step2,
      Step3,
      PageWrapper,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
    },

    setup() {
      const current = ref(0);
      const state = reactive({
        initSetp2: false,
        initSetp3: false,
        formDataStep1: {},
        formDataStep2: {},
      });
      function handleStep1Next(step1Values: any) {
        current.value++;
        state.initSetp2 = true;
        state.formDataStep1 = step1Values;
        console.log(step1Values);
      }

      function handleStepPrev() {
        current.value--;
      }

      function handleStep2Next(step2Values: any) {
        current.value++;
        state.initSetp3 = true;
        state.formDataStep2 = step2Values;
        console.log(step2Values);
        commit();
      }

      function handleRedo() {
        current.value = 0;
        state.initSetp2 = false;
        state.initSetp3 = false;
      }

      async function commit() {
        try {
          // const values = await validate();
          // setProps({
          //   submitButtonOptions: {
          //     loading: true,
          //   },
          // });
          debugger;
          let formData = { ...state.formDataStep1, ...state.formDataStep2 }; // 展开;
          console.log('表单数据', formData);
          await supplierRegister(formData);
          // setTimeout(() => {
          //   setProps({
          //     submitButtonOptions: {
          //       loading: false,
          //     },
          //   });
          //   emit('next', values);
          // }, 1500);
        } catch (error) {}
      }
      return {
        current,
        handleStep1Next,
        handleStep2Next,
        handleRedo,
        handleStepPrev,
        commit,
        ...toRefs(state),
      };
    },
  });
</script>
<style lang="less" scoped>
  .step-form-content {
    padding: 24px;
    background-color: @component-background;
  }

  .step-form-form {
    width: 750px;
    margin: 0 auto;
  }
</style>
