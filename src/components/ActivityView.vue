<template>
  <div
    :id="id"
    class="activity-view"
  >
    <!-- Daily / Weekly / Monthly view switch -->
    <div class="view-select d-flex justify-content-center position-relative">
      <b-form-group>
        <b-form-radio-group
          v-model="chartType"
          :options="chartTypeOptions"
          buttons
          button-variant="light"
          @change="onChartTypeChange"
        />
      </b-form-group>
      <div
        v-if="!isTaskActivity"
        class="position-absolute"
        style="right: 0"
      >
        <div class="dropdown">
          <button
            class="btn btn-light"
            data-toggle="dropdown"
          >
            Set Target
          </button>
          <div class="dropdown-menu">
            <label>{{ chartType }} Target:</label>
            <div
              class="input-group"
            >
              <input
                v-model="target"
                type="number"
                min="0"
                class="form-control"
              >
              <div class="input-group-append">
                <span
                  class="input-group-text"
                >hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- ActivityChart -->
    <ActivityChart
      ref="activityChart"
      :chart-data="chartData"
      :styles="chartStyles"
      :target="target * 60"
    />
    
    <br>
    
    <!-- Log View Switch -->
    <div
      id="viewType"
      class="d-flex justify-content-center"
    >
      <button
        id="viewLogSwitch"
        :class="'btn btn-light nav-link' + (logVisible ? ' active' : '')"
        :title="(logVisible ? 'Hide' : 'Show') + ' activity log'"
        @click="toggleLog"
      >
        <span>Activity Log</span>
      </button>
    </div>
    
    <!-- Activity Data -->
    <div
      v-if="logVisible"
      class="border"
    >
      <!-- Dropdown to add interval manually -->
      <AddIntervalDropdown
        :task-id="taskId"
      />
      
      <!-- Log -->
      <div id="task-log">
        <Log
          v-for="([day, dayActivity]) in dailyActivity"
          :key="day"
          :day="day"
          :log="dayActivity.log"
          :time-spent="dayActivity.timeSpent"
          :delete-interval-button-clicked="deleteIntervalButtonClicked"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Log from './Log'
import ActivityChart from './ActivityChart'
import AddIntervalDropdown from './dropdowns/AddIntervalDropdown'
import { mapState, mapActions } from 'vuex'
import time from '../lib/time'

export default {
  name: 'ActivityView',
  
  components: {
    ActivityChart,
    AddIntervalDropdown,
    Log
  },
  
  mixins: [time],
  
  props: {
    id: {
      type: String,
      default: 'taskActivity'
    },
    taskId: {
      type: String,
      default: null
    },
    tagId: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: '#2020FF'
    },
    log: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  
  data: function () {
    return {
      chartTypeOptions: ['Daily', 'Weekly', 'Monthly'],
      chartType: 'Daily',
      logVisible: false
    }
  },
  
  computed: {
    
    ...mapState([
      'tasks',
      'tags',
      'settings'
    ]),
    
    isTaskActivity: function () {
      return this.taskId !== null
    },
    
    target: {
      get () {
        if (this.isTaskActivity) {
          return null
        }
        const type = this.chartType + 'Target'
        const targetElement = this.label === 'All Activity' ? this.settings : this.tags[this.tagId]
        return targetElement[type]
      },
      set (value) {
        let numValue = parseFloat(value)
        if (numValue < 0) {
          numValue = 0
        }
        if (this.label === 'All Activity') {
          this.updateSetting({
            key: this.chartType + 'Target',
            value: numValue
          })
        } else {
          this.updateTag({
            tagId: this.tagId,
            [this.chartType + 'Target']: numValue
          })
        }
      }
    },
    
    dailyActivity: function () {
      const dailyActivity = {}
      let day
      
      if (this.isTaskActivity) {
        const task = this.tasks.filter(task => task.id === this.taskId)[0]
        if (task.completed) {
          day = this.displayDateISO(task.completed)
          dailyActivity[day] = { log: [{ completed: task.completed }] }
        }
      }
      
      // Create dailyActivity Object from a copy of descending this.log
      for (const event of [...this.log].reverse()) {
        const timestamp = 'started' in event ? event.started : event.completed
        day = this.displayDateISO(timestamp)
        if (day in dailyActivity) {
          dailyActivity[day].log.push(event)
        } else {
          dailyActivity[day] = { log: [event] }
        }
      }
      
      for (const day in dailyActivity) {
        dailyActivity[day].log.sort((a, b) => {
          const aTime = a.completed || a.started
          const bTime = b.completed || b.started
          return bTime - aTime
        })
      }
      
      const dailyActivityArray = Object.entries(dailyActivity)
      dailyActivityArray.sort(([day1], [day2]) => this.stringToMs(day2) - this.stringToMs(day1))
      return dailyActivityArray
    },
    
    chartData () {
      const chartData = Object.assign({}, this.chartType === 'Daily' ? dailyChartData(this) : (this.chartType === 'Weekly' ? weeklyChartData(this) : monthlyChartData(this)))
      chartData.labels = chartData.labels.slice(-30)
      chartData.datasets[0].data = chartData.datasets[0].data.slice(-30)
      return chartData
    },
    
    chartStyles () {
      const width = 50 + this.chartData.labels.length * 100
      
      return width > 600 ? {
        width: `${width}px`,
        height: '400px',
        position: 'relative'
      } : {
        height: '400px'
      }
    }
    
  },
  
  methods: {
    
    ...mapActions([
      'updateSetting',
      'updateTag',
      'deleteInterval'
    ]),
    
    calculateTimeSpent (log) {
      return log.filter(interval => interval.timeSpent)
        .reduce((total, interval) => total + interval.timeSpent, 0)
    },
    
    onChartTypeChange () {
      this.$refs.activityChart.scrollRight()
    },
    
    toggleLog () {
      this.logVisible = !this.logVisible
    },
    
    deleteIntervalButtonClicked ({ logId }) {
      this.deleteInterval({ logId })
    }
  }
}

