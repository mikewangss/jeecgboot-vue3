<template>
  <Card title="最新动态" v-bind="$attrs">
    <template #extra>
      <a-button type="link" size="small">更多</a-button>
    </template>
    <a-empty />
    <!--    <List item-layout="horizontal" :data-source="dynamicInfoItems">-->
    <!--      <template #renderItem="{ item }">-->
    <!--        <ListItem>-->
    <!--          <ListItemMeta>-->
    <!--            <template #description>-->
    <!--              {{ item.date }}-->
    <!--            </template>-->
    <!--            &lt;!&ndash; eslint-disable-next-line &ndash;&gt;-->
    <!--            <template #title> {{ item.name }} <span v-html="item.desc"> </span> </template>-->
    <!--            <template #avatar>-->
    <!--              <Icon :icon="item.avatar" :size="30" />-->
    <!--            </template>-->
    <!--          </ListItemMeta>-->
    <!--        </ListItem>-->
    <!--      </template>-->
    <!--    </List>-->
  </Card>
</template>
<script lang="ts" setup>
  import { Card, List } from 'ant-design-vue';
  import { dynamicInfoItems } from './data';
  import { Icon } from '/@/components/Icon';

  const ListItem = List.Item;
  const ListItemMeta = List.Item.Meta;
</script>
