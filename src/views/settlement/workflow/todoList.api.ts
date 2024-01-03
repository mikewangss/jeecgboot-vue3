import { defHttp, wfHttp } from '/@/utils/http/axios';

enum Api {
  todoList = '/workflow/todoList',
  completeList = '/workflow/historicTaskList',
  apply = '/workflow/apply',
  taskHiList = '/workflow/taskHiList',
  reject = '/workflow/reject',
  queryByProcessId = '/settlement/applyInfo/queryByProcessId',
}

/**
 * 列表接口
 * @param params
 */
export const todoList = (params) => wfHttp.get({ url: Api.todoList, params });
/**
 * 列表接口
 * @param params
 */
export const completeList = (params) => wfHttp.get({ url: Api.completeList, params });
/**
 * 列表接口
 * @param params
 */
export const taskHiList = (params) => {
  return wfHttp.get({ url: Api.taskHiList, params });
};
/**
 * 获取单个
 */
export const queryByProcessId = (params) => {
  return defHttp.get({ url: Api.queryByProcessId, params });
};
/**
 * 同意
 */
export const apply = (params) => {
  return wfHttp.post({ url: Api.apply, params });
};
/**
 * 拒绝
 */
export const reject = (params) => {
  return wfHttp.get({ url: Api.reject, params });
};
