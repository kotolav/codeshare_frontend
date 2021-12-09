import { mount } from '@vue/test-utils'
import KataRank from '@/components/Kata/Rank.vue'

describe('KataRank', () => {
   it('is a Vue instance', () => {
      const rank = 5
      const wrapper = mount(KataRank, { propsData: { rank } })
      expect(wrapper.vm).toBeTruthy()
      expect(wrapper.find('span').text()).toBe('5 kyu')
      expect(wrapper.find('span').classes('rank--5')).toBe(true)
   })

   it('should be beta on beta rank', () => {
      const wrapper = mount(KataRank, { propsData: { rank: 'beta' } })
      expect(wrapper.find('span').text()).toBe('beta')
      expect(wrapper.find('span').classes('rank--beta')).toBe(true)
   })
})
