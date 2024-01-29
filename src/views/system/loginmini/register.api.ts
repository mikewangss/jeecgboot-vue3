import { defHttp, wfHttp } from '/@/utils/http/axios';

enum Api {
  supplierRegister = '/settlement/applySupplier/supplierRegister',
}

/**
 * 供应商注册
 * @param params
 */
export const supplierRegister = (params) => {
  return defHttp.post({ url: Api.supplierRegister, params });
};
