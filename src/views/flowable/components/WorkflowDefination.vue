<template>
  <div class="my-process-designer">
    <div class="my-process-designer__header">
      <slot name="control-header"></slot>
      <template v-if="!$slots['control-header']"> </template>
    </div>
    <div class="my-process-designer__container">
      <div class="my-process-designer__canvas" ref="bpmn-canvas"></div>
    </div>
  </div>
</template>

<script>
  import {
    Histogram,
    Cpu,
    Refresh,
    RefreshLeft,
    RefreshRight,
    ZoomOut,
    ZoomIn,
    View,
    Download,
    FolderOpened,
    ScaleToOriginal,
  } from '@element-plus/icons-vue';
  import BpmnModeler from 'bpmn-js/lib/Modeler';
  import DefaultEmptyXML from '@/package/designer/plugins/defaultEmpty';
  // 翻译方法
  import customTranslate from '@/package/designer/plugins/translate/customTranslate';
  import translationsCN from '@/package/designer/plugins/translate/zh';
  // 模拟流转流程
  import tokenSimulation from 'bpmn-js-token-simulation';
  // 标签解析构建器
  // import bpmnPropertiesProvider from "bpmn-js-properties-panel/lib/provider/bpmn";
  // 标签解析 Moddle
  import camundaModdleDescriptor from '@/package/designer/plugins/descriptor/camundaDescriptor.json';
  import activitiModdleDescriptor from '@/package/designer/plugins/descriptor/activitiDescriptor.json';
  import flowableModdleDescriptor from '@/package/designer/plugins/descriptor/flowableDescriptor.json';
  // 标签解析 Extension
  import camundaModdleExtension from '@/package/designer/plugins/extension-moddle/camunda';
  import activitiModdleExtension from '@/package/designer/plugins/extension-moddle/activiti';
  import flowableModdleExtension from '@/package/designer/plugins/extension-moddle/flowable';
  // 引入json转换与高亮
  // import X2JS from "x2js";

  import Codemirror from 'codemirror-editor-vue3';
  import 'codemirror/theme/monokai.css';
  import 'codemirror/mode/javascript/javascript.js';
  import 'codemirror/mode/xml/xml.js';
  import { readXml, saveXml } from '@/views/flowable/api/defination.api';

  export default {
    name: 'MyProcessDesigner',
    componentName: 'MyProcessDesigner',
    components: {
      Codemirror,
    },
    props: {
      dataId: {
        type: String,
        default: '',
        required: true,
      },
    },
    emits: ['destroy', 'init-finished', 'commandStack-changed', 'update:modelValue', 'change', 'canvas-viewbox-changed', 'element-click'],
    setup() {
      return {
        Histogram,
        Cpu,
        Refresh,
        RefreshLeft,
        RefreshRight,
        ZoomOut,
        ZoomIn,
        View,
        Download,
        FolderOpened,
        ScaleToOriginal,
      };
    },
    data() {
      return {
        flowRecordList: [],
        headerButtonType: 'primary',
        headerButtonSize: 'small',
        defaultZoom: 1,
        previewModelVisible: false,
        simulationStatus: false,
        previewResult: '',
        previewType: 'xml',
        recoverable: false,
        revocable: false,
        cmOptions: {
          mode: 'xml', // 语言模式
          theme: 'monokai', // 主题
          lineNumbers: true, // 显示行号
          smartIndent: true, // 智能缩进
          readOnly: true,
          indentUnit: 2, // 智能缩进单位为4个空格长度
          foldGutter: true, // 启用行槽中的代码折叠
          styleActiveLine: true, // 显示选中行的样式
        },
        xmlString: '',
      };
    },
    computed: {
      additionalModules() {
        const Modules = [];
        Modules.push(flowableModdleExtension);
        return Modules;
      },
      moddleExtensions() {
        const Extensions = {};
        // 仅使用用户自定义模块
        if (this.onlyCustomizeModdle) {
          return this.moddleExtension || null;
        }

        // 插入用户自定义模块
        if (this.moddleExtension) {
          for (let key in this.moddleExtension) {
            Extensions[key] = this.moddleExtension[key];
          }
        }

        // 根据需要的 "流程类型" 设置 对应的解析文件
        if (this.prefix === 'activiti') {
          Extensions.activiti = activitiModdleDescriptor;
        }
        if (this.prefix === 'flowable') {
          Extensions.flowable = flowableModdleDescriptor;
        }
        if (this.prefix === 'camunda') {
          Extensions.camunda = camundaModdleDescriptor;
        }

        return Extensions;
      },
    },
    mounted() {
      this.initBpmnModeler();
      this.createNewDiagram(this.value);
    },
    beforeUnmount() {
      if (this.bpmnModeler) this.bpmnModeler.destroy();
      this.$emit('destroy', this.bpmnModeler);
      this.bpmnModeler = null;
    },
    methods: {
      setColor(val) {
        if (val) {
          return '#2bc418';
        } else {
          return '#b3bdbb';
        }
      },
      initBpmnModeler() {
        if (this.bpmnModeler) return;
        this.bpmnModeler = new BpmnModeler({
          container: this.$refs['bpmn-canvas'],
          keyboard: this.keyboard ? { bindTo: document } : null,
          additionalModules: this.additionalModules,
          moddleExtensions: this.moddleExtensions,
        });
        this.$emit('init-finished', this.bpmnModeler);
        // this.initModelListeners();
      },
      /* 创建新的流程图 */
      async createNewDiagram() {
        // 发送请求，获取xml
        const res = await readXml(this.dataId);
        this.xmlString = res;
        debugger;
        try {
          await this.bpmnModeler.importXML(this.xmlString);
        } catch (e) {
          console.error(`[Process Designer Warn]: ${e?.message || e}`);
        }
      },

      // 下载流程图到本地
      /**
       * @param {string} type
       * @param {*} name
       */
      async downloadProcess(type, name) {
        try {
          const _this = this;
          // 按需要类型创建文件并下载
          if (type === 'xml' || type === 'bpmn') {
            const { err, xml } = await this.bpmnModeler.saveXML();
            // 读取异常时抛出异常
            if (err) {
              console.error(`[Process Designer Warn ]: ${err.message || err}`);
            }
            let { href, filename } = _this.setEncoded(type.toUpperCase(), name, xml);
            downloadFunc(href, filename);
          } else {
            const { err, svg } = await this.bpmnModeler.saveSVG();

            let { href, filename } = _this.setEncoded('SVG', name, svg);
            downloadFunc(href, filename);
          }
        } catch (e) {
          console.error(`[Process Designer Warn ]: ${e.message || e}`);
        }

        // 文件下载方法
        function downloadFunc(href, filename) {
          if (href && filename) {
            let a = document.createElement('a');
            a.download = filename; //指定下载的文件名
            a.href = href; //  URL对象
            a.click(); // 模拟点击
            URL.revokeObjectURL(a.href); // 释放URL 对象
          }
        }
      },

      // 根据所需类型进行转码并返回下载地址
      setEncoded(type, filename = 'diagram', data) {
        const encodedData = encodeURIComponent(data);
        return {
          filename: `${filename}.${type}`,
          href: `data:application/${type === 'svg' ? 'text/xml' : 'bpmn20-xml'};charset=UTF-8,${encodedData}`,
          data: data,
        };
      },

      // 加载本地文件
      importLocalFile() {
        const that = this;
        const file = this.$refs.refFile.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
          let xmlStr = this.result;
          that.createNewDiagram(xmlStr);
        };
      },
      /* ------------------------------------------------ refs methods ------------------------------------------------------ */
      downloadProcessAsXml() {
        this.downloadProcess('xml');
      },
      saveProcess() {
        let name = window.bpmnInstances.bpmnElement.id;
        debugger;
        const params = {
          name: name,
          category: 'OA',
          xml: this.xmlString,
        };
        saveXml(params).then((res) => {
          this.$message.success(res.message);
        });
      },
      downloadProcessAsBpmn() {
        this.downloadProcess('bpmn');
      },
      downloadProcessAsSvg() {
        this.downloadProcess('svg');
      },
      processSimulation() {
        this.simulationStatus = !this.simulationStatus;
        this.simulation && this.bpmnModeler.get('toggleMode').toggleMode();
      },
      processRedo() {
        this.bpmnModeler.get('commandStack').redo();
      },
      processUndo() {
        this.bpmnModeler.get('commandStack').undo();
      },
      processZoomIn(zoomStep = 0.1) {
        let newZoom = Math.floor(this.defaultZoom * 100 + zoomStep * 100) / 100;
        if (newZoom > 4) {
          throw new Error('[Process Designer Warn ]: The zoom ratio cannot be greater than 4');
        }
        this.defaultZoom = newZoom;
        this.bpmnModeler.get('canvas').zoom(this.defaultZoom);
      },
      processZoomOut(zoomStep = 0.1) {
        let newZoom = Math.floor(this.defaultZoom * 100 - zoomStep * 100) / 100;
        if (newZoom < 0.2) {
          throw new Error('[Process Designer Warn ]: The zoom ratio cannot be less than 0.2');
        }
        this.defaultZoom = newZoom;
        this.bpmnModeler.get('canvas').zoom(this.defaultZoom);
      },
      processZoomTo(newZoom = 1) {
        if (newZoom < 0.2) {
          throw new Error('[Process Designer Warn ]: The zoom ratio cannot be less than 0.2');
        }
        if (newZoom > 4) {
          throw new Error('[Process Designer Warn ]: The zoom ratio cannot be greater than 4');
        }
        this.defaultZoom = newZoom;
        this.bpmnModeler.get('canvas').zoom(newZoom);
      },
      processReZoom() {
        this.defaultZoom = 1;
        this.bpmnModeler.get('canvas').zoom('fit-viewport', 'auto');
      },
      processRestart() {
        this.recoverable = false;
        this.revocable = false;
        this.createNewDiagram(null);
      },
      elementsAlign(align) {
        const Align = this.bpmnModeler.get('alignElements');
        const Selection = this.bpmnModeler.get('selection');
        const SelectedElements = Selection.get();
        if (!SelectedElements || SelectedElements.length <= 1) {
          this.$message.warning('请按住 Ctrl 键选择多个元素对齐');
          return;
        }
        this.$confirm('自动对齐可能造成图形变形，是否继续？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => Align.trigger(SelectedElements, align));
      },
      /*-----------------------------    方法结束     ---------------------------------*/
      previewProcessXML() {
        this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
          this.previewResult = xml;
          this.previewType = 'xml';
          this.cmOptions.mode = 'xml';
          this.previewModelVisible = true;
        });
      },
    },
  };
</script>
