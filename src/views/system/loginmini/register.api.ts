import { defHttp, wfHttp } from '/@/utils/http/axios';
import { useMessage } from '@/hooks/web/useMessage';
const { createConfirm } = useMessage();
enum Api {
  supplierRegister = '/settlement/applySupplier/supplierRegister',
}

/**
 * 供应商注册
 * @param params
 */
export const supplierRegister = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认提交吗',
    content: '请确认提交信息是否正确',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp
        .post({ url: Api.supplierRegister, params })
        .then(() => {
          //成功200
          handleSuccess();
        })
        .catch((error) => {
          // 处理错误，例如显示错误消息，4xx 或 5xx）的情况下，Promise 被视为被拒绝
          console.error('API 错误:', error);
          // handleError();
        });
    },
  });
};
