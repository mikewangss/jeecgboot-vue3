import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '任务ID',
    align: 'center',
    dataIndex: 'task_id',
  },
  {
    title: '办理人',
    align: 'center',
    dataIndex: 'assignee',
  },
  {
    title: '优先级',
    align: 'center',
    dataIndex: 'priority',
  },
  {
    title: '节点名称',
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: 'ProcessInstanceId',
    align: 'center',
    dataIndex: 'process_instance_id',
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'create_time',
  },
  {
    title: '办理状态',
    align: 'center',
    dataIndex: 'end_time',
    // 使用插槽渲染列内容，根据结束时间的有无显示不同的状态
    slots: { customRender: 'endTimeSlot' },
  },
];

//查询数据
export const searchFormSchema: FormSchema[] = [];
