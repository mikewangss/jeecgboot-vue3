<template>
  <div class="step1">
    <div class="step1-form">
      <a-form :model="modelRef" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="供应商名称" v-bind="validateInfos.supplierName" required>
          <a-input v-model:value="modelRef.supplierName" />
        </a-form-item>
        <a-form-item label="法人姓名" v-bind="validateInfos.legalPersonName" required>
          <a-input v-model:value="modelRef.legalPersonName" />
        </a-form-item>
        <a-form-item label="法人身份证" v-bind="validateInfos.legalPersonIdcard" required>
          <a-input v-model:value="modelRef.legalPersonIdcard" />
        </a-form-item>
        <a-form-item label="法人电话" :rules="validateInfos.legalPersonPhone" required>
          <a-input v-model:value="modelRef.legalPersonPhone" />
        </a-form-item>
        <a-form-item label="统一社会信用代码" v-bind="validateInfos.unifiedSocialCreditCode" required>
          <a-input v-model:value="modelRef.unifiedSocialCreditCode" />
        </a-form-item>
        <a-form-item label="公司地址" v-bind="validateInfos.firmAddress" required>
          <a-input v-model:value="modelRef.firmAddress" />
        </a-form-item>
        <a-form-item name="range-picker" label="营业执照起止日期" v-bind="validateInfos.businessLicenseDate" required>
          <a-range-picker v-model:value="modelRef.businessLicenseDate" value-format="YYYY-MM-DD" />
        </a-form-item>
        <!--        <a-form-item label="注册资本" v-bind="validateInfos.registeredCapital" required>-->
        <!--          <a-input-number  v-model:value="modelRef.registeredCapital" />-->
        <!--        </a-form-item>-->
        <a-form-item name="upload" label="上传营业执照" v-bind="validateInfos.businessLicenseFile" required>
          <a-upload v-model:fileList="modelRef.businessLicenseFile" name="file" :action="uploadUrl">
            <a-button>
              <template #icon><UploadOutlined /></template>
              上传营业执照
            </a-button>
          </a-upload></a-form-item
        >
        <a-form-item :wrapper-col="{ span: 14, offset: 8 }" style="margin-top: 30px">
          <a-button @click.prevent="back">上一步</a-button>
          <a-button type="primary" @click.prevent="onSubmit">下一步</a-button>
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
  import { ref, reactive, toRaw, unref, defineComponent } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import type { UploadChangeParam } from 'ant-design-vue';
  import { Rule } from 'ant-design-vue/es/form';
  const useForm = Form.useForm;
  export default defineComponent({
    components: {
      UploadOutlined,
    },
    setup(_, { emit }) {
      const { t } = useI18n();
      const modelRef = reactive({
        supplierName: '',
        legalPersonName: '',
        legalPersonIdcard: '',
        legalPersonPhone: '',
        firmAddress: '',
        businessLicenseDate: [],
        unifiedSocialCreditCode: '',
        businessLicenseFile: ref<any[]>([]),
      });
      const validatorRules: Record<string, Rule[]> = {
        unifiedSocialCreditCode: [
          { required: true, message: '请输入统一社会信用代码!' },
          // { pattern: /^[0-9A-Z]{18}$/, message: '统一社会信用代码格式有误', trigger: 'blur' },
        ],
        businessLicenseDate: [{ required: true, message: '请输入营业执照起止时间!' }],
        supplierName: [{ required: true, message: '请输入供应商名称!' }],
        legalPersonName: [{ required: true, message: '请输入法人姓名!' }],
        firmAddress: [{ required: true, message: '请输入公司地址!' }],
        businessLicenseFile: [{ required: true, message: '请上传营业执照!' }],
        legalPersonPhone: [
          { required: true, message: '请输入法人手机号!' },
          // { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式有误', trigger: 'blur' },
        ],
        legalPersonIdcard: [
          { required: true, message: '请输入法人身份证!' },
          // { pattern: '^\\d{6}(18|19|20)?\\d{2}(0[1-9]|1[012])(0[1-9]|[12]\\d|3[01])\\d{3}(\\d|[xX])$', message: '身份证格式有误', trigger: 'blur' },
        ],
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
      const handleChange = (info: UploadChangeParam) => {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          createMessage.success(`${info.file.name} file uploaded successfully`);
          modelRef.businessLicenseFile = info.fileList;
        } else if (info.file.status === 'error') {
          createMessage.error(`${info.file.name} file upload failed.`);
        }
      };

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
