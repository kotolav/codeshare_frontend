export type KataRank = number | 'beta'

export interface Solution {
   id: number
   code: string
   language: string
   date: number
   comment?: string
}

export interface EditSolution extends Solution {
   isShowing: boolean
}

export type SolutionsList = Solution[]

export interface Kata {
   id: string
   rank: KataRank
   solutions: SolutionsList
   title: string
   description: string
   tags: string[]
}

export interface EditKata extends Kata {
   solutions: EditSolution[]
}

export type KataList = Kata[]
