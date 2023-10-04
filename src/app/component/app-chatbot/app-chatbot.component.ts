import { AfterViewChecked, Component, ElementRef, OnInit, Renderer2, ViewChild,   } from '@angular/core'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils'
// import { ChatbotService } from './chatbot.service'
import { RootService } from './../root/root.service'



@Component({
  selector: 'ws-app-chatbot',
  templateUrl: './app-chatbot.component.html',
  styleUrls: ['./app-chatbot.component.scss'],
  // providers: [ChatbotService]
})
export class AppChatbotComponent implements OnInit, AfterViewChecked {

  showIcon :boolean = true
  categories: any[] = []
  language: any[] = []
  currentFilter: string = 'information'
  selectedLaguage: string = 'en'

  responseData:any
  userInfo:any
  userJourney: any = []
  recomendedQns :any = {}
  questionsAndAns: any = {}
  userIcon: string = ''
  more = false
  chatInformation: any = []
  chatIssues: any = []
  displayLoader: boolean = false
  expanded: boolean = false
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
  @ViewChild('scrollMe', {static: false}) private myScrollContainer: ElementRef | undefined

  callText = "<a class='hint-text' target='_blank' href='https://bit.ly/44MJlo4'>Teams Call</a>"
  emailText = "<a class='hint-text' target='_blank' href='mailto:mission.karma@gov.in'>mission.karma@gov.in.</a>"

  constructor(private configSvc: ConfigurationsService, private eventSvc: EventService,private renderer: Renderer2,
    private chatbotService: RootService) { }

  ngOnInit() {
    this.userInfo = this.configSvc && this.configSvc.userProfile
    this.checkForApiCalls()
    this.enableScroll()
    this.userIcon = this.userInfo && this.userInfo.profileImage ? this.userInfo.profileImage : "/assets/icons/chatbot-default-user.svg"
  }

  greetings(){
    return this.localization[this.selectedLaguage]['Hi'] || 'Hi'
  }

  getInfoText(label: string){
    return this.localization[this.selectedLaguage][label] || label
  }

  showMore() {
    return this.localization[this.selectedLaguage]["showmore"] || 'Show More'
  }

  getData(){
    let lang:any = {
      information: 'IN',
      issue: 'IS'
    }
    let tabType:any = {
      lang : this.selectedLaguage,
      config_type : lang[this.currentFilter]
    }
    this.displayLoader = true
    this.chatbotService.getChatData(tabType).subscribe((res: any) => {
      if(res && res.payload && res.payload.config) {
        this.setDataToLocalStorage(res.payload.config)
        this.checkForApiCalls()
        // this.initData(res.payload.config)
        this.displayLoader = false
      }
    })
  }
  setDataToLocalStorage (data: any){
    let localObject: any = {}
    localObject = JSON.parse(localStorage.getItem("faq")|| '{}')
    localObject[this.selectedLaguage] = {...localObject[this.selectedLaguage], [this.currentFilter] : data}
    localStorage.setItem("faq", JSON.stringify(localObject))
    this.toggleFilter(this.currentFilter === 'information' ? 'information': this.currentFilter)
  }

