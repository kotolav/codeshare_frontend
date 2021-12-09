export type KataRank = number | 'beta'

export interface Solution {
   id: number
   code: string
   codeLength: number
   language: string
   solvedAt: number
   comment?: string | null
}

export interface Kata {
   id: string
   rank: KataRank
   solutions: Solution[]
   name: string
   description: string
   tags: string[]
}

export interface EditSolution extends Solution {
   isShowing: boolean
   isEditingComment?: boolean
}

export interface EditKata extends Kata {
   solutions: EditSolution[]
}

export interface Solver {
   nick: string
   about?: string
}

export interface Task {
   editToken: string
   publicToken: string
   status: 'added' | 'processing' | 'updating' | 'done' | 'fail'
   solver: Solver
   logs: { id: number; type: number; time: number }[]
}
