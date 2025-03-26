import { NsContent } from '@sunbird-cb/collection/src/public-api'

export namespace NSQuiz {
  export interface IQuiz {
    timeLimit: number
    questions: IQuestion[]
    isAssessment: boolean
    maxQuestions: number
    requiresSubmit: 'Yes' | 'No'
    showTimer: 'Yes' | 'No'
    allowSkip: 'Yes' | 'No'
    primaryCategory: NsContent.EPrimaryCategory
  }

  export interface IQuestion {
    multiSelection: boolean
    section: string
    instructions: string | null
    question: string
    questionId: string
    options: IOption[]
    editorState?: any[]
    questionLevel: string
    questionType?: TQuizQuestionType
    rhsChoices?: any[],
    marks: number,
    choices?: IChoiceOptions[]
  }

  export interface IOption {
    optionId: string
    text: string
    isCorrect?: boolean | undefined
    hint?: string
    match?: string
    matchForView?: string
    response?: any
    userSelected?: boolean
  }

  export interface IQuizConfig {
    enableHint: boolean
    maxAttempts: number
  }

  export type TQuizQuestionType = 'mcq-sca' | 'mcq-mca' | 'fitb' | 'mtf'
  export type TUserSelectionType = 'start' | 'skip'
  export type TQuizSubmissionState = 'unanswered' | 'marked' | 'answered'
  export type TQuizViewMode = 'initial' | 'attempt' | 'review' | 'answer'

  export interface IQuizSubmitRequest {
    identifier: string
    isAssessment: boolean
    questions: IQuestion[]
    timeLimit: number
    title: string
  }

  export interface IQuizSubmitResponse {
    blank: number
    correct: number
    inCorrect: number
    passPercent: number
    result: number
    total: number
  }

  export interface IChoiceOptions {
    options?: any[]
  }
}
