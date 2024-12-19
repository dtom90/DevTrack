<template>
  <b-modal
    v-if="modalTagId"
    id="activityModal"
    size="lg"
    ok-only
  >
    <template v-slot:modal-title>
      <span id="activity-for">Activity for</span>
      <TagSettingsButton :tag-id="modalTagId" />
    </template>
    <ActivityView
      v-if="modalTagId"
      id="tagActivity"
      :element="modalTagId"
      :log="tagActivity(modalTagId)"
    />
  </b-modal>
</template>

<script>
import ActivityView from '../ActivityView'
import { mapState, mapGetters } from 'vuex'
import TagSettingsButton from '../TagSettingsButton'

export default {
  name: 'ActivityModal',
  
  components: {
    TagSettingsButton,
    ActivityView
  },
  
  computed: {
    ...mapState([
      'modalTagId'
    ]),
    
    ...mapGetters([
      'tagActivity'
    ])
  }
}
</script>

<style scoped>
#activity-for {
  margin-top: 5px;
  margin-right: 5px;
}
</style>
