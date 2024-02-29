<template>
  <PageWrapper title="结算申请" contentBackground content=" 请按照提示信息进行申报，注意申报材料的合规性" contentClass="p-4">
    <div class="step-form-form">
      <a-steps :current="current">
        <a-step title="结算主体信息" />
        <a-step title="报审结算材料" />
        <a-step title="变更签证" />
        <a-step title="完成" />
      </a-steps>
    </div>
    <div class="mt-5">
      <Step1 @next="handleStep1Next" v-show="current === 0" />
      <Step2 @prev="handleStepPrev" @next="handleStep2Next" v-show="current === 1" v-if="initStep2" />
      <Step3 @prev="handleStepPrev" @next="handleStep3Next" @commit="commit" v-show="current === 2" v-if="initStep3" />
      <Step4 v-show="current === 3" @redo="handleRedo" v-if="initStep4" :result="result" />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, toRefs, Ref } from 'vue';
  import Step1 from './Step1.vue';
  import Step2 from './Step2.vue';
  import Step3 from './Step3.vue';
  import Step4 from './Step4.vue';
  import { PageWrapper } from '/@/components/Page';
  import { Steps } from 'ant-design-vue';
  import { step2Schemas, step3Schemas } from './data';
  import { saveOrUpdate } from '@/views/settlement/apply/applyInfo.api';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '@/hooks/web/useMessage';
  import { FormSchema } from '@/components/Form';

  const userStore = useUserStore();
  const { createErrorModal } = useMessage();
  export default defineComponent({
    name: 'FormStepPage',
    components: {
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
      interface FileInfo {
        file: string;
        fileName: string;
        bizType: string;
        fc: string;
        // Add other file-related properties as needed
      }
      const initStep2 = ref(false);
      const initStep3 = ref(false);
      const initStep4 = ref(false);
      const current = ref(0);
      const state = reactive({
        formDataStep1: {},
        formDataStep2: {},
        formDataStep3: {},
      });
      function handleStep1Next(step1Values: any) {
        current.value++;
        initStep2.value = true;
        state.formDataStep1 = step1Values;
        console.log(state);
      }

      function handleStepPrev() {
        current.value--;
        console.log(state);
      }

      function handleStep2Next(step2Values: any) {
        current.value++;
        initStep3.value = true;
        state.formDataStep2 = step2Values;
        console.log(state);
      }
      function handleStep3Next(step3Values: any) {
        state.formDataStep3 = step3Values;
        console.log(state);
        commit();
      }
      function handleRedo() {
        current.value = 0;
        initStep2.value = false;
        initStep3.value = false;
        initStep4.value = false;
      }
      function classifyIntoFormData() {
        // 假设 formDataStep1 和 formDataStep2 中都有其他属性，而 formDataStep2 包含表单字段和可能的文件上传组件
        // 初始化 applyInfo 对象
        const requestFileList: Ref<FileInfo[]> = ref([]);
        const changeFileList: Ref<FileInfo[]> = ref([]);
        let applyInfo = Object.assign({}, state.formDataStep1);
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
                continue;
              }
              var findScheme = step2Schemas.filter((schema) => schema.field == key) as FormSchema[];
              const fileInfo: FileInfo = {
                file: formField,
                fileName: findScheme[0].label,
                bizType: findScheme[0].buss,
                fc: '3',
                // 其他文件相关属性
              };
              requestFileList.value.push(fileInfo);
            } else {
              // 如果不是文件上传组件，则直接复制到 applyInfo 对象中
              applyInfo[key] = fileArr;
            }

            // 判断是否是文件上传组件
            // if (formField instanceof File) {
            // } else {
            //   // 如果不是文件上传组件，则直接复制到 applyInfo 对象中
            //   applyInfo[key] = formField;
            // }
          }
        }
        for (const key in state.formDataStep3) {
          if (state.formDataStep3.hasOwnProperty(key)) {
            const fileArr = state.formDataStep3[key]; //上传组件返回数组，其他为字符串
            // 使用 map 函数获取所有 name 属性的值
            if (Array.isArray(fileArr)) {
              const nameArray = fileArr.filter((item) => item.status == 'done').map((item) => item.response.message);
              // 使用 join 函数将数组中的值用逗号拼接成一个字符串
              const formField = nameArray.join(', ');
              if (formField == '') {
                continue;
              }
              var findScheme = step3Schemas.filter((schema) => schema.field == key) as FormSchema[];
              const fileInfo: FileInfo = {
                file: formField,
                fileName: findScheme[0].label,
                bizType: findScheme[0].buss,
                fc: '1',
                // 其他文件相关属性
              };
              changeFileList.value.push(fileInfo);
            } else {
              // 如果不是文件上传组件，则直接复制到 applyInfo 对象中
              applyInfo[key] = fileArr;
            }
          }
        }
        // let applyInfo = Object.assign({}, state.formDataStep1, state.formDataStep2);
        return {
          ...applyInfo, // 展开
          requestFileList: reactive(requestFileList.value),
          changeFileList: reactive(changeFileList.value),
        };
      }
      function handleSuccess() {
        result.value = true;
        current.value++;
        initStep4.value = true;
      }
      async function commit() {
        try {
          // const values = await validate();
          // setProps({
          //   submitButtonOptions: {
          //     loading: true,
          //   },
          // });
          let formData = classifyIntoFormData();
          console.log('表单数据', formData);
          await saveOrUpdate(formData, false, handleSuccess);
        } catch (error) {}
      }
      return {
        current,
        handleStep1Next,
        handleStep2Next,
        handleStep3Next,
        handleRedo,
        handleStepPrev,
        commit,
        result,
        initStep2,
        initStep3,
        initStep4,
      };
    },
  });
</script>
<style lang="less">
  .step-form-content {
    padding: 24px;
    background-color: @component-background;
  }

  .step-form-form {
    width: 750px;
    margin: 0 auto;
  }
  .ant-input-number {
    width: 100% !important;
  }
</style>
