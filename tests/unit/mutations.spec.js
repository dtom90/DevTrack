import { expect } from 'chai'
import { initialState, mutations } from '@/store'

const { addTask, addTaskTag, selectTag, removeTaskTag, startTask, stopTask, completeTask, deleteTask } = mutations

window.confirm = function () { return true }

describe('mutations', () => {
  
  let myState
  let createdTime
  let origState
  
  beforeEach(() => {
    
    myState = JSON.parse(JSON.stringify(initialState))
    addTask(myState, { name: 'my first task' })
    createdTime = myState.tasks[0].created
    origState = JSON.parse(JSON.stringify(myState))
    
  })
  
  describe('addTask', () => {
    
    it('should add a task to the state', () => {
      
      expect(myState.tasks).to.deep.equal([
        {
          id: 0,
          name: 'my first task',
          tags: [],
          notes: '',
          created: createdTime,
          log: [],
          completed: null
        }
      ])
      expect(myState.selectedTaskID).to.equal(0)
      
    })
    
    it('should not add a blank task to the state', () => {
      
      addTask(myState, { name: '' })
      expect(myState).to.deep.equal(origState)
      
      addTask(myState, { name: ' ' })
      expect(myState).to.deep.equal(origState)
      
    })
    
    it('should add a unique task ID', () => {
      
      addTask(myState, { name: 'my second task' })
      addTask(myState, { name: 'my third task' })
      
      expect(myState.tasks).to.deep.equal([
        {
          id: 0,
          name: 'my first task',
          tags: [],
          notes: '',
          created: createdTime,
          log: [],
          completed: null
        },
        {
          id: 1,
          name: 'my second task',
          tags: [],
          notes: '',
          created: myState.tasks[1].created,
          log: [],
          completed: null
        },
        {
          id: 2,
          name: 'my third task',
          tags: [],
          notes: '',
          created: myState.tasks[2].created,
          log: [],
          completed: null
        }
      ])
      
      deleteTask(myState, { id: 1 })
      addTask(myState, { name: 'my fourth task' })
      
      expect(myState.tasks).to.deep.equal([
        {
          id: 0,
          name: 'my first task',
          tags: [],
          notes: '',
          created: createdTime,
          log: [],
          completed: null
        },
        {
          id: 2,
          name: 'my third task',
          tags: [],
          notes: '',
          created: myState.tasks[1].created,
          log: [],
          completed: null
        },
        {
          id: 3,
          name: 'my fourth task',
          tags: [],
          notes: '',
          created: myState.tasks[2].created,
          log: [],
          completed: null
        }
      ])
      
    })
    
  })
  
  describe('startTask', () => {
    
    it('should start and stop the task', () => {
      
      startTask(myState, { id: 0 })
      const started = Date.now()
      const firstInterval = { started, stopped: null, timeSpent: null }
      expect(myState.tasks[0].log).to.deep.equal([firstInterval])
  
      stopTask(myState, { id: 0 })
      expect(myState.tasks[0].log[0].stopped).not.to.equal(null)
      
    })
    
    it('should not overwrite the latest start time if called twice', () => {
      
      const firstInterval = { started: Date.now() - 10000, stopped: null, timeSpent: null }
      myState.tasks[0].log.push(JSON.parse(JSON.stringify(firstInterval)))
      expect(myState.tasks[0].log).to.deep.equal([firstInterval])
      
      startTask(myState, { id: 0 })
      
      expect(myState.tasks[0].log).to.deep.equal([firstInterval, {
        started: myState.tasks[0].log[1].started, stopped: null, timeSpent: null
      }])
      
    })
    
    it('should not add to invalid tasks', () => {
  
      startTask(myState, { id: -1 })
      expect(myState).to.deep.equal(origState)
      
    })
    
  })
  
  describe('stopTask', () => {
  
    it('should stop the task', () => {
      
      const firstInterval = { started: Date.now() - 10000, stopped: null }
      myState.tasks[0].log.push(firstInterval)
      
      stopTask(myState, { id: 0 })
      
      expect(myState.tasks[0].log[0].stopped).not.to.equal(null)
      
    })
    
    it('should ignore the second stop time if called twice', () => {
      
      const latestInterval = {
        started: Date.now() - 30000,
        stopped: Date.now() - 10000
      }
      myState.tasks[0].log.push(latestInterval)
      
      stopTask(myState, { id: 0 })
      
      expect(myState.tasks[0].log).to.deep.equal([latestInterval])
      
    })
    
    it('should not add to invalid tasks', () => {
      
      stopTask(myState, { id: -1 })
      expect(myState).to.deep.equal(origState)
      
    })
    
  })
  
  describe('addTaskTag', () => {
    
    it('should add and remove tags to/from multiple tasks correctly', () => {
      
      addTask(myState, { name: 'my second task' })
      addTask(myState, { name: 'my third task' })
      
      addTaskTag(myState, { id: 0, tag: 'new tag a' })
      expect(myState.tags).to.have.all.keys('new tag a')
      expect(myState.tags['new tag a'].color).to.match(/#\w{6}/)
      expect(myState.tasks[0].tags).to.deep.equal(['new tag a'])
      
      addTaskTag(myState, { id: 0, tag: 'new tag b' })
      expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
      expect(myState.tags['new tag b'].color).to.match(/#\w{6}/)
      expect(myState.tags['new tag b']).not.to.equal(myState.tags['new tag a'])
      expect(myState.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
      
      addTaskTag(myState, { id: 1, tag: 'new tag b' })
      expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
      expect(myState.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
      expect(myState.tasks[1].tags).to.deep.equal(['new tag b'])
      
      addTaskTag(myState, { id: 2, tag: 'new tag a' })
      expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
      expect(myState.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
      expect(myState.tasks[1].tags).to.deep.equal(['new tag b'])
      expect(myState.tasks[2].tags).to.deep.equal(['new tag a'])
      
      // expect duplicate key to fail
      addTaskTag(myState, { id: 2, tag: 'new tag a' })
      expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
      expect(myState.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
      expect(myState.tasks[1].tags).to.deep.equal(['new tag b'])
      expect(myState.tasks[2].tags).to.deep.equal(['new tag a'])
      
      removeTaskTag(myState, { id: 1, tag: 'new tag b' })
      expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
      expect(myState.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
      expect(myState.tasks[1].tags).to.deep.equal([])
      expect(myState.tasks[2].tags).to.deep.equal(['new tag a'])
  
      removeTaskTag(myState, { id: 0, tag: 'new tag a' })
      expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
      expect(myState.tasks[0].tags).to.deep.equal(['new tag b'])
      expect(myState.tasks[1].tags).to.deep.equal([])
      expect(myState.tasks[2].tags).to.deep.equal(['new tag a'])
  
      removeTaskTag(myState, { id: 2, tag: 'new tag a' })
      expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
      expect(myState.tasks[0].tags).to.deep.equal(['new tag b'])
      expect(myState.tasks[1].tags).to.deep.equal([])
      expect(myState.tasks[2].tags).to.deep.equal([])
  
      removeTaskTag(myState, { id: 0, tag: 'new tag b' })
      expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
      expect(myState.tasks[0].tags).to.deep.equal([])
      expect(myState.tasks[1].tags).to.deep.equal([])
      expect(myState.tasks[2].tags).to.deep.equal([])
      
    })
    
    it('should not add tags to nonexistent tasks', () => {
  
      addTaskTag(myState, { id: -1, tag: 'new tag' })
      expect(myState).to.deep.equal(origState)
      
    })
    
    it('should skip blank tags and trim ending and leading whitespace', () => {
      
      addTaskTag(myState, { id: 0, tag: '' })
      expect(myState).to.deep.equal(origState)
      
      addTaskTag(myState, { id: 0, tag: ' ' })
      expect(myState).to.deep.equal(origState)
  
      addTaskTag(myState, { id: 0, tag: ' a new tag ' })
      expect(myState.tags).to.have.all.keys('a new tag')
      expect(myState.tasks[0].tags).to.deep.equal(['a new tag'])
      
    })
    
    it('should add a task with selectedTag', () => {
      
      expect(myState.selectedTags).to.deep.equal([])
      selectTag(myState, { tag: 'new tag a' })
      expect(myState.selectedTags).to.deep.equal(['new tag a'])
      
      addTask(myState, { name: 'my tagged task' })
      const taggedTask = myState.tasks.filter(t => t.name === 'my tagged task')[0]
      expect(taggedTask.tags).to.deep.equal(['new tag a'])
      expect(myState.selectedTaskID).to.equal(taggedTask.id)
      
    })
    
  })
  
  describe('completeTask', () => {
    
    it('should mark the task as complete', () => {
      
      completeTask(myState, { id: 0 })
      expect(myState.tasks).to.deep.equal([
        {
          id: 0,
          name: 'my first task',
          tags: [],
          notes: '',
          created: createdTime,
          log: [],
          completed: myState.tasks[0].completed
        }
      ])
      
    })
    
  })
  
  describe('deleteTask', () => {
    
    it('should delete the task and any tag references to that task', () => {
      
      addTaskTag(myState, { id: 0, tag: 'new tag a' })
      expect(myState.tags).to.have.all.keys('new tag a')
      expect(myState.tasks[0].tags).to.deep.equal(['new tag a'])
      
      deleteTask(myState, { id: 0 })
      expect(myState.tasks).to.deep.equal([])
      expect(myState.tags).to.have.all.keys('new tag a')
      
    })
    
  })
  
})
