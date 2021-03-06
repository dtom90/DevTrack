<template>
  <div>
    <!-- TaskList Title Section -->
    <div class="title-section">
      <!-- TaskList Title -->
      <h3 class="title">
        {{ title }}
      </h3>
      
      <!-- To Do List Filter Menu -->
      <div
        v-if="!isCompletedList"
        class="dropright d-flex justify-content-end"
      >
        <button
          id="filter-menu-button"
          :class="'btn btn-light' + (selectedTags.length > 0 ? ' filter-active' : '')"
          :style="filterBtnStyle"
          title="Filter on tags"
          data-toggle="dropdown"
          :disabled="Object.keys(tags).length === 0"
        >
          <font-awesome-icon icon="filter" />
        </button>
  
        <div
          id="filter-menu"
          class="dropdown-menu"
        >
          <TagList
            v-if="selectedTags.length > 0"
            label="Filtering on tasks with"
            :tag-list="selectedTags"
            :modal="true"
            :remove-tag="removeTagFilter"
            remove-text="Clear Filter"
          />
          <div
            v-if="selectedTags.length > 0"
            class="form-check form-check-inline"
          >
            <input
              id="addTagsSelect"
              v-model="toggleAddSelectedTags"
              class="form-check-input"
              type="checkbox"
            >
            <label
              class="form-check-label"
              for="addTagsSelect"
            >Include in new tasks</label>
          </div>
          <div
            v-if="selectedTags.length > 0 && unselectedTags.length > 0"
            class="dropdown-divider"
          />
          <TagList
            v-if="unselectedTags.length > 0"
            :label="selectedTags.length > 0 ? 'Add to filter' : 'Filter on'"
            :tag-list="unselectedTags"
            :select-tag="selectTagFilter"
          />
        </div>
      </div>
      
      <!-- Done List Menu -->
      <div
        v-if="isCompletedList"
        class="dropright"
      >
        <button
          :id="btnId"
          class="btn btn-light"
          title="List options"
          data-toggle="dropdown"
        >
          <font-awesome-icon :icon="sortOrder === 'Oldest' ? 'caret-up' : 'caret-down'" />
        </button>
        
        <div
          class="dropdown-menu"
        >
          <div class="input-group">
            <select
              :id="selectId"
              v-model="sortOrder"
              class="custom-select"
            >
              <option
                v-for="option in sortingOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
            <div class="input-group-append">
              <label
                class="input-group-text"
                :for="selectId"
              >First</label>
            </div>
          </div>
          <div class="dropdown-divider" />
          <button
            id="clear-btn"
            class="btn btn-danger"
            title="Delete all list tasks"
            @click="clearTasks"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
    
    <div
      v-if="!isCompletedList"
      id="todo-input-section"
      class="input-group"
    >
      <!-- New Task Input Field -->
      <input
        id="new-task"
        v-model="newTask"
        type="text"
        class="form-control"
        placeholder="enter new task"
        @keyup.enter="addNewTask"
      >
  
      <!-- To Do List Add Position Button -->
      <div class="input-group-append">
        <button
          id="add-position-button"
          class="btn btn-light custom-icons"
          :title="`Adding tasks to ${insertAtTop === true ? 'top' : 'bottom'} of list`"
          @click="setTopInsert(!insertAtTop)"
        >
          <img
            v-if="insertAtTop"
            src="add_to_top.svg"
            alt="Add to Top"
          >
          <img
            v-if="!insertAtTop"
            src="add_to_bottom.svg"
            alt="Add to Bottom"
          >
        </button>
      </div>
    </div>
    
    <!-- Incomplete Tasks -->
    <draggable
      v-if="!isCompletedList"
      id="incomplete-task-list"
      v-model="incompleteTaskList"
      class="list-group"
      animation="200"
      @start="startDrag"
      @end="endDrag"
    >
      <Task
        v-for="task in incompleteTaskList"
        :key="task.id"
        :task="task"
      />
    </draggable>
    
    <!-- Completed Tasks -->
    <ul
      v-if="isCompletedList"
      class="list-group scroll-list"
    >
      <Task
        v-for="task in completedTaskList"
        :key="task.id"
        :task="task"
      />
    </ul>
  </div>
</template>

<script>
import Task from './Task.vue'
import TagList from './TagList.vue'
import { mapState, mapGetters, mapMutations } from 'vuex'
import draggable from 'vuedraggable'

