import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { NSPractice } from './practice.model'
import { BehaviorSubject, Observable, Subject, of } from 'rxjs'
import { map, retry } from 'rxjs/operators'
// tslint:disable-next-line
import _ from 'lodash'

const API_END_POINTS = {
  ASSESSMENT_SUBMIT_V2: `/apis/protected/v8/user/evaluate/assessment/submit/v2`,
  ASSESSMENT_SUBMIT_V3: `/apis/protected/v8/user/evaluate/assessment/submit/v3`,
  ASSESSMENT_SUBMIT_V4: `/apis/protected/v8/user/evaluate/assessment/submit/v4`,
  ASSESSMENT_SUBMIT_V5: `/apis/protected/v8/user/evaluate/assessment/submit/v5`,
  ASSESSMENT_SUBMIT_V6: `/apis/protected/v8/user/evaluate/assessment/submit/v6`,
  ASSESSMENT_RESULT_V4: `/apis/proxies/v8/user/assessment/v4/result`,
  ASSESSMENT_RESULT_V5: `/apis/proxies/v8/user/assessment/v5/result`,
  QUESTION_PAPER_SECTIONS_V4: `/apis/proxies/v8/assessment/read`,
  QUESTION_PAPER_QUESTIONS_V4: `/apis/proxies/v8/question/read`,
  QUESTION_PAPER_SECTIONS: `/apis/proxies/v8/assessment/v5/read`,
  QUESTION_PAPER_QUESTIONS: `/apis/proxies/v8/question/v5/read`,
  SAVE_AND_NEXT_QUESTION: `apis/proxies/v8/assessment/save`,
  CAN_ATTEMPT: (assessmentId: any) => `/apis/proxies/v8/user/assessment/retake/${assessmentId}`,
  CAN_ATTEMPT_V5: (assessmentId: any) => `/apis/proxies/v8/user/assessment/v5/retake/${assessmentId}`,
  PUBLIC_QUESTION_READ: `api/public/assessment/v5/read`,
  PUBLIC_QUESTION_LIST: `/api/public/assessment/v1/question/list`,
  PUBLIC_ASSESSMENT_SUBMIT: `api/public/assessment/v5/assessment/submit`,
  PUBLIC_ASSESSMENT_RESULT: `api/public/assessment/v5/result`,
}
const forcreator = window.location.href.includes('editMode=true')
@Injectable({
  providedIn: 'root',
})

export class PracticeService {

  paperSections: BehaviorSubject<NSPractice.IQPaper | null> = new BehaviorSubject<NSPractice.IQPaper | null>(null)
  questionAnswerHash: BehaviorSubject<NSPractice.IQAnswer> = new BehaviorSubject<NSPractice.IQAnswer>({})
  secAttempted: BehaviorSubject<NSPractice.ISecAttempted[] | []> = new BehaviorSubject<NSPractice.ISecAttempted[] | []>([])
  mtfSrc: BehaviorSubject<NSPractice.IMtfSrc> = new BehaviorSubject<NSPractice.IMtfSrc>({})
  currentSection: BehaviorSubject<Partial<NSPractice.IPaperSection>> = new BehaviorSubject<Partial<NSPractice.IPaperSection>>({})
  // questionAnswerHashV2:BehaviorSubject<NSPractice.IQAnswer> = new BehaviorSubject<NSPractice.IQAnswer>({})
  displayCorrectAnswer: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  checkAlreadySubmitAssessment = new Subject()
  clearResponse = new Subject()

  constructor(
    private http: HttpClient,
  ) {

  }

