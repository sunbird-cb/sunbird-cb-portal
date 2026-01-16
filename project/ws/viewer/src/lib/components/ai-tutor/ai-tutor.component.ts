import { AfterViewChecked, AfterViewInit, Component,ElementRef,EventEmitter,Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ConfigurationsService, EventService, UtilityService, WsEvents } from '@sunbird-cb/utils-v2';
import { RootService } from 'src/app/component/root/root.service';
import { environment } from 'src/environments/environment';
import { WebSocketService } from './socket.service';
import { Subscription } from 'rxjs';
import { NonReleventFeedbackDialogComponent } from '@sunbird-cb/collection/src/lib/_common/non-relevent-feedback-dialog/non-relevent-feedback-dialog.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
// import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import cloneDeep from 'lodash/cloneDeep';
import { MatSnackBar as MatSnackbarNew } from '@angular/material/snack-bar'

@Component({
  selector: 'viewer-ai-tutor',
  templateUrl: './ai-tutor.component.html',
  styleUrls: ['./ai-tutor.component.scss']
})
export class AiTutorComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() from = ''
  @Input() content:any
  @Input() userJourney = []
  showIcon = true
  categories: any[] = []
  language: any[] = []
  currentFilter = 'information'
  selectedLaguage = 'en'

  responseData: any
  userInfo: any
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
  searchQueryAItutor: any = ''
  initials:any
  copiedIndex = -1
  public circleColor!: string
  random = Math.random().toString(36).slice(2)
  iGOTAITutorResultArr:any = []
  maximize = true
  // tslint:disable
  localization: any = {
    'en' : {
      'Hi' : 'Namaste',
      'information': 'Information',
      'issue': 'Issues',
      'categories': 'Show All Categories',
      'showmore': 'Show More'
    },
    'hi' : {
      'Hi' : 'नमस्ते',
      'information': 'जानकारी',
      'issue': 'समस्या',
      'categories': 'सभी कैटगोरी दिखायें',
      'showmore': 'और दिखाओ'

    }
  }

  private colors = [
    '#EB7181', // red
    '#306933', // green
    '#000000', // black
    '#3670B2', // blue
    '#4E9E87',
    '#7E4C8D',
  ]

  private randomcolors = [
    '#EB7181', // red
    '#006400', // green
    '#000000', // black
    '#3670B2', // blue
    '#4E9E87',
    '#7E4C8D',
  ]

  aiTutorResult:any

  private messageSubscription: Subscription | undefined;
  public messages: string[] = [];
  public inputMessage: string = '';

  aiTutorResultArr:any = []
  cloneSearchQuery = ''
  jwtToken = ''
  // tslint: disable
 // @ViewChild('scrollMe') private myScrollContainer: ElementRef | undefined
  isHubEnable!: boolean
  learningStyle = [
    { title: 'None', subtitle: 'Learn with Natural query process' },
    { title: 'Socratic Style', subtitle: 'Explore ideas through thoughtful questions.' },
    { title: 'Storytelling', subtitle: 'Learn through relatable narratives and real-life examples.' },
  ]
  selectedLearningStyle :any
  resultFetch = false
  authTokenHost = ''
  NoneSocketHost = ''
  SocraticeStyleHost = ''
  StorytellingHost = ''
  @ViewChild('autoResizeTextarea') textArea!: ElementRef<HTMLTextAreaElement>;
  @Output() closeAIPopup = new EventEmitter<any>()
  containerHeight = 38;
  isMobile = false
  showAITutorPopup = false
  chatId = ''
  constructor(
    private route: ActivatedRoute,
    private configSvc: ConfigurationsService,
    private eventSvc: EventService,
    private renderer: Renderer2,
    private chatbotService: RootService,
    private websocketService: WebSocketService,
    private dialog: MatDialog,
    private matSnackBarNew: MatSnackbarNew,
    private utilitySvc: UtilityService,
    private router: Router) { 
      this.selectedLearningStyle = this.learningStyle[0]
    }

  ngOnInit() {
    this.isMobile = this.utilitySvc.isMobile
    if (environment?.sitePath?.includes('portal.igotkarmayogi.gov.in')) {
      this.authTokenHost = 'learning-ai.prod.karmayogibharat.net'
      this.NoneSocketHost = 'learning-ai.prod.karmayogibharat.net'
      this.SocraticeStyleHost = 'learning-ai.prod.karmayogibharat.net'
      this.StorytellingHost = 'learning-ai.prod.karmayogibharat.net'
    } else {
      this.authTokenHost = 'learning-ai.uat.karmayogibharat.net'
      this.NoneSocketHost = 'learning-ai.uat.karmayogibharat.net'
      this.SocraticeStyleHost = 'learning-ai.uat.karmayogibharat.net'
      this.StorytellingHost = 'learning-ai.uat.karmayogibharat.net'
    }
    this.userInfo = this.configSvc && this.configSvc.userProfile
    this.websocketService.getJWTToken().subscribe((data:any)=>{
      if(data && data['x-authenticated-user-token']) {
        this.jwtToken = data['x-authenticated-user-token']
        //wss://learning-ai.uat.karmayogibharat.net/socratic/v1/
        this.websocketService.connect(`wss://${this.authTokenHost}/ws?token=${this.jwtToken}`);
      }
      
    })

    //let jwtToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJhMTk5WXh3UkxNQWpBb3JVRmJUSkl4YjZDWE1JdUk4WVp4Y0pLaGxMdHQwIn0.eyJqdGkiOiI4ZWQ2MzE1Yi02OGQ1LTRhZDktYWU3MC1hYzRiNjZmNjIzOWIiLCJleHAiOjE3NDQ4NTM3NDMsIm5iZiI6MCwiaWF0IjoxNzQ0ODEwNTQzLCJpc3MiOiJodHRwczovL3BvcnRhbC51YXQua2FybWF5b2dpYmhhcmF0Lm5ldC9hdXRoL3JlYWxtcy9zdW5iaXJkIiwic3ViIjoiZjo5MWVjOTVkMi1hM2Q1LTQxM2UtYjRlNC01M2IwZGNjOTY0ODU6Y2VlYzAyYzYtYzE5MS00OWZlLTg0NTYtNjYyNDVhOWE3ODM1IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWRtaW4tY2xpIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiYjUyNTliYmMtZDVjYy00YWJkLThjY2UtZThlZTZiYjA4NGYyIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjQyMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInNjb3BlIjoiIiwib3JnIjoiMDEzMzc4MzA5NTgyMzgxMDU2MCIsIm5hbWUiOiJTcHYgQWRtaW4iLCJ1c2VyX3JvbGVzIjpbIk1FTlRPUiIsIlBVQkxJQyIsIlNQVl9BRE1JTiJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzcHZhZG1pbl9qZzJ5IiwiZ2l2ZW5fbmFtZSI6IlNwdiBBZG1pbiIsImZhbWlseV9uYW1lIjoiIiwiZW1haWwiOiJzcCoqKioqKioqKioqQHlvcG1haWwuY29tIn0.naO_FUNci_ImWHQIylfmMGI2B-85koIyb9Sfy0mOguPpLIKeiGZiLZvccP_I_1QUScBewOrrP3fYxeq8oU98dj7sQGmBFOoU1dSZClZce3U4QEjSiugcbxdiNHcQXlpZTyub5aAJE-ub9Hb1bhS_RQjTMUeDfh5wrlZz6Lqg7kdDh5esXFLibfnUcFqmFFqZBtN5iP2sbRCnCFyS1Vw5TEFKxTiGdRPYT-XUzNE_iZuQPm2z-zyK0FEc1E9odaiwwpW5hkn3TznDwwXe7VdJS2E-HtjujmI-naAqZ__R68SuLyRHuq_PGhj2TZ_rjoaVIhjlgiFqHfOVLUsRat8HpA'
    
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        //certificate link check
        this.isHubEnable = (event.url.includes('/certs') || event.url.includes('/public/certs')) ? false : true;
      }
    })
    this.userInfo = this.configSvc && this.configSvc.userProfile
    // this.aiGlobalSearch()
    this.checkForApiCalls()
    this.enableScroll()
    // tslint:disable-next-line: max-line-length
    this.userIcon = this.userInfo && this.userInfo.profileImageUrl ? this.userInfo.profileImageUrl : ''
    if(!this.userInfo.profileImageUrl && this.userInfo && this.userInfo.firstName) {
      this.createInititals(this.userInfo.firstName)
    }
    const email = environment.supportEmail || 'mission.karmayogi@gov.in'
    this.callText = `<a class='hint-text' target='_blank' href='https://bit.ly/44MJlo4'>Teams Call</a>&nbsp;`
    this.emailText = `<a class='hint-text' target='_blank' href='mailto:${email}'>${email}.</a>`

    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click',  "id": "ai-tutor-card-content", "pageid": `viewer/${this.content}`, "subType" :   this.selectedLearningStyle.title  },
        object: { id: this.content},
        state: WsEvents.EnumTelemetrySubType.Loaded,
        eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
        mode: 'view',
      },
      pageContext: {pageId: `viewer/${this.content}`, module: 'Learn'},
      from: '',
      to: 'Telemetry',
    }
    this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
    const timestamp = Date.now();
    this.chatId = `${this.configSvc.unMappedUser.userId}-${timestamp}`
  }

  ngAfterViewInit(): void {
    this.resizeTextarea(this.textArea?.nativeElement,'');
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
    this.displayLoader = true
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
    localObject = JSON.parse(localStorage.getItem('faq')|| '{}')
    localObject[this.selectedLaguage] = {...localObject[this.selectedLaguage], [this.currentFilter] : data}
    localStorage.setItem('faq', JSON.stringify(localObject))
    this.toggleFilter(this.currentFilter === 'information' ? 'information': this.currentFilter)
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
    this.chatInformation=[]
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
    this.showIcon = !this.showIcon
    this.currentFilter = 'information'
    this.expanded = false
    if (type === 'start') {
      this.disableScroll()
      this.raiseChatStartTelemetry()
      // this.toggleFilter(this.currentFilter)
    } else {
      this.raiseChatEndTelemetry()
      this.userJourney = []
      this.chatInformation = []
      this.chatIssues = []
      this.selectedLaguage = 'en'
      this.currentFilter = 'information'
      this.checkForApiCalls()
      this.more = false
      this.enableScroll()
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
      question.recommendedQues.map((ques: any)=> {
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
    this.more= false
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
      pageContext: {pageId: '/chatbot', module: 'Assistant'},
      from: '',
      to: 'Telemetry',
    }
    this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  raiseChatStartTelemetry() {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: '' },
        object: { type: 'zse', id: 'asd'},
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
  }

  raiseChatEndTelemetry() {
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
  }

  raiseTemeletyInterat(idn: string) {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click', id: idn },
        object: {id: idn, type: this.currentFilter.charAt(0).toUpperCase() + this.currentFilter.slice(1)},
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

  checkForAIQuestionResponse() {

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
    this.displayLoader = true
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
  //  this.scrollToBottom()
  }
  scrollToBottom(): void {
    let messageContainer = document.getElementById('container-none')
    if(messageContainer) {
      messageContainer.scrollTo({top: messageContainer.scrollHeight, behavior: 'smooth'})
    }
    
    
   
  }
  clickOutside() {
    this.iconClick('end')
  }
  private disableScroll() {
    this.renderer.addClass(document.body, 'disable-scroll')
  }

  private enableScroll() {
    this.renderer.removeClass(document.body, 'disable-scroll')
  }

  submitSearchQuery(textArea: HTMLTextAreaElement, event:any) {
    if (!this.searchQueryAItutor.trim()) {
      event.preventDefault(); // Prevents Enter key from adding a new line
    }
    if(!this.searchQueryAItutor.trim()) {
      return false
    }
    this.cloneSearchQuery = ''
    this.cloneSearchQuery = cloneDeep(this.searchQueryAItutor);
    this.searchQueryAItutor = this.searchQueryAItutor.trim()
    this.searchQueryAItutor = ''
    this.resetTextAreaHeight(textArea)
    this.aiTutorResultArr.map((item:any, index:any)=>{
      if(item && (item.newMessage === '')) {
        // delete this.aiTutorResultArr[index]
        this.aiTutorResultArr.splice(index,1)
      }
     })
     this.resultFetch = false 
    
  // this.searchQuery = 'Soil Erosion and Conservation'
   let sendMsgObj = {
     type: 'sendMsg',
     tab: 'sarthi',
     question: this.cloneSearchQuery
   }
   
   this.aiTutorResultArr.push(sendMsgObj)
   this.aiTutorResultArr.push({type: 'incoming',  tab: 'sarthi', answer: '',newMessage: ''})
  //  this.searchQuery = ''
  //  this.aiGlobalSearch()
  //  this.getAiTutorMessage()
 
  setTimeout(()=>{
    this.scrollToBottom()
  },0)
  
   this.sendAITutorMessage()
   
  }


  sendAITutorMessage() {
    if (this.cloneSearchQuery) {
      let message = {
        message: this.cloneSearchQuery, 
        query: this.cloneSearchQuery,
        folder_name: this.content //this.content
      }
      this.websocketService.sendMessage(message);
      setTimeout(()=>{
        this.getAiTutorMessage()
      }, 1000)
      
    }
  }
  

  getAiTutorMessage() {
    this.messageSubscription = this.websocketService
      .getMessages()
      .subscribe((message: string) => {
      
       // this.messages.push(message);
       this.aiTutorResult = message
       this.resultFetch = true
       
      this.aiTutorResultMessage()
      //  this.searchQueryAItutor = '';
       
      });
  }

  aiTutorResultMessage() {
    this.iGOTAITutorResultArr = []
  //   let requestBody:any = {
  //     "query":this.cloneSearchQuery
  //  }
    // this.chatbotService.aiGlobalSearch(requestBody).subscribe((data)=>{
    //   console.log('data--', data)
    // })
    // console.log('requestBody', requestBody)
    // console.log('aiSearchResult', this.aiTutorResult)
    // console.log('this.aiSearchResultArr', this.aiTutorResultArr)


      const queryString = Object.entries(this.route.snapshot.queryParams)
        .map(([key, value]) => `${encodeURI(key)}=${encodeURI(value)}`)
        .join('&');

    //const queryString = new URLSearchParams(this.route.snapshot.queryParams).toString();
   // let arr:any = []
   console.log('this.aiTutorResult--',this.aiTutorResult)
   if(this.aiTutorResult && !this.aiTutorResult.answer && !this.aiTutorResult.retrievedChunks) {
    this.aiTutorResult.retrievedChunks = []
   }
    this.aiTutorResult.retrievedChunks && this.aiTutorResult.retrievedChunks.map((item:any)=>{
      let startTime = -1
      let endTime = -1
      let pageNumber:any = 1
      if(item && item?.ContentStart?.trim()) {
        startTime = item?.ContentStart
        pageNumber = item?.ContentStart
      }
      if(item && item?.ContentEnd?.trim()) {
        endTime = item?.ContentEnd
        pageNumber = item?.ContentEnd
      }
      pageNumber = pageNumber !== " " ? pageNumber : 1
      let resultObj = {        
        message: item.Name,
        recommendedQues: '',
        selectedValue: '',       
        title: item.Name,
        content: item,
        mimeType: item.MimeType,
        contentType: item.ContentType,
        artifactUrl: item.ArtifactURL,
        description: item?.Description?.replace(/^\s{4,}/gm, ''),
        identifier: item.Identifier,   
        contentStart: startTime,
        contentEnd: endTime,
        pageNumber:  pageNumber ? pageNumber : 1,  
        query: this.aiTutorResult.query,  
        query_id: this.aiTutorResult.query_id,
        feedback: '',
        resourceLink : item.MimeType === 'application/pdf'? `https://portal.igotkarmayogi.gov.in/viewer/pdf/${item.Identifier}?${queryString}&from=globalSearch&playerPreview=true&pn=${pageNumber}`: 
        (startTime <= 0 && endTime <= 0) ? `https://portal.igotkarmayogi.gov.in/viewer/video/${item.Identifier}?${queryString}&from=globalSearch&playerPreview=true`:  `https://portal.igotkarmayogi.gov.in/viewer/video/${item.Identifier}?${queryString}&from=globalSearch&playerPreview=true&st=${startTime}&et=${endTime}`
      }

      // arr.push(resultObj)
      this.iGOTAITutorResultArr.push(resultObj)
      
    })
    let answer = this.aiTutorResult.answer ? this.aiTutorResult.answer.trim().replace(/\n/g, '<br>') : ""
 
    let shortAnswer =  this.splitParagraphByWords(answer)
   // console.log(this.aiTutorResult.retrievedChunks, { wordsCount: answer.trim().split(/\s+/).length, showLess: answer.trim().split(/\s+/).length > 30 ? true : false ,answer: answer, shortAnswer: shortAnswer ,result: this.iGOTAITutorResultArr, type: 'incoming',  tab: 'sarthi',reterivedChunks: this.iGOTAITutorResultArr.retrievedChunks, showFromInternet:  (!this.aiTutorResult.retrievedChunks ? true : false)});
    this.aiTutorResultArr.push({ query: this.aiTutorResult.query, query_id: this.aiTutorResult.query_id,clientId: this.aiTutorResult.clientId, wordsCount: answer.trim().split(/\s+/).length, showLess: answer.trim().split(/\s+/).length > 30 ? true : false ,answer: answer, shortAnswer: shortAnswer ,result: this.iGOTAITutorResultArr, type: 'incoming',  tab: 'sarthi',reterivedChunks: this.iGOTAITutorResultArr.retrievedChunks, showFromInternet: (!(this.aiTutorResult.answer) && !(this.aiTutorResult.retrievedChunks)) ? true : false})
    this.aiTutorResultArr.map((item:any, index:any)=>{
      if(item && (item.newMessage === '')) {
        // delete this.aiSearchResultArr[index]
        this.aiTutorResultArr.splice(index,1)
      }
     })     
    console.log('this.aiTutorResultArr---', this.aiTutorResultArr)
     setTimeout(()=>{
     // this.scrollToBottom()
    },0)

    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click',  "id": "ai-tutor-card-content", "pageid": `viewer/${this.content}`, "subType" :   this.selectedLearningStyle.title  },
        object: { },
        state: WsEvents.EnumTelemetrySubType.Interact,
        eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
        mode: 'view',
      },
      pageContext: {pageId:  `viewer/${this.content}`, module: 'Learn'},
      from: '',
      to: 'Telemetry',
    }
    this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  redirectToResource(item:any) {
    let queryParams = { ...this.route.snapshot.queryParams };
    console.log(queryParams)
    // Remove specific parameters
    delete queryParams.st;
    delete queryParams.et;
    delete queryParams.pn;
    delete queryParams.from;
    delete queryParams.playerPreview;
    let queryString = ''
    queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURI(key)}=${encodeURI(value)}`)
        .join('&');
    let path = ''
    path = (item.mimeType === 'application/pdf')? `/viewer/pdf/${item.identifier}?${queryString}&from=globalSearch&playerPreview=true&pn=${item?.pageNumber}`: 
    (item?.contentStart <= 0 && item?.contentEnd <=0) ? `/viewer/video/${item.identifier}?${queryString}&from=globalSearch&playerPreview=true` : `/viewer/video/${item.identifier}?${queryString}&from=globalSearch&playerPreview=true&st=${item?.contentStart}&et=${item?.contentEnd}`
    // console.log('path', path)
   // window.open(path, '_blank')
   if(this.isMobile) {
    this.maximize = false
   }
   
   this.router.navigateByUrl(path)
  }

  copyPath(item:any, cindex:any) {
    const queryString = Object.entries(this.route.snapshot.queryParams)
        .map(([key, value]) => `${encodeURI(key)}=${encodeURI(value)}`)
        .join('&');

    //const queryString = new URLSearchParams(this.route.snapshot.queryParams).toString();    
    const selBox = document.createElement('textarea')
    selBox.style.position = 'fixed'
    selBox.style.left = '0'
    selBox.style.top = '0'
    selBox.style.opacity = '0'
     selBox.value = item.mimeType === 'application/pdf'? `https://portal.igotkarmayogi.gov.in/viewer/pdf/${item.identifier}?${queryString}&from=globalSearch&playerPreview=true&pn=${item?.pageNumber}`: 
     (item?.contentStart <=0 && item?.contentEnd <=0 ) ? `https://portal.igotkarmayogi.gov.in/viewer/video/${item.identifier}?${queryString}&from=globalSearch&playerPreview=true` :  `https://portal.igotkarmayogi.gov.in/viewer/video/${item.identifier}?${queryString}&from=globalSearch&playerPreview=true&st=${item?.contentStart}&et=${item?.contentEnd}`
    document.body.appendChild(selBox)
    selBox.focus()
    selBox.select()
    document.execCommand('copy')
    document.body.removeChild(selBox)
    this.copiedIndex = cindex
    setTimeout(()=>{
      this.copiedIndex = -1
    },1000)
    
  }

  redirectToToc(chat:any) {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click',  "id": "ai-tutor-card-content", "pageid": `viewer/${this.content}`, "subType" :   this.selectedLearningStyle.title  },
        object: { id: chat?.identifier, type: chat?.contentType},
        state: WsEvents.EnumTelemetrySubType.Interact,
        eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
        mode: 'view',
      },
      pageContext: {pageId: `viewer/${this.content}`, module: 'Learn'},
      from: '',
      to: 'Telemetry',
    }
    this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
    let path = `https://portal.igotkarmayogi.gov.in/app/toc/${chat?.identifier}/overview`
    window.open(path, '_blank')
  }

  splitParagraphByWords(paragraph:any, wordsPerChunk = 30) {
    const words = paragraph.trim().split(/\s+/);
    const chunks = [];
  
    for (let i = 0; i < wordsPerChunk; i++) {
      chunks.push(words[i])
    }
    
    return chunks.join(' ');
  }

  toggleShow(index:any, showType:any) {
    if(showType === 'less') {
      this.aiTutorResultArr[index]['showLess'] = true
    } else {
      this.aiTutorResultArr[index]['showLess'] = false
    }
    
  }

  get userInitials() {
    return this.initials
  }
  private createInititals(name:any): void {
    const randomIndex = Math.floor(Math.random() * Math.floor(this.colors.length))
    this.circleColor = this.colors[randomIndex]
    if (this.randomcolors) {
      const randomIndex1 = Math.floor(Math.random() * Math.floor(this.randomcolors.length))
      this.circleColor = this.randomcolors[randomIndex1]
    }
    let initials = ''
    const array = `${name} `.toString().split(' ')
    if (array[0] !== 'undefined' && typeof array[1] !== 'undefined') {
      initials += array[0].charAt(0)
      initials += array[1].charAt(0)
    } else {
      for (let i = 0; i < name.length; i += 1) {
        if (name.charAt(i) === ' ') {
          continue
        }

        if (name && (name.charAt(i) === name.charAt(i))) {
          initials += name.charAt(i)

          if (initials.length === 2) {
            break
          }
        }
      }
    }
    this.initials = initials.toUpperCase()
  }

  getLearningStyle() {
    const timestamp = Date.now();
    this.chatId = `${this.configSvc.unMappedUser.userId}-${timestamp}`
    if(this.selectedLearningStyle && this.selectedLearningStyle.title === 'Socratic Style') {
      this.aiTutorResultArr = []
      this.websocketService.closeConnection()
      this.chatId = `${this.configSvc.unMappedUser.userId}-${timestamp}`
      
      this.websocketService.connect(`wss://${this.SocraticeStyleHost}/socratic/v1/ws?token=${this.jwtToken}`);
    } else if (this.selectedLearningStyle && this.selectedLearningStyle.title === 'None') {
      this.aiTutorResultArr = []
      this.websocketService.closeConnection()
      this.chatId = `${this.configSvc.unMappedUser.userId}-${timestamp}`
      
      this.websocketService.connect(`wss://${this.NoneSocketHost}/ws?token=${this.jwtToken}`);
    }  else if (this.selectedLearningStyle && this.selectedLearningStyle.title === 'Storytelling') {
      this.aiTutorResultArr = []
      this.websocketService.closeConnection()
      this.chatId = `${this.configSvc.unMappedUser.userId}-${timestamp}`
      
      this.websocketService.connect(`wss://${this.StorytellingHost}/storytelling/v1/ws?token=${this.jwtToken}`);
    }
   // console.log('selectedLearningStyle--', this.selectedLearningStyle)
  }

  raiseTelemetryForResource(item:any) {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click',  "id": "ai-tutor-card-content", "pageid": `viewer/${this.content}`, "subType" :   this.selectedLearningStyle.title    },
        object: { id: item?.identifier, type: item?.contentType},
        state: WsEvents.EnumTelemetrySubType.Interact,
        eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
        mode: 'view',
      },
      pageContext: {pageId: `viewer/${this.content}`, module: 'Learn'},
      from: '',
      to: 'Telemetry',
    }
    this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  sharePositiveContentRating(item:any, index:any, cindex:any) {
    let requestBody:any = {
      "query_id": item?.query_id,
      "response":  this.aiTutorResultArr[index]['answer'],
      "comments": "",
      "is_liked":true,
      "rating": "5",
      "identifier":this.content,
      "query": item.query,
      chat_id: this.chatId,
      user_id: this.configSvc.unMappedUser.userId,

   }
   if(this.aiTutorResultArr && this.aiTutorResultArr.length && this.aiTutorResultArr[index]) {
    if(this.aiTutorResultArr[index].result && this.aiTutorResultArr[index].result[cindex])
      this.aiTutorResultArr[index].result[cindex]['showLoader'] = true
      this.aiTutorResultArr[index].result[cindex]['showLoaderForUp'] = true
   }
   //this.matSnackBar.open('Unable to fetch content data, due to some error!')
   this.chatbotService.saveAIChatPositiveContentRating(requestBody, this.chatId, this.userInfo?.userId).subscribe((data:any)=>{
    if(data && data.status === 'success') {
      if(this.aiTutorResultArr && this.aiTutorResultArr.length && this.aiTutorResultArr[index]) {
        if(this.aiTutorResultArr[index].result && this.aiTutorResultArr[index].result[cindex])
          this.aiTutorResultArr[index].result[cindex]['feedback'] = 'up'
          this.aiTutorResultArr[index].result[cindex]['showLoader'] = false
          this.aiTutorResultArr[index].result[cindex]['showLoaderForUp'] = false
      }
      this.matSnackBarNew.open(
        'Thank you for your feedback.', 'X',
        { duration: 5000, panelClass: ['success'] }
      );
    } else {
      if(this.aiTutorResultArr && this.aiTutorResultArr.length && this.aiTutorResultArr[index]) {
        if(this.aiTutorResultArr[index].result && this.aiTutorResultArr[index].result[cindex])
          this.aiTutorResultArr[index].result[cindex]['showLoader'] = false
          this.aiTutorResultArr[index].result[cindex]['showLoaderForUp'] = false
      }
      this.matSnackBarNew.open(
        'Something is wrong. Please try again later.', 'X',
        { duration: 5000, panelClass: ['error'] }
      );
    }

  })
  }

  openAIFeedbackPopup(item:any, index:any, cindex:any) {
    if(this.aiTutorResultArr && this.aiTutorResultArr.length && this.aiTutorResultArr[index] && this.aiTutorResultArr[index]) {
      if(this.aiTutorResultArr[index].result && this.aiTutorResultArr[index].result[cindex] && this.aiTutorResultArr[index].result[cindex]['feedback'] !== 'down') {
        const dialogRef = this.dialog.open(NonReleventFeedbackDialogComponent, {
          disableClose: true,
          width: '502px',
          panelClass: ['relevent-feedback-dialog'],
        })
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result) {
            this.shareAIFeedback(item, result, index, cindex);
            dialogRef.close();
          } else {
            dialogRef.close();
          }
        })
      } else {
        this.matSnackBarNew.open(
          'You have already submitted feedback', 'X',
          { duration: 5000, panelClass: ['error'] }
        );
      }
    }

  }

  shareAIFeedback(item:any, result:any, index:any, cindex:any) {

    let requestBody:any = {
      "query_id": item?.query_id,
      "response": this.aiTutorResultArr[index]['answer'],
      "comments": result,
      "is_liked":false,
      "rating": "0",
      "identifier":this.content,
      "query": item.query,
      chat_id: this.chatId,
      user_id: this.configSvc.unMappedUser.userId,

   }
   if(this.aiTutorResultArr && this.aiTutorResultArr.length && this.aiTutorResultArr[index]) {
    if(this.aiTutorResultArr[index].result && this.aiTutorResultArr[index].result[cindex]) {
      this.aiTutorResultArr[index].result[cindex]['showLoader'] = true
      this.aiTutorResultArr[index].result[cindex]['showLoaderForDown'] = true
    }

  }
     this.chatbotService.shareAIFeedback(requestBody, this.chatId, this.userInfo?.userId).subscribe((data:any)=>{
      if(data  && data.status === 'success') {
        if(this.aiTutorResultArr && this.aiTutorResultArr.length && this.aiTutorResultArr[index]) {
          if(this.aiTutorResultArr[index].result && this.aiTutorResultArr[index].result[cindex])
            this.aiTutorResultArr[index].result[cindex]['feedback'] = 'down'
            this.aiTutorResultArr[index].result[cindex]['showLoader'] = false
            this.aiTutorResultArr[index].result[cindex]['showLoaderForDown'] = false
        }
        this.matSnackBarNew.open(
          'Thank you for your feedback.', 'X',
          { duration: 5000, panelClass: ['success'] }
        );
      } else {
        if(this.aiTutorResultArr && this.aiTutorResultArr.length && this.aiTutorResultArr[index]) {
          if(this.aiTutorResultArr[index].result && this.aiTutorResultArr[index].result[cindex])
            this.aiTutorResultArr[index].result[cindex]['showLoader'] = false
          this.aiTutorResultArr[index].result[cindex]['showLoaderForDown'] = false
        }
        this.matSnackBarNew.open(
          'Something is wrong. Please try again later.', 'X',
          { duration: 5000, panelClass: ['error'] }
        );
      }
     })
  }


  sharePositiveContentRatingForAnswer(item:any, index:any) {
    let requestBody:any = {
      "query_id": item.query_id,
      "response": item.answer,
      "comments": "",
      "is_liked":true,
      "rating": "5",
      "identifier":this.content,
      "query": item.query

   }
   if(this.aiTutorResultArr && this.aiTutorResultArr.length && this.aiTutorResultArr[index]) {
    if(this.aiTutorResultArr[index] && this.aiTutorResultArr[index])
      this.aiTutorResultArr[index]['showLoader'] = true
      this.aiTutorResultArr[index]['showLoaderForUp'] = true
   }
   //this.matSnackBar.open('Unable to fetch content data, due to some error!')
   this.chatbotService.saveAIChatPositiveContentRating(requestBody, this.chatId, this.userInfo?.userId).subscribe((data:any)=>{
    if(data && data.status === 'success') {
      if(this.aiTutorResultArr && this.aiTutorResultArr.length && this.aiTutorResultArr[index]) {
        if(this.aiTutorResultArr[index] && this.aiTutorResultArr[index])
          this.aiTutorResultArr[index]['feedback'] = 'up'
          this.aiTutorResultArr[index]['showLoader'] = false
          this.aiTutorResultArr[index]['showLoaderForUp'] = false
      }
      this.matSnackBarNew.open(
        'Thank you for your feedback.', 'X',
        { duration: 5000, panelClass: ['success'] }
      );
    } else {
      if(this.aiTutorResultArr && this.aiTutorResultArr.length && this.aiTutorResultArr[index]) {
        if(this.aiTutorResultArr[index] && this.aiTutorResultArr[index])
          this.aiTutorResultArr[index]['showLoader'] = false
          this.aiTutorResultArr[index]['showLoaderForUp'] = false
      }
      this.matSnackBarNew.open(
        'Something is wrong. Please try again later.', 'X',
        { duration: 5000, panelClass: ['error'] }
      );
    }

  })
  }

  openAIFeedbackPopupForAnswer(item:any, index:any) {
    if(this.aiTutorResultArr && this.aiTutorResultArr.length && this.aiTutorResultArr[index] && this.aiTutorResultArr[index]) {
      if(this.aiTutorResultArr[index] && this.aiTutorResultArr[index] && this.aiTutorResultArr[index]['feedback'] !== 'down') {
        const dialogRef = this.dialog.open(NonReleventFeedbackDialogComponent, {
          disableClose: true,
          width: '502px',
          panelClass: ['relevent-feedback-dialog'],
        })
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result) {
            this.shareAIForAnswerFeedback(item, result, index);
            dialogRef.close();
          } else {
            dialogRef.close();
          }
        })
      } else {
        this.matSnackBarNew.open(
          'You have already submitted feedback', 'X',
          { duration: 5000, panelClass: ['error'] }
        );
      }
    }

  }

  shareAIForAnswerFeedback(item:any, result:any, index:any) {

    let requestBody:any = {
      "query_id": item.query_id,
      "response": item?.answer,
      "comments": result,
      "is_liked":false,
      "rating": "0",
      "identifier":this.content,
      "query": item.query

   }
   if(this.aiTutorResultArr && this.aiTutorResultArr.length && this.aiTutorResultArr[index]) {
    if(this.aiTutorResultArr[index] && this.aiTutorResultArr[index]) {
      this.aiTutorResultArr[index]['showLoader'] = true
      this.aiTutorResultArr[index]['showLoaderForDown'] = true
    }

  }
     this.chatbotService.shareAIFeedback(requestBody, this.chatId, this.userInfo?.userId).subscribe((data:any)=>{
      if(data  && data.status === 'success') {
        if(this.aiTutorResultArr && this.aiTutorResultArr.length && this.aiTutorResultArr[index]) {
          if(this.aiTutorResultArr[index] && this.aiTutorResultArr[index])
            this.aiTutorResultArr[index]['feedback'] = 'down'
            this.aiTutorResultArr[index]['showLoader'] = false
            this.aiTutorResultArr[index]['showLoaderForDown'] = false
        }
        this.matSnackBarNew.open(
          'Thank you for your feedback.', 'X',
          { duration: 5000, panelClass: ['success'] }
        );
      } else {
        if(this.aiTutorResultArr && this.aiTutorResultArr.length && this.aiTutorResultArr[index]) {
          if(this.aiTutorResultArr[index] && this.aiTutorResultArr[index])
            this.aiTutorResultArr[index]['showLoader'] = false
          this.aiTutorResultArr[index]['showLoaderForDown'] = false
        }
        this.matSnackBarNew.open(
          'Something is wrong. Please try again later.', 'X',
          { duration: 5000, panelClass: ['error'] }
        );
      }
     })
  }

  callFromInternet(item:any, index:any) {
    this.aiTutorResultArr.push({type: 'incoming',  tab: 'sarthi', answer: ''})
    if( this.aiTutorResultArr[index] && this.aiTutorResultArr[index]['showFromInternet']) {
      this.aiTutorResultArr[index]['showFromInternet'] = false
    }
    if(item && !item.answer) {

      let internetGlobalSearchRequest = {
        "query": this.cloneSearchQuery,
        "designation":  this.userInfo?.professionalDetails && this.userInfo?.professionalDetails.length ? this.userInfo?.professionalDetails[0].designation : '',
        "department": this.userInfo?.departmentName ? this.userInfo?.departmentName : '',
      }
      this.chatbotService.aiGlobalSearchFromInternet(internetGlobalSearchRequest, '', this.userInfo?.userId).subscribe((idata:any)=>{
        this.resultFetch = true
        this.aiTutorResultArr.map((item:any, index:any)=>{
          if(item && (item.newMessage === '')) {
            // delete this.aiSearchResultArr[index]
            this.aiTutorResultArr.splice(index,1)
          }
         })
        let resultObj = {        
          message: idata.answer,
          recommendedQues: '',
          selectedValue: '',       
          title: idata.answer,
          content: idata,
          mimeType: idata,
          contentType: idata,
          artifactUrl: idata,
          description: idata.answer,
          identifier: idata,    
          contentStart: idata,
          contentEnd: idata, 
          pageNumber:   idata,
          query: this.cloneSearchQuery,
          query_id: idata.query_id,
          resourceLink : '', 
          feedback: '',
          fromInternet: true
        }

        this.iGOTAITutorResultArr.push(resultObj)
        let answer = idata.answer ? idata.answer.trim().replace(/\n/g, '<br>') : ""
        let shortAnswer =  this.splitParagraphByWords(answer)
        this.aiTutorResultArr.push({ feedback:'', wordsCount: answer.trim().split(/\s+/).length, showLess: answer.trim().split(/\s+/).length > 30 ? true : false ,answer: answer, shortAnswer: shortAnswer ,result: this.iGOTAITutorResultArr, type: 'incoming',  tab: 'sarthi', reterivedChunks: this.aiTutorResult.retrievedChunks, showFromInternet: false})
        this.aiTutorResultArr.map((item:any, index:any)=>{
          if(item && (item.newMessage === '')) {
            // delete this.aiSearchResultArr[index]
            this.aiTutorResultArr.splice(index,1)
          }
         })
      })
    }
  }

  rejectFromInternet(index:any) {
    if( this.aiTutorResultArr[index] && this.aiTutorResultArr[index]['showFromInternet']) {
      this.aiTutorResultArr[index]['showFromInternet'] = false
    }
    this.resultFetch = true
    this.aiTutorResultArr.map((item:any, index:any)=>{
      if(item && (item.newMessage === '')) {
        // delete this.aiSearchResultArr[index]
        this.aiTutorResultArr.splice(index,1)
      }
     })
  }

  ngOnDestroy(): void {
    // Clean up the subscription and WebSocket connection
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click',  "id": "ai-tutor-card-content", "pageid": `viewer/${this.content}`, "subType" :   this.selectedLearningStyle.title  },
        object: { id: this.content},
        state: WsEvents.EnumTelemetrySubType.Unloaded,
        eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
        mode: 'view',
      },
      pageContext: {pageId: `viewer/${this.content}`, module: 'Learn'},
      from: '',
      to: 'Telemetry',
    }
    this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
    // this.websocketService.closeConnection();
  }

  resizeTextarea(textArea: HTMLTextAreaElement,_fromInput:any): void {
    if (textArea) {
      textArea.style.height = 'auto'; // Reset height first
      requestAnimationFrame(() => {
        textArea.style.height = textArea.scrollHeight + 'px';
  
        const computed = getComputedStyle(textArea);
        const paddingTop = parseFloat(computed.paddingTop) || 0;
        const paddingBottom = parseFloat(computed.paddingBottom) || 0;
        const marginExtra = 0;
        this.containerHeight = textArea.scrollHeight + paddingTop + paddingBottom + marginExtra;
      });
    }
  }

  resetTextAreaHeight(_textArea:HTMLTextAreaElement) {
    if(this.textArea.nativeElement && this.textArea.nativeElement.style && this.textArea.nativeElement.style.height) {
      setTimeout(()=>{
        this.searchQueryAItutor = this.searchQueryAItutor.trim()        
        this.textArea.nativeElement.style.height = 'auto';
        this.textArea.nativeElement.style.height = '30px';
        const computed = getComputedStyle(this.textArea.nativeElement);
        const paddingTop = parseFloat(computed.paddingTop) || 0;
        const paddingBottom = parseFloat(computed.paddingBottom) || 0;
        const marginExtra = 0;
        this.containerHeight = 30 + paddingTop + paddingBottom + marginExtra;        
      })     
    }


  }

  closeAITutorPopup() {
    this.closeAIPopup.emit(true)
  }

  minimizeAITutor() {
    this.maximize = false
  }

  maximizeAITutor() {
    this.maximize = true
  }
}