<template>
  <BasicDrawer v-bind="$attrs" @register="register2" title="Drawer Title" width="50%">
    <PageWrapper title="详情组件示例">
      <Description
        title="债权主体信息"
        :collapseOptions="{ canExpand: true, helpMessage: 'help me' }"
        :column="3"
        :data="mockData"
        :schema="schema"
      />
      <Description title="债权信息" :collapseOptions="{ canExpand: true, helpMessage: 'help me' }" :column="3" :data="mockData2" :schema="schema2" />
    </PageWrapper>
  </BasicDrawer>
</template>

<script lang="tsx">
  import { defineComponent, h, ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Description, DescItem, useDescription } from '/@/components/Description/index';
  import { PageWrapper } from '/@/components/Page';
  import { baseUrl } from '../../../../../mock/_util';
  import { useGlobSetting } from '@/hooks/setting';
  const mockData = ref({});
  const mockData2 = ref({});

  export default defineComponent({
    components: { Description, PageWrapper, BasicDrawer },
    setup() {
      const glob = useGlobSetting();
      const [register2] = useDrawerInner((data) => {
        mockData.value = data;
        mockData2.value = data;
      });
      // 示例的 render 函数，负责渲染文件列表
      const renderFileList = (filePaths: string) => {
        const fileList = filePaths.split(','); // 假设文件路径使用逗号分隔
        return (
          <ul>
            {fileList.map((filePath, index) => {
              // 从文件路径中提取文件名
              const pathSegments = filePath.split('/');
              const fileName = pathSegments[pathSegments.length - 1];
              // 构建完整的文件路径href="http://localhost:8080/jeecg-boot/sys/common/static/temp/合同管理_1700626538167.docx"
              const fullFilePath = `${glob.domainUrl}/sys/common/static/${filePath}`;
              return (
                <li key={index}>
                  <a href={fullFilePath} target="_blank" rel="noopener noreferrer">
                    {fileName}
                  </a>
                </li>
              );
            })}
          </ul>
        );
      };
      const schema: DescItem[] = [
        {
          field: 'bondholdersName',
          label: '用户名',
        },
        {
          field: 'accountName',
          label: '昵称',
        },
        {
          field: 'phoneNumber',
          label: '联系电话',
        },
        {
          field: 'idCode',
          label: '证件号',
        },
      ];
      const schema2: DescItem[] = [
        {
          field: 'bondholdersType',
          label: '债权类型',
        },
        {
          field: 'money',
          label: '金额',
        },
        {
          field: 'remark',
          label: '说明',
        },
        {
          field: 'file',
          label: '附件',
          render: (val: any, data: Recordable) => {
            // 假设你的数据中包含一个名为 'attachments' 的字段，存储了文件列表
            const filePaths: string = data['file'] || '';
            // 调用 renderFileList 渲染文件列表
            return renderFileList(filePaths);
          },
        },
      ];
      return { mockData, mockData2, schema, schema2, register2, glob };
    },
  });
</script>
