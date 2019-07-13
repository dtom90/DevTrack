import Vue from 'vue'
import Vuex from 'vuex'
import { eventTypes } from './constants'

Vue.use(Vuex)

const event = type => ({ type, time: Date.now() })

const completedDate = task => task.activity.filter(event => event.type === eventTypes.Completed)[0].time

export const mutations = {
  
  addTask (state, newTaskName) {
    const newTask = {
      id: state.tasks.length,
      name: newTaskName,
      tags: new Set([]),
      completed: false,
      activity: [event(eventTypes.Created)]
    }
    state.tasks.push(newTask)
    state.selectedTask = newTask
  },
  
  selectTask (state, id) {
    state.selectedTask = state.tasks.find(t => t.id === id)
  },
  
  addTaskEvent (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    task.activity.push(event(payload.type))
  },
  
  addTaskTag (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    if (!(payload.tag in state.tags)) state.tags[payload.tag] = new Set([task.id])
    else state.tags[payload.tag].add(task.id)
    task.tags.add(payload.tag)
  },
  
  removeTaskTag (state, payload) {
    const task = state.tasks.find(t => t.id === payload.id)
    task.tags.delete(payload.tag)
    state.tags[payload.tag].delete(payload.id)
  },
  
  completeTask (state, id) {
    const task = state.tasks.find(t => t.id === id)
    if (task.completed) {
      task.activity.push(event(eventTypes.Completed))
    } else {
      task.activity.pop()
    }
  },
  
  deleteTask (state, id) {
    const index = state.tasks.findIndex(t => t.id === id)
    const task = state.tasks[index]
    if (task.completed || confirm(`Are you sure you want to delete task ${task.name}? the task is not yet complete!`)) {
      state.tasks.splice(index, 1)
    }
  },
  
  clearTasks (state) {
    const completedTasks = state.tasks.filter(t => t.completed)
    if (completedTasks.length === 1 || confirm(`Are you sure that you want to delete all ${completedTasks.length} completed tasks?`)) {
      state.tasks = state.tasks.filter(t => !t.completed)
    }
  }
}

export default new Vuex.Store({
  
  state: {
    tasks: [],
    tags: {},
    selectedTask: null
  },
  
  getters: {
    incompleteTasks (state) {
      const incompleteTasks = state.tasks.filter(t => !t.completed)
      return state.incompleteOrder === 'Newest' ? incompleteTasks.reverse() : incompleteTasks
    },
    
    completedTasks (state) {
      const completedTasks = state.tasks.filter(t => t.completed).sort((a, b) => completedDate(a) - completedDate(b))
      return state.completedOrder === 'Recent' ? completedTasks.reverse() : completedTasks
    },
    
    availableTags: state => (id, snip) => Object.keys(state.tags).filter(tag =>
      tag.startsWith(snip) && !state.tags[tag].has(id)),
    
    tagActivity: state => tag => [...state.tags[tag]].map(taskID => {
      const task = state.tasks.find(t => t.id === taskID)
      return task.activity.map(event => Object.assign({ task: task.name }, event))
    }).flat().sort((a, b) => a.time - b.time)
  },
  
  mutations
  
})
