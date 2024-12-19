import { shallowMount, createLocalVue } from '@vue/test-utils'
import TagList from '@/components/TagList.vue'
import { FontAwesomeIcon } from '@/lib/font-awesome-icons'
import Vuex from 'vuex'
import ColorManager from 'color-manager'

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)
localVue.use(Vuex)

const myColorManager = new ColorManager()

const tagValues = ['tag-1', 'tag-2']
const state = {
  tags: {
    'tag-1': { tagName: 'first tag', color: myColorManager.getRandomColor() },
    'tag-2': { tagName: 'second tag', color: myColorManager.getRandomColor() }
  },
  tagOrder: tagValues
}

const getters = {
  availableTags: () => jest.fn()
}

const actions = {
  addTaskTagByName: jest.fn(),
  removeTaskTag: jest.fn()
}

const store = new Vuex.Store({
  state,
  getters,
  actions
})

const taskId = 'id-task'

describe('TagList', () => {
  
  const wrapper = shallowMount(TagList, {
    propsData: {
      tagList: tagValues,
      taskId,
      removeTag: () => null
    },
    localVue,
    store
  })
  
  it('allows the user to remove tags from the task', () => {
    
    const tags = wrapper.findAll('.tag')
    
    expect(tags.length).toBe(2)
    expect(tags.at(0).text()).toMatch('first tag')
    expect(tags.at(1).text()).toMatch('second tag')
    
    // const removeTagBtn = tags.at(0).findAll('button').at(1)
    // expect(removeTagBtn.text()).toEqual('×')
    
    // removeTagBtn.trigger('click')
    // expect(actions.removeTaskTag).toHaveBeenCalledWith({}, { id: task.id, tag: task.tags[0] })
    
  })
  
  it('renders an renders an input field for adding tags to the task', async () => {
    
    let addTagInput = wrapper.find('#addTagInput')
    const addTagButton = wrapper.find('#addTagButton')
    
    expect(wrapper.text()).toMatch('Tags:')
    expect(addTagInput.exists()).toBe(false)
    
    await addTagButton.trigger('click')
    addTagInput = wrapper.find('#addTagInput')
    expect(addTagInput.element).toBeVisible()
    expect(addTagInput.attributes('placeholder')).toBe('add new tag')
    
  })
  
  it('allows the user to add new tags to the task', async () => {
    
    expect(wrapper.findAll('.tag').length).toBe(2)
    
    const addTagInput = wrapper.find('#addTagInput')
    
    await addTagInput.setValue('some tag')
    expect(addTagInput.element.value).toBe('some tag')
    expect(wrapper.vm.inputTagName).toBe('some tag')
    
    await addTagInput.trigger('keyup.enter')
    expect(actions.addTaskTagByName).toHaveBeenCalledWith(expect.anything(), { taskId, tagName: 'some tag' })
    expect(addTagInput.element.value).toBe('')
    
  })
  
})
