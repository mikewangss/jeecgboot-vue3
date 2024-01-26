<template>
  <div style="margin-top: 16px">
    <el-form-item label="用户类型">
      <el-radio-group v-model="userTaskForm.type" @change="reloadData(userTaskForm.type)">
        <el-radio label="用户">用户</el-radio>
        <el-radio label="角色">角色</el-radio>
        <el-radio label="岗位">岗位</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="处理用户">
      <el-select v-model="userTaskForm.assignee" @change="updateElementTask('assignee')">
        <el-option v-for="ak in users" :key="'ass-' + ak.id" :label="`${userTaskForm.type}${ak.name}`" :value="`${userTaskForm.type}${ak.id}`" />
      </el-select>
    </el-form-item>
    <el-form-item label="候选用户">
      <el-select v-model="userTaskForm.candidateUsers" multiple collapse-tags @change="updateElementTask('candidateUsers')">
        <el-option v-for="uk in users" :key="'user-' + uk.id" :label="`${userTaskForm.type}${uk.name}`" :value="`${userTaskForm.type}${uk.id}`" />
      </el-select>
    </el-form-item>
    <el-form-item label="候选分组">
      <el-select v-model="userTaskForm.candidateGroups" multiple collapse-tags @change="updateElementTask('candidateGroups')">
        <el-option v-for="gk in groups" :key="'ass-' + gk.id" :label="`分组${gk.name}`" :value="`${gk.id}`" />
      </el-select>
    </el-form-item>
    <el-form-item label="到期时间">
      <el-input v-model="userTaskForm.dueDate" clearable @change="updateElementTask('dueDate')" />
    </el-form-item>
    <el-form-item label="跟踪时间">
      <el-input v-model="userTaskForm.followUpDate" clearable @change="updateElementTask('followUpDate')" />
    </el-form-item>
    <el-form-item label="优先级">
      <el-input v-model="userTaskForm.priority" clearable @change="updateElementTask('priority')" />
    </el-form-item>
  </div>
</template>

<script>
  import { positionList, roleList, userList } from '@/views/flowable/api/defination.api';

  export default {
    name: 'UserTask',
    props: {
      id: String,
      type: String,
    },
    data() {
      return {
        defaultTaskForm: {
          assignee: '',
          candidateUsers: [],
          candidateGroups: [],
          dueDate: '',
          followUpDate: '',
          priority: '',
        },
        userTaskForm: {},
        mockData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        users: [],
        groups: [],
      };
    },
    watch: {
      id: {
        immediate: true,
        handler() {
          this.bpmnElement = window.bpmnInstances.bpmnElement;
          this.$nextTick(() => this.resetTaskForm());
        },
      },
    },
    beforeUnmount() {
      this.bpmnElement = null;
    },
    created() {
      userList({}).then((res) => {
        this.users = res || [];
        this.users.map((o) => {
          o.id = o.username;
          o.name = o.realname;
        });
      });
      // positionList({}).then((res) => {
      //   this.users = res || [];
      //   this.users.map((o) => {
      //     o.id = o.id;
      //     o.name = o.name;
      //   });
      // });
      roleList({}).then((res) => {
        this.groups = res || [];
        this.groups.map((o) => {
          o.id = o.id;
          o.name = o.roleName;
        });
      });
    },
    methods: {
      reloadData(type) {
        if (type == '用户') {
          userList({}).then((res) => {
            this.users = res || [];
            this.users.map((o) => {
              o.id = o.username;
              o.name = o.realname;
            });
          });
        } else if (type == '岗位') {
          positionList({}).then((res) => {
            this.users = res || [];
            this.users.map((o) => {
              o.id = o.id;
              o.name = o.name;
            });
          });
        } else {
          roleList({}).then((res) => {
            this.users = res || [];
            this.users.map((o) => {
              o.id = o.id;
              o.name = o.roleName;
            });
          });
        }
      },
      resetTaskForm() {
        for (let key in this.defaultTaskForm) {
          let value;
          if (key === 'candidateUsers' || key === 'candidateGroups') {
            value = this.bpmnElement?.businessObject[key] ? this.bpmnElement.businessObject[key].split(',') : [];
          } else {
            value = this.bpmnElement?.businessObject[key] || this.defaultTaskForm[key];
          }
          this.userTaskForm[key] = value;
        }
      },
      updateElementTask(key) {
        const taskAttr = Object.create(null);
        if (key === 'candidateUsers' || key === 'candidateGroups') {
          taskAttr[key] = this.userTaskForm[key] && this.userTaskForm[key].length ? this.userTaskForm[key].join() : null;
        } else {
          taskAttr[key] = this.userTaskForm[key] || null;
        }
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, taskAttr);
      },
    },
  };
</script>