  // handleError(error: ErrorEvent) {
  //   let errorMessage = ''
  //   if (error.error instanceof ErrorEvent) {
  //     errorMessage = `Error: ${error.error.message}`
  //   }
  //   return throwError(errorMessage)
  // }
  startSection(section: NSPractice.IPaperSection) {
    if (section) {
      const sections = this.secAttempted.getValue()
      for (let i = 0; sections && i < sections.length; i += 1) {
        if (sections[i] && section.identifier === sections[i].identifier) {
          sections[i].isAttempted = true
          sections[i].fullAttempted = false
        }
      }
      this.secAttempted.next(sections)
    }
  }
  setFullAttemptSection(section: NSPractice.IPaperSection) {
    if (section) {
      const sections = this.secAttempted.getValue()
      for (let i = 0; sections && i < sections.length; i += 1) {
        if (sections[i] && section.identifier === sections[i].identifier) {
          sections[i].isAttempted = true
          sections[i].fullAttempted = true
        }
      }
      this.secAttempted.next(sections)
    }
  }
  qAnsHash(value: any) {
    // tslint:disable-next-line
    this.questionAnswerHash.next(value)
  }
  submitQuizV2(req: NSPractice.IQuizSubmitRequest): Observable<NSPractice.IQuizSubmitResponse> {
    return this.http.post<NSPractice.IQuizSubmitResponse>(API_END_POINTS.ASSESSMENT_SUBMIT_V2, req)
  }
  submitQuizV3(req: NSPractice.IQuizSubmit): Observable<NSPractice.IQuizSubmitResponseV2> {
    return this.http.post<{ result: NSPractice.IQuizSubmitResponseV2 }>(API_END_POINTS.ASSESSMENT_SUBMIT_V3, req).pipe(map(response => {
      return response.result
    }))
  }
  submitQuizV4(req: NSPractice.IQuizSubmit): Observable<any> {
    return this.http.post<{ result: NSPractice.IQuizSubmitResponseV2 }>(API_END_POINTS.ASSESSMENT_SUBMIT_V4, req).pipe(map(response => {
      return response
    }))
  }

  submitQuizV5(req: NSPractice.IQuizSubmit): Observable<any> {
    return this.http.post<{ result: NSPractice.IQuizSubmitResponseV2 }>(API_END_POINTS.ASSESSMENT_SUBMIT_V5, req).pipe(map(response => {
      return response
    }))
  }

  submitQuizV6(req: NSPractice.IQuizSubmit): Observable<any> {
    return this.http.post<{ result: NSPractice.IQuizSubmitResponseV2 }>(API_END_POINTS.ASSESSMENT_SUBMIT_V6, req).pipe(map(response => {
      return response
    }))
  }

  publicSubmit(req: NSPractice.IQuizSubmit): Observable<any> {

    return this.http.post<{ result: NSPractice.IQuizSubmitResponseV2 }>(
      API_END_POINTS.PUBLIC_ASSESSMENT_SUBMIT, req).pipe(map(response => {
      return response
    }))
  }

  quizResult(req: any, forPreview?: any) {
    const url = (forPreview && !forcreator) ? API_END_POINTS.PUBLIC_ASSESSMENT_RESULT : API_END_POINTS.ASSESSMENT_RESULT_V4
    return this.http.post<{ result: NSPractice.IQuizSubmitResponseV2 }>(
      url, req).pipe(map(response => {
      return response
    }))
  }

  quizResultV5(req: any, forPreview?: any) {
    const url = (forPreview && !forcreator) ? API_END_POINTS.PUBLIC_ASSESSMENT_RESULT : API_END_POINTS.ASSESSMENT_RESULT_V5
    return this.http.post<{ result: NSPractice.IQuizSubmitResponseV2 }>(url, req).pipe(map(response => {
      return response
    }))
  }

