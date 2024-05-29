import { Component, EventEmitter, Input, OnInit, OnChanges, Output, ViewChild } from '@angular/core'
import { NsContent, MultilingualTranslationsService } from '@sunbird-cb/utils/src/public-api'
import { NSPractice } from '../../practice.model'
import { MatAccordion } from '@angular/material/expansion'
import { MatTableDataSource } from '@angular/material/table'
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

  summaryTableDataSource = new MatTableDataSource([
    {
      subject: 'Section A',
      yourScore: '0.25 / 35',
    },
    {
      subject: 'Section B',
      yourScore: '-1.25 / 35',
    },
    {
      subject: 'Section C',
      yourScore: '-1.25 / 30',
    },
  ])
  summaryTableDisplayeColumns = [
    { header: 'Subject', key: 'subject' },
    { header: 'Your Score', key: 'yourScore' },
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
    { header: 'Subject', key: 'subject' },
    { header: 'Your Score', key: 'yourScore' },
    { header: 'Topper Score', key: 'topperScore' },
  ]

  overAllSummary = [
    {
      imgType: 'icon',
      imgPath: 'speed',
      class: 'icon-bg-blue',
      summary: '-2.25/100',
      summaryType: 'Score',
    },
    {
      imgType: 'img',
      imgPath: '/assets/icons/final-assessment/nest_clock_farsight_analog.svg',
      class: 'icon-bg-lite-green',
      summary: '0:9:8',
      summaryType: 'Time Taken',
    },
    {
      imgType: 'img',
      imgPath: '/assets/icons/final-assessment/assignment.svg',
      class: 'icon-bg-pink',
      summary: '84/100',
      summaryType: 'Attempted',
    },
    {
      imgType: 'icon',
      imgPath: 'check_circle_outline',
      class: 'icon-bg-yellow',
      summary: '15/100',
      summaryType: 'Correct',
    },
    {
      imgType: 'img',
      imgPath: '/assets/icons/final-assessment/target.svg',
      class: 'icon-bg-dark-green',
      summary: '17.86%',
      summaryType: 'Accuracy',
    },
  ]

  scoreSummary = [
    {
      imgType: 'img',
      imgPath: '/assets/icons/final-assessment/nest_clock_farsight_analog.svg',
      class: 'icon-bg-lite-green',
      summary: '0:9:8',
      summaryType: 'Time Taken',
    },
    {
      imgType: 'img',
      imgPath: '/assets/icons/final-assessment/assignment.svg',
      class: 'icon-bg-pink',
      summary: '84/100',
      summaryType: 'Attempted',
    },
    {
      imgType: 'icon',
      imgPath: 'check_circle_outline',
      class: 'icon-bg-yellow',
      summary: '15/100',
      summaryType: 'Correct',
    },
    {
      imgType: 'icon',
      imgPath: 'cancel',
      class: 'icon-bg-red',
      summary: '69',
      summaryType: 'Worning',
    },
  ]

  questionStatuTableDataSource = new MatTableDataSource([
    {
      question: 'Question: 1',
      status: 'Correct',
      questionTagg: 'Easy',
      timeTaken: '00:00:09',
    },
    {
      question: 'Question: 2',
      status: 'Wrong',
      questionTagg: 'Moderate',
      timeTaken: '00:00:09',
    },
    {
      question: 'Question: 3',
      status: 'Correct',
      questionTagg: 'Difficult',
      timeTaken: '00:00:09',
    },
    {
      question: 'Question: 4',
      status: 'Correct',
      questionTagg: 'HOTS',
      timeTaken: '00:00:09',
    },
    {
      question: 'Question: 5',
      status: 'Wrong',
      questionTagg: 'HOTS',
      timeTaken: '00:00:09',
    },
    {
      question: 'Question: 6',
      status: 'Wrong',
      questionTagg: 'Easy',
      timeTaken: '00:00:09',
    },
    {
      question: 'Question: 7',
      status: 'Correct',
      questionTagg: 'Difficult',
      timeTaken: '00:00:09',
    },

  ])
  questionStatuTableColumns = [
    { header: 'Questions', key: 'question' },
    { header: 'Status', key: 'status' },
    { header: 'Question Tagging', key: 'questionTagg' },
    { header: 'Time Taken', key: 'timeTaken' },
  ]

  sectionsList = [
    {
      sectionName: 'Section A',
    },
    {
      sectionName: 'Section B',
    },
    {
      sectionName: 'Section C',
    },
  ]

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
}
