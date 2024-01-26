import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '任务节点名称',
    align: 'center',
    dataIndex: 'taskName',
  },
  {
    title: '任务ID',
    align: 'center',
    dataIndex: 'taskId',
  },
  {
    title: '流程名称',
    align: 'center',
    dataIndex: 'procDefName',
  },
  {
    title: '申请人',
    align: 'center',
    dataIndex: 'startUserName',
  },
  {
    title: '申请人所在部门',
    align: 'center',
    dataIndex: 'startDeptName',
  },
  {
    title: 'procDefId',
    align: 'center',
    dataIndex: 'procDefId',
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
  },
];

//查询数据
export const searchFormSchema: FormSchema[] = [];
