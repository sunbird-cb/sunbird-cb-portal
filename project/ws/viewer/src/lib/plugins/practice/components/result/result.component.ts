import { Component, EventEmitter, Input, OnInit, OnChanges, Output, ViewChild } from '@angular/core'
import { NsContent, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { NSPractice } from '../../practice.model'
import { MatAccordion } from '@angular/material/expansion'
import { MatTableDataSource } from '@angular/material'
import * as _ from 'lodash'
@Component({
  selector: 'viewer-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit, OnChanges {
  @Input() percentage = 0
  @Input() levelText!: string
  @Input() isPassed = false
  @Input() quizCategory!: NsContent.EPrimaryCategory
  @Input() quizResponse!: NSPractice.IQuizSubmitResponseV2
  @Input() coursePrimaryCategory: any
  @Input() selectedAssessmentCompatibilityLevel = 2
  @Output() userSelection = new EventEmitter<string>()
  @Output() fetchResult = new EventEmitter<string>()
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion | undefined
  staticImage = '/assets/images/exam/practice-result.png'
  questionTYP = NsContent.EPrimaryCategory
  selectedQuestionData: any
  activeQuestionSet: any = ''
  color = 'warn'
  mode = 'determinate'
  value = 45
  showText = 'Rating'
  isMobile = false
  showInsight = false
  questionStatuTableData: any = []
  quizResponseClone: any
  selectedSectionId = ''
  selectedStatus = 'all'
  summaryTableDataSource: any = new MatTableDataSource([
    // {
    //   subject: 'Section A',
    //   yourScore: '0.25 / 35',
    // },
    // {
    //   subject: 'Section B',
    //   yourScore: '-1.25 / 35',
    // },
    // {
    //   subject: 'Section C',
    //   yourScore: '-1.25 / 30',
    // },
  ])
  summaryTableDisplayeColumns:
    { header: string, key: string }[] = [
    ]

  competitiveTableDataSource = new MatTableDataSource([
    {
      subject: 'Section A',
      yourScore: '0.25 / 35',
      topperScore: '35/35',
    },
    {
      subject: 'Section B',
      yourScore: '-1.25 / 35',
      topperScore: '32.5/35',
    },
  ])
  competitiveTableDisplayedColumns = [
    { header: 'quizresult.subject', key: 'subject' },
    { header: 'quizresult.yourScore', key: 'yourScore' },
    // { header: 'Topper Score', key: 'topperScore' },
  ]

  overAllSummary = [
    {
      imgType: 'icon',
      imgPath: 'speed',
      class: 'icon-bg-blue',
      summary: '',
      summaryType: 'quizresult.score',
    },
    {
      imgType: 'img',
      imgPath: '/assets/icons/final-assessment/nest_clock_farsight_analog.svg',
      class: 'icon-bg-lite-green',
      summary: '',
      summaryType: 'quizresult.timeTaken',
    },
    {
      imgType: 'img',
      imgPath: '/assets/icons/final-assessment/assignment.svg',
      class: 'icon-bg-pink',
      summary: '',
      summaryType: 'quizresult.attempted',
    },
    {
      imgType: 'icon',
      imgPath: 'check_circle_outline',
      class: 'icon-bg-yellow',
      summary: '',
      summaryType: 'quizresult.correct',
    },
    {
      imgType: 'img',
      imgPath: '/assets/icons/final-assessment/target.svg',
      class: 'icon-bg-dark-green',
      summary: '',
      summaryType: 'quizresult.accuracy',
    },
  ]

  scoreSummary = [
    {
      imgType: 'img',
      imgPath: '/assets/icons/final-assessment/nest_clock_farsight_analog.svg',
      class: 'icon-bg-lite-green',
      summary: '0:9:8',
      summaryType: 'quizresult.timeTaken',
    },
    {
      imgType: 'img',
      imgPath: '/assets/icons/final-assessment/assignment.svg',
      class: 'icon-bg-pink',
      summary: '84/100',
      summaryType: 'quizresult.attempted',
    },
    {
      imgType: 'icon',
      imgPath: 'check_circle_outline',
      class: 'icon-bg-yellow',
      summary: '15/100',
      summaryType: 'quizresult.correct',
    },
    {
      imgType: 'icon',
      imgPath: 'cancel',
      class: 'icon-bg-red',
      summary: '69',
      summaryType: 'quizresult.wrong',
    },
    {
      imgType: 'img',
      imgPath: '/assets/icons/final-assessment/target.svg',
      class: 'icon-bg-dark-green',
      summary: '',
      summaryType: 'quizresult.accuracy',
    },
  ]

  questionStatuTableDataSource: any = new MatTableDataSource([])
  questionStatuTableColumns = [
    { header: 'quizresult.questions', key: 'question' },
    { header: 'quizresult.status', key: 'status' },
    { header: 'quizresult.questionTagging', key: 'questionTagg' },
    { header: 'quizresult.timeTaken', key: 'timeSpent' },
  ]

  sectionsList: any = []
  selectedSection = 'All'

  expandMwebOverView = false

  constructor(private langtranslations: MultilingualTranslationsService) {

  }

  ngOnInit() {
    if (window.innerWidth < 768) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }
  }

  ngOnChanges() {
    // console.log(this.quizResponse, this.quizResponse)
    this.sectionsList = [
      {
        sectionName: 'All',
        identifier: '',
      },
    ]
    if (this.quizResponse) {
      this.quizResponseClone = _.clone(this.quizResponse)
      const sectionTableData = []
      let totalQuestions = _.get(this.quizResponse, 'total', 0)
        /* tslint:disable */
      if(this.quizResponse.children) {
        for (let i = 0; i < this.quizResponse.children.length; i++) {
          if (this.quizResponse.children[i] && this.quizResponse.children[i].children) {
            const sectionTotalQuestions = this.quizResponse.children[i].children.length
            let sectionName:any = this.quizResponse.children[i]['name'];
            if(_.get(this.quizResponse, 'total', 0) === 0) {
              totalQuestions = sectionTotalQuestions + totalQuestions
            }
            // if (this.quizResponse.children[i]['correct']) {
            
              if(this.quizResponse.children.length === 1) {
                sectionName = sectionName ? sectionName : 'Default Section'
              } else {
                if(i==0) {
                  sectionName =  sectionName ? sectionName : 'Section A'
                } else if(i==1) {
                  sectionName = sectionName ? sectionName : 'Section B'
                } else if(i==2) {
                  sectionName = sectionName ? sectionName : 'Section C'
                } else if(i==3) {
                  sectionName = sectionName ? sectionName : 'Section D'
                } else if(i==4) {
                  sectionName = sectionName ? sectionName : 'Section E'
                } else if(i==5) {
                  sectionName = sectionName ? sectionName :  'Section F'
                }
              }

              const sectionObj = { subject: `${sectionName}`, yourScore : `${this.quizResponse.children[i]['sectionMarks']} / ${this.quizResponse.children[i]['totalMarks']}`}
              sectionTableData.push(sectionObj)
            // }
          }
        }
      }
      this.summaryTableDataSource = new MatTableDataSource(sectionTableData)
      this.summaryTableDisplayeColumns = [
        { header: 'quizresult.subject', key: 'subject' },
        { header: 'quizresult.yourScore', key: 'yourScore' },
      ]

      this.competitiveTableDataSource = new MatTableDataSource([
        {
          subject: 'Section A',
          yourScore: '0.25 / 35',
          topperScore: '35/35',
        },
        {
          subject: 'Section B',
          yourScore: '-1.25 / 35',
          topperScore: '32.5/35',
        },
      ])
      this.competitiveTableDisplayedColumns = [
        { header: 'quizresult.subject', key: 'subject' },
        { header: 'quizresult.yourScore', key: 'yourScore' },
        // { header: 'Topper Score', key: 'topperScore' },
      ]

      if(this.questionTYP.PRACTICE_RESOURCE === this.quizCategory) {
        if(this.quizResponse.correct === undefined) {
          this.quizResponse.correct = 0
          this.quizResponse.incorrect = 0
          this.quizResponse.children.forEach((section: any) => {
            this.quizResponse.correct = section.correct + this.quizResponse.correct
            this.quizResponse.incorrect = section.incorrect + this.quizResponse.incorrect
          })
        }
      }

      const overallResult = typeof this.quizResponse.overallResult === 'number' ? this.quizResponse.overallResult : 0
      this.overAllSummary = [
        {
          imgType: 'icon',
          imgPath: 'speed',
          class: 'icon-bg-blue',
          summary: this.quizResponse['totalSectionMarks'] ? `${(Number(this.quizResponse['totalSectionMarks'])).toFixed(2)}/${this.quizResponse['totalMarks']}` : '0',
          summaryType: 'quizresult.score',
        },
        {
          imgType: 'img',
          imgPath: '/assets/icons/final-assessment/nest_clock_farsight_analog.svg',
          class: 'icon-bg-lite-green',
          summary: this.quizResponse['timeTakenForAssessment'] ? this.millisecondsToHMS(this.quizResponse['timeTakenForAssessment']) : '00:00:00',
          summaryType: 'quizresult.timeTaken',
        },
        {
          imgType: 'img',
          imgPath: '/assets/icons/final-assessment/assignment.svg',
          class: 'icon-bg-pink',
          summary: totalQuestions ? `${(this.quizResponse.correct + this.quizResponse.incorrect)}/${totalQuestions}`: '0',
          summaryType: 'quizresult.attempted',
        },
        {
          imgType: 'icon',
          imgPath: 'check_circle_outline',
          class: 'icon-bg-yellow',
          summary: totalQuestions ? `${this.quizResponse.correct}/${totalQuestions}`: '0',
          summaryType: 'quizresult.correct',
        },
        {
          imgType: 'img',
          imgPath: '/assets/icons/final-assessment/target.svg',
          class: 'icon-bg-dark-green',
          summary: `${Math.round(Number(overallResult))}%`,
          summaryType: 'quizresult.accuracy',
        },
      ]

      this.scoreSummary = [
        // {
        //   imgType: 'img',
        //   imgPath: '/assets/icons/final-assessment/nest_clock_farsight_analog.svg',
        //   class: 'icon-bg-lite-green',
        //   summary: this.millisecondsToHMS(this.quizResponse['timeTakenForAssessment']),
        //   summaryType: 'quizresult.timeTaken',
        // },
        {
          imgType: 'img',
          imgPath: '/assets/icons/final-assessment/assignment.svg',
          class: 'icon-bg-pink',
          summary: totalQuestions ? `${(this.quizResponse.correct + this.quizResponse.incorrect)}/${totalQuestions}` : '0',
          summaryType: 'quizresult.attempted',
        },
        {
          imgType: 'icon',
          imgPath: 'check_circle_outline',
          class: 'icon-bg-yellow',
          summary: totalQuestions ? `${this.quizResponse.correct}/${totalQuestions}` : '0',
          summaryType: 'quizresult.correct',
        },
        {
          imgType: 'icon',
          imgPath: 'cancel',
          class: 'icon-bg-red',
          summary: this.quizResponse.incorrect ? this.quizResponse.incorrect.toString() : '0',
          summaryType: 'quizresult.wrong',
        },
        {
          imgType: 'img',
          imgPath: '/assets/icons/final-assessment/target.svg',
          class: 'icon-bg-dark-green',
          summary: `${Math.round(Number(overallResult))}%`,
          summaryType: 'quizresult.accuracy',
        },
      ]

      if (this.questionTYP.PRACTICE_RESOURCE !== this.quizCategory) {
        this.scoreSummary.unshift(
          {
            imgType: 'img',
            imgPath: '/assets/icons/final-assessment/nest_clock_farsight_analog.svg',
            class: 'icon-bg-lite-green',
            summary: this.quizResponse['timeTakenForAssessment'] ? this.millisecondsToHMS(this.quizResponse['timeTakenForAssessment']) : '0',
            summaryType: 'quizresult.timeTaken',
          }
        )
      }

      this.questionStatuTableDataSource = new MatTableDataSource([
      ])
      this.questionStatuTableColumns = [
        { header: 'quizresult.questions', key: 'question' },
        { header: 'quizresult.status', key: 'status' },
        { header: 'quizresult.questionTagging', key: 'questionTagg' },
        { header: 'quizresult.timeTaken', key: 'timeSpent' },
      ]
        /* tslint:disable */
      if(this.quizResponse && this.quizResponse.children) {
        for (let i = 0; i < this.quizResponse.children.length; i++) {
          let sectionName:any = this.quizResponse.children[i]['name'];
              if(this.quizResponse.children.length === 1) {
                sectionName = sectionName ? sectionName : 'Default Section'
              } else {
                if(i==0) {
                  sectionName = sectionName ? sectionName :'Section A'
                } else if(i==1) {
                  sectionName = sectionName ? sectionName :'Section B'
                } else if(i==2) {
                  sectionName = sectionName ? sectionName :'Section C'
                } else if(i==3) {
                  sectionName = sectionName ? sectionName :'Section D'
                } else if(i==4) {
                  sectionName = sectionName ? sectionName :'Section E'
                } else if(i==5) {
                  sectionName = sectionName ? sectionName :'Section F'
                }
              }
          const obj: any = {
                    sectionName: sectionName,
                    identifier: this.quizResponse.children[i]['identifier'],
          }
            /* tslint:disable */
          if(this.quizResponse.children[i] && this.quizResponse.children[i].children && this.quizResponse.children[i].children.length) {
            for (let j = 0; j < this.quizResponse.children[i].children.length; j++) {
              const objChildren: any = {
                question: this.quizResponse.children[i].children[j]['question'],
                status: this.quizResponse.children[i].children[j]['result'],
                questionTagg: this.quizResponse.children[i].children[j]['questionLevel'],
                timeSpent: this.millisecondsToHMS(this.quizResponse.children[i].children[j]['timeSpent']),
              }
              this.questionStatuTableData.push(objChildren)
            }
          }        
          this.sectionsList.push(obj)
        }
      }
      

      this.getSectionalData('all', 'all')
      // this.sectionsList = [
      //   {
      //     sectionName: 'Section A',
      //   },
      //   {
      //     sectionName: 'Section B',
      //   },
      //   {
      //     sectionName: 'Section C',
      //   },
      // ]
    }

    if(this.quizCategory) {
      this.showInsight = this.questionTYP.PRACTICE_RESOURCE === this.quizCategory
    }
  }

  getSectionalData(sectionId: string= 'all', resultType: string= 'all') {
    let quizResponse: any = this.quizResponse
    this.selectedSectionId = sectionId ? sectionId : 'all'
    this.selectedStatus = resultType
    this.questionStatuTableData = []
    if (this.selectedSectionId === 'all') {
        /* tslint:disable */
      if(this.quizResponse && this.quizResponse.children) {
        for (let i = 0; i < this.quizResponse.children.length; i++) {
          
          /* tslint:disable */
          if(this.quizResponse.children[i] && this.quizResponse.children[i].children && this.quizResponse.children[i].children.length) {
            for (let j = 0; j < this.quizResponse.children[i].children.length; j++) {
              let formattedQuestion = this.quizResponse.children[i].children[j]['question']
              formattedQuestion = formattedQuestion.replace(/&nbsp;/gi," ")
              if(this.quizResponse.children[i].children[j]['qType'] === 'FTB') {
                formattedQuestion = formattedQuestion.split('<input style="border-style:none none solid none" />').join('_________')                
              }
              if (resultType === 'all') {
                const obj: any = {
                  question: formattedQuestion,
                  /* tslint:disable */
                  status: this.quizResponse.children[i].children[j]['result'] === 'blank' ? 'Unattempted' :  (this.quizResponse.children[i].children[j]['result'] === 'incorrect' ? 'wrong' : this.quizResponse.children[i].children[j]['result'] ),
                  questionTagg: this.quizResponse.children[i].children[j]['questionLevel'],
                  timeSpent: this.millisecondsToHMS(this.quizResponse.children[i].children[j]['timeSpent']),
                }
                this.questionStatuTableData.push(obj)
              } else if (resultType === 'correct') {
                if (this.quizResponse.children[i].children[j]['result'] === 'correct') {
                  const obj: any = {
                    question: formattedQuestion,
                    status: this.quizResponse.children[i].children[j]['result'],
                    questionTagg: this.quizResponse.children[i].children[j]['questionLevel'],
                    timeSpent: this.millisecondsToHMS(this.quizResponse.children[i].children[j]['timeSpent']),
                  }
                  this.questionStatuTableData.push(obj)
                }
              } else if (resultType === 'wrong') {
                if (this.quizResponse.children[i].children[j]['result'] === 'incorrect') {
                  const obj: any = {
                    question: formattedQuestion,
                    status: 'wrong',
                    questionTagg: this.quizResponse.children[i].children[j]['questionLevel'],
                    timeSpent: this.millisecondsToHMS(this.quizResponse.children[i].children[j]['timeSpent']),
                  }
                  this.questionStatuTableData.push(obj)
                }
              }  else if (resultType === 'notAnswered') {
                if (this.quizResponse.children[i].children[j]['result'] === 'blank') {
                  const obj: any = {
                    question: formattedQuestion,
                    status: 'Unattempted',
                    questionTagg: this.quizResponse.children[i].children[j]['questionLevel'],
                    timeSpent: this.millisecondsToHMS(this.quizResponse.children[i].children[j]['timeSpent']),
                  }
                  this.questionStatuTableData.push(obj)
                }
              }
    
            }
          }
        
      }
      }
      
      this.questionStatuTableDataSource = this.questionStatuTableData
    } else {
        /* tslint:disable */
      if(this.quizResponse && this.quizResponse.children) {
        for (let i = 0; i < this.quizResponse.children.length; i++) {
          if (this.quizResponse.children[i]['identifier'] === this.selectedSectionId) {
            quizResponse = this.quizResponse.children[i]
            break
          }
        }
      }
     
        /* tslint:disable */
      if(quizResponse && quizResponse.children) {
        for (let j = 0; j < quizResponse.children.length; j++) {
          let formattedQuestion = quizResponse.children[j]['question'].replace(/&nbsp;/gi," ")
          if(quizResponse.children[j]['qType'] === 'FTB') {
            formattedQuestion = formattedQuestion.split('<input style="border-style:none none solid none" />').join('_________')                
          }
          if (resultType === 'all') {            
            const obj: any = {
              question: formattedQuestion ,
              /* tslint:disable */
              status: quizResponse.children[j]['result'] === 'blank' ? 'Unattempted' :  (quizResponse.children[j]['result'] === 'incorrect' ? 'wrong' : quizResponse.children[j]['result'] ),
              questionTagg: quizResponse.children[j]['questionLevel'],
              timeSpent: this.millisecondsToHMS(quizResponse.children[j]['timeSpent']),
            }
            this.questionStatuTableData.push(obj)
          } else if (resultType === 'correct') {
            if (quizResponse.children[j]['result'] === 'correct') {
              const obj: any = {
                question: formattedQuestion,
                status: quizResponse.children[j]['result'],
                questionTagg: quizResponse.children[j]['questionLevel'],
                timeSpent: this.millisecondsToHMS(quizResponse.children[j]['timeSpent']),
              }
              this.questionStatuTableData.push(obj)
            }
          } else if (resultType === 'wrong') {
            if (quizResponse.children[j]['result'] === 'incorrect') {
              const obj: any = {
                question: formattedQuestion,
                status: 'wrong',
                questionTagg: quizResponse.children[j]['questionLevel'],
                timeSpent: this.millisecondsToHMS(quizResponse.children[j]['timeSpent']),
              }
              this.questionStatuTableData.push(obj)
            }
          }  else if (resultType === 'notAnswered') {
            if (quizResponse.children[j]['result'] === 'blank') {
              const obj: any = {
                question: formattedQuestion,
                status: 'Unattempted',
                questionTagg: quizResponse.children[j]['questionLevel'],
                timeSpent: this.millisecondsToHMS(quizResponse.children[j]['timeSpent']),
              }
              this.questionStatuTableData.push(obj)
            }
          }
        }
      }
    this.questionStatuTableDataSource = this.questionStatuTableData
    }

  }

  getQuestionByStatus(status: string) {
    this.selectedStatus = status
    this.getSectionalData(this.selectedSectionId, status)
  }

  action(event: NSPractice.TUserSelectionType) {
    this.userSelection.emit(event)
  }
  get isOnlySection(): boolean {
    return this.quizResponse.children.length === 1
  }

  checkRes() {
    if (this.quizResponse) {
      if (typeof this.quizResponse === 'string') {
        return true
      }
    }
    return false
  }

  retryResult() {
    this.fetchResult.emit()
  }
  getQuestionCount(data: any, activeQuestionSet: any) {
    this.activeQuestionSet = activeQuestionSet
    this.selectedQuestionData = data
  }

  updateProgress(value: any) {
    const progress: any = document.querySelector('.circular-progress')
    progress.style.setProperty('--percentage', `${value * 3.6}deg`)
    progress.style.setProperty('--passPercentage', value)
    progress.innerText = `${value}%`
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabelWithoutspace(label, type, '')
  }

  getFinalColumns(displayedColumns: any): string[] {
    const displayColumns = _.map(displayedColumns, c => c.key)
    return displayColumns
  }

  millisecondsToHMS(milleSeconds: any): string {
    const ms = Number(milleSeconds)
    const seconds: number = Math.floor((ms / 1000) % 60);
    const minutes: number = Math.floor((ms / (1000 * 60)) % 60);
    const hours: number = Math.floor((ms / (1000 * 60 * 60)) % 24);

    const hoursStr: string = (hours < 10) ? `0${hours}` : `${hours}`;
    const minutesStr: string = (minutes < 10) ? `0${minutes}` : `${minutes}`;
    const secondsStr: string = (seconds < 10) ? `0${seconds}` : `${seconds}`;

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  }
}
