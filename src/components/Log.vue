<template>
  <div class="log">
    <!-- Display Day -->
    <h5
      v-if="day"
    >
      {{ displayDateHuman(day) }}
    </h5>
    
    <!-- Time Spent on Task -->
    <h6>Time Spent: {{ displayDuration(timeSpent) }}</h6>
    
    <!-- Task Activity Log -->
    <table
      class="activityLog table"
    >
      <tr
        v-for="(event, index) in log"
        :key="index"
      >
        <template v-if="!event.completed">
          <td v-if="event.task">
            <span>{{ event.task }}</span>
          </td>
          
          <td v-if="event.started">
            <span>Started {{ displayTimeHuman(event.started) }}</span>
          </td>
          <td>
            <font-awesome-icon icon="arrow-right" />
          </td>
          <td>
            <span>{{ event.stopped ? 'Stopped' : 'Running' }} {{ displayTimeHuman(event.stopped || Date.now()) }}</span>
          </td>
          <td v-if="event.timeSpent">
            <span>Time Spent: {{ displayDuration(event.timeSpent) }}</span>
          </td>
          <td
            v-if="!event.task && !event.completed"
            class="btn-container"
          >
            <div
              :ref="`intervalMenu${index}`"
              class="dropright"
            >
              <button
                class="btn btn-light interval-menu-btn"
                data-toggle="dropdown"
                data-boundary="viewport"
              >
                <font-awesome-icon icon="ellipsis-v" />
              </button>
              <div
                class="dropdown-menu"
                style="padding: 0;"
              >
                <button
                  class="btn btn-danger"
                  style="width: 100%"
                  @click="deleteInterval({ log: event, index })"
                >
                  Delete Interval
                </button>
              </div>
            </div>
          </td>
        </template>
        
        <template v-if="event.completed">
          <td />
          <td />
          <td>
            <span>Completed {{ displayTimeHuman(event.completed) }}</span>
          </td>
          <td />
          <td />
        </template>
      </tr>
    </table>
  </div>
</template>

<script>
import time, { displayDuration } from '../lib/time'

export default {
  name: 'Log',
  
  mixins: [time],
  
  props: {
    day: {
      type: String,
      default: null
    },
    log: {
      type: Array,
      default: () => []
    },
    timeSpent: {
      type: Number,
      default: 0
    },
    deleteIntervalButtonClicked: {
      type: Function,
      default: () => {
      }
    }
  },
  
  methods: {
    
    displayEventDuration (event) {
      const end = event.stopped || Date.now()
      return displayDuration(end - event.started)
    },
  
    deleteInterval ({ log, index }) {
      this.$refs[`intervalMenu${index}`][0].classList.remove('show')
      this.$refs[`intervalMenu${index}`][0].querySelector('button[data-toggle="dropdown"]').setAttribute('aria-expanded', 'false')
      this.$refs[`intervalMenu${index}`][0].querySelector('.dropdown-menu').classList.remove('show')
      this.deleteIntervalButtonClicked({ logId: log.id })
    }
  }
}
</script>

<style scoped>

.log {
  margin-top: 32px;
}

.activityLog {
  margin-top: 20px;
  margin-bottom: 0;
  font-size: 16px;
  text-align: center;
  border-bottom: rgb(222, 226, 230) 1px solid;
}

.btn-container {
  padding: 0;
  vertical-align: middle;
}
</style>