  initData(getData: any){
    console.log(getData)
    this.userJourney = []
    let userDetails: any = {
      type: 'incoming',
      message: '', //` Hi ${this.userInfo && this.userInfo.firstName || ''}, I'm KarmaSahayogi - Digital Assistant, I'm here to help you.`,
      recommendedQues:this.getPriorityQuestion(1),
      selectedValue:'',
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
    localStorage.setItem('selectedLanguage',event.target.value)
    this.chatInformation=[]
    this.chatIssues = []
    this.checkForApiCalls()
  }

  readFromLocalStorage(){
    let localStg: any = localStorage.getItem('result')
    if (localStg){
      if (this.currentFilter === 'information'){
        this.responseData = JSON.parse(localStg)[this.selectedLaguage].information
      } else {
        this.responseData = JSON.parse(localStg)[this.selectedLaguage].issue
      }
    }
  }

  goToBottom(){
    window.scrollTo(0,document.body.scrollHeight)
  }


  iconClick(type: string) {
    this.showIcon = !this.showIcon
    this.currentFilter = 'information'
    this.expanded = false
    if (type === 'start'){
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

  selectedQuestion(question:any,data:any){
    data.selectedValue = question.quesID
    let sendMsg = {
      type:'sendMsg',
      question: this.questionsAndAns[question.quesID].quesValue,
      tab: this.currentFilter
    }

    let incomingMsg = {
      type: 'incoming',
      message: this.questionsAndAns[question.quesID].ansVal.replace("<teams_call_link>", this.callText).replace("<email_configuration>", this.emailText),
      recommendedQues: question.recommendedQues || [],
      title: '', //'Questions related to',
      relatedQes:'above Question',
      tab: this.currentFilter
    }
    this.pushData(sendMsg)
    this.pushData(incomingMsg)
    this.raiseTemeletyInterat(question.quesID)
  }

  pushData(msg: any){
    this.userJourney=[]
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
    let recommendedQues: any[] = []
    let isLogedIn: string = this.userInfo ? 'Logged-In' : 'Not Logged-In'
    this.responseData.recommendationMap.map((question: any) => {
      question.recommendedQues.map((ques:any)=> {
        if (ques.priority === priority && (question.categoryType === isLogedIn || question.categoryType === 'Both')) {
          recommendedQues.push(ques)
        }
      })
    })
    return recommendedQues
  }

  showMoreQuestion() {
    let showMoreQes: any = {
      type: 'incoming',
      message: '',
      recommendedQues:this.getPriorityQuestion(1),
      selectedValue:'',
      title: '', //'Showing more questions',
    }
    this.pushData(showMoreQes)
  }

  showCategory(catItem: any) {
    let incomingMsg = {
      type: 'category',
      message: '',
      recommendedQues: [],
      title: '', //'What do you want to know under',
      relatedQes:`${catItem.catName}?`,
      tab: this.currentFilter
    }
    this.more= false
    if (catItem.catId === 'all') {
      incomingMsg.title= '',//'Here is the list of all the topics'
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
    let sendMsg = {
      type:'sendMsg',
      question: catItem.catName
    }
    this.pushData(sendMsg)
    this.pushData(incomingMsg)
  }

  raiseCategotyTelemetry(catItem: string){
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click', id: catItem},
        object: {id: catItem, type: "Category"},
        state: WsEvents.EnumTelemetrySubType.Interact,
        eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
        mode: 'view'
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
        object: {ype: "zse", id: "asd"},
        state: WsEvents.EnumTelemetrySubType.Loaded,
        eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
        type: 'session',
        mode: 'view',
      },
      pageContext: {pageId: "/chatbot", module: "Assistant"},
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
      pageContext: {pageId: "/chatbot", module: "Assistant"},
      from: '',
      to: 'Telemetry',
    }
    this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  raiseTemeletyInterat(id: string) {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click', id: id},
        object: {id: id, type: this.currentFilter.charAt(0).toUpperCase() + this.currentFilter.slice(1)},
        state: WsEvents.EnumTelemetrySubType.Interact,
        eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
        mode: 'view'
      },
      pageContext: {pageId: '/chatbot', module: 'Assistant'},
      from: '',
      to: 'Telemetry',
    }
    this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  checkForApiCalls() {
    this.selectedLaguage = localStorage.getItem('selectedLanguage') || 'en'
    let localStg: any = JSON.parse(localStorage.getItem('faq') || '{}')
    let languageStg: any = JSON.parse(localStorage.getItem('faq-languages') || '{}')
    if(languageStg.length > 0) {
      this.language = languageStg
    } else {
      this.getLanguages()
    }

    if(localStg && languageStg) {
      if (localStg[this.selectedLaguage] && localStg[this.selectedLaguage][this.currentFilter]){
        let localStorageData = localStg[this.selectedLaguage][this.currentFilter]
        this.userJourney=[]
        if(this.currentFilter === 'information') {
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
    this.categories = [{ "catId": "all","catName": this.localization[this.selectedLaguage]['categories'],priority: 0}]
    let categories: any = []
    let isLogedIn: string = this.userInfo ? 'Logged-In' : 'Not Logged-In'
    this.responseData.recommendationMap.map((catandques: any) => {
      this.responseData.categoryMap.map((cat:any)=> {
        if (catandques.catId === cat.catId && (catandques.categoryType === isLogedIn || catandques.categoryType === 'Both')) {
          let category = {
            catId: cat.catId,
            catName: cat.catName,
            priority: catandques.priority,
            categoryType: catandques.categoryType,
          }
          categories.push(category)
        }
      })
    })
    this.categories=[...this.categories, ...categories]
  }
  sortCategory(): any {
    return this.categories.sort((a:any, b:any) => a['priority'] > b['priority'] ? 1 : a['priority'] === b['priority'] ? 0 : -1)
  }
  

  getLanguages(){
    this.displayLoader = true
    this.chatbotService.getLangugages().subscribe((resp: any) => {
      if(resp.status.code === 200) {
        this.language = resp.payload.languages
        localStorage.setItem('faq-languages',JSON.stringify(resp.payload.languages))
        localStorage.setItem('selectedLanguage',this.selectedLaguage)
        this.getData()
        this.displayLoader = false
      }
    })
  }

  ngAfterViewChecked() {
    this.scrollToBottom()
  }
  scrollToBottom(): void {
    try {
      if (this.myScrollContainer) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight
      }
    } catch(err) { }
  }
  clickOutside() {
    this.iconClick('end')
  }
  private disableScroll() {
    this.renderer.addClass(document.body, 'disable-scroll');
  }

  private enableScroll() {
    this.renderer.removeClass(document.body, 'disable-scroll');
  }
}