export type KataRank = number | 'beta'

export interface Solution {
   id: number
   code: string
   language: string
   solvedAt: number
   comment?: string | null
}

export interface EditSolution extends Solution {
   isShowing: boolean
   isEditingComment?: boolean
}

export type SolutionsList = Solution[]

export interface Kata {
   id: string
   rank: KataRank
   solutions: SolutionsList
   name: string
   description: string
   tags: string[]
}

export interface EditKata extends Kata {
   solutions: EditSolution[]
}

export type KataList = Kata[]
