import { FormSchema } from '/@/components/Form';
import { useUserStore } from '@/store/modules/user';
import { supplierListApi } from '@/views/settlement/supplier/ApplySupplier.api';
import { getAuthCache } from '@/utils/auth';
import { LoginInfo } from '#/store';
import { LOGIN_INFO_KEY } from '@/enums/cacheEnum';
import { contractListApi, projectListApi, queryContractById } from '@/views/settlement/project/ApplyProject.api';
import { getDeptList } from '@/api/demo/system';
import { userList } from '@/views/flowable/api/defination.api';
const userStore = useUserStore();
const username = userStore.getUserInfo?.username;
const userid = getAuthCache<LoginInfo>(LOGIN_INFO_KEY).userInfo.id;
const dynamicDefaultValue = '结算申请流程-' + username + '-' + getCurrentYearMonthDay();

export const step1Schemas: FormSchema[] = [
  {
    label: '标题',
    component: 'Input',
    field: 'name',
    defaultValue: dynamicDefaultValue,
    required: true,
  },
  {
    label: '施工单位',
    component: 'ApiSelect',
    field: 'supplierId',
    componentProps: {
      api: supplierListApi,
      params: {
        userid: userid,
      },
      resultField: 'list',
      labelField: 'supplierName',
      valueField: 'id',
    },
    required: true,
  },
  {
    label: '项目',
    component: 'ApiSelect',
    field: 'projectId',
    componentProps: ({ formModel, formActionType }) => {
      return {
        api: projectListApi,
        params: {
          userid: userid,
        },
        resultField: 'list',
        labelField: 'name',
        valueField: 'id',
        onChange: async (e: any) => {
          if (e) {
            console.log(e);
            contractListApi({ id: e }).then((res) => {
              const contractList = res || [];
              contractList.map((o) => {
                o.label = o.contractName;
                o.value = o.id;
                o.key = o.id;
              });
              formModel.contractId = undefined; //  reset city value
              const { updateSchema } = formActionType;
              updateSchema({
                field: 'contractId',
                componentProps: {
                  options: contractList,
                  onChange: async (e: any) => {
                    if (e) {
                      console.log(e);
                      const contract = await queryContractById({ id: e });
                      const major = contract.major;
                      formModel.major = major; //  reset city value
                      // const { updateSchema } = formActionType;
                      // updateSchema({
                      //   field: 'contractName',
                      //   defaultValue: contract_name,
                      // });
                    }
                  },
                },
              });
            });
          }
        },
        // atfer request callback
        onOptionsChange: (options) => {
          console.log('goet ptions', options.length, options);
        },
      };
    },
    required: true,
  },
  {
    label: '合同',
    component: 'Select',
    field: 'contractId',
    componentProps: ({ formModel, formActionType }) => {
      return {
        options: [], // defalut []
        placeholder: '',
        onChange: async (e: any) => {
          if (e) {
            console.log(e);
            const contract = await queryContractById({ id: e });
            const major = contract.major;
            debugger;
            formModel.major = major; //  reset city value
            // const { updateSchema } = formActionType;
            // updateSchema({
            //   field: 'contractName',
            //   defaultValue: contract_name,
            // });
          }
        },
        // atfer request callback
        onOptionsChange: (options) => {
          console.log('goet ptions', options.length, options);
        },
      };
    },
  },
  {
    label: '工程专业类型',
    component: 'Input',
    field: 'major',
    required: true,
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'amounts',
    component: 'InputNumber',
    label: '送审额',
    subLabel:'(单位:元)',
    componentProps: {
      disabled: false,
    },
    defaultValue: '',
    required: true,
  },
  {
    label: '送审时间',
    field: 'reviewDate',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入开始时间!' }];
    },
    defaultValue:'',
  },
];
// Helper function to get current year, month, and day in the format YYYYMMDD
function getCurrentYearMonthDay() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

