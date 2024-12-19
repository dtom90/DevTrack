import { shallowMount, createLocalVue } from '@vue/test-utils'
import TaskList from '@/components/TaskList.vue'
import Task from '@/components/Task.vue'
import { FontAwesomeIcon } from '@/lib/font-awesome-icons'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)
localVue.use(Vuex)

const tasks = [
  { id: '1', name: 'new task 1' },
  { id: '2', name: 'new task 2' },
  { id: '3', name: 'new task 3' }
]

const state = {
  tags: {},
  selectedTagIds: []
}

const getters = {
  incompleteTasks: () => tasks,
  completedTasks: () => tasks,
  unselectedTags: () => []
}

const actions = {
  addTask: jest.fn(),
  archiveTasks: jest.fn()
}

const mutations = {
  deleteTasks: jest.fn()
}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})

const titles = [
  ['To Do', []],
  ['Done', ['Recent', 'Oldest']]
]

describe('TaskList', () => {
  
  describe.each(titles)('%s', (title, expectedSortingOptions) => {
    
    const wrapper = shallowMount(TaskList, {
      propsData: { title },
      localVue,
      store
    })
    
    it(`should have the title "${title}"`, () => {
      
      expect(wrapper.props().title).toBe(title)
      expect(wrapper.find('h3').text()).toBe(title)
      
    })
    
    it('should have the correct soring options', () => {
      
      const sortingOptions = wrapper.findAll('option')
      expect(sortingOptions.length).toBe(expectedSortingOptions.length)
      sortingOptions.wrappers.forEach((sortingOption, i) => {
        expect(sortingOption.text()).toBe(expectedSortingOptions[i])
      })
      
    })
    
    it(`should default sorting to ${expectedSortingOptions[0]}-first order`, () => {
      
      if (expectedSortingOptions.length > 0) {
        const sortOrder = expectedSortingOptions[0]
        
        expect(wrapper.vm.sortOrder).toBe(sortOrder)
        
        const renderedTasks = wrapper.findAllComponents(Task)
        expect(renderedTasks.length).toBe(tasks.length)
        renderedTasks.wrappers.forEach((renderedTask, i) => {
          const index = sortOrder === 'Oldest' ? i : tasks.length - 1 - i
          expect(renderedTask.props().task.name).toMatch(tasks[index].name)
        })
      }
      
    })
    
    it(`should sort in ${expectedSortingOptions[1]}-first order`, async () => {
      
      if (expectedSortingOptions.length > 1) {
        const sortOrder = expectedSortingOptions[1]
        
        await wrapper.setData({
          sortOrder: sortOrder
        })
        expect(wrapper.vm.sortOrder).toBe(sortOrder)
        
        const renderedTasks = wrapper.findAllComponents(Task)
        expect(renderedTasks.length).toBe(tasks.length)
        renderedTasks.wrappers.forEach((renderedTask, i) => {
          const index = sortOrder === 'Oldest' ? i : tasks.length - 1 - i
          expect(renderedTask.props().task.name).toMatch(tasks[index].name)
        })
      }
      
    })
    
    it('should add a new task when entered', async () => {
      
      if (title === 'To Do') {
        const taskInput = wrapper.find('input[placeholder="enter new task"]')
        await taskInput.trigger('click')
        taskInput.setValue('new task 4')
        await taskInput.trigger('keyup.enter')
        
        expect(actions.addTask).toHaveBeenCalledWith(expect.anything(), { name: 'new task 4' })
        expect(taskInput.element.value).toBe('')
      }
      
    })
    
    it('should archive all tasks when the archive button is clicked', () => {
      
      if (title === 'Done') {
        const archiveAllBtn = wrapper.find('button[title="Archive all list tasks"]')
        archiveAllBtn.trigger('click')
        expect(actions.archiveTasks).toHaveBeenCalled()
      }
      
    })
    
    it('should delete all tasks when the button is clicked', () => {
      
      if (title === 'Done') {
        const deleteAllBtn = wrapper.find('button[title="Delete all list tasks"]')
        expect(deleteAllBtn.text()).toEqual('Delete All')
        deleteAllBtn.trigger('click')
        expect(mutations.deleteTasks).toHaveBeenCalled()
      }
      
    })
    
  })
  
})
