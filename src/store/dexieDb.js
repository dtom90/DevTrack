import Dexie from 'dexie'
// import {Task} from "../types/Task";

const dexieDb = new Dexie('DevTrackDatabase')
dexieDb.version(1).stores({
  tasks: 'id, name, notes, order, created_at, completed, archived',
  tags: 'id, &tagName, color, order',
  taskTagMap: 'id, taskId, tagId',
  logs: 'id, taskId, started, stopped, timeSpent',
  settings: 'key'
})

// // Add hooks
// dexieDb.tasks.hook('creating', function (primaryKey: string, obj: Task) {
//   obj.created_at = new Date()//.toISOString()
// })

export default dexieDb
