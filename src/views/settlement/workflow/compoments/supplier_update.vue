<template>
  <BasicDrawer v-bind="$attrs" @register="register2" title="流程审批单" width="70%">
    <PageWrapper title="供应商入驻审批单">
      <template v-if="showApplyButton" #extra>
        <WorkHandleBtn
          @handleSuccess="handleSuccess"
          @handleValidate="handleValidate"
          btnType="primary"
          :dataId="bizId"
          :type="3"
          text="提交"
          v-if="currentFlowNodeId == 'start'"
          :candidateUsers="[]"
          :variables="{ assigneeList: [], outcome: '重新提交' }"
        />
        <WorkHandleBtn
          @handleSuccess="handleSuccess"
          :dataId="bizId"
          :type="1"
          text="保存"
          v-if="currentFlowNodeId == 'start'"
          :candidateUsers="[]"
          :variables="{ assigneeList: [], outcome: '删除' }"
        />
        <WorkHandleBtn
          @handleSuccess="handleSuccess"
          @handleValidate="handleValidate"
          btnType="primary"
          :dataId="bizId"
          :type="0"
          text="通过"
          v-if="currentFlowNodeId != 'start'"
          :candidateUsers="[]"
          :variables="{ assigneeList: [], outcome: '通过' }"
        />
        <WorkHandleBtn
          @handleSuccess="handleSuccess"
          :dataId="bizId"
          :type="1"
          text="驳回"
          v-if="currentFlowNodeId != 'start'"
          :candidateUsers="[]"
          :variables="{ assigneeList: [], outcome: '驳回' }"
        />
      </template>
      <template #footer>
        <a-tabs v-model:activeKey="activeKey" @tabClick="handleChangePanel">
          <a-tab-pane tab="申请明细" key="applyInfo" :forceRender="true">
            <BasicForm @register="registerForm" :disabled="currentFlowNodeId != 'start'" />
            <a-divider />
            <a-card style="margin-top: 10px">
              <p slot="title">
                <span>流程审批进度历史</span>
              </p>
              <a-row style="position: relative">
                <div class="block">
                  <el-timeline>
                    <el-timeline-item v-for="(item, index) in flowRecordList" :key="index" :color="setColor(item.finishTime)">
                      <p style="font-weight: 700"
                        >{{ item.taskName }}
                        <i v-if="!item.finishTime" style="color: orange">(待办中。。。)</i>
                      </p>

                      <a-card :body-style="{ padding: '10px' }">
                        <label v-if="item.assigneeName" style="font-weight: normal; margin-right: 30px">办理人： {{ item.assigneeName }}({{item.assigneeId}})</label>
                        <label v-if="item.assigneeName && item.finishTime" style="font-weight: normal; margin-right: 30px">
                          <a-tag type="info" size="default">{{ item.deptName }}</a-tag></label
                        >
                        <label v-if="item.candidate" style="font-weight: normal; margin-right: 30px">候选办理人： {{ item.candidate }}</label>
                        <label style="font-weight: normal">接收时间： </label
                        ><label style="color: #8a909c; font-weight: normal">{{ item.createTime }}</label>
                        <label v-if="item.finishTime" style="margin-left: 30px; font-weight: normal">办结时间： </label
                        ><label style="color: #8a909c; font-weight: normal">{{ item.finishTime }}</label>
                        <label v-if="item.duration" style="margin-left: 30px; font-weight: normal">耗时： </label
                        ><label style="color: #8a909c; font-weight: normal">{{ item.duration }}</label>

                        <div v-if="item.comment">
                          <!--  1 正常意见  2 退回意见 3 驳回意见                -->
                          <a-tag color="green" v-if="item.comment.type === '1'">
                            <span v-if="item.comment.comment != '重新提交'">通过</span>
                          </a-tag>
                          <a-tag color="orange" v-if="item.comment.type === '2'">退回</a-tag>
                          <a-tag color="red" v-if="item.comment.type === '3'">驳回</a-tag>
                          {{ item.comment.comment }}
                        </div>
                      </a-card>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </a-row>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageWrapper>
  </BasicDrawer>
</template>

<script lang="tsx">
  import { defineComponent, reactive, ref, Ref, onMounted } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { PageWrapper } from '/@/components/Page';
  import { taskHiList } from '../todoList.api';
  import { useGlobSetting } from '@/hooks/setting';
  import WorkHandleBtn from './WorkHandleBtn.vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { supplierFormSchema } from '@/views/settlement/supplier/ApplySupplier.data';
  interface flowRecord {
    id: string;
    taskName: string;
    createTime: string;
    deptName: string;
    assigneeName: string;
    candidate: string;
    finishTime: string;
    duration: string;
    assigneeId: string;
    taskDefKey: string;
    comment: {
      comment: string;
      type: string;
    };
  }
  export default defineComponent({
    components: { BasicForm, PageWrapper, BasicDrawer, WorkHandleBtn },
    props: {
      showApplyButton: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['handeleSuccess'],
    setup(props, { emit }) {
      const currentFlowNodeId = ref('');
      const finalFilesShow = ref(true);
      const preliminaryFilesShow = ref(true);
      const reviewFilesShow = ref(true);
      const approvalComment = ref('');
      const bizId = ref('');
      const toolbarConfig = reactive({
        // add 新增按钮；remove 删除按钮；clearSelection 清空选择按钮
        btn: ['add', 'save', 'remove', 'clearSelection'],
      });
      const activeKey = ref('applyInfo');
      const glob = useGlobSetting();
      const flowRecordList: Ref<flowRecord[]> = ref([]); // 流程流转数据
      //表单配置
      const [registerForm, { updateSchema, setFieldsValue, getFieldsValue, resetFields, validate, clearValidate }] = useForm({
        labelWidth: 150,
        schemas: supplierFormSchema,
        showActionButtonGroup: false,
      });
      onMounted(async () => {});
      async function initaildata(process_instance_id, dataId) {
        const newData = await taskHiList({ process_instance_id: process_instance_id, dataId: dataId });
        bizId.value = newData.formData.id;
        currentFlowNodeId.value = newData.currentFlowNodeId;
        flowRecordList.value = newData.flowList;
        if (currentFlowNodeId.value) {
          console.log(currentFlowNodeId);
          if (currentFlowNodeId.value == 'start') {
          }
        }
        await setFieldsValue({
          ...newData.formData,
        });
      }
      const [register2] = useDrawerInner((data) => {
        initaildata(data.process_instance_id, data.bizId);
      });
      function handleReset() {
        approvalComment.value = '';
      }
      function setColor(val) {
        if (val) {
          return '#2bc418';
        } else {
          return '#b3bdbb';
        }
      }
      function handleSuccess() {
        // let data = getFieldsValue();
        // saveOrUpdate(data, true);
        emit('success');
      }
      async function handleValidate() {
        const values = await validate();
        console.log(values);
      }
      return {
        register2,
        glob,
        activeKey,
        finalFilesShow,
        preliminaryFilesShow,
        reviewFilesShow,
        approvalComment,
        bizId,
        flowRecordList,
        toolbarConfig,
        setColor,
        registerForm,
        handleSuccess,
        handleValidate,
        currentFlowNodeId,
      };
    },
  });
</script>
<style>
  .ant-input-number {
    width: 100% !important;
  }
</style>