export default {
  
  name: 'TaskList',
  
  components: {
    Task,
    TagList,
    draggable
  },
  
  props: {
    title: {
      type: String,
      default: 'To Do'
    }
  },
  
  data: () => ({
    newTask: '',
    sortingOptions: ['Recent', 'Oldest'],
    sortOrder: 'Recent'
  }),
  
  computed: {
    ...mapState([
      'selectedTags',
      'addSelectedTags',
      'filterOperator',
      'insertAtTop'
    ]),
    ...mapState([
      'tags'
    ]),
    ...mapGetters([
      'incompleteTasks',
      'completedTasks',
      'selectedTask',
      'unselectedTags'
    ]),
    isCompletedList () {
      return this.title === 'Done'
    },
    btnId () {
      return this.isCompletedList ? 'completedSettingsButton' : 'todoSettingsButton'
    },
    selectId () {
      return (this.completed ? 'completed' : 'toDo') + 'OrderGroupSelect'
    },
    filterBtnStyle () {
      return this.selectedTags.length > 0 ? {
        backgroundColor: this.tags[this.selectedTags[0]].color
      } : {}
    },
    toggleAddSelectedTags: {
      get () {
        return this.addSelectedTags
      },
      set (value) {
        this.updateAddSelectedTags(value)
      }
    },
    incompleteTaskList: {
      get () {
        return this.selectedTags.length > 0
          ? (
            this.filterOperator === 'and'
              ? this.incompleteTasks.filter(task => this.selectedTags.every(tag => task.tags.includes(tag)))
              : this.incompleteTasks.filter(task => this.selectedTags.some(tag => task.tags.includes(tag)))
          )
          : this.incompleteTasks
      },
      set (newTaskOrder) {
        this.updateIncompleteTasks({ newTaskOrder })
      }
    },
    completedTaskList () {
      const filteredTasks = this.selectedTags.length > 0
        ? (
          this.filterOperator === 'and'
            ? this.completedTasks.filter(task => this.selectedTags.every(tag => task.tags.includes(tag)))
            : this.completedTasks.filter(task => this.selectedTags.some(tag => task.tags.includes(tag)))
        )
        : this.completedTasks
      return filteredTasks && this.sortOrder !== 'Oldest'
        ? filteredTasks.slice().reverse()
        : filteredTasks
    }
  },
  
  methods: {
    
    ...mapMutations([
      'addTask',
      'setTopInsert',
      'updateAddSelectedTags',
      'clearTasks',
      'updateIncompleteTasks',
      'selectTag',
      'removeTag',
      'selectTask'
    ]),
    addNewTask () {
      this.addTask({ name: this.newTask })
      this.newTask = ''
    },
    selectTagFilter (tag, e) {
      e.stopPropagation()
      this.selectTag({ tag })
      if (!this.selectedTask || (this.selectedTask && !this.selectedTags.some(tag => this.selectedTask.tags.includes(tag)))) {
        let tasksWithTag = this.incompleteTasks.find(task => this.selectedTags.some(tag => task.tags.includes(tag)))
        if (!tasksWithTag) {
          tasksWithTag = this.completedTasks.find(task => this.selectedTags.some(tag => task.tags.includes(tag)))
        }
        if (tasksWithTag) {
          this.selectTask(tasksWithTag.id)
        } else {
          this.selectTask(null)
        }
      }
    },
    removeTagFilter (tag) {
      this.removeTag({ tag })
    },
    startDrag () {
      this.$el.closest('html').classList.add('draggable-cursor')
    },
    endDrag () {
      this.$el.closest('html').classList.remove('draggable-cursor')
    }
  }
}
</script>

<style scoped lang="scss">
@import "../styles/_variables.scss";

.title-section {
  display: flex;
}

.title {
  flex: 1;
  margin-left: 40px;
}

.title-section > button {
  margin-bottom: 0.5rem;
}

#todo-input-section {
  margin-bottom: 10px;
}

#add-position-button {
  border: 1px solid #ced4da;
}

#add-position-menu {
  text-align: center;
}

#filter-menu-button {
  width: 50px;
  margin-bottom: 0.5rem;
}

.filter-active > svg {
  color: white;
  -webkit-filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, .7));
  filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, .7));
}

.filter-active:hover > svg {
  color: lightgrey;
}

#filter-menu {
  padding: 8px;
  width: 200px;
}

#filter-menu .form-check {
  margin: 0;
}

.custom-icons img {
  width: 1.4em;
  height: 1.4em;
}

//noinspection CssInvalidPropertyValue
#incomplete-task-list .list-group-item {
  cursor: move;
  cursor: -webkit-grab;
  cursor: -moz-grab;
  cursor: grab;
}

.sortable-chosen {
  background-color: #e9ecef;
}

#incomplete-task-list {
  max-height: calc(100vh - #{$top-offset} - 96px);
  overflow-y: auto;
}

.scroll-list {
  max-height: calc(100vh - #{$top-offset} - 42px);
  overflow-y: auto;
}

</style>
