import { defHttp } from '/@/utils/http/axios';

enum Api {
  todoList = '/flowable/task/todoList',
  completeList = '/flowable/task/finishedList',
  rejectTask = '/flowable/task/taskRejectByDataId',
  backTask = '/flowable/task/taskReturnByDataId',
  taskHiList = '/flowable/task/flowRecord',
  returnList = '/flowable/task/findReturnTaskListByDataId',
  completeTask = '/flowable/task/completeByDateId',
  getFlowViewerByDataId = '/flowable/task/flowViewerByDataId/',
  readXmlByDataId = '/flowable/definition/readXmlByDataId/',
}
/**
 * 列表接口
 * @param params
 */
export const readXmlByDataId = (params) => defHttp.get({ url: Api.readXmlByDataId, params });
/**
 * 列表接口
 * @param params
 */
export const getFlowViewerByDataId = (params) => defHttp.get({ url: Api.getFlowViewerByDataId, params });
/**
 * 列表接口
 * @param params
 */
export const todoList = (params) => defHttp.get({ url: Api.todoList, params });
/**
 * 列表接口
 * @param params
 */
export const completeList = (params) => defHttp.get({ url: Api.completeList, params });
/**
 * 列表接口
 * @param params
 */
export const taskHiList = (params) => defHttp.get({ url: Api.taskHiList, params });
/**
 * 同意
 */
export const completeTask = (params) => {
  return defHttp.post({ url: Api.completeTask, params });
};
// export const completeTask = (params) => {
//   return new Promise((resolve) => {
//     defHttp.post({ url: Api.completeTask, params }).then((res) => {
//       console.log(res);
//       resolve(res);
//     });
//   });
// };
/**
 * 拒绝
 */
export const rejectTask = (params) => defHttp.post({ url: Api.rejectTask, params });

/**
 * 退回
 */
export const returnList = (params) => defHttp.post({ url: Api.returnList, params });

// 退回任务
export const returnTaskInterface = (params) => defHttp.post({ url: Api.backTask, params });
