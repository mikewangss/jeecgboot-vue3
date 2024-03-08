<template>
  <BasicDrawer v-bind="$attrs" @register="register2" title="流程审批单" width="70%">
    <PageWrapper title="申请详情">
      <template #footer>
        <a-tabs v-model:activeKey="activeKey" @tabClick="handleChangePanel">
          <a-tab-pane tab="申请明细" key="applyInfo" :forceRender="true">
            <Description
              title="结算申请信息"
              :collapseOptions="{ canExpand: true, helpMessage: 'help me' }"
              :column="2"
              :data="mockData"
              :schema="schema"
            />
            <Description
              title="项目基本信息"
              :collapseOptions="{ canExpand: true, helpMessage: 'help me' }"
              :column="2"
              :data="mockData2"
              :schema="schema2"
            />
            <Description
              title="合同基本信息"
              :collapseOptions="{ canExpand: true, helpMessage: 'help me' }"
              :column="2"
              :data="mockData3"
              :schema="schema3"
            />
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
                        <label v-if="item.assigneeName" style="font-weight: normal; margin-right: 30px"
                          >办理人： {{ item.assigneeName }}({{ item.assigneeId }})</label
                        >
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
          <a-tab-pane tab="报审结算材料" key="requestFiles" :forceRender="true">
            <JVxeTable
              keep-source
              resizable
              ref="requestFiles"
              :loading="requestFilesTable.loading"
              :columns="requestFilesTable.columns"
              :dataSource="requestFilesTable.dataSource"
              :height="340"
              :rowNumber="true"
              :rowSelection="true"
              :toolbar="false"
              :disabled="true"
              :linkageConfig="linkageConfig"
            />
          </a-tab-pane>
          <a-tab-pane tab="项目附件" key="projectFiles" :forceRender="true">
            <JVxeTable
              keep-source
              resizable
              ref="projectFiles"
              :loading="projectFilesTable.loading"
              :columns="projectFilesTable.columns"
              :dataSource="projectFilesTable.dataSource"
              :height="340"
              :rowNumber="true"
              :rowSelection="true"
              :toolbar="false"
              :disabled="true"
              :linkageConfig="linkageConfig"
            />
          </a-tab-pane>
          <a-tab-pane tab="变更签证" key="changeFiles" :forceRender="true">
            <JVxeTable
              keep-source
              resizable
              ref="changeFiles"
              :loading="changeFilesTable.loading"
              :columns="changeFilesTable.columns"
              :dataSource="changeFilesTable.dataSource"
              :height="340"
              :rowNumber="true"
              :rowSelection="true"
              :toolbar="false"
              :disabled="true"
              :linkageConfig="linkageConfig"
            />
          </a-tab-pane>
          <a-tab-pane tab="初审材料" key="preliminaryFiles" :forceRender="true" v-if="preliminaryFilesShow">
            <JVxeTable
              keep-source
              resizable
              ref="preliminaryFiles"
              :loading="preliminaryFilesTable.loading"
              :columns="preliminaryFilesTable.columns"
              :dataSource="preliminaryFilesTable.dataSource"
              :height="340"
              :rowNumber="true"
              :rowSelection="true"
              :toolbar="false"
              :disabled="true"
              :linkageConfig="linkageConfig"
            />
          </a-tab-pane>
          <a-tab-pane tab="复审材料" key="reviewFiles" :forceRender="true" v-if="reviewFilesShow">
            <JVxeTable
              keep-source
              resizable
              ref="reviewFiles"
              :loading="reviewFilesTable.loading"
              :columns="reviewFilesTable.columns"
              :dataSource="reviewFilesTable.dataSource"
              :height="340"
              :rowNumber="true"
              :rowSelection="true"
              :toolbar="false"
              :disabled="true"
              :linkageConfig="linkageConfig"
            />
          </a-tab-pane>
          <a-tab-pane tab="终审材料" key="finalFiles" :forceRender="true" v-if="finalFilesShow">
            <JVxeTable
              keep-source
              resizable
              ref="finalFiles"
              :loading="finalFilesTable.loading"
              :columns="finalFilesTable.columns"
              :dataSource="finalFilesTable.dataSource"
              :height="340"
              :rowNumber="true"
              :rowSelection="true"
              :toolbar="false"
              :disabled="true"
              :linkageConfig="linkageConfig"
            />
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageWrapper>
  </BasicDrawer>
