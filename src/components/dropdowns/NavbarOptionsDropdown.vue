<template>
  <b-nav-item-dropdown
    text="Options"
    boundary="viewport"
  >
    <b-dropdown-item-button>
      <b-form-checkbox v-model="globalNotificationsEnabled">
        Enable Notifications
      </b-form-checkbox>
    </b-dropdown-item-button>
    <b-dropdown-item-button>
      <b-form-checkbox v-model="timeFormat24">
        Use 24-hour Clock
      </b-form-checkbox>
    </b-dropdown-item-button>
    <div class="dropdown-divider" />
    <b-dropdown-item-button v-b-modal.dataModal>
      Data
    </b-dropdown-item-button>
  </b-nav-item-dropdown>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'NavbarOptionsDropdown',
  
  computed: {
    globalNotificationsEnabled: {
      get () {
        return this.$store.state.settings.globalNotificationsEnabled
      },
      set (value) {
        this.updateSetting(
          { key: 'globalNotificationsEnabled', value }
        )
      }
    },
    
    timeFormat24: {
      get () {
        return this.$store.state.settings.timeFormat24
      },
      set (value) {
        this.updateSetting(
          { key: 'timeFormat24', value }
        )
      }
    }
  },
  
  methods: {
    ...mapActions([
      'updateSetting'
    ])
  }
}
</script>

<style scoped>

</style>