export const step2Schemas: FormSchema[] = [
  {
    field: 'powerAttorney',
    component: 'JUpload',
    label: '授权委托书',
    buss: '27',
    defaultValue: '',
    required: false,
    helpMessage: ['承包人授权结算人员的授权委托书'],
    labelWidth: '200px',
  },
  {
    field: 'InformationCommitment',
    component: 'JUpload',
    label: '结算承诺书',
    buss: '28',
    defaultValue: '',
    required: false,
    helpMessage: ['结算资料真实性、有效性和完整性承诺书'],
    labelWidth: '200px',
  },
  {
    field: 'projectStatement',
    component: 'JUpload',
    label: '工程结算书',
    buss: '29',
    defaultValue: '',
    required: false,
    helpMessage: ['承包人签字盖章确认的报审工程结算书', '（同时提交计价全部软件版）'],
    labelWidth: '200px',
  },
  {
    field: 'quantityCalculation',
    component: 'JUpload',
    label: '工程量计算书',
    buss: '30',
    defaultValue: '',
    required: false,
    helpMessage: ['承包人报审的完整工程量计算书', '（同时提交钢筋、算量、计价等全部软件版），', '封面加盖承包人公章、造价人员执业章'],
    labelWidth: '200px',
  },
  {
    field: 'materials',
    component: 'JUpload',
    label: '甲供材领、退用清单',
    buss: '32',
    defaultValue: '',
    required: false,
    helpMessage: ['经发、承包双方确认的甲供材领、退用清单汇总表', '（汇总表至少应包含材料名称、品牌、产地、规格、数量、金额、领退用时间等）'],
    labelWidth: '200px',
  },
  {
    field: 'feeAcknowledgment',
    component: 'JUpload',
    label: '费用确认单',
    buss: '39',
    defaultValue: '',
    required: false,
    helpMessage: ['水、电费缴付证明资料及相关配合费用确认单'],
    labelWidth: '200px',
  },
  {
    field: 'securityProof',
    component: 'JUpload',
    label: '安全证明文件',
    buss: '38',
    defaultValue: '',
    required: false,
    helpMessage: ['有关工期、质量、安全文明等方面的证明文件'],
    labelWidth: '200px',
  },
  {
    field: 'CommencementConstruction',
    component: 'JUpload',
    label: '工程开工报告',
    buss: '36',
    defaultValue: '',
    required: false,
    helpMessage: ['工程开工报告'],
    labelWidth: '200px',
  },
  {
    field: 'builtDrawings',
    component: 'JUpload',
    label: '竣工图纸',
    buss: '35',
    defaultValue: '',
    required: false,
    helpMessage: ['竣工图纸（须发包、承包、监理三方签章确认）'],
    labelWidth: '200px',
  },
  {
    field: 'acceptanceReport',
    component: 'JUpload',
    label: '竣工报告或验收报告',
    buss: '37',
    defaultValue: '',
    required: false,
    helpMessage: ['竣工报告或已完工程验收报告'],
    labelWidth: '200px',
  },
  {
    field: 'completionAcknowledgment',
    component: 'JUpload',
    label: '完工界面确认单',
    buss: '34',
    defaultValue: '',
    required: false,
    helpMessage: ['已完工程界面确认单（须发包、承包、监理三方签章确认）'],
    labelWidth: '200px',
  },
  {
    field: 'others',
    component: 'JUpload',
    label: '其他',
    buss: '40',
    defaultValue: '',
    required: false,
    helpMessage: ['其他'],
    labelWidth: '200px',
  },
];

export const step3Schemas: FormSchema[] = [
  {
    field: 'constructionDrawings',
    component: 'JUpload',
    label: '施工图会审纪要',
    defaultValue: '',
    labelWidth: '200px',
  },
  {
    field: 'geoElevation',
    component: 'JUpload',
    label: '原始地貌标高测量记录',
    defaultValue: '',
    required: false,
    labelWidth: '200px',
  },
  {
    field: 'changeDesign',
    component: 'JUpload',
    label: '设计变更及实施情况签证',
    defaultValue: '',
    required: false,
    labelWidth: '200px',
  },
  {
    field: 'technicalApproval',
    component: 'JUpload',
    label: '技术核定单及实施情况签证',
    defaultValue: '',
    required: false,
    labelWidth: '200px',
  },
  {
    field: 'projectContact',
    component: 'JUpload',
    label: '工程联系单及实施情况签证',
    defaultValue: '',
    required: false,
    labelWidth: '200px',
  },
  {
    field: 'supervisionNotice',
    component: 'JUpload',
    label: '监理通知单及实施情况签证',
    defaultValue: '',
    required: false,
    labelWidth: '200px',
  },
  {
    field: 'otherVisas',
    component: 'JUpload',
    label: '其它签证',
    defaultValue: '',
    required: false,
    labelWidth: '200px',
  },
  {
    field: 'costRelated',
    component: 'JUpload',
    label: '造价相关的会议纪要',
    defaultValue: '',
    required: false,
    labelWidth: '200px',
  },
];
