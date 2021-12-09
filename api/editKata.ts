import axios from 'axios'
import { EditKata, EditSolution } from '~/types/types'

export const getAllKatas = (token: string) => {
   return axios
      .get(`/edit/${token}/katas`)
      .then((response) => response.data.data)
}

export const setSolutionVisibility = (
   token: string,
   kataId: EditKata['id'],
   solutionId: EditSolution['id'],
   isShowing: EditSolution['isShowing']
) => {
   return axios
      .patch(
         `/edit/${token}/katas/${kataId}/solution/${solutionId}/visibility`,
         {
            isShowing,
         }
      )
      .then((response) => response.data)
}

export const hideKata = (token: string, kataId: EditKata['id']) => {
   return axios
      .patch(`/edit/${token}/katas/${kataId}/hide`)
      .then((response) => response.data)
}

export const setSolutionComment = (
   token: string,
   kataId: EditKata['id'],
   solutionId: EditSolution['id'],
   comment: string
) => {
   return axios
      .patch(`/edit/${token}/katas/${kataId}/solution/${solutionId}/comment`, {
         comment,
      })
      .then((response) => response.data)
}

export const deleteSolutionComment = (
   token: string,
   kataId: EditKata['id'],
   solutionId: EditSolution['id']
) => {
   return axios
      .delete(`/edit/${token}/katas/${kataId}/solution/${solutionId}/comment`)
      .then((response) => response.data)
}
