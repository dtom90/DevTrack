const initialState = {
  tasks: [],
  tags: {},
  tagOrder: [],
  totalTarget: {},
  
  tempState: {
    activeTaskID: null,
    running: false,
    modalTagId: null,
    showArchived: false
  },
  
  settings: {

    // Timer settings
    selectedTaskID: null,
    activeMinutes: 25,
    restMinutes: 5,
    continueOnComplete: false,
    secondReminderMinutes: 5,
    secondReminderEnabled: true,
    
    // TaskList settings
    selectedTagIds: [],
    filterOperator: 'and',
    addSelectedTags: true,
    insertAtTop: false,
    
    // Navbar settings
    globalNotificationsEnabled: true,
    timeFormat24: false,
    DailyTarget: null,
    WeeklyTarget: null,
    MonthlyTarget: null
    // totalTarget: {}
  }
}

// // Load state from sample file
// import sample1 from '../../tests/fixtures/sample1'
// const state = sample1

// // Load task with activity
// import { taskWithActivity } from '../../tests/fixtures'
// state.tasks.push(taskWithActivity())

export default initialState
