import { NsContent } from '@sunbird-cb/collection/src/public-api'

export namespace NSPractice {
  export interface IQuiz {
    timeLimit: number
    questions: IQuestion[]
    isAssessment: boolean
  }

  export interface IQuestion {
    multiSelection: boolean
    instructions: string
    section: string
    editorState?: IEditor
    question: any
    questionId: string
    options: IOption[]
    questionLevel: String,
    timeTaken: String,
    questionType?: TQuizQuestionType,
    rhsChoices?: string[],
    choices?: IChoiceOptions
  }

  export interface IOption {
    optionId: string
    text: string
    isCorrect?: boolean
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

  export type TQuizQuestionType = 'mcq-sca' | 'mcq-mca' | 'fitb' | 'ftb' | 'mtf' | string // need to remove string from next ittration
  export type TUserSelectionType = 'start' | 'skip' | 'retake'
  export type TQuizSubmissionState = 'unanswered' | 'marked' | 'answered'
  export type TQuizViewMode = 'initial' | 'detail' | 'attempt' | 'review' | 'answer'

  export interface IQuizSubmitRequest {
    identifier: string
    isAssessment: boolean
    questions: IQuestion[]
    timeLimit: number
    title: string
  }
  export interface IMtfSrc {
    [questionId: string]: {
      // [source: string]:  {
      // source: string
      // target: string,
      // sourceId: string
      // targetId: string
      source: string[]
      target: string[]
      // }
    }
  }
  export interface IQuizSubmitResponse {
    blank: number
    correct: number
    inCorrect: number
    passPercent: number
    result: number
    total: number
  }
  export interface IQuizSubmitResSec {
    identifier: string
    objectType: string
    primaryCategory: NsContent.EPrimaryCategory
    scoreCutoffType: string
    minimumPassPercentage: number
    result: number
    total: number
    blank: number
    correct: number
    passPercent: number
    inCorrect: number
    pass: boolean,
    totalMarks: number,
    sectionMarks: number,
    children: ISectionQuestion[],
    name: string
  }

  export interface ISectionQuestion {
    identifier: string,
    mimeType: string,
    objectType: string
    primaryCategory: string
    qType: string
    question: string
    result: string,
    questionLevel: string
    timeSpent: string
  }
  export interface IQuizSubmitResponseV2 {
    identifier: string
    isAssessment: boolean
    objectType: string
    primaryCategory: NsContent.EPrimaryCategory
    children: IQuizSubmitResSec[]
    overallResult: number
    total: number
    blank: number
    correct: number
    passPercentage: number
    incorrect: number
    pass: boolean
    isInProgress?: boolean
    timeTakenForAssessment: string,
    totalSectionMarks: number,
    totalMarks: number
  }

  export interface IQPaper {
    response?: any
    questionSet: {
      assessmentType: string,
      lastStatusChangedOn: string
      children: IPaperSection[]
      name: string
      navigationMode: string
      createdOn: string
      pdfUrl: string
      generateDIALCodes: 'No' | 'Yes'
      lastUpdatedOn: string
      showTimer: 'No' | 'Yes'
      expectedDuration: number
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
    children?: IQuestionV2[]
    maxQuestions?: number
    childNodes?: string[]
    additionalInstructions?: string
    name: string
    navigationMode: string
    createdOn: string
    generateDIALCodes: string
    lastUpdatedOn: string
    showTimer: 'No' | 'YES'
    identifier: string
    description: string
    containsUserData: string
    minimumPassPercentage: number
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
    scoreCutoffType: string
    contentDisposition: string
    visibility: string
    showSolutions: 'Yes' | 'No'
    index: number,
    expectedDuration: number,
    questionParagraph?: any
  }
  export interface IQuestionV2 {
    lastStatusChangedOn: string
    answer: any
    editorState?: IEditor
    parent: string
    name: string
    body: string
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
    questionType: TQuizQuestionType
    choices: IEditor
    rhsChoices?: string[]
    showSolutions: string
    variants: object
    index: number
    pkgVersion: number

  }
  export interface IEditor {
    // answer?: string
    options?: IOptionsV2[]
    // question: string
  }
  export interface IOptionsV2 {
    answer?: boolean | any
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

  export interface IResponseOptions {
    selectedAnswer: string | boolean
    index: number | string
  }
  export interface IRScratch {
    identifier: string
    primaryCategory: string
    mimeType: string
    objectType: 'Question'
    qType: string,
    timeTaken: string,
    timeSpent: string,
    editorState: {
      options?: any[]
      selectedAnswer?: string | null
    }
  }
  // tslint:disable-next-line
  export interface IMCQ_SCA extends IRScratch {
    primaryCategory: NsContent.EPrimaryCategory.SINGLE_CHOICE_QUESTION
    mimeType: NsContent.EMimeTypes.QUESTION
    qType: 'MCQ-SCA',
    question: String,
    questionLevel: String,
    editorState: {
      options: IResponseOptions[]
    }
  }
  // tslint:disable-next-line
  export interface IMCQ_MCA extends IRScratch {
    primaryCategory: NsContent.EPrimaryCategory.MULTIPLE_CHOICE_QUESTION
    mimeType: NsContent.EMimeTypes.QUESTION
    qType: 'MCQ-MCA',
    question: String,
    questionLevel: String,
    editorState: {
      options: IResponseOptions[]
    }
  }
  // tslint:disable-next-line
  export interface IMCQ_MCA_W extends IRScratch {
    primaryCategory: NsContent.EPrimaryCategory.MULTIPLE_CHOICE_QUESTION
    mimeType: NsContent.EMimeTypes.QUESTION
    qType: 'MCQ-MCA-W',
    question: String,
    questionLevel: String,
    editorState: {
      options: IResponseOptions[]
    }
  }
  // tslint:disable-next-line
  export interface IMCQ_MTF extends IRScratch {
    primaryCategory: NsContent.EPrimaryCategory.MTF_QUESTION
    mimeType: NsContent.EMimeTypes.QUESTION
    qType: 'MTF',
    question: String,
    questionLevel: String,
    editorState: {
      options: IResponseOptions[]
      rhsChoices?: String[]
    },
  }
  // tslint:disable-next-line
  export interface IMCQ_FTB extends IRScratch {
    primaryCategory: NsContent.EPrimaryCategory.FTB_QUESTION
    mimeType: NsContent.EMimeTypes.QUESTION
    qType: 'FTB'
    question: String
    questionLevel: String,
    editorState: {
      // selectedAnswer: string | null
      options: IResponseOptions[]
    }
  }
  export interface ISubSec {
    identifier: string
    objectType: string
    primaryCategory: NsContent.EPrimaryCategory
    scoreCutoffType: String
    children: IRScratch[]
  }
  export interface IQuizSubmit {
    timeLimit: Number
    isAssessment: boolean
    identifier: string
    objectType: 'QuestionSet'
    courseId: string
    batchId: string
    primaryCategory: NsContent.EPrimaryCategory
    children: ISubSec[]
  }
  export interface IRetakeAssessment {
    attemptsMade: number,
    attemptsAllowed: number
  }
  export interface IChoiceOptions {
    options: any []
  }
}
