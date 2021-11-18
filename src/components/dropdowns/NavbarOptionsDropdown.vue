<template>
  <b-nav-item-dropdown
    text="Options"
    boundary="viewport"
  >
    <b-dropdown-item-button>
      <b-form-checkbox v-model="checkboxEnableNotifications">
        Enable Notifications
      </b-form-checkbox>
    </b-dropdown-item-button>
    <b-dropdown-item-button>
      <b-form-checkbox v-model="timeFormat">
        Use 24-hour Clock
      </b-form-checkbox>
    </b-dropdown-item-button>
    <div class="dropdown-divider" />
    <b-dropdown-item-button v-b-modal.dataModal>
      Data
    </b-dropdown-item-button>
    <b-dropdown-item-button v-b-modal.dataModal>
      Delete Completed
    </b-dropdown-item-button>
  </b-nav-item-dropdown>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'NavbarOptionsDropdown',
  
  computed: {
    ...mapState([
      'globalNotificationsEnabled',
      'timeFormat24'
    ]),
    
    checkboxEnableNotifications: {
      get () {
        return this.globalNotificationsEnabled
      },
      set (newValue) {
        this.setNotificationsEnabled(newValue)
      }
    },
    
    timeFormat: {
      get () {
        return this.timeFormat24
      },
      set (newValue) {
        this.setTimeFormat(newValue)
      }
    }
  }
}
</script>

<style scoped>

</style>
