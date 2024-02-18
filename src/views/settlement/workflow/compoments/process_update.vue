<template>
  <BasicDrawer v-bind="$attrs" @register="register2" title="结算申请流程" width="50%">
    <PageWrapper title="结算审批单">
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
        <!--        <WorkHandleBtn-->
        <!--          @handleSuccess="handleSuccess"-->
        <!--          :dataId="bizId"-->
        <!--          :type="1"-->
        <!--          text="驳回"-->
        <!--          v-if="currentFlowNodeId != 'start'"-->
        <!--          :candidateUsers="[]"-->
        <!--          :variables="{ assigneeList: [], outcome: '驳回' }"-->
        <!--        />-->
        <WorkHandleBtn
          @handleSuccess="handleSuccess"
          :dataId="bizId"
          :type="2"
          text="退回"
          v-if="currentFlowNodeId != 'start'"
          :candidateUsers="[]"
          :variables="{ assigneeList: [], outcome: '退回' }"
        />
      </template>
      <template #footer>
        <a-tabs v-model:activeKey="activeKey" @tabClick="handleChangePanel">
          <a-tab-pane tab="申请明细" key="applyInfo" :forceRender="true">
            <BasicForm @register="registerForm" />
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

                        <p v-if="item.comment">
                          <!--  1 正常意见  2 退回意见 3 驳回意见                -->
                          <a-tag color="green" v-if="item.comment.type === '1'">
                            <span v-if="item.comment.comment != '重新提交'">通过：</span>
                            {{ item.comment.comment }}
                          </a-tag>
                          <a-tag color="orange" v-if="item.comment.type === '2'">退回： {{ item.comment.comment }}</a-tag>
                          <a-tag color="red" v-if="item.comment.type === '3'">驳回： {{ item.comment.comment }}</a-tag>
                        </p>
                      </a-card>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </a-row>
            </a-card>
          </a-tab-pane>
          <a-tab-pane tab="报审结算材料" key="requestFiles" :forceRender="true">
            <JVxeTable
              :toolbarConfig="toolbarConfig"
              keep-source
              resizable
              ref="requestFiles"
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
              :linkageConfig="linkageConfig"
            />
          </a-tab-pane>
          <a-tab-pane tab="项目附件" key="projectFiles" :forceRender="true">
            <JVxeTable
              :toolbarConfig="toolbarConfig"
              keep-source
              resizable
              ref="projectFiles"
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
              :linkageConfig="linkageConfig"
            />
          </a-tab-pane>
          <a-tab-pane tab="变更签证" key="changeFiles" :forceRender="true">
            <JVxeTable
              :toolbarConfig="toolbarConfig"
              keep-source
              resizable
              ref="changeFiles"
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
              :linkageConfig="linkageConfig"
            />
          </a-tab-pane>
          <a-tab-pane tab="初审材料" key="preliminaryFiles" :forceRender="true" v-if="preliminaryFilesShow">
            <JVxeTable
              :toolbarConfig="toolbarConfig"
              keep-source
              resizable
              ref="preliminaryFiles"
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
              :linkageConfig="linkageConfig"
            />
          </a-tab-pane>
          <a-tab-pane tab="复审材料" key="reviewFiles" :forceRender="true" v-if="reviewFilesShow">
            <JVxeTable
              :toolbarConfig="toolbarConfig"
              keep-source
              resizable
              ref="reviewFiles"
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
              :linkageConfig="linkageConfig"
            />
          </a-tab-pane>
          <a-tab-pane tab="终审材料" key="finalFiles" :forceRender="true" v-if="finalFilesShow">
            <JVxeTable
              :toolbarConfig="toolbarConfig"
              keep-source
              resizable
              ref="finalFiles"
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
              :linkageConfig="linkageConfig"
            />
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageWrapper>
  </BasicDrawer>
</template>

