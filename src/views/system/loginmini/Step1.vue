<template>
  <div class="step1">
    <div class="step1-form">
      <a-form :model="modelRef" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item name="username" label="用户名" v-bind="validateInfos.username" required>
          <a-input v-model:value="modelRef.username" />
        </a-form-item>
        <a-form-item label="企业邮箱" v-bind="validateInfos.email" required>
          <a-input v-model:value="modelRef.email" />
        </a-form-item>
        <a-form-item label="手机号" v-bind="validateInfos.phone" required>
          <a-input v-model:value="modelRef.phone" />
        </a-form-item>
        <a-form-item label="验证码" v-bind="validateInfos.smscode" required>
          <div class="aui-input-line">
            <a-input v-model:value="modelRef.smscode" />
            <div v-if="showInterval" class="aui-code-line" @click="getLoginCode">{{ t('component.countdown.normalText') }}</div>
            <div v-else class="aui-code-line">{{ t('component.countdown.sendText', [unref(timeRuning)]) }}</div>
          </div>
        </a-form-item>
        <a-form-item has-feedback label="密码" v-bind="validateInfos.password" required>
          <a-input type="password" v-model:value="modelRef.password" autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="确认密码" v-bind="validateInfos.confirmPassword" required>
          <a-input type="password" v-model:value="modelRef.confirmPassword" />
        </a-form-item>
        <a-form-item name="policy">
          <div class="aui-flex">
            <div class="aui-flex-box">
              <div class="aui-choice">
                <a-checkbox v-model:checked="modelRef.policy" />
                <span style="color: #1b90ff; margin-left: 4px">我同意雨润隐私政策</span>
              </div>
            </div>
          </div>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 8 }">
          <a-button type="primary" @click.prevent="onSubmit">下一步</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-divider />
    <h3 style="color: red">注册说明</h3>
    <p>
      （1）注册授权函； * 文件命名为“注册授权函” （2）法人授权函； * 文件命名为“法人授权函” （3）营业执照； * 文件命名为“营业执照”
      （4）项目信息:录入与我司合作的项目信息，项目区域为项目所在地；
    </p>
  </div>
</template>
<script lang="ts">
  import { Form } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ref, reactive, toRaw, unref, defineComponent } from 'vue';
  import { getCaptcha, register } from '/@/api/sys/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { SmsEnum } from '/@/views/sys/login/useLogin';
  import type { FormInstance } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { rules } from '@/utils/helper/validator';
  const useForm = Form.useForm;
  export default defineComponent({
    setup(_, { emit }) {
      const { t } = useI18n();
      const modelRef = reactive({
        username: '',
        email: '',
        phone: '',
        smscode: '',
        password: '',
        confirmPassword: '',
        policy: false,
      });
      const validatorRules: Record<string, Rule[]> = {
        password: [{ required: true, message: '请输入登录密码!' }],
        smscode: [{ required: true, message: '请输入短信验证码!' }],
        confirmPassword: [{ required: true, message: '请输入确认密码!' }, { ...rules.confirmPassword(modelRef, true)[0] }],
        phone: [
          { required: true, message: '请输入手机号!' },
          { ...rules.duplicateCheckRule('sys_user', 'phone', modelRef, { label: '手机号' })[0] },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式有误', trigger: 'blur' },
        ],
        username: [
          { required: true, message: '请输入用户名!' },
          { ...rules.duplicateCheckRule('sys_user', 'username', modelRef, { label: '用户账号' })[0] },
        ],
        email: [
          { required: true, message: '请输入邮箱账号!' },
          {
            pattern:
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: '邮箱格式有误',
            trigger: 'blur',
          },
        ],
      };
      const { resetFields, validate, validateInfos } = useForm(modelRef, validatorRules, {
        // onValidate: (...args) => console.log(...args),
      });
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
        if (!modelRef.phone) {
          createMessage.warn('请输入手机号码');
          return;
        }
        const result = await getCaptcha({ mobile: modelRef.phone, smsmode: SmsEnum.REGISTER });
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
        validatorRules,
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
    //background: #f5f5f9;
    position: relative;
    //margin: 12px 0 !important;
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
