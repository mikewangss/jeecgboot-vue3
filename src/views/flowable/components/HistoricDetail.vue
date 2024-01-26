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
  <el-card style="margin-top: 10px">
    <p slot="title">
      <span>流程审批进度历史</span>
    </p>
    <el-row style="position: relative">
      <div class="block">
        <el-timeline>
          <el-timeline-item v-for="(item, index) in flowRecordList" :key="index" :color="setColor(item.finishTime)">
            <p style="font-weight: 700"
              >{{ item.taskName }}
              <i v-if="!item.finishTime" style="color: orange">(待办中。。。)</i>
            </p>

            <el-card :body-style="{ padding: '10px' }">
              <label v-if="item.assigneeName && item.finishTime" style="font-weight: normal; margin-right: 30px"
                >实际办理人： {{ item.assigneeName }} <el-tag type="info" size="small">{{ item.deptName }}</el-tag></label
              >
              <label v-if="item.candidate" style="font-weight: normal; margin-right: 30px">候选办理人： {{ item.candidate }}</label>
              <label style="font-weight: normal">接收时间： </label><label style="color: #8a909c; font-weight: normal">{{ item.createTime }}</label>
              <label v-if="item.finishTime" style="margin-left: 30px; font-weight: normal">办结时间： </label
              ><label style="color: #8a909c; font-weight: normal">{{ item.finishTime }}</label>
              <label v-if="item.duration" style="margin-left: 30px; font-weight: normal">耗时： </label
              ><label style="color: #8a909c; font-weight: normal">{{ item.duration }}</label>

              <p v-if="item.comment">
                <!--  1 正常意见  2 退回意见 3 驳回意见                -->
                <el-tag color="green" v-if="item.comment.type === '1'">
                  <span v-if="item.comment.comment != '重新提交'">通过：</span>
                  {{ item.comment.comment }}
                </el-tag>
                <el-tag color="orange" v-if="item.comment.type === '2'">退回： {{ item.comment.comment }}</el-tag>
                <el-tag color="red" v-if="item.comment.type === '3'">驳回： {{ item.comment.comment }}</el-tag>
              </p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-row>
  </el-card>
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
  import { saveXml } from '@/views/flowable/api/defination.api';
  import { readXmlByDataId, taskHiList } from '@/views/settlement/workflow/todoList.api';

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
        // 仅保留用户自定义扩展模块
        // if (this.onlyCustomizeAddi) {
        //   if (Object.prototype.toString.call(this.additionalModel) === '[object Array]') {
        //     return this.additionalModel || [];
        //   }
        //   return [this.additionalModel];
        // }

        // // 插入用户自定义扩展模块
        // if (Object.prototype.toString.call(this.additionalModel) === '[object Array]') {
        //   Modules.push(...this.additionalModel);
        // } else {
        //   this.additionalModel && Modules.push(this.additionalModel);
        // }

        // 翻译模块
        // const TranslateModule = {
        //   translate: ['value', customTranslate(this.translations || translationsCN)],
        // };
        // Modules.push(TranslateModule);

        // 模拟流转模块
        // if (this.simulation) {
        //   Modules.push(tokenSimulation);
        // }

        // 根据需要的流程类型设置扩展元素构建模块
        // if (this.prefix === "bpmn") {
        //   Modules.push(bpmnModdleExtension);
        // }
        Modules.push(flowableModdleExtension);
        // if (this.prefix === 'camunda') {
        //   Modules.push(camundaModdleExtension);
        // }
        // if (this.prefix === 'flowable') {
        // }
        // if (this.prefix === 'activiti') {
        //   Modules.push(activitiModdleExtension);
        // }

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
      this.getFlowRecordList();
      // this.$once("hook:beforeUnmount", () => {
      //   if (this.bpmnModeler) this.bpmnModeler.destroy();
      //   this.$emit("destroy", this.bpmnModeler);
      //   this.bpmnModeler = null;
      // });
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
      /** 流程流转记录 */
      async getFlowRecordList() {
        const params = { dataId: this.dataId };
        await taskHiList(params)
          .then((res) => {
            // console.log(res)
            this.flowRecordList = res.flowList;
            // this.finishOrder();
            // 流程过程中不存在初始化表单 直接读取的流程变量中存储的表单值
            if (res.formData) {
              this.formData = res.formData;
            }
          })
          .catch((res) => {
            console.log(res);
          });
      },
      // //整理顺序，把待办放最上面，并且只留一个（不然会签时会乱）
      // finishOrder() {
      //   let list = [];
      //   let noFinish = undefined;
      //   for (const flow of this.flowRecordList) {
      //     if (flow.finishTime) {
      //       // 办结的节点同时取有实际办理人的，因为会签会将所有的多实例都返回，需要过滤
      //       if (flow.assigneeId) {
      //         list.push(flow);
      //       }
      //     } else {
      //       noFinish = flow;
      //     }
      //   }
      //   if (noFinish.value) {
      //     const find = list.find((obj) => obj.taskDefKey == noFinish.taskDefKey);
      //     if (find) {
      //       noFinish.value.taskName = '【会签中】' + noFinish.value.taskName;
      //     }
      //     this.flowRecordList = [noFinish, ...list];
      //   } else {
      //     this.flowRecordList = list;
      //   }
      // },
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
      // initModelListeners() {
      //   const EventBus = this.bpmnModeler.get('eventBus');
      //   const that = this;
      //   // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
      //   this.events.forEach((event) => {
      //     EventBus.on(event, function (eventObj) {
      //       let eventName = event.replace(/\./g, '-');
      //       let element = eventObj ? eventObj.element : null;
      //       that.$emit(eventName, element, eventObj);
      //     });
      //   });
      // 监听图形改变返回xml
      // EventBus.on('commandStack.changed', async (event) => {
      //   try {
      //     this.recoverable = this.bpmnModeler.get('commandStack').canRedo();
      //     this.revocable = this.bpmnModeler.get('commandStack').canUndo();
      //     let { xml } = await this.bpmnModeler.saveXML({ format: true });
      //     this.$emit('commandStack-changed', event);
      //     this.$emit('update:modelValue', xml);
      //     this.$emit('change', xml);
      //   } catch (e) {
      //     console.error(`[Process Designer Warn]: ${e.message || e}`);
      //   }
      // });
      // 监听视图缩放变化
      // this.bpmnModeler.on('canvas.viewbox.changed', ({ viewbox }) => {
      //   this.$emit('canvas-viewbox-changed', { viewbox });
      //   const { scale } = viewbox;
      //   this.defaultZoom = Math.floor(scale * 100) / 100;
      // });
      // },
      /* 创建新的流程图 */
      async createNewDiagram() {
        // 发送请求，获取xml
        const res = await readXmlByDataId(this.dataId);
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
      previewProcessJson() {
        // const newConvert = new X2JS();
        // this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        //   const { definitions } = newConvert.xml2js(xml);
        //   if (definitions) {
        //     this.previewResult = JSON.stringify(definitions, null, 4);
        //   } else {
        //     this.previewResult = "";
        //   }
        //   this.previewType = "json";
        //   this.previewModelVisible = true;
        // });
      },
    },
  };
</script>
