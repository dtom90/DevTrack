<template>
  <b-modal
    id="tagModal"
    title="Tags"
    size="lg"
    scrollable
    ok-only
  >
    <draggable
      v-model="changeTagOrder"
      animation="200"
      @start="startDrag"
      @end="endDrag"
    >
      <div
        v-for="tagId in tagOrder"
        :key="tagId"
        class="tag btn-toolbar"
      >
        <div
          class="btn-group"
          role="group"
        >
          <button
            type="button"
            class="btn move-btn"
            :style="`backgroundColor: ${tags[tagId].color}`"
          >
            <font-awesome-icon icon="bars" />
          </button>
          <TagSettingsButton :tag-id="tagId" />
        </div>
      </div>
    </draggable>
  </b-modal>
</template>

<script>
import TagSettingsButton from '../TagSettingsButton'
import { mapActions, mapState } from 'vuex'
import draggable from 'vuedraggable'

export default {
  name: 'TagModal',
  
  components: {
    TagSettingsButton,
    draggable
  },
  
  computed: {
    ...mapState([
      'tags',
      'tagOrder'
    ]),
    changeTagOrder: {
      get () {
        return this.tagOrder
      },
      set (newOrder) {
        this.reorderTags({ newOrder })
      }
    }
  },
  
  methods: {
    ...mapActions([
      'reorderTags'
    ]),
    startDrag () {
      document.body.classList.add('draggable-cursor')
    },
    endDrag () {
      document.body.classList.remove('draggable-cursor')
    }
  }
}
</script>

<style scoped lang="scss">

.tag {
  margin-bottom: 20px;
  
  //noinspection CssInvalidPropertyValue
  .move-btn {
    color: white;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.4),
    0 0 13px rgba(0, 0, 0, 0.1),
    0 0 23px rgba(0, 0, 0, 0.1);
    cursor: move;
    cursor: -webkit-grab;
    cursor: -moz-grab;
    cursor: grab;
  }
  
  .move-btn:hover {
    color: lightgrey;
  }
  
}

</style>