<script lang="tsx">
  import { defineComponent, reactive, ref, toRefs, watch, watchEffect, computed, Ref, UnwrapRef, toRaw, onMounted } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Description } from '/@/components/Description/index';
  import { PageWrapper } from '/@/components/Page';
  import { taskHiList } from '../todoList.api';
  import { useGlobSetting } from '@/hooks/setting';
  import { BasicTable } from '@/components/Table';
  import { schemas } from '@/views/settlement/apply/workflow_data';
  import {
    queryApplyFilesByProjectId,
    queryApplyFilesByBizId,
    getSubFileMenu,
    batchDelete,
  } from '@/views/settlement/files/ApplyFiles.api';
  import { JVxeTable } from '@/components/jeecg/JVxeTable';
  import { applyFilesColumns } from '@/views/settlement/project/ApplyProject.data';
  import WorkHandleBtn from './WorkHandleBtn.vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { saveOrUpdate } from '@/views/settlement/apply/applyInfo.api';
  import { saveOrUpdateFile, batchDelete as batchDeleteFile,saveOrUpdate as saveOrUpdateFiles } from '@/views/settlement/files/ApplyFiles.api';
  import { JVxeLinkageConfig } from '@/components/jeecg/JVxeTable/src/types';
  import { useMessage } from '@/hooks/web/useMessage';
  const { createMessage, createWarningModal } = useMessage();
  interface FormState {
    name: string;
    delivery: boolean;
    type: string[];
    resource: string;
    desc: string;
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
      showApplyButton: {
        type: Boolean,
        default: false,
      },
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
      const approvalComment = ref('');
      const bizId = ref('');
      const projectId = ref('');
      const toolbarConfig = reactive({
        // add 新增按钮；remove 删除按钮；clearSelection 清空选择按钮
        btn: ['add', 'save', 'remove', 'clearSelection'],
      });
      // 选择的行
      const selectedRows = ref<Recordable[]>([]);
      // 数据源，控制表格的数据
      const requestFilesTable = reactive({
        loading: false,
        dataSource: [],
        columns: applyFilesColumns,
        show: false,
      });
      const projectFilesTable = reactive({
        loading: false,
        dataSource: [],
        columns: applyFilesColumns,
        show: false,
      });
      const changeFilesTable = reactive({
        loading: false,
        dataSource: [],
        columns: applyFilesColumns,
        show: false,
      });
      const preliminaryFilesTable = reactive({
        loading: false,
        dataSource: [],
        columns: applyFilesColumns,
        show: false,
      });
      const reviewFilesTable = reactive({
        loading: false,
        dataSource: [],
        columns: applyFilesColumns,
        show: false,
      });
      const finalFilesTable = reactive({
        loading: false,
        dataSource: [],
        columns: applyFilesColumns,
        show: false,
      });
      const loading = ref(false);
      const activeKey = ref('applyInfo');
      const glob = useGlobSetting();
      const flowRecordList: Ref<flowRecord[]> = ref([]); // 流程流转数据
      //表单配置
      const [registerForm, { updateSchema, setFieldsValue, getFieldsValue, resetFields, validate, clearValidate }] = useForm({
        labelWidth: 150,
        schemas: schemas,
        showActionButtonGroup: false,
      });
      async function handleChangePanel(key) {
        activeKey.value = key;
        console.log(key);
        if (key == 'requestFiles') {
          const groupedArray = await queryApplyFilesByBizId({ bizId: bizId.value, fc: 3 });
          requestFilesTable.dataSource = groupedArray;
        } else if (key == 'projectFiles') {
          const groupedArray = await queryApplyFilesByProjectId({ projectId: projectId.value, fc: 2 });
          projectFilesTable.dataSource = groupedArray;
        } else if (key == 'changeFiles') {
          const groupedArray = await queryApplyFilesByBizId({ bizId: bizId.value, fc: 1 });
          changeFilesTable.dataSource = groupedArray;
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
      onMounted(async () => {});
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
            preliminaryFilesShow.value = false;
            reviewFilesShow.value = false;
            finalFilesShow.value = false;
            updateDisabledStatus('amounts', false);
            updateDisabledStatus('reviewDate', false);
          } else if (currentFlowNodeId.value == 'Activity_061uiis' || currentFlowNodeId.value == 'Activity_0ujjxwl') {
            //当前审批节点-初审
            updateDisabledStatus('firstAmounts', false);
            updateDisabledStatus('totalArea', false);
          } else if (currentFlowNodeId.value == 'Activity_1ltzfvn' || currentFlowNodeId.value == 'Activity_1vhi94l') {
            updateDisabledStatus('secondAmounts', false);
          } else if (currentFlowNodeId.value == 'Activity_18zvw97' || currentFlowNodeId.value == 'Activity_1ltzfvn') {
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

      // 当分页参数变化时触发的事件
      function handlePageChange(event) {}

      // 当选择的行变化时触发的事件
      function handleSelectRowChange(event) {
        selectedRows.value = event.selectedRows;
      }
      // 联动配置
      const linkageConfig = ref<JVxeLinkageConfig[]>([
        // 可配置多个联动
        { requestData: requestFileType, key: 'fc' },
      ]);
      /** 查询后台真实数据 */
      async function requestFileType(parent) {
        let result;
        result = await getSubFileMenu({ parent: parent });
        // 返回的数据里必须包含 value 和 text 字段
        return result.map((item) => ({ value: item.id, text: item.name }));
      }
      function handleSuccess() {
        let data = getFieldsValue();
        saveOrUpdate(data, true);
        emit('success');
      }
      async function handleValidate() {
        debugger;
        const values = await validate();
        console.log(values);
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
        toolbarConfig,
        linkageConfig,
        handleTableSave,
        handleTableRemove,
        handleEditClosed,
        handlePageChange,
        handleSelectRowChange,
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
