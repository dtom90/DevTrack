<template>
  <!--  Task List Group Item Wrapper  -->
  <li
    :class="'task list-group-item list-group-item-action form-check'+active"
    @click="selectTask({ taskId: task.id })"
  >
    <div class="d-flex align-items-center">
      <Checkbox
        :checked="checked"
        :task-id="task.id"
      />
      <b-badge
        v-if="task.archived"
        class="archive-badge"
      >
        Archvied
      </b-badge>&nbsp;
      <span class="task-name">{{ task.name }}</span>
      <font-awesome-icon
        v-if="displayCountdownIndicator"
        id="indicatorIcon"
        icon="clock"
      />
    </div>
    <div class="d-flex flex-wrap">
      <span
        v-for="tagId in taskTags"
        :key="tagId"
        class="badge mini-tag"
        :style="{backgroundColor: tags[tagId].color}"
      >&nbsp;&nbsp;</span>
    </div>
  </li>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Checkbox from './Checkbox'

export default {
  
  name: 'Task',
  components: { Checkbox },
  props: {
    task: {
      type: Object,
      default: function () {
        return {
          id: 1,
          name: 'new task 1',
          createdDate: Date.now(),
          completed: false
        }
      }
    }
  },
  
  computed: {
    
    ...mapState([
      'tags',
      'tagOrder',
      'selectedTaskID',
      'activeTaskID'
    ]),
    
    active () {
      return this.selectedTaskID === this.task.id ? ' active' : ''
    },
    
    checked () {
      return this.task.completed !== null
    },
    
    taskTags () {
      return this.task.tags.slice().sort((a, b) => this.tagOrder.indexOf(a) - this.tagOrder.indexOf(b))
    },
    
    displayCountdownIndicator () {
      return this.activeTaskID === this.task.id
    }
  },
  
  methods: {
    ...mapActions([
      'selectTask'
    ])
  }
  
}
</script>

<style scoped lang="scss">
@import "../styles/_variables.scss";

.task-name {
  flex: 1;
  text-align: left;
}

#indicatorIcon {
  color: red;
  width: 2rem;
  height: 2rem;
}

.badge:empty {
  display: inline-block !important;
}

.mini-tag {
  width: 50px !important;
  height: 10px !important;
  margin-top: 10px;
  margin-right: 10px;
}
</style>
