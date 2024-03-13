<template>
  <div class="step1">
    <div class="step1-form">
      <a-form :model="modelRef" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="项目名称" v-bind="validateInfos.projectName" required>
          <a-input v-model:value="modelRef.projectName" />
        </a-form-item>
        <a-form-item label="所属区域" v-bind="validateInfos.region">
          <JAreaLinkage v-model:value="modelRef.region" />
        </a-form-item>
        <a-form-item label="合作单位" v-bind="validateInfos.depart">
          <a-select v-model:value="modelRef.depart" placeholder="请正确选择合作方">
            <a-select-option value="A01A02">雨润控股-建设集团</a-select-option>
            <a-select-option value="A01A01">雨润控股-地产集团</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="集团对接人" v-bind="validateInfos.projectManger" required>
          <a-input v-model:value="modelRef.projectManger" />
        </a-form-item>
        <a-form-item label="对接人电话" :rules="validateInfos.projectMangerPhone" required>
          <a-input v-model:value="modelRef.projectMangerPhone" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 8 }" style="margin-top: 30px">
          <a-button @click.prevent="back">上一步</a-button>
          <a-button type="primary" @click.prevent="onSubmit">提交</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts">
  import { uploadUrl } from '/@/api/common/api';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { Form } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ref, reactive, toRaw, unref, defineComponent, inject } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Rule } from 'ant-design-vue/es/form';
  import JAreaLinkage from '/@/components/Form/src/jeecg/components/JAreaLinkage.vue';
  const useForm = Form.useForm;
  export default defineComponent({
    components: {
      UploadOutlined,
      JAreaLinkage,
    },
    setup(_, { emit }) {
      const { t } = useI18n();
      //接收下拉框选项
      const options = ref<Recordable[]>([]);
      //接收选择的值
      const selectValues = inject('selectValues') || ref({});
      const modelRef = reactive({
        projectName: '',
        region: '',
        depart:'',
        projectManger: '',
        projectMangerPhone: '',
      });
      for (let i = 1; i < 10; i++) options.value.push({ label: '选项' + i, value: `${i}` });
      const validatorRules: Record<string, Rule[]> = {
        projectName: [{ required: true, message: '请输入项目名称!' }],
        region: [{ required: true, message: '请输入项目所属区域!' }],
        depart: [{ required: true, message: '请选择甲方单位名称!' }],
        projectManger: [{ required: true, message: '请输入项目对接人!' }],
        projectMangerPhone: [{ required: true, message: '请输入项目对接人电话!' }],
      };
      const { resetFields, validate, validateInfos } = useForm(modelRef, validatorRules, {
        // onValidate: (...args) => console.log(...args),
      });
      const { notification, createErrorModal, createMessage } = useMessage();
      const back = () => {
        emit('prev');
      };
      const onSubmit = () => {
        validate()
          .then((res) => {
            emit('next', modelRef);
            console.log(res, toRaw(modelRef));
          })
          .catch((err) => {
            console.log('error', err);
          });
      };
      const reset = () => {
        resetFields();
      };
      /**
       * 下拉框值改变事件
       */
      function handleChange(value) {
        modelRef.projectOwner = '1';
      }

      return {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        validateInfos,
        reset,
        modelRef,
        onSubmit,
        t,
        unref,
        headers: {
          authorization: 'authorization-text',
        },
        handleChange,
        back,
        uploadUrl,
        selectValues,
        options,
      };
    },
  });
</script>
<style lang="less" scoped>
  .step1 {
    &-form {
      width: 550px;
      margin: 0 auto;
    }

    h3 {
      margin: 0 0 12px;
      font-size: 16px;
      line-height: 32px;
      color: @text-color;
    }

    h4 {
      margin: 0 0 4px;
      font-size: 14px;
      line-height: 22px;
      color: @text-color;
    }

    p {
      color: @text-color;
    }
  }

  .pay-select {
    width: 20%;
  }

  .pay-input {
    width: 70%;
  }

  .aui-input-line {
    background: #f5f5f9;
    position: relative;
    margin: 12px 0 !important;
  }

  .aui-input-line .aui-icon {
    position: absolute;
    z-index: 2;
    top: 10px;
    left: 10px;
    font-size: 20px !important;
  }

  .aui-input-line input {
    //width: 100%;
    //padding: 12px 10px;
    //color: #333333;
    //font-size: 14px;
    background: unset;
    //padding-left: 40px;
  }

  .aui-input-line .icon {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .aui-code-line {
    position: absolute;
    right: 0;
    top: 0;
    border-left: 3px solid #fff;
    height: 30px;
    padding: 0 15px;
    line-height: 30px;
    cursor: pointer;
  }
</style>
