<template>
  <div class="step2">
    <a-alert message="请上传正确的格式，否则流程审批不通过" show-icon />
    <a-divider />
    <div class="step2-form">
      <a-form :model="modelRef" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item name="powerAttorney" label="授权委托书" extra="承包人授权结算人员的授权委托书" v-bind="validateInfos.powerAttorney" required>
          <a-upload v-model:fileList="modelRef.powerAttorney" name="file" :action="uploadUrl" @change="handleChange">
            <a-button>
              <template #icon>
                <UploadOutlined />
              </template>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item name="InformationCommitment" label="结算承诺书" v-bind="validateInfos.InformationCommitment" required>
          <a-upload v-model:fileList="modelRef.InformationCommitment" name="file" :action="uploadUrl" @change="handleChange">
            <a-button>
              <template #icon>
                <UploadOutlined />
              </template>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item name="projectStatement" label="工程结算书" v-bind="validateInfos.projectStatement" required>
          <a-upload v-model:fileList="modelRef.projectStatement" name="file" :action="uploadUrl" @change="handleChange">
            <a-button>
              <template #icon>
                <UploadOutlined />
              </template>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item name="quantityCalculation" label="工程量计算书" v-bind="validateInfos.quantityCalculation" required>
          <a-upload v-model:fileList="modelRef.quantityCalculation" name="file" :action="uploadUrl" @change="handleChange">
            <a-button>
              <template #icon>
                <UploadOutlined />
              </template>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item name="materials" label="甲供材领、退用清单" v-bind="validateInfos.materials" required>
          <a-upload v-model:fileList="modelRef.materials" name="file" :action="uploadUrl" @change="handleChange">
            <a-button>
              <template #icon>
                <UploadOutlined />
              </template>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item name="feeAcknowledgment" label="费用确认单" v-bind="validateInfos.feeAcknowledgment" required>
          <a-upload v-model:fileList="modelRef.feeAcknowledgment" name="file" :action="uploadUrl" @change="handleChange">
            <a-button>
              <template #icon>
                <UploadOutlined />
              </template>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item name="securityProof" label="安全证明文件" v-bind="validateInfos.securityProof" required>
          <a-upload v-model:fileList="modelRef.securityProof" name="file" :action="uploadUrl" @change="handleChange">
            <a-button>
              <template #icon>
                <UploadOutlined />
              </template>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item name="CommencementConstruction" label="工程开工报告" v-bind="validateInfos.CommencementConstruction" required>
          <a-upload v-model:fileList="modelRef.CommencementConstruction" name="file" :action="uploadUrl" @change="handleChange">
            <a-button>
              <template #icon>
                <UploadOutlined />
              </template>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item name="builtDrawings" label="竣工图纸" v-bind="validateInfos.builtDrawings" required>
          <a-upload v-model:fileList="modelRef.builtDrawings" name="file" :action="uploadUrl" @change="handleChange">
            <a-button>
              <template #icon>
                <UploadOutlined />
              </template>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item name="acceptanceReport" label="竣工报告或验收报告" v-bind="validateInfos.acceptanceReport" required>
          <a-upload v-model:fileList="modelRef.acceptanceReport" name="file" :action="uploadUrl" @change="handleChange">
            <a-button>
              <template #icon>
                <UploadOutlined />
              </template>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item name="completionAcknowledgment" label="完工界面确认单" v-bind="validateInfos.completionAcknowledgment" required>
          <a-upload v-model:fileList="modelRef.completionAcknowledgment" name="file" :action="uploadUrl" @change="handleChange">
            <a-button>
              <template #icon>
                <UploadOutlined />
              </template>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item name="others" label="其他" v-bind="validateInfos.others">
          <a-upload v-model:fileList="modelRef.others" name="file" :action="uploadUrl" @change="handleChange">
            <a-button>
              <template #icon>
                <UploadOutlined />
              </template>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 8 }" style="margin-top: 30px">
          <a-button @click.prevent="back">上一步</a-button>
          <a-button type="primary" style="margin-left: 10px" @click.prevent="onSubmit">下一步 </a-button>
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
  import { rules } from '@/utils/helper/validator';
  import { step2Schemas } from '@/views/settlement/apply/data';

  const useForm = Form.useForm;
  export default defineComponent({
    components: {
      UploadOutlined,
    },
    setup(_, { emit }) {
      const { t } = useI18n();
      const modelRef = reactive<Record<string, any>>({
        powerAttorney: [],
        InformationCommitment: [],
        projectStatement: [],
        quantityCalculation: [],
        materials: [],
        feeAcknowledgment: [],
        securityProof: [],
        CommencementConstruction: [],
        builtDrawings: [],
        acceptanceReport: [],
        completionAcknowledgment: [],
        others: [],
      });
      function getValidateStr(field) {
        const arr = step2Schemas
          .filter((item) => item.field == field)
          .map((item) => [{ required: true, message: '请上传' + item.label + '!' }, { ...rules.fileCheckRule({ label: item.label }, true)[0] }]);
        return arr[0];
      }
      const validatorRules: Record<string, Rule[]> = {
        powerAttorney: getValidateStr('powerAttorney'),
        // InformationCommitment: getValidateStr('InformationCommitment'),
        // projectStatement: getValidateStr('projectStatement'),
        // quantityCalculation: getValidateStr('quantityCalculation'),
        // materials: getValidateStr('materials'),
        // feeAcknowledgment: getValidateStr('feeAcknowledgment'),
        // securityProof: getValidateStr('securityProof'),
        // CommencementConstruction: getValidateStr('CommencementConstruction'),
        // builtDrawings: getValidateStr('builtDrawings'),
        // acceptanceReport: getValidateStr('acceptanceReport'),
        // completionAcknowledgment: getValidateStr('completionAcknowledgment'),
      };
      console.log('validatorRules:' + validatorRules);
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
        if (info.file.response) {
          if (info.file.status === 'done' && info.file.response.success) {
            createMessage.success(`${info.file.name} file uploaded successfully`);
            // modelRef.powerAttorney = info.fileList;
          } else if (info.file.status === 'done' && info.file.response.success == false) {
            createMessage.error(`${info.file.name} file upload failed.`);
            info.file.status = 'error';
          }
        }
      };

      return {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
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
        validateInfos,
      };
    },
  });
</script>
<style lang="less" scoped>
  .step2 {
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
