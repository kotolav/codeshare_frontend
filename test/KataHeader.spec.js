import { mount } from '@vue/test-utils'
import Header from '~/components/Kata/Header.vue'

describe('KataHeader', () => {
   it('should render correct', () => {
      const testKataName = 'Test kata name'
      const wrapper = mount(Header, {
         stubs: { KataRank: true, KataTagsList: true },
         propsData: { name: testKataName, rank: 8, tags: [] },
      })

      expect(wrapper.vm).toBeTruthy()
      expect(wrapper.find('h4').text()).toBe(testKataName)
   })
})