  createAssessmentSubmitRequest(
    identifier: string,
    title: string,
    quiz: NSPractice.IQuiz,
    questionAnswerHash: { [questionId: string]: any[] },
    mtfSrc: {
      [questionId: string]: {
        source: string[],
        target: string[]
      }
    }
  ): NSPractice.IQuizSubmitRequest {
    const quizWithAnswers = {
      ...quiz,
      identifier,
      title,
    }
    quizWithAnswers.questions.map(question => {
      if (
        question.questionType === undefined ||
        question.questionType === 'mcq-mca' ||
        question.questionType === 'mcq-sca' ||
        question.questionType === 'mcq-mca-w' ||
        question.questionType === 'mcq-sca-tf'
      ) {
        return question.options.map(option => {
          if (questionAnswerHash[question.questionId]) {
            option.userSelected = questionAnswerHash[question.questionId].includes(option.optionId)
          } else {
            option.userSelected = false
          }
          return option
        })
      } if (question.questionType === 'ftb') {
        for (let i = 0; i < question.options.length; i += 1) {
          if (questionAnswerHash[question.questionId]) {
            question.options[i].response = questionAnswerHash[question.questionId][0].split(',')[i]
          }
        }
      } else if (question.questionType === 'mtf') {
        for (let i = 0; i < question.options.length; i += 1) {
          // this.mtfSrc['']
          // if (mtfSrc[question.questionId] && mtfSrc[question.questionId].source[i] && mtfSrc[question.questionId].target[i]) {
          //   for (let j = 0; j < question.options.length; j += 1) {
              let  opText = question.options[i].text.trim()
              opText = opText.replace(/\&lt;/g, '<').replace(/\&gt;/g, '>')
              opText = this.extractContent(opText)
              if (mtfSrc[question.questionId] && mtfSrc[question.questionId].source.length
                && mtfSrc[question.questionId].source.includes(opText.replace(/<(.|\n)*?>/g, ''))) {
                  // tslint:disable-next-line: max-line-length
                const stringRemoveSlashN =  this.extractContent(question.options[i].text.replace(/\n/g, '').replace(/\&lt;/g, '<').replace(/\&gt;/g, '>'))
                const idxOfSource = _.indexOf(mtfSrc[question.questionId].source, stringRemoveSlashN.replace(/<(.|\n)*?>/g, ''))
                const targetId = mtfSrc[question.questionId].target[idxOfSource]
                if (targetId) {
                  const lastChar = targetId.slice(-1)
                  if (question && lastChar) {
                    question.options[i].response = question.rhsChoices && question.rhsChoices[Number(lastChar) - 1]
                  }
                  question.options[i].userSelected = true
                } else {
                  question.options[i].userSelected = false
                }

              // }
            // }
          } else {
            question.options[i].response = ''
          }
        }
        // for (let i = 0; i < question.options.length; i += 1) {
        //   if (questionAnswerHash[question.questionId] && questionAnswerHash[question.questionId][0][i]) {
        //     for (let j = 0; j < questionAnswerHash[question.questionId][0].length; j += 1) {
        //       if (question.options[i].text.trim() === questionAnswerHash[question.questionId][0][j].source.innerText.trim()) {
        //         question.options[i].response = questionAnswerHash[question.questionId][0][j].target.innerText
        //       }
        //     }
        //   } else {
        //     question.options[i].response = ''
        //   }
        // }
      }
      return question
    })
    return quizWithAnswers
  }

  extractContent(htmlData: any) {
    const spanData = document.createElement('span')
    spanData.innerHTML = htmlData
    return spanData.textContent || spanData.innerText
  }

  sanitizeAssessmentSubmitRequest(requestData: NSPractice.IQuizSubmitRequest): NSPractice.IQuizSubmitRequest {
    requestData.questions.map(question => {
      question.question = ''
      question.options.map(option => {
        option.hint = ''
        option.text = question.questionType === 'ftb' || question.questionType === 'mtf' ? option.text : ''
      })
    })
    return requestData
  }

  getSection(sectionId: string, forPreview?: any, postReqData?: any): Observable<any> {
    if (forPreview && !forcreator) {
      return this.http.post<NSPractice.ISectionResponse>(API_END_POINTS.PUBLIC_QUESTION_READ, postReqData).pipe(retry(2))
    }
      if (forcreator) {
        // tslint:disable-next-line: max-line-length
        return this.http.get<NSPractice.ISectionResponse>(`${API_END_POINTS.QUESTION_PAPER_SECTIONS}/${sectionId}?editMode=true`).pipe(retry(2))
      }
        // tslint:disable-next-line: max-line-length
        return this.http.get<NSPractice.ISectionResponse>(`${API_END_POINTS.QUESTION_PAPER_SECTIONS}/${sectionId}`).pipe(retry(2))

  }
  getQuestions(identifiers: string[], assessmentId: string,
               forPreview?: any, userDetails?: any, collectionId?: any): Observable<{ count: Number, questions: any[] }> {
    const data = {
      assessmentId,
      request: {
        search: {
          identifier: identifiers,
        },
      },
    }
    if (forPreview && !forcreator) {
      const forPreviewData = {
        assessmentIdentifier: assessmentId,
        contextId: collectionId,
        request: {
          search: {
            identifier: identifiers,
          },
        },
        ...userDetails,
      }
      return this.http.post<{ count: Number, questions: any[] }>(
        API_END_POINTS.PUBLIC_QUESTION_LIST, forPreviewData)
    }
      if (forcreator) {
        // tslint:disable-next-line: max-line-length
        return this.http.post<{ count: Number, questions: any[] }>(`${API_END_POINTS.QUESTION_PAPER_QUESTIONS}?editMode=true`, data)
      }

        return this.http.post<{ count: Number, questions: any[] }>(API_END_POINTS.QUESTION_PAPER_QUESTIONS, data)

  }

