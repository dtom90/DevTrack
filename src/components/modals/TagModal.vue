<template>
  <b-modal
    id="tagModal"
    content-class="tag-modal-content"
    title="Tags"
    size="lg"
    scrollable
    ok-only
    @shown="isModalShown = true"
    @hidden="isModalShown = false"
  >
    <draggable
      v-if="isModalShown"
      v-model="tagOrder"
      animation="200"
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
            class="btn move-btn draggable-item"
            :style="`backgroundColor: ${tags[tagId].color}`"
          >
            <font-awesome-icon icon="bars" />
          </button>
          <TagSettingsButton :tag-id="tagId" />
        </div>
      </div>
    </draggable>
    <div id="menu-padding" />
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
  
  data: () => ({
    isModalShown: false
  }),
  
  computed: {
    ...mapState([
      'tags'
    ]),
    tagOrder: {
      get () {
        return this.$store.state.tagOrder
      },
      set (newOrder) {
        this.reorderTags({ newOrder })
      }
    }
  },
  
  methods: {
    ...mapActions([
      'reorderTags'
    ])
  }
}
</script>

<style>
.tag-modal-content {
  overflow-y: scroll;
}
#menu-padding {
  height: 380px;
}
</style>

<style scoped lang="scss">

.tag {
  margin-bottom: 20px;
  
  //noinspection CssInvalidPropertyValue
  .move-btn {
    color: white;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.4),
    0 0 13px rgba(0, 0, 0, 0.1),
    0 0 23px rgba(0, 0, 0, 0.1);
  }
  
  .move-btn:hover {
    color: lightgrey;
  }
}

</style>