</template>

<script lang="tsx">
  import { defineComponent, reactive, ref, Ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Description } from '/@/components/Description/index';
  import { PageWrapper } from '/@/components/Page';
  import { taskHiList } from '../todoList.api';
  import { useGlobSetting } from '@/hooks/setting';
  import { BasicTable } from '@/components/Table';
  import { schema, schema2, schema3 } from '@/views/settlement/apply/workflow_data';
  import { getSubFileMenu, queryApplyFilesByBizId, queryApplyFilesByProjectId } from '@/views/settlement/files/ApplyFiles.api';
  import { JVxeTable } from '@/components/jeecg/JVxeTable';
  import { applyFilesColumns } from '@/views/settlement/project/ApplyProject.data';
  import WorkHandleBtn from './WorkHandleBtn.vue';
  import { JVxeLinkageConfig } from '@/components/jeecg/JVxeTable/src/types';
  import { useUserStore } from '@/store/modules/user';
  import { JUploadModal } from '@/components/Form/src/jeecg/components/JUpload';

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
    components: { JUploadModal, JVxeTable, BasicTable, Description, PageWrapper, BasicDrawer, WorkHandleBtn },
    props: {
      showApplyButton: {
        type: Boolean,
        default: false,
      },
    },
    setup(props) {
      const userStore = useUserStore();
      const username = userStore.getUserInfo?.username;
      const currentFlowNodeId = ref('');
      const mockData = ref({});
      const mockData2 = ref({});
      const mockData3 = ref({});
      const finalFile = ref('');
      const finalFilesShow = ref(true);
      const preliminaryFilesShow = ref(true);
      const reviewFilesShow = ref(true);
      const approvalComment = ref('');
      const bizId = ref('');
      const projectId = ref('');
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
      const submitLoading = ref(false);
      const activeKey = ref('applyInfo');
      const glob = useGlobSetting();
      const flowRecordList: Ref<flowRecord[]> = ref([]); // 流程流转数据
      async function initaildata(process_instance_id, dataId) {
        const newData = await taskHiList({ process_instance_id: process_instance_id, dataId: dataId });
        mockData.value = newData.formData;
        mockData2.value = newData.formData;
        mockData3.value = newData.formData;
        finalFile.value = newData.formData.finalFile;
        bizId.value = newData.formData.id;
        projectId.value = newData.formData.projectId;
        currentFlowNodeId.value = newData.currentFlowNodeId;
        flowRecordList.value = newData.flowList;
        if (newData.formData.createBy === username) {
          //申请节点
          preliminaryFilesShow.value = false;
          reviewFilesShow.value = false;
          finalFilesShow.value = false;
        }
      }
      const [register2] = useDrawerInner((data) => {
        initaildata(data.process_instance_id, data.bizId);
      });
      function handleReset() {
        approvalComment.value = '';
      }
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
      function setColor(val) {
        if (val) {
          return '#2bc418';
        } else {
          return '#b3bdbb';
        }
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
      function handeleSuccess() {}
      return {
        mockData,
        mockData2,
        mockData3,
        schema,
        schema2,
        schema3,
        register2,
        glob,
        linkageConfig,
        activeKey,
        requestFilesTable,
        projectFilesTable,
        changeFilesTable,
        finalFilesTable,
        preliminaryFilesTable,
        reviewFilesTable,
        approvalComment,
        handeleSuccess,
        bizId,
        flowRecordList,
        setColor,
        handleChangePanel,
        finalFilesShow,
        preliminaryFilesShow,
        reviewFilesShow,
        finalFile,
      };
    },
  });
</script>
