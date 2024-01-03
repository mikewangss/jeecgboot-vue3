import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { Button } from '@/components/Button';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '标题',
    align: 'center',
    dataIndex: 'titile',
  },
  {
    title: '发布时间',
    align: 'center',
    dataIndex: 'sendTime',
  },
  {
    title: '简介',
    align: 'center',
    dataIndex: 'msgAbstract',
  },
  {
    title: '内容',
    align: 'center',
    dataIndex: 'msgContent',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '标题',
    field: 'titile',
    component: 'Input',
  },
  {
    label: '发布时间',
    field: 'sendTime',
    component: 'InputTextArea',
  },
  {
    label: '简介',
    field: 'msgAbstract',
    component: 'Input',
  },
  {
    label: '内容',
    field: 'msgContent',
    component: 'JEditor',
  },

  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
