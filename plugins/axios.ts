import axios from 'axios'
import { Context } from '@nuxt/types'

export default ({ req }: Context) => {
   axios.defaults.baseURL = process.env.apiServer

   axios.interceptors.request.use((request) => {
      if (process.server) {
         let ip = req.socket.remoteAddress
         if (req.headers['x-forwarded-for']) {
            if (Array.isArray(req.headers['x-forwarded-for'])) {
               ip = req.headers['x-forwarded-for'][0]
            } else {
               ip = req.headers['x-forwarded-for']
            }
            ip = ip?.split(',').pop()
         }
         request.headers.common['X-Forwarded-For'] = ip
      }
      return request
   })
}