function initializeChartData (that) {
  return {
    labels: [],
    datasets: [{
      label: that.label,
      backgroundColor: that.color,
      data: [],
      barThickness: 70
    }]
  }
}

function dailyChartData (that) {
  const chartData = initializeChartData(that)
  
  // Add time spent per day and add to chartData
  let nextDay = null
  that.dailyActivity.forEach(([day, dayActivity]) => {
    const daysDiff = that.dateDiffInDays(day, nextDay)
    if (nextDay && daysDiff > 1) {
      const a = that.displayDateHuman(that.daysLater(day, 1))
      if (daysDiff === 2) {
        chartData.labels.unshift(a)
      } else {
        const b = that.displayDateHuman(that.daysLater(nextDay, -1))
        chartData.labels.unshift([a + ' -', b])
      }
      chartData.datasets[0].data.unshift(0)
    }
    dayActivity.timeSpent = that.calculateTimeSpent(dayActivity.log)
    chartData.labels.unshift(that.displayDateHuman(day))
    chartData.datasets[0].data.unshift(that.msToMinutes(dayActivity.timeSpent))
    nextDay = day
  })
  
  return chartData
}

function weeklyChartData (that) {
  const weeklyActivity = {}
  let week
  
  // Create weeklyActivity Object from log
  for (const event of that.log) {
    week = that.displayWeekISO(event.started)
    if (week in weeklyActivity) {
      weeklyActivity[week].log.push(event)
    } else {
      weeklyActivity[week] = { log: [event] }
    }
  }
  
  const chartData = initializeChartData(that)
  
  // Add time spent per week and add to chartData
  Object.keys(weeklyActivity).slice().sort((a, b) => {
    const [ay, aw] = a.split('-').map(n => parseInt(n))
    const [by, bw] = b.split('-').map(n => parseInt(n))
    return (ay - by) * 100 + (aw - bw)
  }).forEach(week => {
    chartData.labels.push(that.displayWeekHuman(week))
    chartData.datasets[0].data.push(that.msToMinutes(that.calculateTimeSpent(weeklyActivity[week].log)))
  })
  
  return chartData
}

function monthlyChartData (that) {
  const monthlyActivity = {}
  let month
  
  // Create monthlyActivity Object from log
  for (const event of that.log) {
    month = that.displayMonthISO(event.started)
    if (month in monthlyActivity) {
      monthlyActivity[month].log.push(event)
    } else {
      monthlyActivity[month] = { log: [event] }
    }
  }
  
  const chartData = initializeChartData(that)
  
  // Add time spent per week and add to chartData
  Object.keys(monthlyActivity).slice().sort((a, b) => {
    const [ay, am] = a.split('-').map(n => parseInt(n))
    const [by, bm] = b.split('-').map(n => parseInt(n))
    return (ay - by) * 100 + (am - bm)
  }).forEach(month => {
    chartData.labels.push(that.displayMonthHuman(month))
    chartData.datasets[0].data.push(that.msToMinutes(that.calculateTimeSpent(monthlyActivity[month].log)))
  })
  
  return chartData
}

</script>

<style scoped>

.view-select {
  margin-bottom: 20px;
}

.activity-view {
  padding: 20px;
}

#viewLogSwitch {
  font-size: 1.25rem;
  font-weight: 500;
}

#task-log {
  margin-top: -38px;
}

</style>
