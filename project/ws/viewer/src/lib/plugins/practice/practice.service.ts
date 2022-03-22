import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { NSPractice } from './practice.model'
import { BehaviorSubject, Observable } from 'rxjs'
import { retry } from 'rxjs/operators'

const API_END_POINTS = {
  ASSESSMENT_SUBMIT_V2: `/apis/protected/v8/user/evaluate/assessment/submit/v2`,
  QUESTION_PAPER_SECTIONS: `/apis/proxies/v8/assessment/read`,
  QUESTION_PAPER_QUESTIONS: `/apis/proxies/v8/question/read`,
}
@Injectable({
  providedIn: 'root',
})

export class PracticeService {

  paperSections: BehaviorSubject<NSPractice.IQPaper | null> = new BehaviorSubject<NSPractice.IQPaper | null>(null)
  questionAnswerHash: BehaviorSubject<NSPractice.IQAnswer> = new BehaviorSubject<NSPractice.IQAnswer>({})
  secAttempted: BehaviorSubject<NSPractice.ISecAttempted[] | []> = new BehaviorSubject<NSPractice.ISecAttempted[] | []>([])
  constructor(
    private http: HttpClient,
  ) { }

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
        }
      }
      this.secAttempted.next(sections)
    }
  }
  qAnsHash(value: any) {
    this.questionAnswerHash.next(value)
  }
  submitQuizV2(req: NSPractice.IQuizSubmitRequest): Observable<NSPractice.IQuizSubmitResponse> {
    return this.http.post<NSPractice.IQuizSubmitResponse>(API_END_POINTS.ASSESSMENT_SUBMIT_V2, req)
  }

  createAssessmentSubmitRequest(
    identifier: string,
    title: string,
    quiz: NSPractice.IQuiz,
    questionAnswerHash: { [questionId: string]: any[] },
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
        question.questionType === 'mcq-sca'
      ) {
        return question.options.map(option => {
          if (questionAnswerHash[question.questionId]) {
            option.userSelected = questionAnswerHash[question.questionId].includes(option.optionId)
          } else {
            option.userSelected = false
          }
          return option
        })
      } if (question.questionType === 'fitb') {
        for (let i = 0; i < question.options.length; i += 1) {
          if (questionAnswerHash[question.questionId]) {
            question.options[i].response = questionAnswerHash[question.questionId][0].split(',')[i]
          }
        }
      } else if (question.questionType === 'mtf') {
        for (let i = 0; i < question.options.length; i += 1) {
          if (questionAnswerHash[question.questionId] && questionAnswerHash[question.questionId][0][i]) {
            for (let j = 0; j < questionAnswerHash[question.questionId][0].length; j += 1) {
              if (question.options[i].text.trim() === questionAnswerHash[question.questionId][0][j].source.innerText.trim()) {
                question.options[i].response = questionAnswerHash[question.questionId][0][j].target.innerText
              }
            }
          } else {
            question.options[i].response = ''
          }
        }
      }
      return question
    })
    return quizWithAnswers
  }

  sanitizeAssessmentSubmitRequest(requestData: NSPractice.IQuizSubmitRequest): NSPractice.IQuizSubmitRequest {
    requestData.questions.map(question => {
      question.question = ''
      question.options.map(option => {
        option.hint = ''
        option.text = question.questionType === 'fitb' || question.questionType === 'mtf' ? option.text : ''
      })
    })
    return requestData
  }

  getSection(sectionId: string): Observable<NSPractice.ISectionResponse> {
    return this.http.get<NSPractice.ISectionResponse>(`${API_END_POINTS.QUESTION_PAPER_SECTIONS}/${sectionId}`).pipe(retry(2))
  }
  getQuestions(identifiers: string[]): Observable<{ count: Number, questions: any[] }> {
    const data = {
      request: {
        search: {
          identifier: identifiers,
        },
      },
    }
    return this.http.post<{ count: Number, questions: any[] }>(API_END_POINTS.QUESTION_PAPER_QUESTIONS, data)
  }
}
