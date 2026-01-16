import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NsDiscussionV2 } from '@sunbird-cb/discussion-v2';

@Component({
  selector: 'ws-app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {
  widgetData: NsDiscussionV2.IDiscussV2WidgetData | null =  {
    newPostSection: {
      "show": true,
      "type": "question",
      "openAsDialogue": true,
      "showTopInfo": false,
      "topInfo": {
        "icon": "forum",
        "text": "<span>Do you have any questions, suggestions or ideas in your mind?Post it.</span>"
      },
      "avatarPhoto": {
        "show": true,
        "size": "m",
        "photoUrl": "https://portal.dev.karmayogibharat.net/assets/public/profileImage/1725443303744_images.jpeg",
        "name": "Christopher Fernandes",
        "color": "#006400"
      },
      "commentBox": {
        "placeholder": "Start a discussion"
      },
      "postBtn": {
        "text": "Post",
        "icon": "send",
        show: true
      },
      "styles": {
        "background-color": "#fff", 
        "border": "1px solid rgba(0, 0, 0, 0.08)"
      }
    },
    postsList: {
      "listType": "multiple", 
      "cardType": "topLevel",
      "type": "question",
      "showActions": true,
      "cardClick": {
        enabled: false,
        position: 'title',
        redirectUrl: '/post/',
        id:''
      },

      "avatarPhoto": {
        "show": true,
        "size": "ml",
        "photoUrl": "https://portal.dev.karmayogibharat.net/assets/public/profileImage/1725443303744_images.jpeg",
        "name": "Christopher Fernandes",
        "color": "#006400"
      },
      sliderData: {
        styleData: {
          "bannerMetaClass": "meta",
          "bannerMeta": "visible",
          "bannerMetaAlign": "middle",
          "navigationArrows": "visible",
          "borderRadius": "0",
          "customHeight": "360px",
          "arrowsPlacement": "middle-inline",
          autoplay: false,
          "responsive": {
            "bannerMetaClass": "meta",
            "customHeight": "232px",
            "bannerMetaAlign": "middle",
            "navigationArrows": "visible",
            "dots": "hidden",
            "arrowsPlacement": "middle-inline",
            autoplay: false,
          }
        }
      },
      "reportIcon": {
        "show": true,
        "icon": "report",
        "successMsg": "Reported successfully! Thank you for reporting.",
        "errorMsg": "Something went wrong! please try reporting again later.",
        "showToolTip": true,
        "toolTipText":"Report this comment"
      },
      "actions": {
        "like": {
          "show": true,
          "showCount": true,
          "icon": "thumb_up"
        },
        "comments": {
          "show": true,
          "showCount": true,
          "icon": "comment"
        },
        "avatarPhoto": {
          "show": true,
          "size": "ml",
          "photoUrl": "https://portal.dev.karmayogibharat.net/assets/public/profileImage/1725443303744_images.jpeg",
          "name": "Christopher Fernandes",
          "color": "#006400"
        }
      },
      "repliesSection": {
        "show": true,
        "indented": true,
        "newPostReply": {
          "show": true,
          "type": "answerPost",
          "openAsDialogue": true,
          "showTopInfo": false,
          "topInfo": {
            "icon": "forum",
            "text": "<div>Do you have any questions, suggestions or ideas in your mind?Post it.</div>"
          },
          "avatarPhoto": {
            "show": true,
            "size": "m",
            "photoUrl": "https://portal.dev.karmayogibharat.net/assets/public/profileImage/1725443303744_images.jpeg",
            "name": "Christopher Fernandes",
            "color": "#006400"
          },
          "commentBox": {
            "placeholder": "Add a comment"
          },
          "postBtn": {
            "text": "",
            "icon": "send",
            show: true
          },
          "styles": {
            "background-color": "#1B4CA10D", 
            "border": "none"
          }
        },
        "replyCardConfig": {
          "cardType": "reply",
          "type": "answerPost",
          "showActions": true,
          "reportIcon": {
            "show": true,
            "icon": "report",
            "successMsg": "Reported successfully! Thank you for reporting.",
            "errorMsg": "Something went wrong! please try reporting again later.",
            "showToolTip": true,
            "toolTipText":"Report this comment"
          },
          "actions": {
            "like": {
              "show": true,
              "showCount": true,
              "icon": "thumb_up"
            },
            "comments": {
              "show": true,
              "showCount": false,
              "icon": "comment"
            },
          },

          "repliesSection": {
            "show": false
          },
          "newPostReply": {
            "show": true,
            "showTopInfo": false,
            "type": "answerPost",
            "topInfo": {
              "icon": "forum",
              "text": "<div>Do you have any questions, suggestions or ideas in your mind?Post it.</div>"
            },
            "avatarPhoto": {
              "show": true,
              "size": "m",
              "photoUrl": "https://portal.dev.karmayogibharat.net/assets/public/profileImage/1725443303744_images.jpeg",
              "name": "Christopher Fernandes",
              "color": "#006400"
            },
            "commentBox": {
              "placeholder": "Add a comment"
            },
            "postBtn": {
              "text": "",
              "icon": "send"
            },
            "styles": {
              "background-color": "#1B4CA10D", 
              "border": "none"
            }
          }
        }
      },
      "noPostsSection": {
        "text": "No posts found!"
      }
    }
  }
  discussionId!: string
  constructor(private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      console.log(params['discussionId'])
      this.discussionId = params['discussionId']
    })
  }
}
