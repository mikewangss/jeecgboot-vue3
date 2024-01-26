<template>
  <span>
    <a-button :type="btnType" @click="handle()">{{ text }}</a-button>
    <a-modal :title="modalTaskTitle" :visible="modalTaskVisible" :footer="null" @cancel="handleCancel()">
      <div v-if="modalTaskVisible">
        <div v-if="type == handleType.reApply"> 确认无误并重新提交？ </div>
        <a-form :model="form" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 24 }" autocomplete="off" @finish="handelSubmit">
          <a-form-item v-if="type !== handleType.reApply" label="处理意见" name="comment">
            <a-textarea type="textarea" v-model:value="form.comment" :rows="5" />
          </a-form-item>
          <div v-show="type == 2">
            <a-form-item label="退回节点" name="targetKey" v-if="returnTaskList.length">
              <a-radio-group v-model:value="form.targetKey" name="targetKey" @change="targetKeyChange">
                <a-radio-button v-for="item in returnTaskList" :key="item.id" :value="item.id">{{ item.name }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <span v-else>无可退回节点！</span>
          </div>
          <!--          <div v-if="form.targetKey !== 'start' && candidateUsers.length">-->
          <!--            <a-form-item label="下个节点审批候选人">-->
          <!--              <a-select mode="multiple" v-model:value="form.candidateUsersSelecteds" style="width: 100%" placeholder="请选择下个节点审批候选人">-->
          <!--                <a-select-option v-for="user in candidateUsers" :key="user.username" :value="user.username">-->
          <!--                  {{ user.realname }}-->
          <!--                </a-select-option>-->
          <!--              </a-select>-->
          <!--            </a-form-item>-->
          <!--          </div>-->
          <a-form-item :wrapper-col="{ offset: 4, span: 16 }" style="text-align: center; padding-bottom: 20px">
            <a-button type="primary" html-type="submit">提交</a-button>
          </a-form-item>
        </a-form>
      </div>
      <!--      <div>-->
      <!--        <a-button type="primary" @click="modalTaskVisible = false">取消</a-button>-->
      <!--        <a-button type="primary" :loading="submitLoading" @click="handelSubmit">提交</a-button>-->
      <!--      </div>-->
    </a-modal>
  </span>
</template>
<script lang="ts" name="WorkHandleBtn">
  import { returnList, completeTask, rejectTask, returnTaskInterface } from '@/views/settlement/workflow/todoList.api';
  import { defineComponent, reactive, ref, toRefs } from 'vue';
  import { useMessage } from '@/hooks/web/useMessage';
  //提示弹窗
  const $message = useMessage();
  interface FormState {
    comment: string;
    targetKey: string;
    candidateUsersSelecteds: string[];
  }
  export default defineComponent({
    name: 'WorkHandleBtn',
    components: {},
    props: {
      btnType: { type: String, default: 'link', required: false },
      /* handleType 0通过 1驳回 2退回  */
      type: {
        type: Number,
        default: 0,
        required: true,
      },
      dataId: {
        type: String,
        default: '',
        required: true,
      },
      /*流程变量*/
      variables: {
        type: Object,
        default: () => {},
      },
      candidateUsers: {
        type: Array,
        default: () => [],
      },
      text: {
        type: String,
        default: '处理',
        required: false,
      },
    },
    emits: ['handleSuccess', 'handleValidate'],
    setup(props, { emit }) {
      const { btnType, dataId, type, text, candidateUsers, variables } = toRefs(props);
      const handleType = {
        // 通过
        pass: 0,
        // 驳回
        back: 1,
        // 退回
        return: 2,
        // 重新提交
        reApply: 3,
        delegate: 4,
      };
      const returnTaskList = ref([]);
      const modalTaskVisible = ref(false);
      const submitLoading = ref(false);
      const form = reactive<FormState>({
        comment: '',
        targetKey: '',
        candidateUsersSelecteds: [],
      });

      let modalTaskTitle = ref('');
      function handleCancel() {
        modalTaskVisible.value = false;
      }
      function handle() {
        if (type.value === handleType.delegate) {
          // delegateTask();
        } else if (type.value === handleType.pass) {
          passTask();
        } else if (type.value === handleType.back) {
          backTask();
        } else if (type.value === handleType.return) {
          returnTask();
        } else if (type.value === handleType.reApply) {
          reApply();
        } else {
          $message.createWarningModal({ title: 'Tip', content: '未知类型type，参见 handleType' });
        }
      }

      function reApply() {
        modalTaskTitle.value = '确认重新提交';
        modalTaskVisible.value = true;
      }

      function passTask() {
        modalTaskTitle.value = '审批通过';
        modalTaskVisible.value = true;
      }

      function backTask() {
        modalTaskTitle.value = '审批驳回';
        modalTaskVisible.value = true;
      }

      function returnTask() {
        modalTaskTitle.value = '审批退回';
        modalTaskVisible.value = true;
        returnList({ dataId: dataId }).then((res) => {
          returnTaskList.value = res.result || [];
          // console.log(returnTaskList)
        });
      }

      async function handelSubmit() {
        console.log('提交');
        emit('handleValidate');
        debugger;
        submitLoading.value = true;
        var formData = {
          dataId: dataId.value,
          candidateUsers: form.candidateUsersSelecteds,
          values: variables.value,
          comment: form.comment,
          targetKey: form.targetKey,
        };
        if (type.value == handleType.reApply) {
          formData.comment = '重新提交';
        }
        if (!formData.comment) {
          $message.createErrorModal({ title: 'Tip', content: '请输入审批意见！' });
          submitLoading.value = false;
          return;
        }
        // 有下个节点审批人选择，但是未选
        // if (candidateUsers.value.length && form.candidateUsersSelecteds.length == 0 && form.targetKey !== 'start') {
        //   $message.createErrorModal({ title: 'Tip', content: '请选择下个节点审批人！' });
        //   submitLoading.value = false;
        //   return;
        // }
        if (type.value == handleType.reApply || type.value == handleType.pass) {
          // 通过
          completeTask(formData)
            .then((res) => {
              submitLoading.value = false;
              if (res == 'success') {
                $message.createSuccessModal({ title: 'Tip', content: '操作成功' });
                emit('handleSuccess');
              } else {
                $message.createErrorModal({ title: 'Tip', content: '操作失败' });
              }
            })
            .finally(() => {
              submitLoading.value = false;
              modalTaskVisible.value = false;
            });
        } else if (type.value == handleType.back) {
          // 驳回
          rejectTask(formData)
            .then((res) => {
              debugger;
              submitLoading.value = false;
              if (res == 'success') {
                $message.createSuccessModal({ title: 'Tip', content: '操作成功' });
                emit('handleSuccess');
              } else {
                $message.createErrorModal({ title: 'Tip', content: '操作失败' });
              }
            })
            .finally(() => {
              submitLoading.value = false;
              modalTaskVisible.value = false;
            });
        } else if (type.value == handleType.return) {
          if (!formData.targetKey) {
            $message.createErrorModal({ title: 'Tip', content: '请选择退回节点！' });
            submitLoading.value = false;
            return;
          }
          //退回
          returnTaskInterface(formData)
            .then((res) => {
              submitLoading.value = false;
              if (res == 'success') {
                $message.createSuccessModal({ title: 'Tip', content: '操作成功' });
                modalTaskVisible.value = false;
                // emit('success');
              } else {
                $message.createErrorModal({ title: 'Tip', content: '操作失败' });
              }
            })
            .finally(() => {
              submitLoading.value = false;
            });
        }
      }

      function targetKeyChange() {
        form.candidateUsersSelecteds = [];
        // $emit('targetKeyChange', form.targetKey);
      }
      const onFinish = (values: any) => {
        console.log('Success:', values);
      };
      return {
        type,
        modalTaskTitle,
        candidateUsers,
        modalTaskVisible,
        targetKeyChange,
        returnTaskList,
        btnType,
        handleType,
        form,
        submitLoading,
        handelSubmit,
        handle,
        text,
        handleCancel,
        onFinish,
      };
    },
  });
</script>

<style lang="less"></style>
