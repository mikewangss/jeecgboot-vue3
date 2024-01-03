<template>
  <Card title="待办中心" v-bind="$attrs">
    <template #extra>
      <a-button type="link" size="small">更多</a-button>
    </template>
    <ul class="task-list">
      <li v-for="(item, index) in taskItems" :key="index" class="task-item">
        <div class="task-details">
          <div class="task-row">
            <div class="task-col task-desc-col">
              <a class="task-desc" @click="getApplyList(item)">{{ item.task_id }}</a>
            </div>
            <div class="task-col">
              <div class="task-name">{{ item.description }}</div>
            </div>
            <div class="task-col">
              <div class="task-name">{{ item.name }}</div>
            </div>
            <div class="task-col">
              <div class="task-date">{{ item.create_time }}</div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </Card>
</template>
<script lang="ts">
  import { Card, List } from 'ant-design-vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { todoList } from '../../../settlement/workflow/todoList.api';
  import { useUserStore } from '@/store/modules/user';
  import { router } from '@/router';

  export default defineComponent({
    components: { Card },
    setup() {
      const taskItems = ref([]);
      function getApplyList(item) {
        router.push({
          path: '/workflow/todoList',
          query: { taskId: item.task_id, processInstanceId: item.process_instance_id },
        });
      }
      onMounted(async () => {
        // Fetch taskItems from your API
        try {
          const userStore = useUserStore();
          const username = userStore.getUserInfo?.username;
          const response = await todoList({ userId: username }); // Implement your fetchTaskItems function
          taskItems.value = response; // Assuming your API returns an array of task items
        } catch (error) {
          console.error('Error fetching taskItems:', error);
        }
      });

      return {
        taskItems,
        getApplyList,
      };
    },
  });
</script>

<style scoped>
  .task-list {
    padding: 0;
  }

  .task-list-scrollbar {
    max-height: 300px; /* Adjust the max height as needed */
  }

  .task-item {
    border-bottom: 1px solid #ebeef5;
    padding: 10px;
  }

  .task-details {
    width: 100%; /* Make the card content full-width */
  }

  .task-row {
    display: flex;
  }

  .task-col {
    flex: 1;
    padding: 5px; /* Add padding to each column */
  }

  .task-desc-col {
    flex: 4; /* Adjust the flex value for the first column to make it longer */
  }
</style>
