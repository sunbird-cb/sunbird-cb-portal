export namespace NSPractice {
  export interface IQuiz {
    timeLimit: number
    questions: IQuestion[]
    isAssessment: boolean
  }

  export interface IQuestion {
    multiSelection: boolean
    section: string
    question: string
    questionId: string
    options: IOption[]
    questionType?: TQuizQuestionType
  }

  export interface IOption {
    optionId: string
    text: string
    isCorrect: boolean
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

  export type TQuizQuestionType = 'mcq-sca' | 'mcq-mca' | 'fitb' | 'mtf' | string // need to remove string from next ittration
  export type TUserSelectionType = 'start' | 'skip'
  export type TQuizSubmissionState = 'unanswered' | 'marked' | 'answered'
  export type TQuizViewMode = 'initial' | 'detail' | 'attempt' | 'review' | 'answer'

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

  export interface IQPaper {
    questionSet: {
      lastStatusChangedOn: string
      children: IPaperSection[]
      name: string
      navigationMode: string
      createdOn: string
      pdfUrl: string
      generateDIALCodes: 'No' | 'Yes'
      lastUpdatedOn: string
      showTimer: 'No' | 'Yes'
      identifier: string
      containsUserData: 'No' | 'Yes'
      allowSkip: 'Yes' | 'No'
      compatibilityLevel: number
      trackable: string
      primaryCategory: string
      setType: string
      downloadUrl: string
      versionKey: string
      mimeType: string
      code: string
      license: string
      version: number
      prevStatus: string
      showHints: string
      language: string[]
      showFeedback: 'No' | 'Yes'
      lastPublishedOn: string
      objectType: string
      status: string
      requiresSubmit: 'No' | 'Yes'
      shuffle: true
      contentEncoding: string
      depth: number
      consumerId: string
      allowAnonymousAccess: 'Yes' | 'NO'
      contentDisposition: string
      previewUrl: string
      childNodes: string[]
      visibility: string
      showSolutions: 'No' | 'Yes'
      variants: object
      pkgVersion: number
    }
  }
  export interface IPaperSection {
    lastStatusChangedOn: string
    parent: string
    children: IQuestionV2[]
    name: string
    navigationMode: string
    createdOn: string
    generateDIALCodes: string
    lastUpdatedOn: string
    showTimer: 'No' | 'YES'
    identifier: string
    description: string
    containsUserData: string
    allowSkip: string
    compatibilityLevel: number
    trackable: {
      enabled: 'No' | 'Yes'
      autoBatch: 'No' | 'Yes'
    }
    primaryCategory: string
    setType: string
    languageCode: string[]
    attributions: []
    versionKey: string
    mimeType: string
    code: string
    license: string
    version: number
    showHints: 'No' | 'Yes'
    language: string[]
    showFeedback: 'Yes' | 'No'
    objectType: 'QuestionSet'
    status: string
    requiresSubmit: 'No' | 'Yes'
    shuffle: true
    contentEncoding: string
    depth: number
    allowAnonymousAccess: string
    contentDisposition: string
    visibility: string
    showSolutions: 'Yes' | 'No'
    index: number
  }
  export interface IQuestionV2 {
    lastStatusChangedOn: string
    answer: any
    parent: string
    name: string
    bloomsLevel: string
    createdOn: string
    lastUpdatedOn: string
    showTimer: string
    identifier: string
    compatibilityLevel: number
    audience: string[]
    primaryCategory: string
    se_mediums: string[]
    downloadUrl: string
    medium: string[]
    interactionTypes: string[]
    versionKey: string
    mimeType: string
    code: string
    license: string
    version: number
    prevStatus: string
    templateId: string
    language: string[]
    showFeedback: string
    objectType: string
    status: string
    contentEncoding: string
    depth: number
    allowAnonymousAccess: string
    contentDisposition: string
    artifactUrl: string
    visibility: string
    qType: TQuizQuestionType
    editorState: IEditor
    showSolutions: string
    variants: object
    index: number
    pkgVersion: number
  }
  export interface IEditor {
    answer?: string
    options?: IOptionsV2[]
    question: string
  }
  export interface IOptionsV2 {
    answer: boolean | any
    value: {
      body: string | any
      value: number | any
    }
  }
  export interface ISectionResponse {
    ts: string
    params: {
      resmsgid: string
      msgid: string
      err: string
      status: string
      errmsg: string
    },
    responseCode: string
    result: IQPaper
  }
  export interface IQAnswer {
    [questionId: string]: string[]
  }
  export interface ISecAttempted {
    identifier: string
    isAttempted: boolean // attempted
    fullAttempted: boolean // full attempted
    totalQueAttempted: number
    nextSection: string | null
    attemptData?: { questionId: string, answers: any[] } | null
  }
}