  getSectionV4(sectionId: string, forPreview?: any, postReqData?: any): Observable<any> {
    if (forPreview && !forcreator) {
      return this.http.post<NSPractice.ISectionResponse>(API_END_POINTS.PUBLIC_QUESTION_READ, postReqData).pipe(retry(2))
    }
      if (forcreator) {
        // tslint:disable-next-line: max-line-length
        return this.http.get<NSPractice.ISectionResponse>(`${API_END_POINTS.QUESTION_PAPER_SECTIONS_V4}/${sectionId}?editMode=true`).pipe(retry(2))
      }
        // tslint:disable-next-line: max-line-length
        return this.http.get<NSPractice.ISectionResponse>(`${API_END_POINTS.QUESTION_PAPER_SECTIONS_V4}/${sectionId}`).pipe(retry(2))

  }
  getQuestionsV4(identifiers: string[], assessmentId: string,
                 forPreview?: any, userDetails?: any, collectionId?: any): Observable<{ count: Number, questions: any[] }> {
    const data = {
      assessmentId,
      request: {
        search: {
          identifier: identifiers,
        },
      },
    }

    if (forPreview && !forcreator) {
      const forPreviewData = {
        assessmentIdentifier: assessmentId,
        contextId: collectionId,
        request: {
          search: {
            identifier: identifiers,
          },
        },
        ...userDetails,
      }
      return this.http.post<{ count: Number, questions: any[] }>(
        API_END_POINTS.PUBLIC_QUESTION_LIST, forPreviewData)
    }
      if (forcreator) {
        // tslint:disable-next-line: max-line-length
        return this.http.post<{ count: Number, questions: any[] }>(`${API_END_POINTS.QUESTION_PAPER_QUESTIONS_V4}?editMode=true`, data)
      }
        // tslint:disable-next-line: max-line-length
        return this.http.post<{ count: Number, questions: any[] }>(API_END_POINTS.QUESTION_PAPER_QUESTIONS_V4, data)

  }
  shuffle(array: any[] | (string | undefined)[]) {
    let currentIndex = array.length
    let temporaryValue
    let randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      // And swap it with the current element.
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }
  canAttend(identifier: string): Observable<NSPractice.IRetakeAssessment> {
    if (identifier) {
      return this.http.get<any>(API_END_POINTS.CAN_ATTEMPT(identifier)).pipe(map(r => r.result))
    }
    return of({
      attemptsMade: 0,
      attemptsAllowed: 1,
    })
  }

  canAttendV5(identifier: string): Observable<NSPractice.IRetakeAssessment> {
    if (identifier) {
      return this.http.get<any>(API_END_POINTS.CAN_ATTEMPT_V5(identifier)).pipe(map(r => r.result))
    }
    return of({
      attemptsMade: 0,
      attemptsAllowed: 1,
    })
  }

  saveAndNextQuestion(req: NSPractice.IQuizSubmit) {
    return this.http.post<{ result: NSPractice.IQuizSubmitResponseV2 }>(API_END_POINTS.SAVE_AND_NEXT_QUESTION, req).pipe(map(response => {
      return response
    }))
  }

  shCorrectAnswer(val: boolean) {
    this.displayCorrectAnswer.next(val)
  }
}
