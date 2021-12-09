import axios from 'axios'

export const getData = (token: string) => {
   return axios
      .get(`/public/${token}`)
      .then((response) => response.data.data)
      .catch((error) => error)
}
