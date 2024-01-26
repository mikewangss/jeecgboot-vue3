import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  listDefinition = '/flowable/definition/list',
  delete = '/flowable/definition/delete',
  readXml = '/flowable/definition/readXml/',
  saveXml = '/flowable/definition/save',
  userList = '/flowable/definition/userList',
  positionList = '/flowable/definition/positionList',
  roleList = '/flowable/definition/roleList',
  deleteBatch = '/flowable/definition/deleteBatch',
}
/**
 * 列表接口
 * @param params
 */
export const listDefinition = (params) => defHttp.get({ url: Api.listDefinition, params });
export const categoryList = (params) => defHttp.get({ url: Api.listDefinition, params });
export const delDeployment = (params) => defHttp.get({ url: Api.listDefinition, params });
export const readXml = (params) => defHttp.get({ url: Api.readXml, params });
export const roleList = (params) => defHttp.get({ url: Api.roleList, params });
export const saveXml = (params) => defHttp.post({ url: Api.saveXml, params });
export const updateState = (params) => defHttp.get({ url: Api.listDefinition, params });
export const userList = (params) => defHttp.get({ url: Api.userList, params });
export const positionList = (params) => defHttp.get({ url: Api.positionList, params });
export const saveOrUpdate = (params) => defHttp.post({ url: Api.saveXml, params });
/**
 * 删除单个
 */
export const deleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.delete, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
