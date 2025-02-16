<template>
  <div
    v-show="selectedTask"
    id="selected-task-container"
    class="border"
  >
    <template v-if="selectedTask">
      <!--  Title Section  -->
      <div
        id="title-section"
        class="d-flex justify-content-between"
      >
        <div
          id="checkbox-name-container"
          class="d-flex align-items-center justify-content-center flex-grow-1"
        >
          <div
            v-if="!editingName"
            id="menu-counterbalance"
            style="width: 28px;"
          />
          
          <!--  Checkbox  -->
          <div>
            <Checkbox
              :checked="checked"
              :task-id="selectedTask.id"
              style="margin-left: 20px"
            />
          </div>
          
          <!--  Task Name & Field (when editing)  -->
          <div
            v-if="!editingName"
            id="task-name"
            @mousedown="possibleEdit = true"
            @mousemove="possibleEdit = false"
            @mouseup="editName"
          >
            <b-badge
              v-if="selectedTask.archived"
              class="archive-badge"
            >
              Archived
            </b-badge>&nbsp;
            <span>{{ selectedTask.name }}</span>
          </div>
          <div
            v-if="editingName"
            class="input-group flex-grow-1"
          >
            <input
              id="task-name-input"
              ref="taskNameInput"
              v-model="selectedTask.name"
              class="form-control"
              @keyup.enter="editingName = false"
            >
            <div class="input-group-append">
              <button
                type="button"
                class="btn btn-primary"
                @click="editingName = false"
              >
                <font-awesome-icon icon="save" />
              </button>
            </div>
          </div>
          
          <div
            v-if="!editingName"
            id="checkbox-counterbalance"
            style="width: 55.19px;"
          />
        </div>
        
        <!-- Menu Options -->
        <div
          ref="taskMenu"
          class="dropdown"
        >
          <button
            class="btn btn-light"
            title="Task options"
            data-toggle="dropdown"
          >
            <font-awesome-icon icon="ellipsis-v" />
          </button>
          <div class="dropdown-menu dropdown-menu-right">
            <div
              id="selected-task-menu"
            >
              <b-button
                block
                variant="warning"
                title="Edit task name"
                @click="editName"
              >
                <font-awesome-icon icon="pencil-alt" />
                <span>&nbsp;&nbsp;Edit</span>
              </b-button>
              
              <b-button
                block
                variant="archive-color"
                title="Archive task"
                @click="archiveTask({taskId: selectedTask.id})"
              >
                <span v-if="!selectedTask.archived">
                  <font-awesome-icon icon="download" />
                  <span>&nbsp;&nbsp;Archive</span>
                </span>
                <span v-if="selectedTask.archived">
                  <font-awesome-icon icon="upload" />
                  <span>&nbsp;&nbsp;Unarchive</span>
                </span>
              </b-button>
              
              <!--            <b-button-->
              <!--              block-->
              <!--              variant="danger"-->
              <!--              title="Delete task"-->
              <!--              @click="deleteTask({id: task.id})"-->
              <!--            >-->
              <!--              <font-awesome-icon icon="trash-alt" />-->
              <!--              <span>&nbsp;&nbsp;Delete</span>-->
              <!--            </b-button>-->
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tags Section -->
      <TagList
        :tag-list="taskTags"
        :task-id="selectedTask.id"
        :remove-tag="removeTag"
      />
      
      <!-- Notes Section -->
      <div
        id="notes-section"
        class="d-flex align-items-center"
        style="max-width: 100%"
      >
        <span id="notes-label">Notes: </span>
        
        <!-- Display Mode -->
        <!-- eslint-disable vue/no-v-html -->
        <span
          v-if="selectedTask.notes && !editingNotes"
          id="display-notes"
          v-html="displayNotes"
        />
        <!-- eslint-enable vue/no-v-html -->
        <button
          v-if="!editingNotes"
          type="button"
          class="btn btn-light"
          title="Edit notes"
          @click="editNotes"
        >
          <font-awesome-icon icon="pencil-alt" />
        </button>
        
        <!-- Editing Mode -->
        <div
          v-if="editingNotes"
          class="input-group"
        >
          <textarea
            ref="notesInput"
            v-model="selectedTask.notes"
            class="form-control"
            :rows="selectedTask.notes.split('\n').length"
          />
          <div class="input-group-append">
            <button
              v-if="editingNotes"
              type="button"
              class="btn btn-primary"
              title="Save notes"
              @click="editingNotes = false"
            >
              <font-awesome-icon icon="save" />
            </button>
          </div>
        </div>
      </div>
    </template>
    
    <!-- Countdown Timer -->
    <div>
      <div v-show="selectedTask && !selectedTask.completed && (!tempState.running || !tempState.activeTaskID || tempState.activeTaskID === selectedTask.id)">
        <Countdown
          :task-id="tempState.activeTaskID || (selectedTask && selectedTask.id)"
          class="top-margin"
        />
      </div>
    </div>
    
    <template v-if="selectedTask">
      <!-- Continue Timer Here -->
      <div
        v-if="!selectedTask.completed && (tempState.running && tempState.activeTaskID && tempState.activeTaskID !== selectedTask.id)"
        class="d-flex flex-column align-items-center"
        style="color: darkred"
      >
        <div>Continue Here</div>
        <button
          id="continue-here-btn"
          type="button"
          class="btn btn-light btn-lg"
          style="color: darkred"
          title="Continue Timer Here"
          @click="continueTimerHere"
        >
          <font-awesome-icon icon="play" />
        </button>
      </div>
      
      <!-- Activity View -->
      <ActivityView
        id="taskActivity"
        class="border-top top-margin"
        :task-id="selectedTask.id"
        :label="selectedTask.name"
        :log="selectedTask.log"
      />
    </template>
    <br>
  </div>
