import axios from 'axios'
import { EditKata, EditSolution } from '~/types/types'

axios.defaults.baseURL = 'http://codeshare.local/api'

export const getAllKatas = (token: string) => {
   return axios
      .get(`/${token}/katas`)
      .then((response) => response.data.data)
      .catch((error) => error)
}

export const setSolutionVisibility = (
   token: string,
   kataId: EditKata['id'],
   solutionId: EditSolution['id'],
   isShowing: EditSolution['isShowing']
) => {
   return axios
      .patch(`/${token}/katas/${kataId}/solution/${solutionId}/visibility`, {
         isShowing,
      })
      .then((response) => response.data)
      .catch((error) => error)
}

export const hideKata = (token: string, kataId: EditKata['id']) => {
   return axios
      .patch(`/${token}/katas/${kataId}/hide`)
      .then((response) => response.data)
      .catch((error) => error)
}

export const setSolutionComment = (
   token: string,
   kataId: EditKata['id'],
   solutionId: EditSolution['id'],
   comment: string
) => {
   return axios
      .patch(`/${token}/katas/${kataId}/solution/${solutionId}/comment`, {
         comment,
      })
      .then((response) => response.data)
      .catch((error) => error)
}

export const deleteSolutionComment = (
   token: string,
   kataId: EditKata['id'],
   solutionId: EditSolution['id']
) => {
   return axios
      .delete(`/${token}/katas/${kataId}/solution/${solutionId}/comment`)
      .then((response) => response.data)
      .catch((error) => error)
}
