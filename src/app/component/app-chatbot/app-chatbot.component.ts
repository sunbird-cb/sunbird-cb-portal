import { AfterViewChecked, OnChanges, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils-v2'
// import { ChatbotService } from './chatbot.service'
import { RootService } from './../root/root.service'
import { environment } from 'src/environments/environment'
import { NavigationEnd, Router } from '@angular/router'
import { CdkDragEnd } from '@angular/cdk/drag-drop'
import { DialogBoxComponent as ZohoDialogComponent } from '@ws/app/src/lib/routes/profile-v3/components/dialog-box/dialog-box.component'
import { HttpClient } from '@angular/common/http'
import { DomSanitizer } from '@angular/platform-browser'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
@Component({
  selector: 'ws-app-chatbot',
  templateUrl: './app-chatbot.component.html',
  styleUrls: ['./app-chatbot.component.scss'],
  // providers: [ChatbotService]
})
export class AppChatbotComponent implements OnInit, AfterViewChecked, OnChanges {
  @Input() rootOrgId: any
  @Input() iGOTAIConfigLoaded: any
  showIcon = true
  categories: any[] = []
  language: any[] = []
  currentFilter = 'information'
  selectedLaguage = 'en'

  responseData: any
  userInfo: any
  userJourney: any = []
  recomendedQns: any = {}
  questionsAndAns: any = {}
  userIcon = ''
  more = false
  chatInformation: any = []
  chatIssues: any = []
  displayLoader = false
  expanded = false
  callText = ''
  emailText = ''
  enableIGOTAIFlag = false
  dragEnabled = false
  // tslint:disable
  localization: any = {
    'en': {
      'Hi': 'Namaste',
      'information': 'Information',
      'issue': 'Issues',
      'categories': 'Show All Categories',
      'showmore': 'Show More'
    },
    'hi': {
      'Hi': 'नमस्ते',
      'information': 'जानकारी',
      'issue': 'समस्या',
      'categories': 'सभी कैटगोरी दिखायें',
      'showmore': 'और दिखाओ'

    }
  }
  iconPosition = { x: 0, y: 0 }
  // tslint: enable
  // @ViewChild('scrollMe') private myScrollContainer: ElementRef | undefined
  @ViewChild('dragItem') dragElement!: ElementRef
  isHubEnable!: boolean
  chatIconOutside = false
  chatId = ''
  enableSupportAI = false
  zohoHtml: any
  zohoUrl: any = '/assets/static-data/zoho-code.html'
  maximizeChatFlag = true
  fullScreenChatFlag = false
  faqChatBotDisable = true
  footerClassName = 'cb-footer'
  fromTopNavHelp = false
  userDesignation = ''
  constructor(
    private configSvc: ConfigurationsService,
    private eventSvc: EventService,
    private renderer: Renderer2,
    private chatbotService: RootService,
    public http: HttpClient,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        //certificate link check
        this.isHubEnable = (event.url.includes('/certs') || event.url.includes('/public/certs')) ? false : true
      }
    })
    this.userInfo = this.configSvc && this.configSvc.userProfile



    console.log('this.userInfo--', this.userInfo)
    // console.log('this.configSvc.iGOTAIConfig--', this.configSvc.iGOTAIConfig)
    // console.log()
    if (this.rootOrgId && this.iGOTAIConfigLoaded) {
      if (this.userInfo?.professionalDetails && this.userInfo?.professionalDetails?.length) {
        this.userDesignation = this.userInfo?.professionalDetails[0]['designation']?.trim()
      }
      // console.log('this.configSvc.iGOTAIConfig--', this.configSvc.iGOTAIConfig)
      this.currentFilter = 'information'

      if (this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.supportAI && this.configSvc.iGOTAIConfig?.supportAI?.all) {
        this.enableSupportAI = true
        this.currentFilter = 'support-ai'
      } else if (this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.supportAI && this.configSvc.iGOTAIConfig?.supportAI?.forOrg && this.configSvc.iGOTAIConfig?.supportAI?.forOrg?.length
        && this.configSvc.iGOTAIConfig?.supportAI?.forOrg?.includes(this.rootOrgId)
      ) {
        this.enableSupportAI = true
        this.currentFilter = 'support-ai'
      }

      if (this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.iGOTAI && this.configSvc.iGOTAIConfig?.iGOTAI?.all) {
        if (this.configSvc.iGOTAIConfig?.iGOTAI?.allDesignation) {
          this.enableIGOTAIFlag = true
          this.currentFilter = 'sarthi'
        }
        else if (this.configSvc.iGOTAIConfig?.iGOTAI?.forDesignation?.includes(this.userDesignation)) {
          this.enableIGOTAIFlag = true
          this.currentFilter = 'sarthi'
        }

      } else if (this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.iGOTAI && this.configSvc.iGOTAIConfig?.iGOTAI?.forOrg && this.configSvc.iGOTAIConfig?.iGOTAI?.forOrg?.length
        && this.configSvc.iGOTAIConfig?.iGOTAI?.forOrg?.includes(this.rootOrgId)
      ) {
        if (this.configSvc.iGOTAIConfig?.iGOTAI?.allDesignation) {
          this.enableIGOTAIFlag = true
          this.currentFilter = 'sarthi'
        }
        else if (this.configSvc.iGOTAIConfig?.iGOTAI?.forDesignation?.includes(this.userDesignation)) {
          this.enableIGOTAIFlag = true
          this.currentFilter = 'sarthi'
        }
      }

      if (this.fromTopNavHelp && this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.supportAI && this.configSvc.iGOTAIConfig?.supportAI?.all) {
        this.enableSupportAI = true
        this.currentFilter = 'support-ai'
      } else if (this.fromTopNavHelp && this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.supportAI && this.configSvc.iGOTAIConfig?.supportAI?.forOrg && this.configSvc.iGOTAIConfig?.supportAI?.forOrg?.length
        && this.configSvc.iGOTAIConfig?.supportAI?.forOrg?.includes(this.rootOrgId)
      ) {
        this.enableSupportAI = true
        this.currentFilter = 'support-ai'
      }

      if (this.enableSupportAI || this.enableIGOTAIFlag) {
        this.faqChatBotDisable = true
      } else {
        this.faqChatBotDisable = false
      }
      this.getFooterClass()
    }

    this.chatbotService.openSupportAIChatbot.subscribe((data) => {
      if (data) {
        this.fromTopNavHelp = true
        if (this.fromTopNavHelp && this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.supportAI && this.configSvc.iGOTAIConfig?.supportAI?.all) {
          this.enableSupportAI = true
          this.currentFilter = 'support-ai'
        } else if (this.fromTopNavHelp && this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.supportAI && this.configSvc.iGOTAIConfig?.supportAI?.forOrg && this.configSvc.iGOTAIConfig?.supportAI?.forOrg?.length
          && this.configSvc.iGOTAIConfig?.supportAI?.forOrg?.includes(this.rootOrgId)
        ) {
          this.enableSupportAI = true
          this.currentFilter = 'support-ai'
        }
        this.iconClick('start')
      } else {
        this.fromTopNavHelp = false
      }
    })

    this.checkForApiCalls()
    this.enableScroll()
    // tslint:disable-next-line: max-line-length
    this.userIcon = this.userInfo && this.userInfo.profileImage ? this.userInfo.profileImage : '/assets/icons/chatbot-default-user.svg'
    const email = environment.supportEmail || 'mission.karmayogi@gov.in'
    this.callText = `<a class='hint-text' target='_blank' href='https://bit.ly/44MJlo4'>Teams Call</a>&nbsp;`
    this.emailText = `<a class='hint-text' target='_blank' href='mailto:${email}'>${email}.</a>`
    this.http.get(this.zohoUrl, { responseType: 'text' }).subscribe((res: any) => {
      this.zohoHtml = this.sanitizer.bypassSecurityTrustHtml(res)
    })
  }

  ngOnChanges() {
    if (this.rootOrgId && this.iGOTAIConfigLoaded) {
      // console.log('this.configSvc.iGOTAIConfig--', this.configSvc.iGOTAIConfig)
      this.currentFilter = 'information'
      this.userInfo = this.configSvc && this.configSvc.userProfile
      if (this.userInfo?.professionalDetails && this.userInfo?.professionalDetails?.length) {
        this.userDesignation = this.userInfo?.professionalDetails[0]['designation']?.trim()
      }

      if (this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.supportAI && this.configSvc.iGOTAIConfig?.supportAI?.all) {
        this.enableSupportAI = true
        this.currentFilter = 'support-ai'
      } else if (this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.supportAI && this.configSvc.iGOTAIConfig?.supportAI?.forOrg && this.configSvc.iGOTAIConfig?.supportAI?.forOrg?.length
        && this.configSvc.iGOTAIConfig?.supportAI?.forOrg?.includes(this.rootOrgId)
      ) {
        this.enableSupportAI = true
        this.currentFilter = 'support-ai'
      }

      if (this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.iGOTAI && this.configSvc.iGOTAIConfig?.iGOTAI?.all) {
        if (this.configSvc.iGOTAIConfig?.iGOTAI?.allDesignation) {
          this.enableIGOTAIFlag = true
          this.currentFilter = 'sarthi'
        }
        else if (this.configSvc.iGOTAIConfig?.iGOTAI?.forDesignation?.includes(this.userDesignation)) {
          this.enableIGOTAIFlag = true
          this.currentFilter = 'sarthi'
        }
      } else if (this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.iGOTAI && this.configSvc.iGOTAIConfig?.iGOTAI?.forOrg && this.configSvc.iGOTAIConfig.iGOTAI?.forOrg?.length
        && this.configSvc.iGOTAIConfig?.iGOTAI?.forOrg?.includes(this.rootOrgId)
      ) {
        if (this.configSvc.iGOTAIConfig?.iGOTAI?.allDesignation) {
          this.enableIGOTAIFlag = true
          this.currentFilter = 'sarthi'
        }
        else if (this.configSvc.iGOTAIConfig?.iGOTAI?.forDesignation?.includes(this.userDesignation)) {
          this.enableIGOTAIFlag = true
          this.currentFilter = 'sarthi'
        }
      }

      if (this.fromTopNavHelp && this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.supportAI && this.configSvc.iGOTAIConfig?.supportAI?.all) {
        this.enableSupportAI = true
        this.currentFilter = 'support-ai'
      } else if (this.fromTopNavHelp && this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.supportAI && this.configSvc.iGOTAIConfig?.supportAI?.forOrg && this.configSvc.iGOTAIConfig?.supportAI?.forOrg?.length
        && this.configSvc.iGOTAIConfig?.supportAI?.forOrg?.includes(this.rootOrgId)
      ) {
        this.enableSupportAI = true
        this.currentFilter = 'support-ai'
      }

      if (this.enableSupportAI || this.enableIGOTAIFlag) {
        this.faqChatBotDisable = true
      } else {
        this.faqChatBotDisable = false
      }
      this.getFooterClass()
    }
  }

  greetings() {
    return this.localization[this.selectedLaguage]['Hi'] || 'Hi'
  }

  getInfoText(label: string) {
    return this.localization[this.selectedLaguage][label] || label
  }

  showMore() {
    return this.localization[this.selectedLaguage]['showmore'] || 'Show More'
  }

  getData() {
    const lang: any = {
      information: 'IN',
      issue: 'IS'
    }
    const tabType: any = {
      lang: this.selectedLaguage,
      config_type: lang[this.currentFilter]
    }
    this.displayLoader = false
    this.chatbotService.getChatData(tabType).subscribe((res: any) => {
      if (res && res.payload && res.payload.config) {
        this.setDataToLocalStorage(res.payload.config)
        this.checkForApiCalls()
        // this.initData(res.payload.config)
        this.displayLoader = false
      }
    })
  }
  setDataToLocalStorage(data: any) {
    let localObject: any = {}
    localObject = JSON.parse(localStorage.getItem('faq') || '{}')
    localObject[this.selectedLaguage] = { ...localObject[this.selectedLaguage], [this.currentFilter]: data }
    localStorage.setItem('faq', JSON.stringify(localObject))
    this.toggleFilter(this.currentFilter === 'information' ? 'information' : this.currentFilter)
  }

  initData(_getData: any) {
    // tslint:disable-next-line
    // console.log(getData)
    this.userJourney = []
    let userDetails: any = {
      type: 'incoming',
      message: '', //` Hi ${this.userInfo && this.userInfo.firstName || ''}, I'm KarmaSahayogi - Digital Assistant, I'm here to help you.`,
      recommendedQues: this.getPriorityQuestion(1),
      selectedValue: '',
      title: '',//'Here are the most frequently asked questions users have looked for',
      tab: 'information',
    }

    this.pushData(userDetails)
    // this.pushData(userDetailsForIssues)
    this.getQns()
  }
  getQns() {
    this.responseData.quesMap.map((q: any) => {
      this.questionsAndAns[q.quesId] = q
    })
  }

  selectLaguage(event: any) {
    this.selectedLaguage = event.target.value
    localStorage.setItem('selectedLanguage', event.target.value)
    this.chatInformation = []
    this.chatIssues = []
    this.checkForApiCalls()
  }

  readFromLocalStorage() {
    let localStg: any = localStorage.getItem('result')
    if (localStg) {
      if (this.currentFilter === 'information') {
        this.responseData = JSON.parse(localStg)[this.selectedLaguage].information
      } else {
        this.responseData = JSON.parse(localStg)[this.selectedLaguage].issue
      }
    }
  }

  goToBottom() {
    window.scrollTo(0, document.body.scrollHeight)
  }

  iconClick(type: string) {
    this.fullScreenChatFlag = false
    this.maximizeChatFlag = true
    if (!this.dragEnabled) {
      this.showIcon = !this.showIcon
      // if(this.fromTopNavHelp && this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig.supportAI) {
      //   this.enableSupportAI = true
      //   this.currentFilter = 'support-ai'
      // } else {
      //   this.currentFilter = this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig.iGOTAI ? 'sarthi' : 'information'
      // }
      this.currentFilter = 'information'
      if (this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.supportAI && this.configSvc.iGOTAIConfig?.supportAI?.all) {
        this.enableSupportAI = true
        this.currentFilter = 'support-ai'
      } else if (this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.supportAI && this.configSvc.iGOTAIConfig?.supportAI?.forOrg && this.configSvc.iGOTAIConfig?.supportAI?.forOrg?.length
        && this.configSvc.iGOTAIConfig?.supportAI?.forOrg?.includes(this.rootOrgId)
      ) {
        this.enableSupportAI = true
        this.currentFilter = 'support-ai'
      }

      if (this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.iGOTAI && this.configSvc.iGOTAIConfig?.iGOTAI?.all) {
        if (this.configSvc.iGOTAIConfig?.iGOTAI?.allDesignation) {
          this.enableIGOTAIFlag = true
          this.currentFilter = 'sarthi'
        }
        else if (this.configSvc.iGOTAIConfig?.iGOTAI?.forDesignation?.includes(this.userDesignation)) {
          this.enableIGOTAIFlag = true
          this.currentFilter = 'sarthi'
        }
      } else if (this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.iGOTAI && this.configSvc.iGOTAIConfig?.iGOTAI?.forOrg && this.configSvc.iGOTAIConfig?.iGOTAI?.forOrg?.length
        && this.configSvc.iGOTAIConfig?.iGOTAI?.forOrg?.includes(this.rootOrgId)
      ) {
        if (this.configSvc.iGOTAIConfig?.iGOTAI?.allDesignation) {
          this.enableIGOTAIFlag = true
          this.currentFilter = 'sarthi'
        }
        else if (this.configSvc.iGOTAIConfig?.iGOTAI?.forDesignation?.includes(this.userDesignation)) {
          this.enableIGOTAIFlag = true
          this.currentFilter = 'sarthi'
        }
      }

      if (this.fromTopNavHelp && this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.supportAI && this.configSvc.iGOTAIConfig?.supportAI?.all) {
        this.enableSupportAI = true
        this.currentFilter = 'support-ai'
      } else if (this.fromTopNavHelp && this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.supportAI && this.configSvc.iGOTAIConfig?.supportAI?.forOrg && this.configSvc.iGOTAIConfig?.supportAI?.forOrg?.length
        && this.configSvc.iGOTAIConfig?.supportAI?.forOrg?.includes(this.rootOrgId)
      ) {
        this.enableSupportAI = true
        this.currentFilter = 'support-ai'
      }
      this.expanded = false
      if (type === 'start') {
        const timestamp = Date.now()
        this.chatId = `${this.configSvc.unMappedUser.userId}-${timestamp}`
        this.chatbotService.iGOTAIChatHistory = []
        this.disableScroll()
        this.raiseChatStartTelemetry()
        // this.toggleFilter(this.currentFilter)
      } else {
        this.chatId = ''
        this.chatbotService.iGOTAIChatHistory = []
        this.raiseChatEndTelemetry()
        this.userJourney = []
        this.chatInformation = []
        this.chatIssues = []
        this.selectedLaguage = 'en'
        this.currentFilter = 'information'
        //this.currentFilter = this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig.iGOTAI ? 'sarthi' : 'information'
        if (this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.iGOTAI && this.configSvc.iGOTAIConfig?.iGOTAI?.all) {
          //this.enableIGOTAIFlag = true

          if (this.configSvc.iGOTAIConfig?.iGOTAI?.allDesignation) {
            this.currentFilter = 'sarthi'
          }
          else if (this.configSvc.iGOTAIConfig?.iGOTAI?.forDesignation?.includes(this.userDesignation)) {
            this.currentFilter = 'sarthi'
          }
        } else if (this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.iGOTAI && this.configSvc.iGOTAIConfig?.iGOTAI?.forOrg && this.configSvc.iGOTAIConfig?.iGOTAI?.forOrg?.length
          && this.configSvc.iGOTAIConfig?.iGOTAI?.forOrg?.includes(this.rootOrgId)
        ) {
          // this.enableIGOTAIFlag = true
          if (this.configSvc.iGOTAIConfig?.iGOTAI?.allDesignation) {
            this.currentFilter = 'sarthi'
          }
          else if (this.configSvc.iGOTAIConfig?.iGOTAI?.forDesignation?.includes(this.userDesignation)) {
            this.currentFilter = 'sarthi'
          }
        }
        this.checkForApiCalls()
        this.more = false

        this.enableScroll()
      }
    }

  }

  toggleFilter(tab: string) {
    this.currentFilter = tab
    this.checkForApiCalls()
    this.more = false
  }

  selectedQuestion(question: any, data: any) {
    data.selectedValue = question.quesID
    const sendMsg = {
      type: 'sendMsg',
      question: this.questionsAndAns[question.quesID].quesValue,
      tab: this.currentFilter,
    }

    const incomingMsg = {
      type: 'incoming',
      // tslint:disable-next-line:max-line-length
      message: this.questionsAndAns[question.quesID].ansVal.replace('<teams_call_link>', this.callText).replace('<email_configuration>', this.emailText),
      recommendedQues: question.recommendedQues || [],
      title: '', // 'Questions related to',
      relatedQes: 'above Question',
      tab: this.currentFilter,
    }
    this.pushData(sendMsg)
    this.pushData(incomingMsg)
    setTimeout(() => {
      this.scrollToBottom()
    }, 100)
    this.raiseTemeletyInterat(question.quesID)
  }

  pushData(msg: any) {
    this.userJourney = []
    if (this.currentFilter === 'information') {
      this.chatInformation.push(msg)
      this.userJourney = this.chatInformation
    } else {
      this.chatIssues.push(msg)
      this.userJourney = this.chatIssues
    }
  }

  getuserjourney(tab: string) {
    return this.userJourney.filter((j: any) => j.tab === tab)
  }

  getPriorityQuestion(priority: any) {
    const recommendedQues: any[] = []
    const isLogedIn: string = this.userInfo ? 'Logged-In' : 'Not Logged-In'
    this.responseData.recommendationMap.map((question: any) => {
      question.recommendedQues.map((ques: any) => {
        if (ques.priority === priority && (question.categoryType === isLogedIn || question.categoryType === 'Both')) {
          recommendedQues.push(ques)
        }
      })
    })
    return recommendedQues
  }

  showMoreQuestion() {
    const showMoreQes: any = {
      type: 'incoming',
      message: '',
      recommendedQues: this.getPriorityQuestion(1),
      selectedValue: '',
      title: '', //'Showing more questions',
    }
    this.pushData(showMoreQes)
  }

  showCategory(catItem: any) {
    let incomingMsg = {
      type: 'category',
      message: '',
      recommendedQues: [],
      title: '', //' What do you want to know under',
      relatedQes: `${catItem.catName}?`,
      tab: this.currentFilter,
    }
    this.more = false
    if (catItem.catId === 'all') {
      incomingMsg.title = '', // 'Here is the list of all the topics'
        incomingMsg.relatedQes = ''
      incomingMsg.recommendedQues = this.sortCategory()
    } else {
      this.responseData.recommendationMap.forEach((element: any) => {
        if (catItem.catId === element.catId) {
          incomingMsg.type = 'incoming',
            incomingMsg.recommendedQues = element.recommendedQues
        }
      })
      this.raiseCategotyTelemetry(catItem.catId)
    }
    const sendMsg = {
      type: 'sendMsg',
      question: catItem.catName,
    }
    this.pushData(sendMsg)
    this.pushData(incomingMsg)
    setTimeout(() => {
      this.scrollToBottom()
    }, 100)
  }

  raiseCategotyTelemetry(catItem: string) {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click', id: catItem },
        object: { id: catItem, type: 'Category' },
        state: WsEvents.EnumTelemetrySubType.Interact,
        eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
        mode: 'view',
      },
      pageContext: { pageId: '/chatbot', module: 'Assistant' },
      from: '',
      to: 'Telemetry',
    }
    this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  raiseChatStartTelemetry() {
    if (this.currentFilter !== 'sarthi') {
      const event = {
        eventType: WsEvents.WsEventType.Telemetry,
        eventLogLevel: WsEvents.WsEventLogLevel.Info,
        data: {
          edata: { type: '' },
          object: { type: 'zse', id: 'asd' },
          state: WsEvents.EnumTelemetrySubType.Loaded,
          eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
          type: 'session',
          mode: 'view',
        },
        pageContext: { pageId: '/chatbot', module: 'Assistant' },
        from: '',
        to: 'Telemetry',
      }
      this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
    } else {
      const event = {
        eventType: WsEvents.WsEventType.Telemetry,
        eventLogLevel: WsEvents.WsEventLogLevel.Info,
        data: {
          edata: { type: 'click', "id": "ai-global-search", "pageid": "/page/home" },
          object: {},
          state: WsEvents.EnumTelemetrySubType.Loaded,
          eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
          mode: 'view',
        },
        pageContext: { pageId: '/page/home', module: 'Home' },
        from: '',
        to: 'Telemetry',
      }
      this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)

      if (this.enableSupportAI) {
        const event = {
          eventType: WsEvents.WsEventType.Telemetry,
          eventLogLevel: WsEvents.WsEventLogLevel.Info,
          data: {
            edata: { type: 'click', "id": "ai-support-search", "pageid": "/page/home" },
            object: {},
            state: WsEvents.EnumTelemetrySubType.Loaded,
            eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
            mode: 'view',
          },
          pageContext: { pageId: '/page/home', module: 'Home' },
          from: '',
          to: 'Telemetry',
        }
        this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
      }
    }

  }

  raiseChatEndTelemetry() {
    if (this.currentFilter !== 'sarthi') {
      const event = {
        eventType: WsEvents.WsEventType.Telemetry,
        eventLogLevel: WsEvents.WsEventLogLevel.Info,
        data: {
          edata: { type: '' },
          object: {},
          state: WsEvents.EnumTelemetrySubType.Unloaded,
          eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
          type: 'session',
          mode: 'view',
        },
        pageContext: { pageId: '/chatbot', module: 'Assistant' },
        from: '',
        to: 'Telemetry',
      }
      this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
    } else {
      const event = {
        eventType: WsEvents.WsEventType.Telemetry,
        eventLogLevel: WsEvents.WsEventLogLevel.Info,
        data: {
          edata: { type: 'click', "id": "ai-global-search", "pageid": "/page/home" },
          object: {},
          state: WsEvents.EnumTelemetrySubType.Unloaded,
          eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
          mode: 'view',
        },
        pageContext: { pageId: '/page/home', module: 'Home' },
        from: '',
        to: 'Telemetry',
      }
      console.log('event--', event)
      this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
      if (this.enableSupportAI) {
        const event = {
          eventType: WsEvents.WsEventType.Telemetry,
          eventLogLevel: WsEvents.WsEventLogLevel.Info,
          data: {
            edata: { type: 'click', "id": "ai-support-search", "pageid": "/page/home" },
            object: {},
            state: WsEvents.EnumTelemetrySubType.Unloaded,
            eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
            mode: 'view',
          },
          pageContext: { pageId: '/page/home', module: 'Home' },
          from: '',
          to: 'Telemetry',
        }
        console.log('event--', event)
        this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
      }
    }

  }

  raiseTemeletyInterat(idn: string) {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click', id: idn },
        object: { id: idn, type: this.currentFilter.charAt(0).toUpperCase() + this.currentFilter.slice(1) },
        state: WsEvents.EnumTelemetrySubType.Interact,
        eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
        mode: 'view'
      },
      pageContext: { pageId: '/chatbot', module: 'Assistant' },
      from: '',
      to: 'Telemetry',
    }
    this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  checkForApiCalls() {

    this.selectedLaguage = localStorage.getItem('selectedLanguage') || 'en'
    let localStg: any = JSON.parse(localStorage.getItem('faq') || '{}')
    let languageStg: any = JSON.parse(localStorage.getItem('faq-languages') || '{}')
    if (languageStg.length > 0) {
      this.language = languageStg
    } else {
      this.getLanguages()
    }

    if (localStg && languageStg) {
      if (localStg[this.selectedLaguage] && localStg[this.selectedLaguage][this.currentFilter]) {
        const localStorageData = localStg[this.selectedLaguage][this.currentFilter]
        this.userJourney = []
        if (this.currentFilter === 'information') {
          if (this.chatInformation.length === 0) {
            this.responseData = localStorageData
            this.initData(localStorageData)
          } else {
            this.responseData = localStorageData
            this.userJourney = this.chatInformation
          }
        } else {
          if (this.chatIssues.length === 0) {
            this.responseData = localStorageData
            this.initData(localStorageData)
          } else {
            this.responseData = localStorageData
            this.userJourney = this.chatIssues
          }
        }
        this.getQns()
        this.getCategories()
      } else {
        this.getLanguages()
        // this.getData()
      }
    }
  }
  getCategories() {
    this.categories = [{ catId: 'all', catName: this.localization[this.selectedLaguage]['categories'], priority: 0 }]
    const categories: any = []
    const isLogedIn: string = this.userInfo ? 'Logged-In' : 'Not Logged-In'
    this.responseData.recommendationMap.map((catandques: any) => {
      this.responseData.categoryMap.map((cat: any) => {
        if (catandques.catId === cat.catId && (catandques.categoryType === isLogedIn || catandques.categoryType === 'Both')) {
          const category = {
            catId: cat.catId,
            catName: cat.catName,
            priority: catandques.priority,
            categoryType: catandques.categoryType,
          }
          categories.push(category)
        }
      })
    })
    if (categories.length < 6) {
      this.categories = categories
    } else {
      this.categories = [...this.categories, ...categories]
    }
  }
  sortCategory(): any {
    // tslint:disable-next-line: max-line-length
    return this.categories.sort((a: any, b: any) => a['priority'] > b['priority'] ? 1 : a['priority'] === b['priority'] ? 0 : -1)
  }

  getLanguages() {
    this.displayLoader = false
    this.chatbotService.getLangugages().subscribe((resp: any) => {
      if (resp && resp.status && resp.status.code === 200) {
        this.language = resp.payload.languages
        localStorage.setItem('faq-languages', JSON.stringify(resp.payload.languages))
        localStorage.setItem('selectedLanguage', this.selectedLaguage)
        this.getData()
        this.displayLoader = false
      }
    })
  }

  ngAfterViewChecked() {
    if (this.currentFilter !== 'sarthi' && this.currentFilter !== 'support-ai') {
      let chatbotContent = document.getElementById('chatbot-content')
      if (chatbotContent) {
        chatbotContent.scrollTo({ top: chatbotContent.scrollHeight, behavior: 'smooth' })
      }
    }
  }
  scrollToBottom(): void {
    try {
      let chatbotContent = document.getElementById('chatbot-wrapper')
      if (chatbotContent) {
        chatbotContent.scrollTo({ top: chatbotContent.scrollHeight, behavior: 'smooth' })
      }
    } catch (err) { }
  }

  scrollToBottomEvent() {
    let chatbotContent = document.getElementById('chatbot-content')
    if (chatbotContent) {
      chatbotContent.scrollTo({ top: chatbotContent.scrollHeight, behavior: 'smooth' })
    }
    //  this.scrollToBottom()
  }
  clickOutside() {
    if (this.enableIGOTAIFlag || this.enableSupportAI) {
    } else {
      this.iconClick('end')
    }
  }
  private disableScroll() {
    this.renderer.addClass(document.body, 'disable-scroll')
  }

  private enableScroll() {
    this.renderer.removeClass(document.body, 'disable-scroll')
  }

  onDragEnded(event: CdkDragEnd) {
    const point = event.source.getFreeDragPosition()
    // const element = this.dragItem.nativeElement;
    // element.style.transform = 'none';

    // Optional: reset internal transform tracking
    const dragRef = event.source._dragRef
    if (dragRef && this.chatIconOutside) {
      dragRef.reset() // resets internal position tracking
    } else {
      this.iconPosition = point
    }
    setTimeout(() => {
      this.dragEnabled = false
    }, 0)

  }

  onDragMoved() {
    this.dragEnabled = true
    const rect = this.dragElement.nativeElement.getBoundingClientRect()

    const isOutside =
      rect.top < 0 ||
      rect.left < 0 ||
      rect.bottom > (window.innerHeight || document.documentElement.clientHeight) ||
      rect.right > (window.innerWidth || document.documentElement.clientWidth)
    if (isOutside) {
      this.chatIconOutside = true
    } else {
      this.chatIconOutside = false
    }
  }

  getZohoForm() {
    const dialogRef = this.dialog.open(ZohoDialogComponent, {
      width: '45%',
      data: {
        view: 'zohoform',
        value: this.zohoHtml,
      },
    })
    dialogRef.afterClosed().subscribe(() => {
    })
    setTimeout(() => {
      this.callXMLRequest()
    }, 0)
  }

  callXMLRequest() {
    let webFormxhr: any = {}
    webFormxhr = new XMLHttpRequest()
    // tslint:disable-next-line: prefer-template
    webFormxhr.open('GET', 'https://desk.zoho.in/support/GenerateCaptcha?action=getNewCaptcha&_=' + new Date().getTime(), true)
    webFormxhr.onreadystatechange = () => {
      if (webFormxhr.readyState === 4 && webFormxhr.status === 200) {
        try {
          const response = (webFormxhr.responseText != null) ? JSON.parse(webFormxhr.responseText) : ''
          const zsCaptchaUrl: any = document.getElementById('zsCaptchaUrl')
          if (zsCaptchaUrl) {
            zsCaptchaUrl.src = response.captchaUrl
            zsCaptchaUrl.style.display = 'block'
          }
          const xJdfEaS: any = document.getElementsByName('xJdfEaS')[0]
          xJdfEaS.value = response.captchaDigest
          const zsCaptchaLoading: any = document.getElementById('zsCaptchaLoading')
          zsCaptchaLoading.style.display = 'none'
          const zsCaptcha: any = document.getElementById('zsCaptcha')
          zsCaptcha.style.display = 'block'
          const refreshCaptcha: any = document.getElementById('refreshCaptcha')
          if (refreshCaptcha) {
            refreshCaptcha.addEventListener('click', () => {
              this.callXMLRequest()
            })
          }
        } catch (e) {
        }
      }
    }
    webFormxhr.send()
  }

  minimizeChat() {
    this.maximizeChatFlag = false
    this.fullScreenChatFlag = false
  }

  maximizeChat() {
    this.maximizeChatFlag = true
    this.fullScreenChatFlag = false
  }

  fullScreenChat() {
    this.fullScreenChatFlag = true
  }

  fullScreenExitChat() {
    this.fullScreenChatFlag = false
    this.maximizeChatFlag = true
  }

  getFooterClass() {
    if (this.enableSupportAI && this.enableIGOTAIFlag) {
      this.footerClassName = 'cb-footer-with-support-ai'
    } else if (!this.enableSupportAI && this.enableIGOTAIFlag) {
      this.footerClassName = 'cb-footer-with-ai'
    } else if (this.enableSupportAI && !this.enableIGOTAIFlag) {
      this.footerClassName = 'cb-footer-with-ai-support-only'
    } else if (!this.enableSupportAI && !this.enableIGOTAIFlag) {
      this.footerClassName = 'cb-footer'
    }
  }

}
