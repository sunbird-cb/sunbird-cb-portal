import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild,   } from '@angular/core'
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
  localization: any = {
    'en' : {
      'Hi' : 'Hi',
      'information': 'Information',
      'issue': 'Issues'
    },
    'hi' : {
      'Hi' : 'जानकारी',
      'information': 'जानकारी',
      'issue': 'समस्या'
    }
  }
  @ViewChild('scrollMe', {static: false}) private myScrollContainer: ElementRef | undefined

  callText = "<a class='hint-text' target='_blank' href='https://bit.ly/44MJlo4'>Teams Call</a>"
  emailText = "<a class='hint-text' target='_blank' href='mailto:mission.karma@gov.in'>mission.karma@gov.in.</a>"

  constructor(private configSvc: ConfigurationsService, private eventSvc: EventService,
    private chatbotService: RootService) { }

  ngOnInit() {
    this.userInfo = this.configSvc && this.configSvc.userProfile
    this.checkForApiCalls()
    this.userIcon = this.userInfo.profileImage || "/assets/icons/chatbot-default-user.svg"
  }

  greetings(){
    return this.localization[this.selectedLaguage]['Hi'] || 'Hi'
  }

  getInfoText(label: string){
    return this.localization[this.selectedLaguage][label] || label
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
    this.toggleFilter('information')
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
    if (type === 'start'){
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
    }
  }

  toggleFilter(tab: string) {
    this.currentFilter = tab
    this.checkForApiCalls()
    let localStg: any = JSON.parse(localStorage.getItem('faq') || '{}')
     let localStorageData = localStg[this.selectedLaguage][this.currentFilter]
     console.log(localStorageData,'asdfghjk',this.currentFilter)

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
        if (ques.priority === priority && question.categoryType === isLogedIn) {
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
    if (catItem.catId === 'all') {
      incomingMsg.title= '',//'Here is the list of all the topics'
      incomingMsg.relatedQes = ''
      incomingMsg.recommendedQues = this.responseData.categoryMap
    } else {
      this.responseData.recommendationMap.forEach((element: any) => {
        if (catItem.catId === element.catId) {
          incomingMsg.type = 'incoming',
          incomingMsg.recommendedQues = element.recommendedQues
        }
      })
    }
    let sendMsg = {
      type:'sendMsg',
      question: catItem.catName
    }
    this.pushData(sendMsg)
    this.pushData(incomingMsg)
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
      pageContext: {pageId: '/chatboat', module: 'Assistant'},
      from: '',
      to: 'Telemetry',
    }
    this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  checkForApiCalls(){
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
    this.categories = [{ "catId": "all","catName": "Show all category"}]
    this.categories=[...this.categories, ...this.responseData.categoryMap]
  }

  getLanguages(){
    this.displayLoader = true
    this.chatbotService.getLangugages().subscribe((resp: any) => {
      if(resp.status.code === 200) {
        this.language = resp.payload.languages
        localStorage.setItem('faq-languages',JSON.stringify(resp.payload.languages))
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

}
