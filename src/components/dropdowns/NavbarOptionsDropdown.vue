<template>
  <b-nav-item-dropdown
    text="Options"
    boundary="viewport"
  >
    <b-dropdown-item-button>
      <b-form-checkbox v-model="globalNotificationsEnabledValue">
        Enable Notifications
      </b-form-checkbox>
    </b-dropdown-item-button>
    <b-dropdown-item-button>
      <b-form-checkbox v-model="timeFormatValue">
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
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'NavbarOptionsDropdown',
  
  computed: {
    ...mapState([
      'globalNotificationsEnabled',
      'timeFormat24'
    ]),
    
    globalNotificationsEnabledValue: {
      get () {
        return this.globalNotificationsEnabled
      },
      set (newValue) {
        this.setGlobalNotificationsEnabled(newValue)
      }
    },
    
    timeFormatValue: {
      get () {
        return this.timeFormat24
      },
      set (newValue) {
        this.setTimeFormat(newValue)
      }
    }
  },
  
  methods: {
    ...mapMutations([
      'setGlobalNotificationsEnabled',
      'setTimeFormat'
    ])
  }
}
</script>

<style scoped>

</style>
