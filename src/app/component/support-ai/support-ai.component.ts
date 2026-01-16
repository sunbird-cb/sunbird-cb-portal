import { AfterViewChecked, AfterViewInit, Component,ElementRef,EventEmitter,Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils-v2';
import { RootService } from '../root/root.service';
import { environment } from '../../../environments/environment';  
import { NonReleventFeedbackDialogComponent } from '@sunbird-cb/collection/src/lib/_common/non-relevent-feedback-dialog/non-relevent-feedback-dialog.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { MatSnackBar as MatSnackbarNew } from '@angular/material/snack-bar'
import cloneDeep from 'lodash/cloneDeep';


@Component({
  selector: 'ws-app-support-ai',
  templateUrl: './support-ai.component.html',
  styleUrls: ['./support-ai.component.scss']
})
export class SupportAIComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() from = ''
  @Input() userJourney = []
  @Input() chatId = ''
  @Input() userId = ''
  @Input() fullScreenChatFlag = false
  @Input() activeLaguage= 'en'
  @Output() scrollToBottomEvent = new EventEmitter()
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
  searchQuery: any
  initials:any
  copiedIndex = -1
  public circleColor!: string
  random = Math.random().toString(36).slice(2)
  iGOTAISearchResultArr:any = []
  // public initials!: string
  resultFetch = false
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

  aiSearchResult:any = {}
  
  aiSearchResultArr:any = []
  cloneSearchQuery = ''
  displayedText = '';
  startNewChat = false
  initiateSupportNewChat = false
  // tslint: enable
  @ViewChild('scrollMe') private myScrollContainer: ElementRef | undefined
  isHubEnable!: boolean
  @ViewChild('autoResizeTextarea') textArea!: ElementRef<HTMLTextAreaElement>;
  containerHeight = 36;
  constructor(
    private configSvc: ConfigurationsService,
    private eventSvc: EventService,
    private renderer: Renderer2,
    private chatbotService: RootService,
    private dialog: MatDialog,
    private matSnackBarNew: MatSnackbarNew,
    private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        //certificate link check
        this.isHubEnable = (event.url.includes('/certs') || event.url.includes('/public/certs')) ? false : true;
      }
    })
    this.userInfo = this.configSvc && this.configSvc.userProfile
    // this.aiGlobalSearch()
   // this.startNewSupportAISearch()
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
    
    
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId']) {
      const prev = changes['chatId'].previousValue;
      const current = changes['chatId'].currentValue;

      if (prev !== current) {
        console.log(`'chatId' changed from '${prev}' to '${current}'`);
        this.startNewChat = true
        this.startNewSupportAISearch()
      }
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
    //this.scrollToBottom()
  }


  ngAfterViewInit(): void {
    this.resizeTextarea(this.textArea.nativeElement,'');
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
    this.renderer.addClass(document.body, 'disable-scroll')
  }

  private enableScroll() {
    this.renderer.removeClass(document.body, 'disable-scroll')
  }

  submitSearchQuery(textArea: HTMLTextAreaElement, event:any) {
    if(!this.initiateSupportNewChat) {
      return false
    }
    if (!this.searchQuery.trim()) {
      event.preventDefault(); // Prevents Enter key from adding a new line
    }
    this.searchQuery = this.searchQuery.trim()
    // console.log('this.aiSearchResultArr--->', this.aiSearchResultArr)
    this.aiSearchResultArr.map((item:any, index:any)=>{
      if(item && (item.newMessage === '')) {
        // delete this.aiSearchResultArr[index]
        this.aiSearchResultArr.splice(index,1)
      }
     })
     this.resultFetch = false 
  //  console.log(this.searchQuery)
   this.cloneSearchQuery = ''
    // this.searchQuery = 'Basics of National Income Accounting'
   let sendMsgObj = {
     type: 'sendMsg',
     tab: 'support-ai',
     question: this.searchQuery
   }
   this.cloneSearchQuery = cloneDeep(this.searchQuery);
   this.aiSearchResultArr.push(sendMsgObj)
   this.aiSearchResultArr.push({type: 'incoming',  tab: 'support-ai', answer: '', newMessage: '', showBot: true})
   
   if(this.aiSearchResultArr.length > 2) {
    setTimeout(()=>{
      this.scrollToBottomEvent.emit() 
    },0)
   }  
    this.searchQuery = ''
    this.resetTextAreaHeight(textArea)
    this.supportAISearch()
    // setTimeout(()=>{
    //   this.searchQuery = ''
    // },1000)
   
  //  this.getAiTutorMessage()
  // this.sendAITutorMessage()
  }

  startNewSupportAISearch() {
    this.iGOTAISearchResultArr = []
    let requestBody:any = {
      "channel_id": "web",
      // "session_id": this.chatId,
      "text": this.cloneSearchQuery,
      "audio": "",
      "language": this.activeLaguage
    }
    console.log('requestBody--', requestBody)
    if(this.startNewChat) {
      this.chatbotService.aiStartChathForSupport(requestBody,  this.userId).subscribe((data)=>{
        console.log('data---', data)
        this.resultFetch = true
        if(data && data.message) {
          this.initiateSupportNewChat = true
          this.aiSearchResultArr.push(
            {type: 'incoming',  tab: 'support-ai', answer: `Hi ${this.userInfo?.firstName}! 👋`, newMessage: 'Hi Manasvi! 👋', showBot: true},
            {type: 'incoming',  tab: 'support-ai', answer: "I'm your iGOT Support Assistant 🤖 — here to guide you with anything related to the iGOT platform.", newMessage: "I'm your iGOT Support Assistant 🤖 — here to guide you with anything related to the iGOT platform.", showBot: false},
            {type: 'incoming',  tab: 'support-ai', answer: "How can I assist you today?", newMessage: 'How can I assist you today?', showBot: false}
          )
        } else {
          this.initiateSupportNewChat = false
        }
        
        
      
      })
      
      const event = {
        eventType: WsEvents.WsEventType.Telemetry,
        eventLogLevel: WsEvents.WsEventLogLevel.Info,
        data: {
          edata: { type: 'click',  "id": "support-ai-global-search", "pageid": "/page/home"   },
          object: { },
          state: WsEvents.EnumTelemetrySubType.Interact,
          eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
          mode: 'view',
        },
        pageContext: {pageId: '/page/home', module: 'Home'},
        from: '',
        to: 'Telemetry',
      }
      this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
    }
  }


  

  supportAISearch() {
    console.log('this.initiateSupportNewChat--',this.initiateSupportNewChat)
    if(this.initiateSupportNewChat) {
      let requestBody:any = {
        "channel_id": "web",
        // "session_id": this.chatId,
        "text": this.cloneSearchQuery,
        "audio": "",
        "language": this.activeLaguage
      }
        this.chatbotService.aiSendChathForSupport(requestBody,  this.userId).subscribe((data)=>{
          this.resultFetch = true
        this.aiSearchResult = data 
        
        //let arr:any = []
        // this.aiSearchResult.RetrievedChunks && this.aiSearchResult.RetrievedChunks.map((item:any)=>{
        //   let startTime = 0
        //   let endTime = 0
        //   let pageNumber:any = 1
        //   if(item && item?.contentStart) {
        //     startTime = item?.contentStart
        //     pageNumber= item?.contentStart
        //   }
        //   if(item && item?.ContentEnd) {
        //     endTime = item?.ContentEnd
        //     pageNumber= item?.ContentEnd
        //   }
        //   pageNumber = pageNumber !== " " ? pageNumber : 1
          
        //   let resultObj = {        
        //     message: item.Name,
        //     recommendedQues: '',
        //     selectedValue: '',       
        //     title: item.Name,
        //     content: item,
        //     mimeType: item.mimeType,
        //     contentType: item.ContentType,
        //     artifactUrl: item.ArtifactURL,
        //     description: item.Description,
        //     identifier: item.Identifier,    
        //     contentStart: startTime,
        //     contentEnd: endTime, 
        //     pageNumber:   pageNumber,
        //     query: this.aiSearchResult.query,
        //     query_id: this.aiSearchResult.query_id,
        //     feedback: '',
        //     resourceLink : item.mimeType === 'application/pdf'? `https://portal.igotkarmayogi.gov.in/app/amrit-gyaan-kosh/player/pdf/${item.Identifier}?primaryCategory=Learning Resource&from=globalSearch&playerPreview=true&pn=${pageNumber}`: `https://portal.igotkarmayogi.gov.in/app/amrit-gyaan-kosh/player/video/${item.Identifier}?primaryCategory=Learning Resource&from=globalSearch&playerPreview=true&st=${startTime}&et=${endTime}`
        //   }
    
        //   // arr.push(resultObj)
        //   this.iGOTAISearchResultArr.push(resultObj)
          
        // })
        let answer = this.aiSearchResult.text ? this.aiSearchResult.text.trim().replace(/\n/g, '<br>') : ""
        let shortAnswer =  this.splitParagraphByWords(answer)
        this.aiSearchResultArr.push({showBot: true, wordsCount: answer.trim().split(/\s+/).length, showLess: answer.trim().split(/\s+/).length > 30 ? true : false ,answer: answer, shortAnswer: shortAnswer ,result: this.iGOTAISearchResultArr, type: 'incoming',  tab: 'support-ai', reterivedChunks: this.aiSearchResult.RetrievedChunks, showFromInternet: (!(this.aiSearchResult.answer) && !(this.aiSearchResult.RetrievedChunks)) ? true : false})
        this.aiSearchResultArr.map((item:any, index:any)=>{
          if(item && (item.newMessage === '')) {
            // delete this.aiSearchResultArr[index]
            this.aiSearchResultArr.splice(index,1)
          }
         })
        // setTimeout(()=>{
        //   this.scrollToBottomEvent.emit() 
        // },0)
        
        })
        
        const event = {
          eventType: WsEvents.WsEventType.Telemetry,
          eventLogLevel: WsEvents.WsEventLogLevel.Info,
          data: {
            edata: { type: 'click',  "id": "support-ai-global-search", "pageid": "/page/home"   },
            object: { },
            state: WsEvents.EnumTelemetrySubType.Interact,
            eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
            mode: 'view',
          },
          pageContext: {pageId: '/page/home', module: 'Home'},
          from: '',
          to: 'Telemetry',
        }
        this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
    }
   
    
   
    
  }

  sharePositiveContentRating(item:any, index:any, cindex:any) {
    let requestBody:any = {
      "query_id": item?.query_id,
      // "response": item?.description,
      "comments": "accurate",
      "is_liked":true,
      "rating": "5"

   }
   
   //this.matSnackBar.open('Unable to fetch content data, due to some error!')
   this.chatbotService.saveAIChatPositiveContentRating(requestBody, this.chatId, this.userId).subscribe((data:any)=>{
    if(data && data.status === 'success') {
      // this.matSnackBar.openFromComponent(SnackbarComponent, {
      //   data: {
      //     message: 'Thank you for your feedback.', type: 'success',
      //   }, duration: 5000, panelClass: 'course-success-snackbar',
      // })
      // console.log(this.aiSearchResultArr, index, this.aiSearchResultArr[index])
      if(this.aiSearchResultArr && this.aiSearchResultArr.length && this.aiSearchResultArr[index]) {
        if(this.aiSearchResultArr[index].result && this.aiSearchResultArr[index].result[cindex])
          this.aiSearchResultArr[index].result[cindex]['feedback'] = 'up'
      }
      this.matSnackBarNew.open(
        'Thank you for your feedback.', 'X',
        { duration: 5000, panelClass: ['success'] }
      );
      
    } else {
      this.matSnackBarNew.open(
        'Something is wrong. Please try again later.', 'X',
        { duration: 5000, panelClass: ['error'] }
      );
    }

  })
  }

  openAIFeedbackPopup(item:any, index:any, cindex:any) {
    if(this.aiSearchResultArr && this.aiSearchResultArr.length && this.aiSearchResultArr[index] && this.aiSearchResultArr[index]) {
      if(this.aiSearchResultArr[index].result && this.aiSearchResultArr[index].result[cindex] && this.aiSearchResultArr[index].result[cindex]['feedback'] !== 'down') {
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
      // "response": item?.description,
      "comments": result,
      "is_liked":false,
      "rating": "0"

   }
     this.chatbotService.shareAIFeedback(requestBody, this.chatId, this.userId).subscribe((data:any)=>{
      if(data  && data.status === 'success') {
        if(this.aiSearchResultArr && this.aiSearchResultArr.length && this.aiSearchResultArr[index]) {
          if(this.aiSearchResultArr[index].result && this.aiSearchResultArr[index].result[cindex])
            this.aiSearchResultArr[index].result[cindex]['feedback'] = 'down'
        }
        this.matSnackBarNew.open(
          'Thank you for your feedback.', 'X',
          { duration: 5000, panelClass: ['success'] }
        );
      } else {
        this.matSnackBarNew.open(
          'Something is wrong. Please try again later.', 'X',
          { duration: 5000, panelClass: ['error'] }
        );
      }
     })
  }

  callFromInternet(item:any, index:any) {
    this.resultFetch = false
    this.aiSearchResultArr.push({showBot: true, type: 'incoming',  tab: 'support-ai', answer: '', newMessage: ''})
    if( this.aiSearchResultArr[index] && this.aiSearchResultArr[index]['showFromInternet']) {
      this.aiSearchResultArr[index]['showFromInternet'] = false
    }
    
    if(item && !item.answer) {

      let internetGlobalSearchRequest = {
        "query": this.cloneSearchQuery,
        "designation":  this.userInfo?.professionalDetails && this.userInfo?.professionalDetails.length ? this.userInfo?.professionalDetails[0].designation : '',
        "department": this.userInfo?.departmentName ? this.userInfo?.departmentName : '',
      }
      this.chatbotService.aiGlobalSearchFromInternet(internetGlobalSearchRequest, this.chatId, this.userId).subscribe((idata:any)=>{
        this.resultFetch = true
        this.aiSearchResultArr.map((item:any, index:any)=>{
          if(item && (item.newMessage === '')) {
            // delete this.aiSearchResultArr[index]
            this.aiSearchResultArr.splice(index,1)
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
          fromInternet: true,
          feedback: ''
        }

        this.iGOTAISearchResultArr.push(resultObj)
        let answer = idata.answer ? idata.answer.trim().replace(/\n/g, '<br>') : ""
        let shortAnswer =  this.splitParagraphByWords(answer)
        this.aiSearchResultArr.push({ showBot: true, wordsCount: answer.trim().split(/\s+/).length, showLess: answer.trim().split(/\s+/).length > 30 ? true : false ,answer: answer, shortAnswer: shortAnswer ,result: this.iGOTAISearchResultArr, type: 'incoming',  tab: 'support-ai', reterivedChunks: this.aiSearchResult.RetrievedChunks, showFromInternet: false})
        this.aiSearchResultArr.map((item:any, index:any)=>{
          if(item && (item.newMessage === '')) {
            // delete this.aiSearchResultArr[index]
            this.aiSearchResultArr.splice(index,1)
          }
         })
        // setTimeout(()=>{
        //   this.scrollToBottomEvent.emit() 
        // },0)
      })
    }
  }

  rejectFromInternet(index:any) {
    if( this.aiSearchResultArr[index] && this.aiSearchResultArr[index]['showFromInternet']) {
      this.aiSearchResultArr[index]['showFromInternet'] = false
    }
    this.resultFetch = true
    this.aiSearchResultArr.map((item:any, index:any)=>{
      if(item && (item.newMessage === '')) {
        // delete this.aiSearchResultArr[index]
        this.aiSearchResultArr.splice(index,1)
      }
     })
  }

  copyPath(item:any, cindex:any) {
    const selBox = document.createElement('textarea')
    selBox.style.position = 'fixed'
    selBox.style.left = '0'
    selBox.style.top = '0'
    selBox.style.opacity = '0'
    selBox.value = item.mimeType === 'application/pdf'? `https://portal.igotkarmayogi.gov.in/app/amrit-gyaan-kosh/player/pdf/${item.identifier}?primaryCategory=Learning Resource&from=globalSearch&playerPreview=true&pn=${item.pageNumber}`: `https://portal.igotkarmayogi.gov.in/app/amrit-gyaan-kosh/player/video/${item.identifier}?primaryCategory=Learning Resource&from=globalSearch&playerPreview=true&st=${item?.contentStart}&et=${item?.contentEnd}`
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

  redirectToResource(item:any) {   
    let path = (item.mimeType) === 'application/pdf'? `https://portal.igotkarmayogi.gov.in/app/amrit-gyaan-kosh/player/pdf/${item.identifier}?primaryCategory=Learning Resource&from=globalSearch&playerPreview=true&pn=${item.pageNumber}`: `https://portal.igotkarmayogi.gov.in/app/amrit-gyaan-kosh/player/video/${item.identifier}?primaryCategory=Learning Resource&from=globalSearch&playerPreview=true&st=${item?.contentStart}&et=${item?.contentEnd}`
    window.open(path, '_blank')
  }

  redirectToToc(chat:any) {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click',  "id": "card-content", "pageid": "/page/home"   },
        object: { id: chat?.identifier, type: chat?.contentType},
        state: WsEvents.EnumTelemetrySubType.Interact,
        eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
        mode: 'view',
      },
      pageContext: {pageId: '/page/home', module: 'Home'},
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
      this.aiSearchResultArr[index]['showLess'] = true
    } else {
      this.aiSearchResultArr[index]['showLess'] = false
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

        if (name.charAt(i) === name.charAt(i)) {
          initials += name.charAt(i)

          if (initials.length === 2) {
            break
          }
        }
      }
    }
    this.initials = initials.toUpperCase()
  }

  raiseTelemetryForResource(item:any) {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click',  "id": "card-content", "pageid": "/page/home"   },
        object: { id: item?.identifier, type: item?.contentType},
        state: WsEvents.EnumTelemetrySubType.Interact,
        eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
        mode: 'view',
      },
      pageContext: {pageId: '/page/home', module: 'Home'},
      from: '',
      to: 'Telemetry',
    }
    this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
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
        this.searchQuery = this.searchQuery.trim()        
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

  ngOnDestroy(): void {
   
  }
}