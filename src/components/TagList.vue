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
        v-for="tag in sortedTagList"
        :key="tag"
        class="tag btn-group"
      >
        <button
          class="tag-name btn"
          :style="`backgroundColor: ${tags[tag].color}`"
          :title="selectText"
          @click="modal ? viewActivityModal(tag) : selectTag(tag, $event)"
        >
          {{ tag }}
        </button>
        <button
          v-if="removeTag"
          class="tag-close btn"
          :style="`backgroundColor: ${tags[tag].color}`"
          :title="removeText"
          aria-label="Close"
          @click.stop="removeTag(tag)"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div v-if="label === 'Filtering on tasks with' && tagList.length > 1">
        <div
          class="btn-group btn-group-toggle"
        >
          <label
            :class="'btn btn-light' + (filterOperatorValue === 'and' ? ' active' : '')"
            title="Show tasks with all of the selected tags"
          >
            <input
              v-model="filterOperatorValue"
              type="radio"
              value="and"
            >
            <span>All</span>
          </label>
          <label
            :class="'btn btn-light' + (filterOperatorValue === 'or' ? ' active' : '')"
            title="Show tasks with any of the selected tags"
          >
            <input
              v-model="filterOperatorValue"
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
            id="tagDropdown"
          >
            <div
              id="tagDropdownMenu"
              class="btn-group-vertical"
            >
              <button
                v-for="tag in tagOptions"
                :key="tag"
                class="tag-option btn btn-light"
                :style="`backgroundColor: ${tags[tag].color}`"
                @click="addTag(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </div>
          <input
            v-if="showTagInput"
            id="addTagInput"
            ref="addTagInput"
            v-model="newTag"
            type="text"
            class="form-control"
            placeholder="add new tag"
            @input="tagInputChange"
            @focus="tagInputChange"
            @blur="clickOutside"
            @keyup.enter="addTag(newTag)"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  name: 'TagList',
  props: {
    tagList: {
      type: Array,
      default: () => []
    },
    taskId: {
      type: Number,
      default: NaN
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
      default: () => null
    },
    modal: {
      type: Boolean,
      default: false
    },
    removeText: {
      type: String,
      default: 'Remove tag from task'
    },
    removeTag: {
      type: Function,
      default: null
    }
  },
  
  data: () => ({
    editing: false,
    newTag: '',
    tagOptions: [],
    showTagInput: false
  }),
  
  computed: {
    
    ...mapState([
      'tags',
      'tagOrder',
      'filterOperator'
    ]),
    
    ...mapGetters([
      'availableTags'
    ]),
    
    taskTags () {
      return !isNaN(this.taskId)
    },
    
    sortedTagList () {
      return this.tagList.slice().sort((a, b) => this.tagOrder.indexOf(a) - this.tagOrder.indexOf(b))
    },
    
    filterOperatorValue: {
      get () {
        return this.filterOperator
      },
      set (value) {
        this.setFilterOperator(value)
      }
    }
  },
  
  methods: {
    
    ...mapMutations([
      'addTaskTag',
      'removeTaskTag',
      'setFilterOperator',
      'setModalTag'
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
      this.tagOptions = this.availableTags(this.taskId, this.newTag)
    },
    
    addTag: function (newTag) {
      this.addTaskTag({ id: this.taskId, tag: newTag })
      this.newTag = ''
      this.tagInputChange()
      this.tagOptions = this.availableTags(this.taskId, this.newTag)
      this.$refs.addTagInput.focus()
    },
    
    viewActivityModal: function (newTag) {
      this.setModalTag({ newTag })
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
