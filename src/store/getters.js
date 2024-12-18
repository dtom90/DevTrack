const getters = {
  selectedTask (state) {
    return state.tasks.find(t => t.id === state.selectedTaskID)
  },
  
  activeTask (state) {
    return state.tasks.find(t => t.id === state.activeTaskID)
  },
  
  notificationsEnabled (state) {
    const activeTask = state.tasks.find(t => t.id === state.activeTaskID)
    return state.globalNotificationsEnabled && (
      activeTask ? !(activeTask.disableNotifications === true) : true
    )
  },
  
  incompleteTasks: (state) => {
    return state.tasks.filter(t => !t.completed)
  },
  
  completedTasks (state) {
    let completedTasks = state.tasks.filter(t => t.completed)
    completedTasks = completedTasks.sort((a, b) => a.completed - b.completed)
    return state.completedOrder === 'Recent' ? completedTasks.reverse() : completedTasks
  },
  
  unselectedTags: state => Object.keys(state.tags).filter(tag => !state.selectedTags.includes(tag)),
  
  availableTags: state => (id, snip) => Object.keys(state.tags)
    .filter(tag => tag.startsWith(snip) && !state.tasks.find(t => t.id === id).tags.includes(tag))
    .sort((a, b) => state.tagOrder.indexOf(a) - state.tagOrder.indexOf(b)),
  
  tagActivity: state => tag => state.tasks.filter(task => task.tags.includes(tag))
    .map(task => {
      const logEvents = task.log.map(event => Object.assign({ task: task.name }, event))
      if (task.completed) {
        logEvents.unshift({ task: task.name, completed: task.completed })
      }
      return logEvents
    }).flat().sort((a, b) => ('started' in a ? a.started : a.completed) - ('started' in b ? b.started : b.completed)),
  
  allActivity: state => state.tasks
    .map(task => {
      const logEvents = task.log.map(event => Object.assign({ task: task.name }, event))
      if (task.completed) {
        logEvents.unshift({ task: task.name, completed: task.completed })
      }
      return logEvents
    }).flat().sort((a, b) => ('started' in a ? a.started : a.completed) - ('started' in b ? b.started : b.completed))
}

export default getters
