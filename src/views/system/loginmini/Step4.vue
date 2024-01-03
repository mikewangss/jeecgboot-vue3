<template>
  <div class="step1">
    <div class="step1-form">
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="8">
            <a-form-item label="项目名称">
              <a-input v-model:value="modelRef.projectName" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :lg="8">
            <a-form-item label="项目归属地"> <a-input v-model:value="modelRef.projectRegion" placeholder="" /> </a-form-item>
          </a-col>
          <a-col :lg="8">
            <a-form-item label="对接人姓名">
              <a-input v-model:value="modelRef.projectManger" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :lg="8">
            <a-form-item label="对接人电话">
              <a-input v-model:value="modelRef.projectMangerPhone" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :lg="8">
            <a-form-item label="合同名称">
              <a-input v-model:value="modelRef.contractName" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :lg="8">
            <a-form-item label="合同签订时间">
              <a-input v-model:value="modelRef.contractSignDate" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :lg="8">
            <a-form-item label="合同附件">
              <a-input v-model:value="modelRef.contractFile" placeholder="" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts">
  import { Form } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ref, reactive, toRaw, unref, defineComponent } from 'vue';
  import { getCaptcha, register } from '/@/api/sys/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { SmsEnum } from '/@/views/sys/login/useLogin';
  const useForm = Form.useForm;
  export default defineComponent({
    setup(_, { emit }) {
      const { t } = useI18n();
      const modelRef = reactive({
        supplierName: '',
        legalPersonName: '',
        legalPersonIdcard: '',
        legalPersonPhone: '',
        firmAddress: '',
        businessLicenseDate: [],
        registeredCapital: '',
      });
      const { resetFields, validate, validateInfos } = useForm(
        modelRef,
        reactive({
          supplierName: [
            {
              required: true,
              message: '请输入供应商名称',
              trigger: 'blur',
            },
          ],
          legalPersonName: [
            {
              required: true,
              message: '请输入法人姓名',
              trigger: 'blur',
            },
          ],
          legalPersonIdcard: [
            {
              required: true,
              message: '请输入法人身份证',
              trigger: 'blur',
            },
          ],
          legalPersonPhone: [
            {
              required: true,
              message: '请输入法人电话',
              trigger: 'blur',
            },
          ],
          firmAddress: [
            {
              required: true,
              message: '请输入公司地址',
              trigger: 'blur',
            },
          ],
          businessLicenseDate: [
            {
              required: true,
              message: '请输入营业执照起止日期',
              trigger: 'blur',
            },
          ],
          registeredCapital: [
            {
              required: true,
              message: '请输入注册资本',
              trigger: 'blur',
            },
          ],
        })
      );
      //是否显示获取验证码
      const showInterval = ref<boolean>(true);
      //60s
      const timeRuning = ref<number>(60);
      //定时器
      const timer = ref<any>(null);
      const { notification, createErrorModal, createMessage } = useMessage();
      /**
       * 获取手机验证码
       */
      async function getLoginCode() {
        if (!modelRef.mobile) {
          createMessage.warn(t('sys.login.mobilePlaceholder'));
          return;
        }
        const result = await getCaptcha({ mobile: modelRef.mobile, smsmode: SmsEnum.REGISTER });
        if (result) {
          const TIME_COUNT = 60;
          if (!unref(timer)) {
            timeRuning.value = TIME_COUNT;
            showInterval.value = false;
            timer.value = setInterval(() => {
              if (unref(timeRuning) > 0 && unref(timeRuning) <= TIME_COUNT) {
                timeRuning.value = timeRuning.value - 1;
              } else {
                showInterval.value = true;
                clearInterval(unref(timer));
                timer.value = null;
              }
            }, 1000);
          }
        }
      }
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
      return {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        validateInfos,
        showInterval,
        getLoginCode,
        timeRuning,
        reset,
        modelRef,
        onSubmit,
        t,
        unref,
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
