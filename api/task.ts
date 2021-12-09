import axios from 'axios'

export interface CreateTaskData {
   cookies?: string
   login?: string
   password?: string
}

export interface ReparseTaskData extends CreateTaskData {
   shiftStatuses?: boolean
}

export const createTask = (data: CreateTaskData) => {
   return axios
      .post(`/edit/create-task`, data)
      .then((response) => response.data)
      .catch((error) => error)
}

export const reparseTask = (token: string, data: ReparseTaskData) => {
   return axios
      .post(`/edit/${token}/update`, data)
      .then((response) => response.data.data)
      .catch((error) => error)
}

export const generatePublicToken = (token: string) => {
   return axios
      .post(`/edit/${token}/public-token/generate`)
      .then((response) => response.data.data)
      .catch((error) => error)
}

export const getTaskStatus = (token: string) => {
   return axios
      .get(`/edit/${token}/status`)
      .then((response) => response.data.data)
   // .catch((error) => error)
}

export const setSolverAbout = (token: string, about: string) => {
   return axios
      .patch(`/edit/${token}/solver`, { about })
      .then((response) => response.data.data)
      .catch((error) => error)
}
