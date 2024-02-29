<template>
  <BasicDrawer v-bind="$attrs" @register="register2" title="结算申请流程" width="50%">
    <PageWrapper title="结算审批单">
      <template #extra>
        <a-button btnType="primary" type="3" @click="handle(3)" v-if="showApplyButton && currentFlowNodeId == 'start'">提交</a-button>
<!--        <a-button btnType="primary" type="1" @click="handle(1)" v-if="showApplyButton && currentFlowNodeId == 'start'">保存</a-button>-->
        <a-button btnType="primary" type="0" @click="handle(0)" v-if="showApplyButton && currentFlowNodeId != 'start'">通过</a-button>
        <a-button btnType="primary" type="2" @click="handle(2)" danger v-if="showApplyButton && currentFlowNodeId != 'start'">退回</a-button>
      </template>
      <template #footer>
        <a-tabs v-model:activeKey="activeKey" @tabClick="handleChangePanel">
          <a-tab-pane tab="申请明细" key="applyInfo" :forceRender="true">
            <BasicForm @register="registerForm" ref="formRef" />
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
                        <label v-if="item.assigneeName && item.finishTime" style="font-weight: normal; margin-right: 30px"
                          >实际办理人： {{ item.assigneeName }} <a-tag type="info" size="default">{{ item.deptName }}</a-tag></label
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
          <a-tab-pane tab="报审结算材料" key="requestFiles" :forceRender="true">
            <JVxeTable
              :toolbarConfig="toolbarConfig1"
              keep-source
              resizable
              ref="requestFilesRef"
              :disabledRows="requestFilesTable.disabledRows"
              :loading="requestFilesTable.loading"
              :columns="requestFilesTable.columns"
              :dataSource="requestFilesTable.dataSource"
              :height="340"
              :rowNumber="true"
              :rowSelection="true"
              :toolbar="true"
              @save="handleTableSave"
              @removed="handleTableRemove"
              @edit-closed="handleEditClosed"
              @pageChange="handlePageChange"
              @selectRowChange="handleSelectRowChange"
              :linkageConfig="linkageConfig3"
            />
          </a-tab-pane>

          <a-tab-pane tab="变更签证" key="changeFiles" :forceRender="true">
            <JVxeTable
              :toolbarConfig="toolbarConfig1"
              keep-source
              resizable
              ref="changeFilesRef"
              :disabledRows="changeFilesTable.disabledRows"
              :loading="changeFilesTable.loading"
              :columns="changeFilesTable.columns"
              :dataSource="changeFilesTable.dataSource"
              :height="340"
              :rowNumber="true"
              :rowSelection="true"
              :toolbar="true"
              @save="handleTableSave"
              @removed="handleTableRemove"
              @edit-closed="handleEditClosed"
              @pageChange="handlePageChange"
              @selectRowChange="handleSelectRowChange"
              :linkageConfig="linkageConfig1"
            />
          </a-tab-pane>
          <a-tab-pane tab="项目附件" key="projectFiles" :forceRender="true">
            <JVxeTable
              :toolbarConfig="toolbarConfig2"
              keep-source
              resizable
              ref="projectFilesRef"
              :disabledRows="projectFilesTable.disabledRows"
              :loading="projectFilesTable.loading"
              :columns="projectFilesTable.columns"
              :dataSource="projectFilesTable.dataSource"
              :height="340"
              :rowNumber="true"
              :rowSelection="true"
              :toolbar="true"
              @save="handleTableSave"
              @removed="handleTableRemove"
              @edit-closed="handleEditClosed"
              @pageChange="handlePageChange"
              @selectRowChange="handleSelectRowChange"
              :linkageConfig="linkageConfig2"
            />
          </a-tab-pane>
          <a-tab-pane tab="初审材料" key="preliminaryFiles" :forceRender="true" v-if="preliminaryFilesShow">
            <JVxeTable
              :toolbarConfig="toolbarConfig2"
              keep-source
              resizable
              ref="preliminaryFilesRef"
              :loading="preliminaryFilesTable.loading"
              :columns="preliminaryFilesTable.columns"
              :dataSource="preliminaryFilesTable.dataSource"
              :height="340"
              :rowNumber="true"
              :rowSelection="true"
              :toolbar="true"
              @save="handleTableSave"
              @removed="handleTableRemove"
              @edit-closed="handleEditClosed"
              @pageChange="handlePageChange"
              @selectRowChange="handleSelectRowChange"
              :linkageConfig="linkageConfig4"
            />
          </a-tab-pane>
          <a-tab-pane tab="复审材料" key="reviewFiles" :forceRender="true" v-if="reviewFilesShow">
            <JVxeTable
              :toolbarConfig="toolbarConfig3"
              keep-source
              resizable
              ref="reviewFilesRef"
              :loading="reviewFilesTable.loading"
              :columns="reviewFilesTable.columns"
              :dataSource="reviewFilesTable.dataSource"
              :height="340"
              :rowNumber="true"
              :rowSelection="true"
              :toolbar="true"
              @save="handleTableSave"
              @removed="handleTableRemove"
              @edit-closed="handleEditClosed"
              @pageChange="handlePageChange"
              @selectRowChange="handleSelectRowChange"
              :linkageConfig="linkageConfig5"
            />
          </a-tab-pane>
          <a-tab-pane tab="终审材料" key="finalFiles" :forceRender="true" v-if="finalFilesShow">
            <JVxeTable
              :toolbarConfig="toolbarConfig4"
              keep-source
              resizable
              ref="finalFilesRef"
              :loading="finalFilesTable.loading"
              :columns="finalFilesTable.columns"
              :dataSource="finalFilesTable.dataSource"
              :height="340"
              :rowNumber="true"
              :rowSelection="true"
              :toolbar="true"
              @save="handleTableSave"
              @removed="handleTableRemove"
              @edit-closed="handleEditClosed"
              @pageChange="handlePageChange"
              @selectRowChange="handleSelectRowChange"
              :linkageConfig="linkageConfig6"
            />
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageWrapper>
  </BasicDrawer>
  <a-modal :title="modalTaskTitle" :visible="modalTaskVisible" :footer="null" @cancel="handleCancel()">
    <div v-if="modalTaskVisible">
      <div v-if="btnType == handleType.reApply"> 确认无误并重新提交？ </div>
      <a-form :model="form" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 24 }" autocomplete="off" @finish="submitForm">
        <a-form-item v-if="btnType !== handleType.reApply" label="处理意见" name="comment">
          <a-textarea type="textarea" v-model:value="form.comment" :rows="5" />
        </a-form-item>
        <div v-show="btnType == 2">
          <a-form-item label="退回节点" name="targetKey" v-if="returnTaskList.length">
            <a-select v-model:value="form.targetKey" name="targetKey" @change="targetKeyChange">
              <template v-for="item in returnTaskList" :key="`${item.id}`">
                <a-select-option :value="item.id">{{ item.name }}</a-select-option>
              </template>
            </a-select>
          </a-form-item>
          <span v-else>无可退回节点！</span>
        </div>
        <a-form-item :wrapper-col="{ offset: 4, span: 16 }" style="text-align: center; padding-bottom: 20px">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script lang="tsx">
  import { Modal } from 'ant-design-vue';
  import { defineComponent, reactive, ref, toRefs, watch, watchEffect, computed, Ref, UnwrapRef, toRaw, onMounted } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Description } from '/@/components/Description/index';
  import { PageWrapper } from '/@/components/Page';
  import { completeTask, rejectTask, returnList, returnTaskInterface, taskHiList } from '../todoList.api';
  import { useGlobSetting } from '@/hooks/setting';
  import { BasicTable } from '@/components/Table';
  import { schemas } from '@/views/settlement/apply/workflow_data';
  import { queryApplyFilesByProjectId, queryApplyFilesByBizId, getSubFileMenu, batchDelete } from '@/views/settlement/files/ApplyFiles.api';
  import { JVxeTable } from '@/components/jeecg/JVxeTable';
  import { applyFilesColumns } from '@/views/settlement/project/ApplyProject.data';
  import WorkHandleBtn from './WorkHandleBtn.vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { saveOrUpdate } from '@/views/settlement/apply/applyInfo.api';
  import { saveOrUpdateFile, batchDelete as batchDeleteFile, saveOrUpdate as saveOrUpdateFiles } from '@/views/settlement/files/ApplyFiles.api';
  import { JVxeLinkageConfig } from '@/components/jeecg/JVxeTable/src/types';
  import { useMessage } from '@/hooks/web/useMessage';
  import { JVxeTableInstance } from '@/components/jeecg/JVxeTable/types';
  import { useFormRules, useFormValid } from '@/views/sys/login/useLogin';
  import { useUserStore } from '@/store/modules/user';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const { createMessage, createWarningModal } = useMessage();
  const userStore = useUserStore();

  // interface FormState {
  //   name: string;
  //   delivery: boolean;
  //   type: string[];
  //   resource: string;
  //   desc: string;
  // }
  interface FormState {
    comment: string;
    targetKey: string;
    candidateUsersSelecteds: string[];
  }
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
    components: { BasicForm, JVxeTable, BasicTable, Description, PageWrapper, BasicDrawer, WorkHandleBtn },
    props: {
      // showApplyButton: {
      //   type: Boolean,
      //   default: false,
      // },
    },
    emits: ['handeleSuccess'],
    setup(props, { emit }) {
      const currentFlowNodeId = ref('');
      const mockData = ref({});
      const mockData2 = ref({});
      const mockData3 = ref({});
      const finalFilesShow = ref(true);
      const preliminaryFilesShow = ref(true);
      const reviewFilesShow = ref(true);
      const showApplyButton = ref(false);
      const approvalComment = ref('');
      const bizId = ref('');
      const projectId = ref('');
      const requestFilesRef = ref<JVxeTableInstance>();
      const projectFilesRef = ref<JVxeTableInstance>();
      const changeFilesRef = ref<JVxeTableInstance>();
      const preliminaryFilesRef = ref<JVxeTableInstance>();
      const reviewFilesRef = ref<JVxeTableInstance>();
      const finalFilesRef = ref<JVxeTableInstance>();
      const toolbarConfig1 = reactive({
        // add 新增按钮；remove 删除按钮；clearSelection 清空选择按钮
        btn: [],
      });
      const toolbarConfig2 = reactive({
        // add 新增按钮；remove 删除按钮；clearSelection 清空选择按钮
        btn: [],
      });
      const toolbarConfig3 = reactive({
        // add 新增按钮；remove 删除按钮；clearSelection 清空选择按钮
        btn: [],
      });
      const toolbarConfig4 = reactive({
        // add 新增按钮；remove 删除按钮；clearSelection 清空选择按钮
        btn: [],
      });
      const formRef = ref();
      const userid = userStore.getUserInfo?.username;
      // 创建一个响应式引用，用来覆盖 showApplyButton 的值

      // 选择的行
      const selectedRows = ref<Recordable[]>([]);
      // 数据源，控制表格的数据
      const requestFilesTable = reactive({
        loading: false,
        dataSource: [],
        columns: applyFilesColumns,
        show: false,
        disabledRows: {},
      });
      const projectFilesTable = reactive({
        loading: false,
        dataSource: [],
        columns: applyFilesColumns,
        show: false,
        disabledRows: {},
      });
      const changeFilesTable = reactive({
        loading: false,
        dataSource: [],
        columns: applyFilesColumns,
        show: false,
        disabledRows: {},
      });
      const preliminaryFilesTable = reactive({
        loading: false,
        dataSource: [],
        columns: applyFilesColumns,
        show: false,
        disabledRows: {},
      });
      const reviewFilesTable = reactive({
        loading: false,
        dataSource: [],
        columns: applyFilesColumns,
        show: false,
        disabledRows: {},
      });
      const finalFilesTable = reactive({
        loading: false,
        dataSource: [],
        columns: applyFilesColumns,
        show: false,
        disabledRows: {},
      });

      const loading = ref(false);
      const activeKey = ref('applyInfo');
      const glob = useGlobSetting();
      const flowRecordList: Ref<flowRecord[]> = ref([]); // 流程流转数据
      const todoUsers = ref([]);
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
      const btnType = ref(0);
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
      //表单配置
      const [registerForm, { updateSchema, setFieldsValue, getFieldsValue, resetFields, validate, clearValidate }] = useForm({
        labelWidth: 150,
        schemas: schemas,
        showActionButtonGroup: false,
      });
      function checkAndWarnIfDataNotSaved(tableRef) {
        const table = tableRef.value;
        if (table && table.getNewData() && table.getNewData().length > 0) {
          Modal.warning({
            title: '数据未保存',
            content: '当前修改数据未保存，请先点击保存',
          });
          return true; // 表示有未保存的数据
        }
        return false; // 表示数据已保存或者没有表格对象
      }
      async function handleChangePanel(key) {
        // 调用函数进行检查
        if (
          checkAndWarnIfDataNotSaved(requestFilesRef) ||
          checkAndWarnIfDataNotSaved(projectFilesRef) ||
          checkAndWarnIfDataNotSaved(changeFilesRef) ||
          checkAndWarnIfDataNotSaved(preliminaryFilesRef) ||
          checkAndWarnIfDataNotSaved(reviewFilesRef) ||
          checkAndWarnIfDataNotSaved(finalFilesRef)
        ) {
          return;
        }
        activeKey.value = key;
        console.log(key);
        if (key == 'requestFiles') {
          const groupedArray = await queryApplyFilesByBizId({ bizId: bizId.value, fc: 3 });
          requestFilesTable.dataSource = groupedArray;
          if (currentFlowNodeId.value == 'start') {
            //开始节点限制
            let filterRows = [];
            for (const row of groupedArray) {
              if (row['flag'] == '1') {
                filterRows.push(row['id']);
              }
            }
            requestFilesTable.disabledRows = { id: filterRows };
          }
        } else if (key == 'projectFiles') {
          const groupedArray = await queryApplyFilesByProjectId({ projectId: projectId.value, fc: 2 });
          projectFilesTable.dataSource = groupedArray;
          if (currentFlowNodeId.value == 'start') {
            //开始节点限制
            let filterRows = [];
            for (const row of groupedArray) {
              if (row['flag'] == '1') {
                filterRows.push(row['id']);
              }
            }
            projectFilesTable.disabledRows = { id: filterRows };
          }
        } else if (key == 'changeFiles') {
          const groupedArray = await queryApplyFilesByBizId({ bizId: bizId.value, fc: 1 });
          changeFilesTable.dataSource = groupedArray;
          if (currentFlowNodeId.value == 'start') {
            //开始节点限制
            let filterRows = [];
            for (const row of groupedArray) {
              if (row['flag'] == '1') {
                filterRows.push(row['id']);
              }
            }
            changeFilesTable.disabledRows = { id: filterRows };
          }
        } else if (key == 'preliminaryFiles') {
          const groupedArray = await queryApplyFilesByBizId({ bizId: bizId.value, fc: 4 });
          preliminaryFilesTable.dataSource = groupedArray;
        } else if (key == 'reviewFiles') {
          const groupedArray = await queryApplyFilesByBizId({ bizId: bizId.value, fc: 5 });
          reviewFilesTable.dataSource = groupedArray;
        } else if (key == 'finalFiles') {
          const groupedArray = await queryApplyFilesByBizId({ bizId: bizId.value, fc: 6 });
          finalFilesTable.dataSource = groupedArray;
        }
      }

      function updateDisabledStatus(fieldName, disabled) {
        // 直接访问要更新的字段
        const targetField = schemas.find((field) => field.field === fieldName);
        // targetField.componentProps.disabled = false;
        if (targetField) {
          // 更新字段的 disabled 属性
          updateSchema({ ...targetField, required: !disabled, componentProps: { disabled: disabled } });
        }
      }
      async function initaildata(process_instance_id, dataId) {
        const newData = await taskHiList({ process_instance_id: process_instance_id, dataId: dataId });
        bizId.value = newData.formData.id;
        projectId.value = newData.formData.projectId;
        currentFlowNodeId.value = newData.currentFlowNodeId;
        flowRecordList.value = newData.flowList;
        todoUsers.value = newData.todoUsers;
        if (todoUsers.value.includes(userid)) {
          //待办用户是否包含当前用户
          showApplyButton.value = true;
        } else {
          showApplyButton.value = false;
        }
        updateDisabledStatus('amounts', true);
        updateDisabledStatus('reviewDate', true);
        updateDisabledStatus('firstAmounts', true);
        updateDisabledStatus('secondAmounts', true);
        updateDisabledStatus('thirdAmounts', true);
        updateDisabledStatus('totalArea', true);
        if (currentFlowNodeId.value) {
          console.log(currentFlowNodeId);
          if (currentFlowNodeId.value == 'start') {
            //申请节点
            toolbarConfig1.btn = ['add', 'save', 'remove', 'clearSelection'];
            preliminaryFilesShow.value = false;
            reviewFilesShow.value = false;
            finalFilesShow.value = false;
            updateDisabledStatus('amounts', false);
            updateDisabledStatus('reviewDate', false);
            updateDisabledStatus('flag', false);
          } else if (
            //当前审批节点-初审
            currentFlowNodeId.value == 'Activity_061uiis' ||
            currentFlowNodeId.value == 'Activity_0ujjxwl' ||
            currentFlowNodeId.value == 'Activity_1keife4'
          ) {
            toolbarConfig2.btn = ['add', 'save', 'remove', 'clearSelection'];
            updateDisabledStatus('firstAmounts', false);
            updateDisabledStatus('totalArea', false);
            //申请节点
            reviewFilesShow.value = false;
            finalFilesShow.value = false;
          } else if (
            //当前审批节点-二审
            currentFlowNodeId.value == 'Activity_1vhi94l' ||
            currentFlowNodeId.value == 'Activity_11yqg39' ||
            currentFlowNodeId.value == 'Activity_0tvz5zl'
          ) {
            toolbarConfig3.btn = ['add', 'save', 'remove', 'clearSelection'];
            updateDisabledStatus('secondAmounts', false);
            finalFilesShow.value = false;
          } else if (
            //当前审批节点-三审
            currentFlowNodeId.value == 'Activity_18zvw97' ||
            currentFlowNodeId.value == 'Activity_0lwfr9d'
          ) {
            toolbarConfig4.btn = ['add', 'save', 'remove', 'clearSelection'];
            updateDisabledStatus('thirdAmounts', false);
          } else {
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

      // 【整体保存】点击保存按钮时触发的事件
      function handleTableSave({ $table, target }) {
        debugger;
        // 校验整个表格
        $table.validate().then((errMap) => {
          // 校验通过
          if (!errMap) {
            // 获取所有数据
            let tableData = target.getTableData();
            console.log('当前保存的数据是：', tableData);
            // 获取新增的数据
            let newData = target.getNewData();
            console.log('-- 新增的数据：', newData);
            // 获取删除的数据
            let deleteData = target.getDeleteData();
            console.log('-- 删除的数据：', deleteData);
            // 【模拟保存】
            loading.value = true;
            if (newData.length > 0) {
              newData.forEach((obj, index) => {
                // 在这里进行赋值操作
                obj.bizId = bizId.value;
                obj.projectId = projectId.value;
              });
              saveOrUpdateFile(newData, false);
            }
            if (deleteData.length > 0) {
              batchDeleteFile(deleteData, () => {
                loading.value = false;
                return 'success';
              });
            }
            // 清空删除数据
            target.removeInsertRow();
          }
        });
      }
      function handleDeleteSuccess() {
        createMessage.success('删除成功');
      }
      // 触发单元格删除事件
      async function handleTableRemove(event) {
        // 把 event.deleteRows 传给后台进行删除（注意：这里不会传递前端逻辑新增的数据，因为不需要请求后台删除）
        console.log('待删除的数据: ', event.deleteRows);
        // 也可以只传ID，因为可以根据ID删除
        let deleteIds = event.deleteRows.map((row) => row.id);
        console.log('待删除的数据ids: ', deleteIds);
        // 模拟请求后台删除
        loading.value = true;
        const res = await batchDelete({ ids: deleteIds }, handleDeleteSuccess);
        loading.value = false;
        console.log('..' + res);
        // 假设后台返回删除成功，必须要调用 confirmRemove() 方法，才会真正在表格里移除（会同时删除选中的逻辑新增的数据）
        if (res.success) {
          event.confirmRemove();
        }
      }

      // 单元格编辑完成之后触发的事件
      async function handleEditClosed(event) {
        let { $table, row, column } = event;
        let field = column.property;
        // 判断单元格值是否被修改
        if ($table.isUpdateByRow(row, field)) {
          // 校验当前行
          $table.validate(row).then((errMap) => {
            // 校验通过
            if (!errMap) {
              // 【模拟保存】
              // let hideLoading = createMessage.loading(`正在保存"${column.title}"`, 0);
              console.log('即时保存数据：', row);
              saveOrUpdateFiles(row, true);
            }
          });
        }
      }
      /**
       * 判断是否有模板操作权限
       */
      function hasAuth() {
        return hasPermission('drag:template:edit');
      }
      // 当分页参数变化时触发的事件
      function handlePageChange(event) {}

      // 当选择的行变化时触发的事件
      function handleSelectRowChange(event) {
        selectedRows.value = event.selectedRows;
      }
      // const resConfig = async function requestFileType(parent) {
      //   let result;
      //   result = await getSubFileMenu({ parent: parent });
      //   // 返回的数据里必须包含 value 和 text 字段
      //   return result.map((item) => ({ value: item.id, text: item.name }));
      // };
      const resConfig = async function requestFileType(parent, filterId) {
        let result;
        result = await getSubFileMenu({ parent: parent });
        // 返回的数据里必须包含 value 和 text 字段
        return result.filter((item) => item.id === filterId || item.parent === filterId).map((item) => ({ value: item.id, text: item.name }));
      };
      const linkageConfig1 = ref<JVxeLinkageConfig[]>([
        // 可配置多个联动
        { requestData: (parent) => resConfig(parent, '1'), key: 'fc' },
      ]);
      const linkageConfig2 = ref<JVxeLinkageConfig[]>([
        // 可配置多个联动
        { requestData: (parent) => resConfig(parent, '2'), key: 'fc' },
      ]);
      const linkageConfig3 = ref<JVxeLinkageConfig[]>([
        // 可配置多个联动
        { requestData: (parent) => resConfig(parent, '3'), key: 'fc' },
      ]);
      const linkageConfig4 = ref<JVxeLinkageConfig[]>([
        // 可配置多个联动
        { requestData: (parent) => resConfig(parent, '4'), key: 'fc' },
      ]);
      const linkageConfig5 = ref<JVxeLinkageConfig[]>([
        // 可配置多个联动
        { requestData: (parent) => resConfig(parent, '5'), key: 'fc' },
      ]);
      const linkageConfig6 = ref<JVxeLinkageConfig[]>([
        // 可配置多个联动
        { requestData: (parent) => resConfig(parent, '6'), key: 'fc' },
      ]);
      function handleSuccess() {}
      /** 查询后台真实数据 */
      async function submitForm() {
        if (
          checkAndWarnIfDataNotSaved(requestFilesRef) ||
          checkAndWarnIfDataNotSaved(projectFilesRef) ||
          checkAndWarnIfDataNotSaved(changeFilesRef) ||
          checkAndWarnIfDataNotSaved(preliminaryFilesRef) ||
          checkAndWarnIfDataNotSaved(reviewFilesRef) ||
          checkAndWarnIfDataNotSaved(finalFilesRef)
        ) {
          return;
        }
        if (btnType.value != handleType.back && btnType.value != handleType.return) {
          const data = await validate();
          if (!data) {
            return;
          }
        }
        debugger;
        let formdata = getFieldsValue();
        saveOrUpdate(formdata, true, handelSubmit);
      }

      function handle(type) {
        btnType.value = type;
        form.comment = '';
        if (type === handleType.delegate) {
          // delegateTask();
        } else if (type === handleType.pass) {
          passTask();
        } else if (type === handleType.back) {
          backTask();
        } else if (type === handleType.return) {
          returnTask();
        } else if (type === handleType.reApply) {
          reApply();
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
        returnList({ dataId: bizId.value }).then((res) => {
          returnTaskList.value = res || [];
          // console.log(returnTaskList)
        });
      }

      async function handelSubmit() {
        console.log('提交');
        submitLoading.value = true;
        var formData = {
          dataId: bizId.value,
          candidateUsers: form.candidateUsersSelecteds,
          values: {},
          comment: form.comment,
          targetKey: form.targetKey,
        };
        if (btnType.value == handleType.reApply) {
          formData.comment = '重新提交';
        }
        if (!formData.comment) {
          $message.createErrorModal({ title: 'Tip', content: '请输入审批意见！' });
          submitLoading.value = false;
          return;
        }
        if (btnType.value == handleType.reApply || btnType.value == handleType.pass) {
          // 通过
          completeTask(formData)
            .then((res) => {
              submitLoading.value = false;
              if (res == 'success') {
                // $message.createSuccessModal({ title: 'Tip', content: '操作成功' });
                emit('success');
              } else {
                // $message.createErrorModal({ title: 'Tip', content: '操作失败' });
              }
            })
            .finally(() => {
              submitLoading.value = false;
              modalTaskVisible.value = false;
            });
        } else if (btnType.value == handleType.back) {
          // 驳回
          rejectTask(formData)
            .then((res) => {
              submitLoading.value = false;
              if (res == 'success') {
                // $message.createSuccessModal({ title: 'Tip', content: '操作成功' });
                emit('success');
              } else {
                // $message.createErrorModal({ title: 'Tip', content: '操作失败' });
              }
            })
            .finally(() => {
              submitLoading.value = false;
              modalTaskVisible.value = false;
            });
        } else if (btnType.value == handleType.return) {
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
                // $message.createSuccessModal({ title: 'Tip', content: '操作成功' });
                modalTaskVisible.value = false;
                emit('success');
              } else {
                // $message.createErrorModal({ title: 'Tip', content: '操作失败' });
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
      return {
        mockData,
        mockData2,
        mockData3,
        schemas,
        register2,
        glob,
        activeKey,
        requestFilesTable,
        projectFilesTable,
        changeFilesTable,
        finalFilesTable,
        preliminaryFilesTable,
        reviewFilesTable,
        finalFilesShow,
        preliminaryFilesShow,
        reviewFilesShow,
        handleChangePanel,
        approvalComment,
        bizId,
        flowRecordList,
        toolbarConfig1,
        toolbarConfig2,
        toolbarConfig3,
        toolbarConfig4,
        linkageConfig1,
        linkageConfig2,
        linkageConfig3,
        linkageConfig4,
        linkageConfig5,
        linkageConfig6,
        handleTableSave,
        handleTableRemove,
        handleEditClosed,
        handlePageChange,
        handleSelectRowChange,
        setColor,
        registerForm,
        submitForm,
        currentFlowNodeId,
        requestFilesRef,
        projectFilesRef,
        changeFilesRef,
        preliminaryFilesRef,
        reviewFilesRef,
        finalFilesRef,
        handle,
        handelSubmit,
        handleCancel,
        modalTaskTitle,
        modalTaskVisible,
        returnTaskList,
        targetKeyChange,
        btnType,
        handleType,
        form,
        formRef,
        showApplyButton,
      };
    },
  });
</script>
<style>
  .ant-input-number {
    width: 100% !important;
  }
</style>