</template>

<script>
import Checkbox from './Checkbox'
import TagList from './TagList'
import ActivityView from './ActivityView'
import { mapActions, mapGetters, mapState } from 'vuex'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import Countdown from './Countdown.vue'

marked.setOptions({
  breaks: true
})

const renderer = new marked.Renderer()
const linkRenderer = renderer.link
renderer.link = (href, title, text) => {
  const html = linkRenderer.call(renderer, href, title, text)
  return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ')
}

export default {
  
  name: 'SelectedTask',
  
  components: {
    Countdown,
    Checkbox,
    TagList,
    ActivityView
  },
  
  props: {
    heightClass: {
      type: String,
      default: 'full-height'
    }
  },
  
  data: () => ({
    possibleEdit: true,
    editingName: false,
    editingNotes: false,
    newTag: '',
    tagOptions: [],
    showTagInput: false
  }),
  
  computed: {
    
    ...mapState([
      'tempState',
      'tagOrder'
    ]),
    
    ...mapGetters([
      'selectedTask'
    ]),
    
    checked () {
      return this.selectedTask.completed !== null
    },
    
    taskTags () {
      return this.selectedTask.tags
    },
    
    displayNotes () {
      return marked(DOMPurify.sanitize(this.selectedTask.notes), { renderer })
    }
    
  },
  
  methods: {
    
    ...mapActions([
      'startTask',
      'archiveTask',
      'removeTaskTag'
    ]),
    
    editName () {
      if (this.possibleEdit) {
        this.editingName = true
        this.$refs.taskMenu.classList.remove('show')
        this.$refs.taskMenu.querySelector('button[data-toggle="dropdown"]').setAttribute('aria-expanded', 'false')
        this.$refs.taskMenu.querySelector('.dropdown-menu').classList.remove('show')
        this.$nextTick(() => this.$refs.taskNameInput.focus())
      }
      this.possibleEdit = true
    },
    
    addTagButton () {
      this.showTagInput = !this.showTagInput
      if (this.showTagInput) {
        this.$nextTick(() => {
          this.$refs.addTagInput.focus()
        })
      }
    },
    
    removeTag ({ tagId }) {
      this.removeTaskTag({ taskId: this.selectedTask.id, tagId })
      this.$forceUpdate()
    },
    
    editNotes () {
      this.editingNotes = true
      this.$nextTick(() => {
        this.$refs.notesInput.focus()
      })
    },
    
    async continueTimerHere () {
      await this.startTask({ taskId: this.selectedTask.id })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../styles/_variables.scss";

#selected-task-container {
  overflow-y: auto;
  border-radius: 0.25rem;
  flex: 1;
}

#title-section {
  margin-top: 20px;
}

#checkbox-name-section {
  margin-left: 20px;
  flex: 1;
}

#task-name-container {
  margin: 8px;
}

#task-name {
  font-weight: 600;
  font-size: xx-large;
  text-align: center;
}

#selected-task-menu {
  justify-content: space-evenly;
}

#notes-section {
  padding: 15px 10px 10px;
}

#notes-label {
  padding-right: 15px;
}

#display-notes {
  padding: 10px;
  border: #e2e6ea 1px solid;
  border-radius: 5px;
  font-size: 18px;
  flex: 1;
  min-width: 0;
  overflow: visible;
  overflow-wrap: break-word;
}

.dropdown > button {
  margin: 8px;
}

.dropdown-menu {

  .selected-task-menu {
    margin: 8px;
  }
}

$play-btn-size: 75px;

#play-btn {
  width: $play-btn-size;
  height: $play-btn-size;
  font-size: 28px;
  border-radius: $play-btn-size;
}

.top-margin {
  margin-top: 20px;
}
</style>
