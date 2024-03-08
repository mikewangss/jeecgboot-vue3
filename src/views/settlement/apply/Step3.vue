<template>
  <div class="step2">
    <a-alert message="若没有变更，请忽略" show-icon />
    <a-divider />
    <div class="step2-form">
      <a-form :model="modelRef" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item name="constructionDrawings" label="施工图会审纪要" extra="">
          <a-upload :multiple="true" v-model:fileList="modelRef.constructionDrawings" name="file" :action="uploadUrl">
            <a-button>
              <template #icon><UploadOutlined /></template>
              点击上传
            </a-button>
          </a-upload></a-form-item
        >
        <a-form-item name="geoElevation" label="原始地貌标高测量记录">
          <a-upload :multiple="true" v-model:fileList="modelRef.geoElevation" name="file" :action="uploadUrl">
            <a-button>
              <template #icon><UploadOutlined /></template>
              点击上传
            </a-button>
          </a-upload></a-form-item
        >
        <a-form-item name="changeDesign" label="设计变更及实施情况签证">
          <a-upload :multiple="true" v-model:fileList="modelRef.changeDesign" name="file" :action="uploadUrl">
            <a-button>
              <template #icon><UploadOutlined /></template>
              点击上传
            </a-button>
          </a-upload></a-form-item
        >
        <a-form-item name="technicalApproval" label="技术核定单及实施情况签证">
          <a-upload :multiple="true" v-model:fileList="modelRef.technicalApproval" name="file" :action="uploadUrl">
            <a-button>
              <template #icon><UploadOutlined /></template>
              点击上传
            </a-button>
          </a-upload></a-form-item
        >
        <a-form-item name="projectContact" label="工程联系单及实施情况签证">
          <a-upload :multiple="true" v-model:fileList="modelRef.projectContact" name="file" :action="uploadUrl">
            <a-button>
              <template #icon><UploadOutlined /></template>
              点击上传
            </a-button>
          </a-upload></a-form-item
        >
        <a-form-item name="supervisionNotice" label="监理通知单及实施情况签证">
          <a-upload :multiple="true" v-model:fileList="modelRef.supervisionNotice" name="file" :action="uploadUrl">
            <a-button>
              <template #icon><UploadOutlined /></template>
              点击上传
            </a-button>
          </a-upload></a-form-item
        >
        <a-form-item name="otherVisas" label="其它签证">
          <a-upload :multiple="true" v-model:fileList="modelRef.otherVisas" name="file" :action="uploadUrl">
            <a-button>
              <template #icon><UploadOutlined /></template>
              点击上传
            </a-button>
          </a-upload></a-form-item
        >
        <a-form-item name="costRelated" label="造价相关的会议纪要">
          <a-upload :multiple="true" v-model:fileList="modelRef.costRelated" name="file" :action="uploadUrl">
            <a-button>
              <template #icon><UploadOutlined /></template>
              点击上传
            </a-button>
          </a-upload></a-form-item
        >
        <a-form-item :wrapper-col="{ span: 14, offset: 8 }" style="margin-top: 30px">
          <a-button @click.prevent="back">上一步</a-button>
          <a-button type="primary" style="margin-left: 10px" @click.prevent="onSubmit">提交</a-button>
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
  import { getCaptcha, register } from '/@/api/sys/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { SmsEnum } from '/@/views/sys/login/useLogin';
  import type { UploadChangeParam } from 'ant-design-vue';
  import { rules } from '/@/utils/helper/validator';
  import { Rule } from 'ant-design-vue/es/form';
  const useForm = Form.useForm;
  export default defineComponent({
    components: {
      UploadOutlined,
    },
    setup(_, { emit }) {
      const { t } = useI18n();
      const modelRef = reactive<Record<string, any>>({});
      const { resetFields, validate } = useForm(modelRef, {
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
          modelRef.powerAttorney = info.fileList;
        } else if (info.file.status === 'error') {
          createMessage.error(`${info.file.name} file upload failed.`);
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
