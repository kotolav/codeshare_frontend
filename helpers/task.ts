import { computed, ref, ssrRef } from '@nuxtjs/composition-api'
import { Task } from '~/types/types'
import * as api from '~/api/task'
import { CreateTaskData } from '~/api/task'

const task = ssrRef<Task>({
   solver: { nick: '', about: '' },
   editToken: '',
   publicToken: '',
   logs: [],
   status: 'fail',
})

export function useTask(editToken: string) {
   const taskUpdating = ref({
      creating: false,
      parsing: false,
      status: false,
      solver: false,
      generating: false,
   })

   let intervalId: NodeJS.Timer

   async function createTask(data: CreateTaskData) {
      taskUpdating.value.creating = true
      const response = await api.createTask(data)
      taskUpdating.value.creating = false

      return response
   }

   function changeToken(newEditToken: string) {
      editToken = newEditToken
   }

   async function waitTaskProcessed() {
      return await new Promise((resolve) => {
         intervalId = setInterval(async () => {
            const response = await getStatus()
            if (['done', 'fail'].includes(response?.status)) {
               clearInterval(intervalId)
               resolve(true)
            }
         }, 5000)
      })
   }

   function clearTimers() {
      clearInterval(intervalId)
   }

   async function reparseTask(data: CreateTaskData) {
      taskUpdating.value.parsing = true
      const response = await api.reparseTask(editToken, data)
      await waitTaskProcessed()
      taskUpdating.value.parsing = false
   }

   async function getStatus() {
      taskUpdating.value.status = true
      let response
      try {
         response = await api.getTaskStatus(editToken)
         task.value = response
      } catch (error) {
         return error
      } finally {
         taskUpdating.value.status = false
      }

      return response
   }

   async function setSolverAbout(text: string) {
      if (task.value?.solver) {
         task.value.solver.about = text
      }
      taskUpdating.value.solver = true
      const response = await api.setSolverAbout(editToken, text)
      taskUpdating.value.solver = false
   }
   async function recreatePublicToken() {
      taskUpdating.value.generating = true
      const response = await api.generatePublicToken(editToken)
      taskUpdating.value.generating = false
   }
   async function generateOfflineCopy() {}

   return {
      task,
      taskUpdating,
      createTask,
      changeToken,
      reparseTask,
      clearTimers,
      waitTaskProcessed,
      getStatus,
      setSolverAbout,
      recreatePublicToken,
      generateOfflineCopy,
   }
}
