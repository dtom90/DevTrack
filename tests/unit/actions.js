// // import { expect } from 'chai'
// import Vuex from 'vuex'
// import { initialState, actions, mutations } from '@/store'
// import dexieDb from '@/store/dexieDb'
//
// window.confirm = function () { return true }
//
// describe('actions', () => {
//
//   let myState
//   let createdTime
//   let origState
//   let store
//
//   beforeAll(() => {
//     dexieDb.version(1).stores({
//       tasks: 'id, name, notes, completed, archived, created_at',
//       tags: 'taskId, name, color',
//       logs: 'taskId, started, stopped, timeSpent',
//       settings: 'key'
//     })
//   })
//
//   afterAll(() => {
//     dexieDb.delete()
//   })
//
//   beforeEach(async () => {
//
//     myState = JSON.parse(JSON.stringify(initialState))
//     store = new Vuex.Store({
//       state: myState,
//       mutations
//     })
//     await actions.addTask({ state: myState, commit: store.commit }, { name: 'my first task' })
//     createdTime = myState.tasks[0].created_at
//     origState = JSON.parse(JSON.stringify(myState))
//
//   })
//
//   afterEach(async () => {
//     await dexieDb.settings.clear()
//     await dexieDb.tasks.clear()
//     await dexieDb.logs.clear()
//   })
//
//   describe('addTask', () => {
//
//     it('should add a task to the state', () => {
//
//       expect(myState.tasks).toEqual([
//         {
//           id: 0,
//           name: 'my first task',
//           tags: [],
//           notes: '',
//           created_at: createdTime,
//           log: [],
//           completed: null,
//           archived: null
//         }
//       ])
//       expect(myState.selectedTaskID).toEqual(0)
//
//     })
//
//     it('should not add a blank task to the state', async () => {
//
//       await actions.addTask({ state: myState, commit: store.commit }, { name: '' })
//       expect(myState).toEqual(origState)
//
//       await actions.addTask({ state: myState, commit: store.commit }, { name: ' ' })
//       expect(myState).toEqual(origState)
//
//     })
//
//     it('should add a unique task ID', async () => {
//
//       await actions.addTask({ state: myState, commit: store.commit }, { name: 'my second task' })
//       await actions.addTask({ state: myState, commit: store.commit }, { name: 'my third task' })
//
//       expect(myState.tasks).toEqual([
//         {
//           id: 0,
//           name: 'my first task',
//           tags: [],
//           notes: '',
//           created_at: createdTime,
//           log: [],
//           completed: null,
//           archived: null
//         },
//         {
//           id: 1,
//           name: 'my second task',
//           tags: [],
//           notes: '',
//           created_at: myState.tasks[1].created_at,
//           log: [],
//           completed: null,
//           archived: null
//         },
//         {
//           id: 2,
//           name: 'my third task',
//           tags: [],
//           notes: '',
//           created_at: myState.tasks[2].created_at,
//           log: [],
//           completed: null,
//           archived: null
//         }
//       ])
//
//       mutations.deleteTask(myState, { id: 1 })
//       await actions.addTask({ state: myState, commit: store.commit }, { name: 'my fourth task' })
//
//       expect(myState.tasks).toEqual([
//         {
//           id: 0,
//           name: 'my first task',
//           tags: [],
//           notes: '',
//           created_at: createdTime,
//           log: [],
//           completed: null,
//           archived: null
//         },
//         {
//           id: 2,
//           name: 'my third task',
//           tags: [],
//           notes: '',
//           created_at: myState.tasks[1].created_at,
//           log: [],
//           completed: null,
//           archived: null
//         },
//         {
//           id: 3,
//           name: 'my fourth task',
//           tags: [],
//           notes: '',
//           created_at: myState.tasks[2].created_at,
//           log: [],
//           completed: null,
//           archived: null
//         }
//       ])
//
//     })
//
//   })
//
//   describe('startTask', () => {
//
//     it('should start and stop the task', async () => {
//
//       await actions.startTask({ state: myState, commit: store.commit }, { taskId: 0 })
//       expect(myState.tasks[0].log).toEqual([expect.objectContaining({
//         taskId: 0,
//         stopped: null,
//         timeSpent: null
//       })])
//
//       mutations.stopTask(myState, { id: 0 })
//       expect(myState.tasks[0].log[0].stopped).not.toEqual(null)
//
//     })
//
//     it('should not overwrite the latest start time if called twice', async () => {
//
//       const firstInterval = { taskId: 0, started: Date.now() - 10000, stopped: null, timeSpent: null }
//       myState.tasks[0].log.push(JSON.parse(JSON.stringify(firstInterval)))
//       expect(myState.tasks[0].log).toEqual([firstInterval])
//
//       await actions.startTask({ state: myState, commit: store.commit }, { taskId: 0 })
//
//       expect(myState.tasks[0].log).toEqual([firstInterval, {
//         taskId: 0, started: myState.tasks[0].log[1].started, stopped: null, timeSpent: null
//       }])
//
//     })
//
//     it('should not add to invalid tasks', async () => {
//
//       await actions.startTask({ state: myState, commit: store.commit }, { taskId: -1 })
//       expect(myState).toEqual(origState)
//
//     })
//
//   })
//
//   // describe('stopTask', async () => {
//   //
//   //   it('should stop the task', () => {
//   //
//   //     const firstInterval = { started: Date.now() - 10000, stopped: null }
//   //     myState.tasks[0].log.push(firstInterval)
//   //
//   //     stopTask(myState, { id: 0 })
//   //
//   //     expect(myState.tasks[0].log[0].stopped).not.to.equal(null)
//   //
//   //   })
//   //
//   //   it('should ignore the second stop time if called twice', () => {
//   //
//   //     const latestInterval = {
//   //       started: Date.now() - 30000,
//   //       stopped: Date.now() - 10000
//   //     }
//   //     myState.tasks[0].log.push(latestInterval)
//   //
//   //     stopTask(myState, { id: 0 })
//   //
//   //     expect(myState.tasks[0].log).toEqual([latestInterval])
//   //
//   //   })
//   //
//   //   it('should not add to invalid tasks', () => {
//   //
//   //     stopTask(myState, { id: -1 })
//   //     expect(myState).toEqual(origState)
//   //
//   //   })
//   //
//   // })
//   //
//   // describe('addTaskTag', () => {
//   //
//   //   it('should add and remove tags to/from multiple tasks correctly', () => {
//   //
//   //     addTask(myState, { name: 'my second task' })
//   //     addTask(myState, { name: 'my third task' })
//   //
//   //     addTaskTag(myState, { id: 0, tag: 'new tag a' })
//   //     expect(myState.tags).to.have.all.keys('new tag a')
//   //     expect(myState.tags['new tag a'].color).to.match(/#\w{6}/)
//   //     expect(myState.tasks[0].tags).toEqual(['new tag a'])
//   //
//   //     addTaskTag(myState, { id: 0, tag: 'new tag b' })
//   //     expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
//   //     expect(myState.tags['new tag b'].color).to.match(/#\w{6}/)
//   //     expect(myState.tags['new tag b']).not.to.equal(myState.tags['new tag a'])
//   //     expect(myState.tasks[0].tags).toEqual(['new tag a', 'new tag b'])
//   //
//   //     addTaskTag(myState, { id: 1, tag: 'new tag b' })
//   //     expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
//   //     expect(myState.tasks[0].tags).toEqual(['new tag a', 'new tag b'])
//   //     expect(myState.tasks[1].tags).toEqual(['new tag b'])
//   //
//   //     addTaskTag(myState, { id: 2, tag: 'new tag a' })
//   //     expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
//   //     expect(myState.tasks[0].tags).toEqual(['new tag a', 'new tag b'])
//   //     expect(myState.tasks[1].tags).toEqual(['new tag b'])
//   //     expect(myState.tasks[2].tags).toEqual(['new tag a'])
//   //
//   //     // expect duplicate key to fail
//   //     addTaskTag(myState, { id: 2, tag: 'new tag a' })
//   //     expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
//   //     expect(myState.tasks[0].tags).toEqual(['new tag a', 'new tag b'])
//   //     expect(myState.tasks[1].tags).toEqual(['new tag b'])
//   //     expect(myState.tasks[2].tags).toEqual(['new tag a'])
//   //
//   //     removeTaskTag(myState, { id: 1, tag: 'new tag b' })
//   //     expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
//   //     expect(myState.tasks[0].tags).toEqual(['new tag a', 'new tag b'])
//   //     expect(myState.tasks[1].tags).toEqual([])
//   //     expect(myState.tasks[2].tags).toEqual(['new tag a'])
//   //
//   //     removeTaskTag(myState, { id: 0, tag: 'new tag a' })
//   //     expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
//   //     expect(myState.tasks[0].tags).toEqual(['new tag b'])
//   //     expect(myState.tasks[1].tags).toEqual([])
//   //     expect(myState.tasks[2].tags).toEqual(['new tag a'])
//   //
//   //     removeTaskTag(myState, { id: 2, tag: 'new tag a' })
//   //     expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
//   //     expect(myState.tasks[0].tags).toEqual(['new tag b'])
//   //     expect(myState.tasks[1].tags).toEqual([])
//   //     expect(myState.tasks[2].tags).toEqual([])
//   //
//   //     removeTaskTag(myState, { id: 0, tag: 'new tag b' })
//   //     expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
//   //     expect(myState.tasks[0].tags).toEqual([])
//   //     expect(myState.tasks[1].tags).toEqual([])
//   //     expect(myState.tasks[2].tags).toEqual([])
//   //
//   //   })
//   //
//   //   it('should not add tags to nonexistent tasks', () => {
//   //
//   //     addTaskTag(myState, { id: -1, tag: 'new tag' })
//   //     expect(myState).toEqual(origState)
//   //
//   //   })
//   //
//   //   it('should skip blank tags and trim ending and leading whitespace', () => {
//   //
//   //     addTaskTag(myState, { id: 0, tag: '' })
//   //     expect(myState).toEqual(origState)
//   //
//   //     addTaskTag(myState, { id: 0, tag: ' ' })
//   //     expect(myState).toEqual(origState)
//   //
//   //     addTaskTag(myState, { id: 0, tag: ' a new tag ' })
//   //     expect(myState.tags).to.have.all.keys('a new tag')
//   //     expect(myState.tasks[0].tags).toEqual(['a new tag'])
//   //
//   //   })
//   //
//   //   it('should add a task with selectedTag', () => {
//   //
//   //     expect(myState.selectedTagIds).toEqual([])
//   //     selectTag(myState, { tag: 'new tag a' })
//   //     expect(myState.selectedTagIds).toEqual(['new tag a'])
//   //
//   //     addTask(myState, { name: 'my tagged task' })
//   //     const taggedTask = myState.tasks.filter(t => t.name === 'my tagged task')[0]
//   //     expect(taggedTask.tags).toEqual(['new tag a'])
//   //     expect(myState.selectedTaskID).to.equal(taggedTask.id)
//   //
//   //   })
//   //
//   // })
//   //
//   // describe('completeTask', () => {
//   //
//   //   it('should mark the task as complete', () => {
//   //
//   //     completeTask(myState, { id: 0 })
//   //     expect(myState.tasks).toEqual([
//   //       {
//   //         id: 0,
//   //         name: 'my first task',
//   //         tags: [],
//   //         notes: '',
//   //         created_at: createdTime,
//   //         log: [],
//   //         completed: myState.tasks[0].completed
//   //       }
//   //     ])
//   //
//   //   })
//   //
//   // })
//   //
//   // describe('deleteTask', () => {
//   //
//   //   it('should delete the task and any tag references to that task', () => {
//   //
//   //     addTaskTag(myState, { id: 0, tag: 'new tag a' })
//   //     expect(myState.tags).to.have.all.keys('new tag a')
//   //     expect(myState.tasks[0].tags).toEqual(['new tag a'])
//   //
//   //     deleteTask(myState, { id: 0 })
//   //     expect(myState.tasks).toEqual([])
//   //     expect(myState.tags).to.have.all.keys('new tag a')
//   //
//   //   })
//   //
//   // })
//
// })
