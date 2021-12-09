import { mount } from '@vue/test-utils'
import TagsList from '~/components/Kata/TagsList.vue'

describe('KataTagList', () => {
   it('is Vue instance', () => {
      const wrapper = mount(TagsList)

      expect(wrapper.vm).toBeTruthy()
      expect(wrapper.findAll('ul.tags li').exists()).toBe(false)
   })

   it('should show tags', () => {
      const tags = ['functions', 'arrays', 'bugs']
      const wrapper = mount(TagsList, {
         propsData: { tags },
      })

      const liItems = wrapper.findAll('ul.tags li')

      expect(liItems.length).toEqual(3)
      for (let i = 0; i < tags.length; i++) {
         expect(liItems.at(i).text()).toEqual(tags[i])
      }
   })
})
