import Vue from 'vue'
import dayjs from 'dayjs'

Vue.filter('dateDiffHuman', (dateTimeUnix: number) => {
   return dayjs.unix(dateTimeUnix).fromNow()
})
