import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils';

@Component({
  selector: 'ws-app-chatbot',
  templateUrl: './app-chatbot.component.html',
  styleUrls: ['./app-chatbot.component.scss']
})
export class AppChatbotComponent implements OnInit {

  showIcon :boolean = true
  categories: any[] = []
  language: any[] = [
    {value: 'english', viewValue: 'English'},
    {value: 'hindi', viewValue: 'Hindi'},
    {value: 'kannada', viewValue: 'Kannada'},
  ];
  currentFilter: string = 'info'

  responseData:any
  userInfo:any
  userJourney: any = []
  chatInfo :any = []
  recomendedQns :any = {}
  questionsAndAns: any = {}
  more = false
  constructor(private configSvc: ConfigurationsService, private eventSvc: EventService) { }

  ngOnInit() {
    this.userInfo = this.configSvc && this.configSvc.userProfile
    this.responseData = {
      "categoryMapIN": [
        {
          "catId": "INENC101",
          "catName": "Karmayogi"
        },
        {
          "catId": "INENC102",
          "catName": "Registration"
        },
        {
          "catId": "INENC103",
          "catName": "Login"
        },
        {
          "catId": "INENC104",
          "catName": "Profile"
        },
        {
          "catId": "INENC105",
          "catName": "Hubs"
        },
        {
          "catId": "INENC106",
          "catName": "Learning, Assessment and Certifications"
        }
      ],
      "Recommendation_Map_IN": [
        {
          "catId": "INENC101",
          "categoryType": "Not Logged-In",
          "priority": 1,
          "recommendedQues": [
            {
              "priority": 1,
              "quesID": "INENC101L1Q101",
              "recommendedQues": [
                {
                  "priority": 1,
                  "quesID": "INENC101L1Q101L2Q101"
                }
              ]
            },
            {
              "priority": 2,
              "quesID": "INENC101L1Q102",
              "recommendedQues": []
            }
          ]
        },
        {
          "catId": "INENC106",
          "categoryType": "Logged-In",
          "priority": 2,
          "recommendedQues": [
            {
              "priority": 1,
              "quesID": "INENC106L1Q105",
              "recommendedQues": [
                {
                  "priority": 1,
                  "quesID": "INENC106L1Q105L2Q108"
                }
              ]
            },
            {
              "priority": 2,
              "quesID": "INENC106L1Q104",
              "recommendedQues": [
                {
                  "priority": 1,
                  "quesID": "INENC106L1Q104L2Q104"
                }
              ]
            },
            {
              "priority": 3,
              "quesID": "INENC106L1Q103",
              "recommendedQues": [
                {
                  "priority": 1,
                  "quesID": "INENC106L1Q103L2Q102"
                }
              ]
            },
            {
              "priority": 4,
              "quesID": "INENC106L1Q102",
              "recommendedQues": [
                {
                  "priority": 1,
                  "quesID": "INENC106L1Q102L2Q101"
                }
              ]
            },
            {
              "priority": 5,
              "quesID": "INENC106L1Q101",
              "recommendedQues": []
            }
          ]
        },
        {
          "catId": "INENC105",
          "categoryType": "Logged-In",
          "priority": 3,
          "recommendedQues": [
            {
              "priority": 1,
              "quesID": "INENC105L1Q106",
              "recommendedQues": [
                {
                  "priority": 1,
                  "quesID": "INENC105L1Q106L2Q118"
                }
              ]
            },
            {
              "priority": 2,
              "quesID": "INENC105L1Q105",
              "recommendedQues": [
                {
                  "priority": 1,
                  "quesID": "INENC105L1Q105L2Q116"
                }
              ]
            },
            {
              "priority": 3,
              "quesID": "INENC105L1Q104",
              "recommendedQues": [
                {
                  "priority": 1,
                  "quesID": "INENC105L1Q104L2Q112"
                }
              ]
            },
            {
              "priority": 4,
              "quesID": "INENC105L1Q103",
              "recommendedQues": [
                {
                  "priority": 1,
                  "quesID": "INENC105L1Q103L2Q104"
                }
              ]
            },
            {
              "priority": 5,
              "quesID": "INENC105L1Q102",
              "recommendedQues": [
                {
                  "priority": 1,
                  "quesID": "INENC105L1Q102L2Q102"
                }
              ]
            },
            {
              "priority": 6,
              "quesID": "INENC105L1Q101",
              "recommendedQues": [
                {
                  "priority": 1,
                  "quesID": "INENC105L1Q101L2Q101"
                }
              ]
            }
          ]
        },
        {
          "catId": "INENC104",
          "categoryType": "Logged-In",
          "priority": 4,
          "recommendedQues": [
            {
              "priority": 1,
              "quesID": "INENC104L1Q102",
              "recommendedQues": [
                {
                  "priority": 1,
                  "quesID": "INENC104L1Q102L2Q105"
                }
              ]
            },
            {
              "priority": 2,
              "quesID": "INENC104L1Q101",
              "recommendedQues": [
                {
                  "priority": 1,
                  "quesID": "INENC104L1Q101L2Q104"
                },
                {
                  "priority": 2,
                  "quesID": "INENC104L1Q101L2Q103"
                },
                {
                  "priority": 3,
                  "quesID": "INENC104L1Q101L2Q102"
                },
                {
                  "priority": 4,
                  "quesID": "INENC104L1Q101L2Q101"
                }
              ]
            }
          ]
        },
        {
          "catId": "INENC103",
          "categoryType": "Not Logged-In",
          "priority": 5,
          "recommendedQues": [
            {
              "priority": 1,
              "quesID": "INENC103L1Q102",
              "recommendedQues": []
            },
            {
              "priority": 2,
              "quesID": "INENC103L1Q101",
              "recommendedQues": []
            }
          ]
        },
        {
          "catId": "INENC102",
          "categoryType": "Not Logged-In",
          "priority": 6,
          "recommendedQues": [
            {
              "priority": 1,
              "quesID": "INENC102L1Q101",
              "recommendedQues": [
                {
                  "priority": 1,
                  "quesID": "INENC102L1Q101L2Q103"
                },
                {
                  "priority": 2,
                  "quesID": "INENC102L1Q101L2Q102"
                },
                {
                  "priority": 3,
                  "quesID": "INENC102L1Q101L2Q101"
                }
              ]
            }
          ]
        }
      ],
      "quesMapIN": [
        {
          "quesId": "INENC101L1Q101",
          "ansVal": "Mission Karmayogi - National Programme for Civil Services Capacity Building has been envisioned by the Government to address the changing needs and aspiration of the citizen. The Programme has been designed to enhance the civil services under a national Programme, anchored by an apex body headed by the Prime Minister.",
          "quesValue": "What is Mission Karmayogi?"
        },
        {
          "quesId": "INENC101L1Q101L2Q101",
          "ansVal": "iGOT Karmayogi platform enables officials to explore, acquire and certify their competencies that are critical to discharging their duties. The platform also helps them connect and collaborate across silos and become more efficient in the execution of their responsibilities. These are made possible, with a series of features organized into specific hubs.",
          "quesValue": "How will Mission Karmayogi help me?"
        },
        {
          "quesId": "INENC101L1Q102",
          "ansVal": "Once logged in to the portal, go to learn hub and choose your course of interest and start learning by enrolling to it",
          "quesValue": "How can I start my learning on iGoT?"
        },
        {
          "quesId": "INENC102L1Q101",
          "ansVal": "Follow the below steps to register in iGOT Karmayogi\n1. Click on the \"Register\" button\n2. Fill all the details and click on submit\n3. Once submitted you will receive an email to set the password",
          "quesValue": "How should I register for iGoT Karmayogi?"
        },
        {
          "quesId": "INENC102L1Q101L2Q101",
          "ansVal": "Only gov email ids can be used. In case you don't have one while registering choose the request for help for the domain. Once your domain is approved you will be able to use the karmayogi portal.",
          "quesValue": "Can I use Gmail ID for registration?"
        },
        {
          "quesId": "INENC102L1Q101L2Q102",
          "ansVal": "Both email and mobile number are required while registering to the platform. \nif you are an already existing user, then by updating the mobile number you can log in using the mobile number",
          "quesValue": "Can I register using mobile Number?"
        },
        {
          "quesId": "INENC102L1Q101L2Q103",
          "ansVal": "Follow the below steps to register using parichay:\n1. Click on \"Login with Parichay\"\n2. Provide your parichay credentials\n3. Fill your details in the welcome page\n4. Start using karmayogi portal",
          "quesValue": "How to use Parichay for registration?"
        },
        {
          "quesId": "INENC103L1Q101",
          "ansVal": "Follow the below steps to register using parichay:\n1. Click on \"Login with Parichay\"\n2. Provide your parichay credentials\n3. Start using karmayogi portal",
          "quesValue": "How to use Single Sign On using Parichay?"
        },
        {
          "quesId": "INENC103L1Q102",
          "ansVal": "You can save your username and password in the browser",
          "quesValue": "Can I save my username and password for login?"
        },
        {
          "quesId": "INENC104L1Q101",
          "ansVal": "You can update your profile details by following the below steps: \n1. Click on the 'View profile' button in the profile dropdown. \n2. Click on the 'Edit profile' button \n3. Make the necessary changes and click on the 'Save details' button. Please note that a few profile details will be updated only after it is approved by the admin.",
          "quesValue": "How can I update my profile?"
        },
        {
          "quesId": "INENC104L1Q101L2Q101",
          "ansVal": "Click on \"forget your password\" in the login page and enter your email address. you will receive and OTP in your registered email id to reset the password",
          "quesValue": "How can I reset my password?"
        },
        {
          "quesId": "INENC104L1Q101L2Q102",
          "ansVal": "No you cannot change your primary email",
          "quesValue": "Can I change my email ID to my personal Email ID?"
        },
        {
          "quesId": "INENC104L1Q101L2Q103",
          "ansVal": "Placeholder Answer",
          "quesValue": "How can I the change language in which I access the portal?"
        },
        {
          "quesId": "INENC104L1Q101L2Q104",
          "ansVal": "Placeholder Answer",
          "quesValue": "How to enable/disable Email Notifications?"
        },
        {
          "quesId": "INENC104L1Q102",
          "ansVal": "A verified karmayogi badge is given to the karmayogi users whose profile is updated. This badge helps to identify the users whose details are verified and approved by the adminstrators.",
          "quesValue": "What is Verified Karmayogi Badge?"
        },
        {
          "quesId": "INENC104L1Q102L2Q105",
          "ansVal": "Update your profile with all mandatory information. Some information requires approval from the administrators to get reflected in your profile.",
          "quesValue": "How do I get a verified karmayogi badge?"
        },
        {
          "quesId": "INENC105L1Q101",
          "ansVal": "Placeholder Answer",
          "quesValue": "What are hubs?"
        },
        {
          "quesId": "INENC105L1Q101L2Q101",
          "ansVal": "Placeholder Answer",
          "quesValue": "How can different hubs help me in my career?"
        },
        {
          "quesId": "INENC105L1Q102",
          "ansVal": "Enabling the government to solve the complex problem of encouraging lifelong learning, and finding the right person for the right job. The hub will list vacancies/ job opportunities/ job postings available. \nTHE FEATURE IS COMING SOON",
          "quesValue": "What is Career hub?"
        },
        {
          "quesId": "INENC105L1Q102L2Q102",
          "ansVal": "THE FEATURE IS COMING SOON",
          "quesValue": "How can view different open positions?"
        },
        {
          "quesId": "INENC105L1Q102L2Q103",
          "ansVal": "No, You won't be apply to the job postings through career hub.\n\nTHE FEATURE IS COMING SOON",
          "quesValue": "Will I be able to apply for the job through Career hub?"
        },
        {
          "quesId": "INENC105L1Q103",
          "ansVal": "Placeholder Answer",
          "quesValue": "What is Learn Hub?"
        },
        {
          "quesId": "INENC105L1Q103L2Q104",
          "ansVal": "Placeholder Answer",
          "quesValue": "What is self-paced learning?"
        },
        {
          "quesId": "INENC105L1Q103L2Q105",
          "ansVal": "Placeholder Answer",
          "quesValue": "What are courses?"
        },
        {
          "quesId": "INENC105L1Q103L2Q106",
          "ansVal": "Programs are collections of courses. Our platform support invitation based programs, open programs and blended programs",
          "quesValue": "What are programs?"
        },
        {
          "quesId": "INENC105L1Q103L2Q107",
          "ansVal": "Placeholder Answer",
          "quesValue": "What are Open Programs?"
        },
        {
          "quesId": "INENC105L1Q103L2Q108",
          "ansVal": "Blended Programs are a collection of online and offline training, providing a comprehensive learning experience & to meet the diverse training needs of government employees, leveraging the benefits of both learning methods",
          "quesValue": "What are Blended Program?"
        },
        {
          "quesId": "INENC105L1Q103L2Q109",
          "ansVal": "Moderated courses are courses that are discoverable only to users belonging to certain Ministries, Department, and Organisations for keeping the contents secure\n",
          "quesValue": "What is moderated courses?"
        },
        {
          "quesId": "INENC105L1Q103L2Q110",
          "ansVal": "Follow the below steps to view courses created by your organisation:\n1. Go to Learn hub\n2. Click on \"Explore by competency\"\n3. Search your organisation's name\n4. View all the courses created by your organisation ",
          "quesValue": "How can I view all the courses created by my organisation?"
        },
        {
          "quesId": "INENC105L1Q103L2Q111",
          "ansVal": "Follow the below steps to view courses based on competencies:\n1. Go to learn hub\n2. Click on \"Explore by competency\"\n3. View the courses based on competency",
          "quesValue": "Is there a way to view the courses based on any particular competency?"
        },
        {
          "quesId": "INENC105L1Q104",
          "ansVal": "Discussion forum facilitates learners to interact with each other. Discussions promote collaborative learning that can add a new dimension to the iGOT Karmayogi platform. This social contact is important in reducing the feeling of isolation. Secondly, the forum allows learners to observe others, and then imitate their approach. The hub will also be a place to engage in meaningful conversations and get query resolutions on iGOT Karmayogi platform.",
          "quesValue": "What is Discuss Hub?"
        },
        {
          "quesId": "INENC105L1Q104L2Q112",
          "ansVal": "The discuss hub enables you to post your query, idea, or suggestion which will be visible to all officials on the platform. Other officials can then engage with your post, provide the necessary information and guide the official.",
          "quesValue": "How can I use disucss Hub?"
        },
        {
          "quesId": "INENC105L1Q104L2Q113",
          "ansVal": "Post or Query implies the discussion of a topic or seeking a response to a question, through the use of a Discussion board, so that users get the right and collaborative solutions for their needs.",
          "quesValue": "What is a post?"
        },
        {
          "quesId": "INENC105L1Q104L2Q114",
          "ansVal": "Placeholder Answer",
          "quesValue": "How can I delete a post?"
        },
        {
          "quesId": "INENC105L1Q104L2Q115",
          "ansVal": "Any official who have been onboarded to the iGOT Karmayogi platform will be able to view and engage with your post.",
          "quesValue": "Who can view my posts?"
        },
        {
          "quesId": "INENC105L1Q105",
          "ansVal": "Network hub will help know, connect and interact with people on iGOT Karmayogi platform.The feature will allow users to join their departmental groups and also build their own network.",
          "quesValue": "What is Network Hub?"
        },
        {
          "quesId": "INENC105L1Q105L2Q116",
          "ansVal": "It shows the professional network of a particular user, the list of government professionals you are connected with on iGOT Karmayogi. It also shows you the invitations (people who want to be added to your network) and a list of people you would like to connect with.",
          "quesValue": "What are connections?"
        },
        {
          "quesId": "INENC105L1Q105L2Q117",
          "ansVal": "There is no limit to the number of connections. You can connect with people from different organizations.",
          "quesValue": "How many connections I can have?"
        },
        {
          "quesId": "INENC105L1Q106",
          "ansVal": "Competency hub is one of the key hubs in the iGOT platform detailing about the recommended competencies for your position and your acquired competencies thus giving information about your competency gap.\n\nor\n\nThe competency hub will list out the roles, activities, and competencies an individual is required to have so as to effectively deliver on the outcomes expected from her with respect to their current and future positions in government (FRAC based). In doing so, it makes it possible to establish arrangements to test the extent to which a person occupying a position has these competencies and consequently the competency gaps, if any, that should be addressed. An individual will be able to evaluate her competency status against all the listed positions on the platform. ",
          "quesValue": "What is Competency Hub?"
        },
        {
          "quesId": "INENC105L1Q106L2Q118",
          "ansVal": "Competency is defined as a combination of attitudes, skills, and knowledge (ASK) that enable an individual to perform a task or activity successfully in a given job. There are three types of competencies – Behavioural, Domain, and Functional",
          "quesValue": "What is competency?"
        },
        {
          "quesId": "INENC105L1Q106L2Q119",
          "ansVal": "Placeholder Answer",
          "quesValue": "Where can I view my competencies?"
        },
        {
          "quesId": "INENC105L1Q106L2Q120",
          "ansVal": "Placeholder Answer",
          "quesValue": "How can I aquire more competencies?"
        },
        {
          "quesId": "INENC105L1Q106L2Q121",
          "ansVal": "Placeholder Answer",
          "quesValue": "What is competency Score?"
        },
        {
          "quesId": "INENC106L1Q101",
          "ansVal": "Placeholder Answer",
          "quesValue": "How can I start Learning?"
        },
        {
          "quesId": "INENC106L1Q102",
          "ansVal": "Placeholder Answer",
          "quesValue": "How can I enroll in courses?"
        },
        {
          "quesId": "INENC106L1Q102L2Q101",
          "ansVal": "You can resume your course by clicking on \"Resume\" button",
          "quesValue": "Can I pause a Course?"
        },
        {
          "quesId": "INENC106L1Q103",
          "ansVal": "Placeholder Answer",
          "quesValue": "How can I enroll in Programs?"
        },
        {
          "quesId": "INENC106L1Q103L2Q102",
          "ansVal": "You can resume your program by clicking on \"Resume\" button until the end date",
          "quesValue": "Can I pause a Program?"
        },
        {
          "quesId": "INENC106L1Q103L2Q103",
          "ansVal": "Yes it is necessary to pass the assessment to receive the certificate",
          "quesValue": "Is it necessary to pass an Assessment?"
        },
        {
          "quesId": "INENC106L1Q104",
          "ansVal": "Placeholder Answer",
          "quesValue": "How can I assess myself?"
        },
        {
          "quesId": "INENC106L1Q104L2Q104",
          "ansVal": "Standalone assessments are specifically built for the learners to evaluate their learning. These standalone assessments will only have practice assessments and final assessments",
          "quesValue": "What are Standalone Assessments?"
        },
        {
          "quesId": "INENC106L1Q104L2Q105",
          "ansVal": "You need to make 100% progress along with passing the assessment to get a certificate",
          "quesValue": "Will I get a certificate by passing the assessments?"
        },
        {
          "quesId": "INENC106L1Q104L2Q106",
          "ansVal": "Write an email to the support team",
          "quesValue": "What should I do if I exceed the retake limit for the assessment?"
        },
        {
          "quesId": "INENC106L1Q104L2Q107",
          "ansVal": "No you cannot resume ",
          "quesValue": "Can I resume a program after the end date?"
        },
        {
          "quesId": "INENC106L1Q105",
          "ansVal": "Once you start making progress in the course there will be a \"Rate this course\" button on the course details page to provide your rating and feedback.",
          "quesValue": "How can I rate a course?"
        },
        {
          "quesId": "INENC106L1Q105L2Q108",
          "ansVal": "Yes, the course provider will respond to your feedbacks and you can view those in the course detail page",
          "quesValue": "Will I get a reply for the feedback provided in the courses?"
        },
        {
          "quesId": "INENC106L1Q105L2Q109",
          "ansVal": "Click on the \"Rate this course\" button on the course details page and update your previous rating ",
          "quesValue": "How do I update the rating/ feedback given?"
        }
      ]
    }
    this.categories = [{ "catId": "all","catName": "Show all category"}]
    this.categories=[...this.categories, ...this.responseData.categoryMapIN]
    this.userJourney = []
    this.chatInfo = []
    let userDetails: any = {
      type: 'incoming',
      message: ` Hi ${this.userInfo && this.userInfo.firstName || ''}, I'm KarmaSahayogi - Digital Assistant, I'm here to help you.`,
      recommendedQues:this.getPriorityQuestion(1),
      selectedValue:'',
      title:'Here are the most frequently asked questions users have looked for',
      tab: 'info',
    }

    this.responseData.quesMapIN.map((q: any) => {
      this.questionsAndAns[q.quesId] = q
    })

    this.chatInfo.push(userDetails)
    this.userJourney = this.chatInfo
  }

