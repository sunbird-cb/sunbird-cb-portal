import { AfterViewChecked, AfterViewInit, Component,ElementRef,EventEmitter,Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils-v2';
import { RootService } from '../../component/root/root.service';
import { environment } from '../../../environments/environment';  
import { NonReleventFeedbackDialogComponent } from '@sunbird-cb/collection/src/lib/_common/non-relevent-feedback-dialog/non-relevent-feedback-dialog.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { MatSnackBar as MatSnackbarNew } from '@angular/material/snack-bar'
import cloneDeep from 'lodash/cloneDeep';
// import { timeout, catchError } from 'rxjs/operators';
// import { throwError } from 'rxjs';
@Component({
  selector: 'ws-app-igot-sarthi',
  templateUrl: './igot-sarthi.component.html',
  styleUrls: ['./igot-sarthi.component.scss']
})
export class IGotSarthiComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() from = ''
  @Input() userJourney = []
  @Input() chatId = ''
  @Input() userId = ''
  @Input() fullScreenChatFlag = false  
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
  searchAPIResponseInProgress = false
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
  isLoading = false;
  hasError = false;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef | undefined
  // @ViewChild('autoResizeTextarea') textArea!: ElementRef;
  @ViewChild('autoResizeTextarea') textArea!: ElementRef<HTMLTextAreaElement>;
  isHubEnable!: boolean
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
   
    if(this.chatbotService.iGOTAIChatHistory && this.chatbotService.iGOTAIChatHistory.length) {
      this.aiSearchResultArr = this.chatbotService.iGOTAIChatHistory 
      this.aiSearchResultArr.map((item:any, index:any)=>{
        if(item && (item?.newMessage === '')) {
          // delete this.aiSearchResultArr[index]
          this.aiSearchResultArr.splice(index,1)
        }
      })
    }
  }

  ngAfterViewInit(): void {
    this.resizeTextarea(this.textArea.nativeElement,'');
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
    if (!this.searchQuery.trim()) {
      event.preventDefault(); // Prevents Enter key from adding a new line
    }
    // console.log('this.aiSearchResultArr--->', this.aiSearchResultArr)
    this.searchQuery = this.searchQuery.trim()
    if(this.searchQuery && !this.searchAPIResponseInProgress) {
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
     tab: 'sarthi',
     question: this.searchQuery
   }
   this.cloneSearchQuery = cloneDeep(this.searchQuery);
   this.aiSearchResultArr.push(sendMsgObj)
   this.aiSearchResultArr.push({type: 'incoming',  tab: 'sarthi', answer: '', newMessage: ''})
   
   if(this.aiSearchResultArr.length > 2) {
    setTimeout(()=>{
      this.scrollToBottomEvent.emit() 
    },0)
   }  
    this.searchQuery = ''
    this.resetTextAreaHeight(textArea)
    this.aiGlobalSearch()
    // setTimeout(()=>{
    //   this.searchQuery = ''
    // },1000)
   
  //  this.getAiTutorMessage()
  // this.sendAITutorMessage()
      
    }
  }


  

  aiGlobalSearch() {
    this.searchAPIResponseInProgress = true
    this.iGOTAISearchResultArr = []
    let requestBody:any = {
      "query":this.cloneSearchQuery
   }

   this.isLoading = true;
    this.hasError = false;
    this.chatbotService.aiGlobalSearch(requestBody, this.chatId, this.userId).subscribe({
      next: (data:any) => {
        this.searchAPIResponseInProgress = false
      this.resultFetch = true
    this.aiSearchResult = data 

    // this.aiSearchResult = {

    //   "answer": "",
    //   "RetrievedChunks": [
    //       {
    //           "Identifier": "do_1136364937253437441916",
    //           "Name": "Microsoft Excel for Beginners",
    //           "Description": "Welcome to the Beginner's Guide course in Excel. This Excel Course enables you to Learn MS Excel in simple and easy steps. In this course we will learn how to Enter and edit Excel data, Format numbers, fonts, and alignment make simple pivot tables and charts, create simple Excel formulas, filters, formatting. Learn common Excel functions used in any Office.\n\nExpected Outcomes:\n\n· Understand how to start Excel documents and navigate through them,\n\n· One can pin documents and templates in MS Excel as per their requirement.\n\n· Every Ribbon menu comprises functions that help in using MS Excel easily.\n\n· Understand the different elements of Excel and how to use them.\n\n· Individuals can look into specific Sheet Views, zoom into the data, and even input the data.\n\n· Individuals can insert, store, wrap, and format data in worksheets.\n\n· The Page Layout tab provides commands for the user which help them in preparing the workbook.\n\n· Long sets of values or texts in the cells, to fit them all, the Merge function can be used to fit all the data.\n\n· Print View and Sorting are two basic and important functions of MS Excel which helps the user in printing exactly the required set of data and also sorting the data as per their requirement.\n\n· Change the orientation of the text and apply formatting changes with the help of the Format Painter tool in the cells.\n\n· Individuals can calculate data and numbers with the library of formulas available.\n\n· Learning how to calculate the average of numbers.\n\n· The subtraction formula does not exist in Excel, but yet individuals can calculate the subtraction value.\n\n· Learn how to calculate the product of numbers in different methods.\n\n· Learn how to use the Division formula in Excel.\n\n· Individuals can copy formulas and use them anywhere in the data sets without changing or relocating the values in the cell.\n\n· The function of the Freeze pane is to lock rows and columns.\n\n· Individuals can enter words and phrases of the function; they want to ",
    //           "ContentType": "Course",
    //           "ArtifactUrl": "unknown",
    //           "mimeType": "application/vnd.ekstep.content-collection",
    //           "contentStart": " ",
    //           "ContentEnd": " ",
    //           "similarity": 0.31391570667359525
    //       },
    //       {
    //           "Identifier": "do_11363681497528729611020",
    //           "Name": "Microsoft Excel Advanced",
    //           "Description": "Microsoft Office 365 Productivity Suite Training for government Officials powered by the Ministry of Skill Development & Entrepreneurship and Capacity Building Commission in partnership with Microsoft.\nWe aim to enhance the functional computer literacy of nearly 2.5 million civil servants of the Government of India (GoI). This training program will digitally empower officials to provide efficient and effective citizen-centric services to the vulnerable and underprivileged sections of society. It will enable them to deliver last-mile social welfare services.",
    //           "ContentType": "Course",
    //           "ArtifactUrl": "unknown",
    //           "mimeType": "application/vnd.ekstep.content-collection",
    //           "contentStart": " ",
    //           "ContentEnd": " ",
    //           "similarity": 0.3113991646908274
    //       },
    //       {
    //           "Identifier": "do_11363683220894515211071",
    //           "Name": "Inserting Automatic Subtotal In Lists",
    //           "Description": "Individuals can insert automatic subtotals in already sorted lists.",
    //           "ContentType": "Resource",
    //           "ArtifactUrl": "https://igotkarmayogi.gov.in/content-store/content/do_11363683220894515211071/artifact/do_11363683220894515211071_1664653065858_insertingautomaticsubtotalinlists1664653041080.mp4",
    //           "mimeType": "video/mp4",
    //           "contentStart": "480",
    //           "ContentEnd": "510",
    //           "similarity": 0.23258735082034232
    //       },
    //       {
    //           "Identifier": "do_11363683198664704011066",
    //           "Name": "Flash Fill",
    //           "Description": "Flash Fill helps in automatically filling up data in the cells, once it recognizes the pattern.",
    //           "ContentType": "Resource",
    //           "ArtifactUrl": "https://igotkarmayogi.gov.in/content-store/content/do_11363683198664704011066/artifact/do_11363683198664704011066_1664652756044_flashfill1664652739081.mp4",
    //           "mimeType": "video/mp4",
    //           "contentStart": "480",
    //           "ContentEnd": "502",
    //           "similarity": 0.22146977289147618
    //       },
    //       {
    //           "Identifier": "do_11363683440009216011090",
    //           "Name": "Reference ",
    //           "Description": "Reference ",
    //           "ContentType": "Resource",
    //           "ArtifactUrl": "https://igotkarmayogi.gov.in/content-store/content/do_11363683440009216011090/artifact/do_11363683440009216011090_1664787426206_microsoftexcelphase211664787425423.pdf",
    //           "mimeType": "application/pdf",
    //           "contentStart": "2",
    //           "ContentEnd": "2",
    //           "similarity": 0.21836847481351385
    //       }
    //   ],
    //   "query_id": "e10f0b10-2bd5-42a7-803d-ecb845ff2dea",
    //   "query": "i  want to learn excel"
    // }

  //  if(this.aiSearchResult && !this.aiSearchResult.answer && !this.aiSearchResult.RetrievedChunks) {
  //   this.aiSearchResult.RetrievedChunks = []
  //  }
    
    //let arr:any = []
    let showSimiliarResultsFlag = false 
    let showFromInternet = false
    let showReterivedChunks = true
    if(!this.aiSearchResult.answer  &&  this.aiSearchResult.RetrievedChunks?.length) {
      showSimiliarResultsFlag = true
      showFromInternet = true
      showReterivedChunks = false
    }
    if(!this.aiSearchResult.answer  &&  !this.aiSearchResult.RetrievedChunks?.length) {
      showFromInternet = true
    } 
    this.aiSearchResult.RetrievedChunks && this.aiSearchResult.RetrievedChunks.map((item:any)=>{
      let startTime = -1
      let endTime = -1
      let pageNumber:any = 1
      if(item && item?.contentStart?.trim()) {
        startTime = item?.contentStart
        pageNumber= item?.contentStart
      }
      if(item && item?.ContentEnd?.trim()) {
        endTime = item?.ContentEnd
        pageNumber= item?.ContentEnd
      }
      pageNumber = pageNumber !== " " ? pageNumber : 1
      
      let resultObj = {        
        message: item.Name,
        recommendedQues: '',
        selectedValue: '',       
        title: item.Name,
        content: item,
        mimeType: item.mimeType,
        contentType: item.ContentType,
        artifactUrl: item.ArtifactURL,
        description: item?.Description?.replace(/^\s{4,}/gm, ''),
        identifier: item.Identifier,    
        contentStart: startTime,
        contentEnd: endTime, 
        pageNumber:   pageNumber,
        query: this.aiSearchResult.query,
        query_id: this.aiSearchResult.query_id,
        feedback: '',
        resourceLink : item.mimeType === 'application/pdf'? `https://portal.igotkarmayogi.gov.in/app/amrit-gyaan-kosh/player/pdf/${item.Identifier}?primaryCategory=Learning Resource&from=globalSearch&playerPreview=true&pn=${pageNumber}`: 
        (startTime <=0 && endTime <= 0) ? `https://portal.igotkarmayogi.gov.in/app/amrit-gyaan-kosh/player/video/${item.Identifier}?primaryCategory=Learning Resource&from=globalSearch&playerPreview=true` :`https://portal.igotkarmayogi.gov.in/app/amrit-gyaan-kosh/player/video/${item.Identifier}?primaryCategory=Learning Resource&from=globalSearch&playerPreview=true&st=${startTime}&et=${endTime}`
      }

      // arr.push(resultObj)
      this.iGOTAISearchResultArr.push(resultObj)
      
    })
    let answer = this.aiSearchResult.answer ? this.aiSearchResult.answer.trim().replace(/\n/g, '<br>') : ""
    let shortAnswer =  this.splitParagraphByWords(answer)
    
    
    this.aiSearchResultArr.push({ wordsCount: answer.trim().split(/\s+/).length, showLess: answer.trim().split(/\s+/).length > 30 ? true : false ,answer: answer, shortAnswer: shortAnswer ,result: this.iGOTAISearchResultArr, type: 'incoming',  tab: 'sarthi', reterivedChunks: this.aiSearchResult.RetrievedChunks, showFromInternet: showFromInternet, showSimiliarResultsFlag : showSimiliarResultsFlag, showReterivedChunks: showReterivedChunks})
    this.aiSearchResultArr.map((item:any, index:any)=>{
      if(item && (item.newMessage === '')) {
        // delete this.aiSearchResultArr[index]
        this.aiSearchResultArr.splice(index,1)
      }
     })
     this.chatbotService.iGOTAIChatHistory = this.aiSearchResultArr
    setTimeout(()=>{
     // this.scrollToBottomEvent.emit() 
    },0)
      },
      error: (err:any) => {
        console.error('API failed:', err);
        this.searchAPIResponseInProgress = false
        this.hasError = true;
        this.isLoading = false;
      }
    });

    

  //   this.chatbotService.aiGlobalSearch(requestBody, this.chatId, this.userId).subscribe((data)=>{
  //     this.searchAPIResponseInProgress = false
  //     this.resultFetch = true
  //   this.aiSearchResult = data 

  //  if(this.aiSearchResult && !this.aiSearchResult.answer && !this.aiSearchResult.RetrievedChunks) {
  //   this.aiSearchResult.RetrievedChunks = []
  //  }
    
  //   //let arr:any = []
  //   this.aiSearchResult.RetrievedChunks && this.aiSearchResult.RetrievedChunks.map((item:any)=>{
  //     let startTime = 0
  //     let endTime = 0
  //     let pageNumber:any = 1
  //     if(item && item?.contentStart) {
  //       startTime = item?.contentStart
  //       pageNumber= item?.contentStart
  //     }
  //     if(item && item?.ContentEnd) {
  //       endTime = item?.ContentEnd
  //       pageNumber= item?.ContentEnd
  //     }
  //     pageNumber = pageNumber !== " " ? pageNumber : 1
      
  //     let resultObj = {        
  //       message: item.Name,
  //       recommendedQues: '',
  //       selectedValue: '',       
  //       title: item.Name,
  //       content: item,
  //       mimeType: item.mimeType,
  //       contentType: item.ContentType,
  //       artifactUrl: item.ArtifactURL,
  //       description: item.Description,
  //       identifier: item.Identifier,    
  //       contentStart: startTime,
  //       contentEnd: endTime, 
  //       pageNumber:   pageNumber,
  //       query: this.aiSearchResult.query,
  //       query_id: this.aiSearchResult.query_id,
  //       feedback: '',
  //       resourceLink : item.mimeType === 'application/pdf'? `https://portal.igotkarmayogi.gov.in/app/amrit-gyaan-kosh/player/pdf/${item.Identifier}?primaryCategory=Learning Resource&from=globalSearch&playerPreview=true&pn=${pageNumber}`: `https://portal.igotkarmayogi.gov.in/app/amrit-gyaan-kosh/player/video/${item.Identifier}?primaryCategory=Learning Resource&from=globalSearch&playerPreview=true&st=${startTime}&et=${endTime}`
  //     }

  //     // arr.push(resultObj)
  //     this.iGOTAISearchResultArr.push(resultObj)
      
  //   })
  //   let answer = this.aiSearchResult.answer ? this.aiSearchResult.answer.trim().replace(/\n/g, '<br>') : ""
  //   let shortAnswer =  this.splitParagraphByWords(answer)
  //   this.aiSearchResultArr.push({ wordsCount: answer.trim().split(/\s+/).length, showLess: answer.trim().split(/\s+/).length > 30 ? true : false ,answer: answer, shortAnswer: shortAnswer ,result: this.iGOTAISearchResultArr, type: 'incoming',  tab: 'sarthi', reterivedChunks: this.aiSearchResult.RetrievedChunks, showFromInternet: (!(this.aiSearchResult.answer) && !(this.aiSearchResult.RetrievedChunks)) ? true : false})
  //   this.aiSearchResultArr.map((item:any, index:any)=>{
  //     if(item && (item.newMessage === '')) {
  //       // delete this.aiSearchResultArr[index]
  //       this.aiSearchResultArr.splice(index,1)
  //     }
  //    })
  //   setTimeout(()=>{
  //     this.scrollToBottomEvent.emit() 
  //   },0)
    
  //   }, (error:any)=>{
  //     console.log('error', error)
  //   })
    
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click',  "id": "ai-global-search", "pageid": "/page/home" ,"subType" : "ai-global-search"  },
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

  sharePositiveContentRating(item:any, index:any, cindex:any) {
    let requestBody:any = {
      "query_id": item?.query_id,
      // "response": item?.description,
      "comments": "",
      "is_liked":true,
      "rating": "5",
      "identifier": item.identifier ? item.identifier : '',
      "query": item?.query,
      "chat_id": this.chatId,
      "user_id": this.userId

   }
   if(this.aiSearchResultArr && this.aiSearchResultArr.length && this.aiSearchResultArr[index]) {
    if(this.aiSearchResultArr[index].result && this.aiSearchResultArr[index].result[cindex])
      this.aiSearchResultArr[index].result[cindex]['showLoader'] = true
      this.aiSearchResultArr[index].result[cindex]['showLoaderForUp'] = true
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
        if(this.aiSearchResultArr[index].result && this.aiSearchResultArr[index].result[cindex]) {
          this.aiSearchResultArr[index].result[cindex]['feedback'] = 'up'
          this.aiSearchResultArr[index].result[cindex]['showLoader'] = false
          this.aiSearchResultArr[index].result[cindex]['showLoaderForUp'] = false
        }
          
      }
      this.matSnackBarNew.open(
        'Thank you for your feedback.', 'X',
        { duration: 5000, panelClass: ['success'] }
      );
      
    } else {
      if(this.aiSearchResultArr && this.aiSearchResultArr.length && this.aiSearchResultArr[index]) {
        if(this.aiSearchResultArr[index].result && this.aiSearchResultArr[index].result[cindex])
          this.aiSearchResultArr[index].result[cindex]['showLoader'] = false
          this.aiSearchResultArr[index].result[cindex]['showLoaderForUp'] = false
      }
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
      "rating": "0",
      "chat_id": this.chatId,
      "user_id": this.userId,
      "identifier":item.identifier ? item.identifier : '',
      "query": item?.query

   }
   if(this.aiSearchResultArr && this.aiSearchResultArr.length && this.aiSearchResultArr[index]) {
    if(this.aiSearchResultArr[index].result && this.aiSearchResultArr[index].result[cindex]) {
      this.aiSearchResultArr[index].result[cindex]['showLoader'] = true
      this.aiSearchResultArr[index].result[cindex]['showLoaderForDown'] = true
    }
      
  }
     this.chatbotService.shareAIFeedback(requestBody, this.chatId, this.userId).subscribe((data:any)=>{
      if(data  && data.status === 'success') {
        if(this.aiSearchResultArr && this.aiSearchResultArr.length && this.aiSearchResultArr[index]) {
          if(this.aiSearchResultArr[index].result && this.aiSearchResultArr[index].result[cindex]) {
            this.aiSearchResultArr[index].result[cindex]['feedback'] = 'down'
            this.aiSearchResultArr[index].result[cindex]['showLoader'] = false
            this.aiSearchResultArr[index].result[cindex]['showLoaderForDown'] = false
          }
            
        }
        this.matSnackBarNew.open(
          'Thank you for your feedback.', 'X',
          { duration: 5000, panelClass: ['success'] }
        );
      } else {
        if(this.aiSearchResultArr && this.aiSearchResultArr.length && this.aiSearchResultArr[index]) {
          if(this.aiSearchResultArr[index].result && this.aiSearchResultArr[index].result[cindex])
            this.aiSearchResultArr[index].result[cindex]['showLoader'] = false
          this.aiSearchResultArr[index].result[cindex]['showLoaderForDown'] = false
        }
        this.matSnackBarNew.open(
          'Something is wrong. Please try again later.', 'X',
          { duration: 5000, panelClass: ['error'] }
        );
      }
     })
  }

  callFromInternet(item:any, index:any) {
    this.resultFetch = false
    
    this.aiSearchResultArr.push({type: 'incoming',  tab: 'sarthi', answer: '', newMessage: ''})
    if( this.aiSearchResultArr[index] && this.aiSearchResultArr[index]['showFromInternet']) {
      this.aiSearchResultArr[index]['showFromInternet'] = false
      this.aiSearchResultArr[index]['showSimiliarResultsFlag'] = false
    }
    
    if(item && !item.answer) {
      this.searchAPIResponseInProgress = true
      let internetGlobalSearchRequest = {
        "query": this.cloneSearchQuery,
        "designation":  this.userInfo?.professionalDetails && this.userInfo?.professionalDetails.length ? this.userInfo?.professionalDetails[0].designation : '',
        "department": this.userInfo?.departmentName ? this.userInfo?.departmentName : '',
      }
      this.chatbotService.aiGlobalSearchFromInternet(internetGlobalSearchRequest, this.chatId, this.userId).subscribe((idata:any)=>{
        this.searchAPIResponseInProgress = false
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
        this.aiSearchResultArr.push({ wordsCount: answer.trim().split(/\s+/).length, showLess: answer.trim().split(/\s+/).length > 30 ? true : false ,answer: answer, shortAnswer: shortAnswer ,result: this.iGOTAISearchResultArr, type: 'incoming',  tab: 'sarthi', reterivedChunks: this.aiSearchResult.RetrievedChunks, showFromInternet: false, fromInternet: true})
        this.aiSearchResultArr.map((item:any, index:any)=>{
          if(item && (item.newMessage === '')) {
            // delete this.aiSearchResultArr[index]
            this.aiSearchResultArr.splice(index,1)
          }
         })
         this.chatbotService.iGOTAIChatHistory = this.aiSearchResultArr
        setTimeout(()=>{
          this.scrollToBottomEvent.emit() 
        },0)
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
    if(item?.contentType === 'Resource') {
      selBox.value = item.mimeType === 'application/pdf'? `https://portal.igotkarmayogi.gov.in/app/amrit-gyaan-kosh/player/pdf/${item.identifier}?primaryCategory=Learning Resource&from=globalSearch&playerPreview=true&pn=${item.pageNumber}`: 
      (item?.contentStart <=0 && item?.contentEnd <= 0 ) ? `https://portal.igotkarmayogi.gov.in/app/amrit-gyaan-kosh/player/video/${item.identifier}?primaryCategory=Learning Resource&from=globalSearch&playerPreview=true` : `https://portal.igotkarmayogi.gov.in/app/amrit-gyaan-kosh/player/video/${item.identifier}?primaryCategory=Learning Resource&from=globalSearch&playerPreview=true&st=${item?.contentStart}&et=${item?.contentEnd}`
    } else {
      selBox.value = `https://portal.igotkarmayogi.gov.in/app/toc/${item?.identifier}/overview`
    }
    
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
    let path = (item.mimeType) === 'application/pdf'? `https://portal.igotkarmayogi.gov.in/app/amrit-gyaan-kosh/player/pdf/${item.identifier}?primaryCategory=Learning Resource&from=globalSearch&playerPreview=true&pn=${item.pageNumber}`: 
    (item?.contentStart <=0 && item?.contentEnd <=0) ? `https://portal.igotkarmayogi.gov.in/app/amrit-gyaan-kosh/player/video/${item.identifier}?primaryCategory=Learning Resource&from=globalSearch&playerPreview=true` : `https://portal.igotkarmayogi.gov.in/app/amrit-gyaan-kosh/player/video/${item.identifier}?primaryCategory=Learning Resource&from=globalSearch&playerPreview=true&st=${item?.contentStart}&et=${item?.contentEnd}`
    window.open(path, '_blank')
  }

  redirectToToc(chat:any) {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click',  "id": "card-content", "pageid": "/page/home" ,"subType" : "ai-global-search"  },
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
        edata: { type: 'click',  "id": "card-content", "pageid": "/page/home","subType" : "ai-global-search"   },
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

  loadFailedData( ) {
    // this.aiSearchResultArr.push({type: 'incoming',  tab: 'sarthi', answer: '', newMessage: ''})
     this.aiGlobalSearch()
  }

  viewSimiliarResults(index:any) {
    this.aiSearchResultArr[index]['showReterivedChunks'] = true
    this.aiSearchResultArr[index]['showSimiliarResultsFlag'] = false
    this.aiSearchResultArr[index]['showFromInternet'] = false
    
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