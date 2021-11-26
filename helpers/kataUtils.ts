import { EditKata, EditSolution } from '~/types/types.js'

export interface FindKata {
   kataId: EditKata['id']
}

export interface FindSolution extends FindKata {
   solutionId: EditSolution['id']
}

type getKata = (katas: EditKata[], kata: FindKata) => EditKata | undefined
type getSolution = (
   katas: EditKata[],
   solution: FindSolution
) => EditSolution | undefined

export const getKataById: getKata = (katas, credentials) => {
   return katas.find((kata) => kata.id === credentials.kataId)
}

export const getSolutionById: getSolution = (katas, credentials) => {
   const kata = getKataById(katas, credentials)

   if (kata !== undefined) {
      return kata.solutions.find(
         (solution) => solution.id === credentials.solutionId
      )
   }
   return undefined
}