  iconClick(type: string) {
    this.showIcon = !this.showIcon
    this.currentFilter = 'info'
    type === 'start' ? this.raiseChatStartTelemetry() : this.raiseChatEndTelemetry()
  }

  toggleFilter(tab: string) {
    tab === 'info' ? this.currentFilter = 'info' : this.currentFilter = 'issue'
  }

  selectedQuestion(question:any,data:any){
    data.selectedValue = question.quesID
    let sendMsg = {
      type:'sendMsg',
      question: this.questionsAndAns[question.quesID].quesValue,
      tab: 'info'
    }
    let incomingMsg = {
      type: 'incoming',
      message: this.questionsAndAns[question.quesID].ansVal,
      recommendedQues: question.recommendedQues || [],
      title:'Questions related to',
      relatedQes:'above Question',
      tab: 'info'
    }
    this.chatInfo.push(sendMsg)
    this.chatInfo.push(incomingMsg)
    this.userJourney = this.chatInfo
    this.raiseTemeletyInterat(question.quesID)
  }

  getuserjourney(tab: string) {
    console.log(tab)
    debugger
    return this.userJourney.filter((j: any) => j.tab === tab)
  }

  getPriorityQuestion(priority: any) {
    let recommendedQues: any[] = []
    this.responseData.Recommendation_Map_IN.map((question: any) => {
      question.recommendedQues.map((ques:any)=> {
        if (ques.priority === priority) {
          // this.recomendedQns.list.push(ques)
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
      title:'Showing more questions',
    }
    this.chatInfo.push(showMoreQes)
    this.userJourney = this.chatInfo
  }

  showCategory(catItem: any) {
    let incomingMsg = {
      type: 'category',
      message: '',
      recommendedQues: [],
      title:'What do you want to know under',
      relatedQes:`${catItem.catName}?`
    }
    if (catItem.catId === 'all') {
      incomingMsg.title= 'Here is the list of all the topics'
      incomingMsg.relatedQes = ''
      incomingMsg.recommendedQues = this.responseData.categoryMapIN
    } else {
      this.responseData.Recommendation_Map_IN.forEach((element: any) => {
        if (catItem.catId === element.catId) {
          incomingMsg.type = 'incoming',
          incomingMsg.recommendedQues = element.recommendedQues
        }
      });
    }
    let sendMsg = {
      type:'sendMsg',
      question: catItem.catName
    }
    this.chatInfo.push(sendMsg)
    this.userJourney = this.chatInfo
    this.chatInfo.push(incomingMsg)
    this.userJourney = this.chatInfo
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
        object: {id: id, type: "Information"},
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


}

