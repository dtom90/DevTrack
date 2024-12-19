// import { expect } from 'chai'
// import Vuex from 'vuex'
// // import { initialState, actions, mutations } from '@/store'
// import dexieDb from '@/store/dexieDb'
// import mutations from '../../src/store/mutations'
// import initialState from '../../src/store/initialState'
//
// window.confirm = function () { return true }
//
// describe('mutations', () => {
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
//   describe('stopTask', () => {
//
//     it('should stop the task', () => {
//
//       const firstInterval = { started: Date.now() - 10000, stopped: null }
//       myState.tasks[0].log.push(firstInterval)
//
//       mutations.stopTask(myState, { id: 0 })
//
//       expect(myState.tasks[0].log[0].stopped).not.to.equal(null)
//
//     })
//
//     it('should ignore the second stop time if called twice', () => {
//
//       const latestInterval = {
//         started: Date.now() - 30000,
//         stopped: Date.now() - 10000
//       }
//       myState.tasks[0].log.push(latestInterval)
//
//       mutations.stopTask(myState, { id: 0 })
//
//       expect(myState.tasks[0].log).to.deep.equal([latestInterval])
//
//     })
//
//     it('should not add to invalid tasks', () => {
//
//       mutations.stopTask(myState, { id: -1 })
//       expect(myState).to.deep.equal(origState)
//
//     })
//
//   })
//
//   describe('addTaskTag', () => {
//
//     it('should add and remove tags to/from multiple tasks correctly', async () => {
//
//       await actions.addTask({ state: myState, commit: store.commit }, { name: 'my second task' })
//       await actions.addTask({ state: myState, commit: store.commit }, { name: 'my third task' })
//
//       mutations.addTaskTag(myState, { id: 0, tag: 'new tag a' })
//       expect(myState.tags).to.have.all.keys('new tag a')
//       expect(myState.tags['new tag a'].color).to.match(/#\w{6}/)
//       expect(myState.tasks[0].tags).to.deep.equal(['new tag a'])
//
//       mutations.addTaskTag(myState, { id: 0, tag: 'new tag b' })
//       expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
//       expect(myState.tags['new tag b'].color).to.match(/#\w{6}/)
//       expect(myState.tags['new tag b']).not.to.equal(myState.tags['new tag a'])
//       expect(myState.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
//
//       mutations.addTaskTag(myState, { id: 1, tag: 'new tag b' })
//       expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
//       expect(myState.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
//       expect(myState.tasks[1].tags).to.deep.equal(['new tag b'])
//
//       mutations.addTaskTag(myState, { id: 2, tag: 'new tag a' })
//       expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
//       expect(myState.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
//       expect(myState.tasks[1].tags).to.deep.equal(['new tag b'])
//       expect(myState.tasks[2].tags).to.deep.equal(['new tag a'])
//
//       // expect duplicate key to fail
//       mutations.addTaskTag(myState, { id: 2, tag: 'new tag a' })
//       expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
//       expect(myState.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
//       expect(myState.tasks[1].tags).to.deep.equal(['new tag b'])
//       expect(myState.tasks[2].tags).to.deep.equal(['new tag a'])
//
//       mutations.removeTaskTag(myState, { id: 1, tag: 'new tag b' })
//       expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
//       expect(myState.tasks[0].tags).to.deep.equal(['new tag a', 'new tag b'])
//       expect(myState.tasks[1].tags).to.deep.equal([])
//       expect(myState.tasks[2].tags).to.deep.equal(['new tag a'])
//
//       mutations.removeTaskTag(myState, { id: 0, tag: 'new tag a' })
//       expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
//       expect(myState.tasks[0].tags).to.deep.equal(['new tag b'])
//       expect(myState.tasks[1].tags).to.deep.equal([])
//       expect(myState.tasks[2].tags).to.deep.equal(['new tag a'])
//
//       mutations.removeTaskTag(myState, { id: 2, tag: 'new tag a' })
//       expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
//       expect(myState.tasks[0].tags).to.deep.equal(['new tag b'])
//       expect(myState.tasks[1].tags).to.deep.equal([])
//       expect(myState.tasks[2].tags).to.deep.equal([])
//
//       mutations.removeTaskTag(myState, { id: 0, tag: 'new tag b' })
//       expect(myState.tags).to.have.all.keys('new tag a', 'new tag b')
//       expect(myState.tasks[0].tags).to.deep.equal([])
//       expect(myState.tasks[1].tags).to.deep.equal([])
//       expect(myState.tasks[2].tags).to.deep.equal([])
//
//     })
//
//     it('should not add tags to nonexistent tasks', () => {
//
//       mutations.addTaskTag(myState, { id: -1, tag: 'new tag' })
//       expect(myState).to.deep.equal(origState)
//
//     })
//
//     it('should skip blank tags and trim ending and leading whitespace', () => {
//
//       mutations.addTaskTag(myState, { id: 0, tag: '' })
//       expect(myState).to.deep.equal(origState)
//
//       mutations.addTaskTag(myState, { id: 0, tag: ' ' })
//       expect(myState).to.deep.equal(origState)
//
//       mutations.addTaskTag(myState, { id: 0, tag: ' a new tag ' })
//       expect(myState.tags).to.have.all.keys('a new tag')
//       expect(myState.tasks[0].tags).to.deep.equal(['a new tag'])
//
//     })
//
//     it('should add a task with selectedTag', async () => {
//
//       expect(myState.selectedTagIds).to.deep.equal([])
//       mutations.selectTag(myState, { tag: 'new tag a' })
//       expect(myState.selectedTagIds).to.deep.equal(['new tag a'])
//
//       await actions.addTask({ state: myState, commit: store.commit }, { name: 'my tagged task' })
//       const taggedTask = myState.tasks.filter(t => t.name === 'my tagged task')[0]
//       expect(taggedTask.tags).to.deep.equal(['new tag a'])
//       expect(myState.selectedTaskID).to.equal(taggedTask.id)
//
//     })
//
//   })
//
//   describe('completeTask', () => {
//
//     it('should mark the task as complete', () => {
//
//       mutations.completeTask(myState, { id: 0 })
//       expect(myState.tasks).to.deep.equal([
//         {
//           id: 0,
//           name: 'my first task',
//           tags: [],
//           notes: '',
//           created_at: createdTime,
//           log: [],
//           completed: myState.tasks[0].completed,
//           archived: null
//         }
//       ])
//
//     })
//
//   })
//
//   describe('deleteTask', () => {
//
//     it('should delete the task and any tag references to that task', () => {
//
//       mutations.addTaskTag(myState, { id: 0, tag: 'new tag a' })
//       expect(myState.tags).to.have.all.keys('new tag a')
//       expect(myState.tasks[0].tags).to.deep.equal(['new tag a'])
//
//       mutations.deleteTask(myState, { id: 0 })
//       expect(myState.tasks).to.deep.equal([])
//       expect(myState.tags).to.have.all.keys('new tag a')
//
//     })
//
//   })
//
// })
