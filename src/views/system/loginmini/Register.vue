<template>
  <a-layout class="layout">
    <Header />
    <a-layout-content>
      <div :style="{ background: '#fff', padding: '80px', minHeight: '280px' }">
        <div class="step-form-form">
          <a-alert message="欢迎注册供应商结算平台。简单几步即可完成注册~" show-icon style="margin: 0 20px 20px 20px" />
          <a-steps :current="current">
            <a-step title="账号注册" />
            <a-step title="供应商基本信息" />
            <a-step title="项目信息" />
            <a-step title="完成注册" />
          </a-steps>
        </div>
        <div class="mt-5">
          <Step1 @next="handleStep1Next" v-show="current === 0" />
          <Step2 @prev="handleStepPrev" @next="handleStep2Next" v-show="current === 1" />
          <Step3 @prev="handleStepPrev" @next="handleStep3Next" v-show="current === 2" />
          <Step4 v-show="current === 3" @prev="handleStepPrev" :result="result" />
        </div> </div
    ></a-layout-content>
    <Footer />
  </a-layout>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, toRefs } from 'vue';
  import Step1 from './Step1.vue';
  import Step2 from './Step2.vue';
  import Step3 from './Step3.vue';
  import Step4 from './Step4.vue';
  import { PageWrapper } from '/@/components/Page';
  import { Steps } from 'ant-design-vue';
  import { supplierRegister } from '@/views/system/loginmini/register.api';
  import Header from '@/views/home/Header.vue';
  import Footer from '@/views/home/Footer.vue';
  export default defineComponent({
    name: 'FormStepPage',
    components: {
      Footer,
      Header,
      Step1,
      Step2,
      Step3,
      Step4,
      PageWrapper,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
    },

    setup() {
      const result = ref(false);
      const current = ref(0);
      const state = reactive({
        initSetp2: false,
        initSetp3: false,
        initSetp4: false,
        formDataStep1: {},
        formDataStep2: {},
        formDataStep3: {},
      });
      function handleStep1Next(step1Values: any) {
        current.value++;
        state.initSetp2 = true;
        state.formDataStep1 = step1Values;
      }

      function handleStepPrev() {
        current.value--;
      }

      function handleStep2Next(step2Values: any) {
        current.value++;
        state.formDataStep2 = step2Values;
      }
      function handleStep3Next(step3Values: any) {
        state.formDataStep3 = step3Values;
        console.log(step3Values);
        commit();
      }
      function handleRedo() {
        current.value = 0;
        state.initSetp2 = false;
        state.initSetp3 = false;
        state.initSetp4 = false;
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
          let formData = { ...state.formDataStep1,...state.formDataStep3 }; // 展开;
          // 遍历 formDataStep2 的属性
          for (const key in state.formDataStep2) {
            if (state.formDataStep2.hasOwnProperty(key)) {
              const fileArr = state.formDataStep2[key]; //上传组件返回数组，其他为字符串
              // 使用 map 函数获取所有 name 属性的值
              if (Array.isArray(fileArr)) {
                const nameArray = fileArr.filter((item) => item.status == 'done').map((item) => item.response.message);
                // 使用 join 函数将数组中的值用逗号拼接成一个字符串
                const formField = nameArray.join(', ');
                if (formField == '') {
                  formData[key] = fileArr; //是数组但是不是上传组件
                } else {
                  formData[key] = formField;
                }
              } else {
                // 如果不是文件上传组件，则直接复制到 applyInfo 对象中
                formData[key] = fileArr;
              }
            }
          }
          console.log('表单数据', formData);
          await supplierRegister(formData, handleSuccess);
        } catch (error) {}
      }
      function handleSuccess() {
        result.value = true;
        current.value++;
        state.initSetp4 = true;
      }
      return {
        current,
        handleStep1Next,
        handleStep2Next,
        handleStep3Next,
        handleRedo,
        handleStepPrev,
        commit,
        ...toRefs(state),
        result,
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
