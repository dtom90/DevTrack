<template>
  <div
    :id="taskTags ? 'taskTags' : 'filterTags'"
    :class="taskTags ? 'd-flex' : 'form-inline'"
  >
    <h6
      v-if="!taskTags"
      style="width: 100%"
      class="tag-label"
    >
      <span>{{ label }}:</span>
    </h6>
    <label
      v-if="taskTags"
      class="tag-label"
    >
      <span>{{ label }}:</span>
    </label>
    
    <div id="elements">
      <div
        v-for="tagId in sortedTagList"
        :key="tagId"
        class="tag btn-group"
      >
        <button
          class="tag-name btn"
          :style="`backgroundColor: ${tags[tagId].color}`"
          :title="selectText"
          @click="selectTag ? selectTag(tagId, $event) : viewActivityModal(tagId)"
        >
          {{ tags[tagId].tagName }}
        </button>
        <button
          v-if="removeTag"
          class="tag-close btn"
          :style="`backgroundColor: ${tags[tagId].color}`"
          :title="removeText"
          aria-label="Close"
          @click.stop="removeTag({tagId})"
        >
          <font-awesome-icon icon="times" />
        </button>
      </div>
      <div v-if="label === 'Filtering on tasks with' && tagList.length > 1">
        <div
          class="btn-group btn-group-toggle"
        >
          <label
            :class="'btn btn-light' + (filterOperator === 'and' ? ' active' : '')"
            title="Show tasks with all of the selected tags"
          >
            <input
              v-model="filterOperator"
              type="radio"
              value="and"
            >
            <span>All</span>
          </label>
          <label
            :class="'btn btn-light' + (filterOperator === 'or' ? ' active' : '')"
            title="Show tasks with any of the selected tags"
          >
            <input
              v-model="filterOperator"
              type="radio"
              value="or"
            >
            <span>Any</span>
          </label>
        </div>
      </div>
      
      <!-- Tag Input -->
      <div
        v-if="taskTags"
        id="newTag"
        class="btn-group"
      >
        <div class="d-flex">
          <button
            id="addTagButton"
            class="btn btn-light"
            :title="showTagInput ? 'Cancel' : 'Add new tag'"
            @click="addTagButton"
          >
            <font-awesome-icon
              v-if="!showTagInput"
              icon="plus"
            />
            <font-awesome-icon
              v-if="showTagInput"
              icon="times"
            />
          </button>
          <div
            v-if="showTagInput"
            id="tagDropdown"
          >
            <div
              id="tagDropdownMenu"
              class="btn-group-vertical"
            >
              <button
                v-for="tag in availableTags(taskId, inputTagName)"
                :key="tag.id"
                class="tag-option btn btn-light"
                :style="`backgroundColor: ${tag.color}`"
                @click="addTag({ tagId: tag.id })"
              >
                {{ tag.tagName }}
              </button>
            </div>
          </div>
          <input
            v-if="showTagInput"
            id="addTagInput"
            ref="addTagInput"
            v-model="inputTagName"
            type="text"
            class="form-control"
            placeholder="add new tag"
            @input="tagInputChange"
            @focus="tagInputChange"
            @blur="clickOutside"
            @keyup.enter="addTag({ tagName: inputTagName })"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export default {
  name: 'TagList',
  props: {
    tagList: {
      type: Array,
      default: () => []
    },
    taskId: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: 'Tags'
    },
    selectText: {
      type: String,
      default: 'View tag activity'
    },
    selectTag: {
      type: Function,
      default: null
    },
    removeText: {
      type: String,
      default: 'Remove tag from task'
    },
    removeTag: {
      type: Function,
      default: null
    },
    updateFilterOperator: {
      type: Function,
      default: null
    }
  },
  
  data: () => ({
    editing: false,
    inputTagName: '',
    tagOptions: [],
    showTagInput: false
  }),
  
  computed: {
    
    ...mapState([
      'tags',
      'tagOrder',
      'settings'
    ]),
    
    ...mapGetters([
      'availableTags'
    ]),
    
    taskTags () {
      return this.taskId != null
    },
    
    sortedTagList () {
      return this.tagList.slice().sort((a, b) => this.tagOrder.indexOf(a) - this.tagOrder.indexOf(b))
    },
    
    filterOperator: {
      get () {
        return this.$store.state.settings.filterOperator
      },
      async set (value) {
        await this.updateSetting({ key: 'filterOperator', value })
        if (this.updateFilterOperator) {
          this.updateFilterOperator()
        }
      }
    }
  },
  
  methods: {
    
    ...mapActions([
      'addTaskTagById',
      'addTaskTagByName',
      'updateSetting'
    ]),
    
    ...mapMutations([
      'updateTempState'
    ]),
    
    addTagButton: function () {
      this.showTagInput = !this.showTagInput
      if (this.showTagInput) {
        this.$nextTick(() => {
          this.$refs.addTagInput.focus()
        })
      }
    },
    
    tagInputChange: function () {
      this.tagOptions = this.availableTags(this.taskId, this.inputTagName)
    },
    
    addTag: function ({ tagId, tagName }) {
      if (tagId != null) {
        this.addTaskTagById({ taskId: this.taskId, tagId })
      } else if (tagName != null && tagName.length) {
        this.addTaskTagByName({ taskId: this.taskId, tagName })
      }
      this.inputTagName = ''
      this.tagInputChange()
      this.tagOptions = this.availableTags(this.taskId, this.inputTagName)
      this.$refs.addTagInput.focus()
    },
    
    viewActivityModal: function (tagId) {
      this.updateTempState({ key: 'modalTagId', value: tagId })
      this.$root.$emit('bv::toggle::modal', 'activityModal')
    },
    
    clickOutside: function (event) {
      if (!(event.relatedTarget && event.relatedTarget.classList &&
        event.relatedTarget.classList.contains('tag-option'))) {
        this.tagOptions = []
        if (!(event.relatedTarget && event.relatedTarget.id === 'addTagButton')) {
          this.showTagInput = false
        }
      }
    }
    
  }
}
</script>

<style scoped>

/*noinspection CssUnusedSymbol*/
#taskTags {
  padding-left: 20px;
}

/*noinspection CssUnusedSymbol*/
#taskTags > .tag-label, #taskTags > #elements > * {
  margin-top: 20px;
  margin-right: 20px;
}

/*noinspection CssUnusedSymbol*/
#filterTags > .tag-label, #filterTags > #elements > * {
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 10px;
}

#filterTags > label {
  width: 100%;
  justify-content: start;
}

#addTagInput {
  max-width: 160px;
}

#tagDropdown {
  position: relative;
}

#tagDropdownMenu {
  position: absolute;
  top: 42px;
  z-index: 4;
  width: 160px;
}

.tag > button {
  color: white;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.4),
  0 0 13px rgba(0, 0, 0, 0.1),
  0 0 23px rgba(0, 0, 0, 0.1);
}

.tag > button:hover {
  color: lightgrey;
}

.tag-name {
  word-break: break-word;
}

.tag-option {
  color: white;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.4),
  0 0 13px rgba(0, 0, 0, 0.1),
  0 0 23px rgba(0, 0, 0, 0.1);
  word-break: break-word;
}

.tag-option:hover {
  color: lightgrey;
}

</style>
