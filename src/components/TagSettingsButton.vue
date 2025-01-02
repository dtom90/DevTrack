<template>
  <div
    ref="tagSettingsButton"
    class="btn-group dropright"
    role="group"
  >
    <button
      type="button"
      class="btn tag-button dropdown-toggle"
      :style="`backgroundColor: ${tag.color}`"
      data-toggle="dropdown"
      data-boundary="viewport"
    >
      {{ tag.tagName }}
    </button>
    <div
      id="tag-menu"
      class="dropdown-menu"
    >
      <div
        class="d-flex align-items-center"
      >
        <input
          v-model="newTagName"
          title="Rename tag"
          @keyup.enter="updateTagName"
        >
        <button
          type="button"
          class="btn btn-primary"
          @click="updateTagName"
        >
          <font-awesome-icon icon="save" />
        </button>
      </div>
      <div class="dropdown-divider" />
      <sketch-picker
        :value="color"
        @input="updateTagColor"
      />
      <div class="dropdown-divider" />
      <button
        id="delete-tag-btn"
        type="button"
        class="btn btn-danger"
        title="Delete tag"
        @click="deleteTag({tag:tagName})"
      >
        <font-awesome-icon icon="trash-alt" />
      </button>
    </div>
  </div>
</template>

<script>
import Sketch from 'vue-color/src/components/Sketch'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'TagSettingsButton',
  
  components: {
    'sketch-picker': Sketch
  },
  
  props: {
    tagId: {
      type: String,
      default: null
    }
  },
  
  data: () => ({
    color: '#FFFFFF',
    newTagName: ''
  }),
  
  computed: {
    ...mapState([
      'tags'
    ]),
    tag: function () {
      return this.tags[this.tagId]
    }
  },
  
  mounted () {
    this.newTagName = this.tag.tagName
    this.color = this.tag.color
  },
  
  methods: {
    ...mapActions([
      'setTagName'
    ]),
    
    ...mapMutations([
      'deleteTag'
    ]),
    
    updateTagName () {
      this.setTagName({
        tagId: this.tagId,
        newTagName: this.newTagName
      })
      this.$refs.tagSettingsButton.classList.remove('show')
      this.$refs.tagSettingsButton.querySelector('button[data-toggle="dropdown"]').setAttribute('aria-expanded', 'false')
      this.$refs.tagSettingsButton.querySelector('.dropdown-menu').classList.remove('show')
    },
    
    updateTagColor (value) {
      this.updateTag({
        tagId: this.tagId,
        color: value.hex
      })
      this.color = this.tag.color
    }
  }
}
</script>

<style scoped>

.tag-button {
  color: white;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.4),
  0 0 13px rgba(0, 0, 0, 0.1),
  0 0 23px rgba(0, 0, 0, 0.1);
}

.tag-button:hover {
  color: lightgrey;
}

.dropdown-menu {
  min-width: 40px;
  position: absolute;
}

#delete-tag-btn {
  margin-left: 8px;
}

</style>
