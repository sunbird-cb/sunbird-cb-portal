import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ws-app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent {

  constructor(
    private router: Router
  ) { }

  peopleYouMayKnowList: any[] = [
    {
      professionalDetails: [
        {
          "name": "BIHAR",
          "osid": "193ed4b1-00a8-4fc2-a1e1-44e5770cb93f",
          "id": null,
          "organisationType": "Government",
          "group": "Group C"
        }
      ],
      employmentDetails: {
        "departmentName": "BIHAR",
        "departmentId": null,
      },
      personalDetails: {
        "firstname": "Ajeshck",
        "phoneVerified": true,
        "mobile": "8129324667",
        "primaryEmail": "Kannancekeey1052@gmail.com"
      },
      "userId": "5beb33ad-29c6-4425-aa3b-9afe6e395535",
      "id": "5beb33ad-29c6-4425-aa3b-9afe6e395535",
      "@id": "5beb33ad-29c6-4425-aa3b-9afe6e395535",
    },
    {
      "professionalDetails": [
        {
          "name": "BIHAR",
          "osid": "8ecddd6e-cb90-4e9f-a56e-3271071b89f7",
          "designation": "",
          "id": null,
          "organisationType": "Government",
          "group": "Group C"
        }
      ],
      "verifiedKarmayogi": false,
      "employmentDetails": {
        "departmentName": "departmentName",
        "pinCode": "",
        "departmentId": null,
        "employeeCode": ""
      },
      "personalDetails": {
        "firstname": "Akkrapalli",
        "gender": "",
        "phoneVerified": true,
        "dob": "",
        "mobile": "7799813736",
        "domicileMedium": "",
        "category": "",
        "primaryEmail": "prasanthakkarapalli123@gmail.com"
      },
      "userId": "1c8bd791-f34c-4a04-af52-f57074a726c2",
      "id": "1c8bd791-f34c-4a04-af52-f57074a726c2",
      "@id": "1c8bd791-f34c-4a04-af52-f57074a726c2"
    },
    {
      "professionalDetails": [
        {
          "name": "BIHAR",
          "osid": "66d34557-ef26-4c03-bf59-19ba03da1b68",
          "id": null,
          "organisationType": "Government",
          "group": "Group C"
        }
      ],
      "verifiedKarmayogi": false,
      "employmentDetails": {
        "departmentName": "BIHAR",
        "departmentId": null
      },
      "personalDetails": {
        "firstname": "Ajaysingh",
        "phoneVerified": true,
        "mobile": "7889476596",
        "primaryEmail": "ajju122232@gmail.com"
      },
      "userId": "d1e8fb2b-8443-490a-aa5d-394059243f93",
      "id": "d1e8fb2b-8443-490a-aa5d-394059243f93",
      "@id": "d1e8fb2b-8443-490a-aa5d-394059243f93"
    },
    {
      "professionalDetails": [
        {
          "name": "BIHAR",
          "osid": "216244cd-bb72-47e2-98ba-e641a9c526c9",
          "id": null,
          "organisationType": "Government",
          "group": "Group C"
        }
      ],
      "verifiedKarmayogi": false,
      "employmentDetails": {
        "departmentName": "BIHAR",
        "departmentId": null
      },
      "personalDetails": {
        "firstname": "Aedwardsam",
        "phoneVerified": true,
        "mobile": "9480395303",
        "primaryEmail": "edwardsam948039@gmail.com"
      },
      "userId": "c122bf31-5de6-4369-8fcb-8c5604ebbf48",
      "id": "c122bf31-5de6-4369-8fcb-8c5604ebbf48",
      "@id": "c122bf31-5de6-4369-8fcb-8c5604ebbf48"
    },
    {
      "professionalDetails": [
        {
          "name": "BIHAR",
          "osid": "8166f2b8-b975-4549-8cf4-4261755b6e48",
          "id": null,
          "organisationType": "Government",
          "group": "Group A"
        }
      ],
      "verifiedKarmayogi": false,
      "employmentDetails": {
        "departmentName": "BIHAR",
        "departmentId": null
      },
      "personalDetails": {
        "firstname": "Check Four",
        "phoneVerified": true,
        "mobile": "9654784112",
        "primaryEmail": "checkFour@yopmail.com"
      },
      "userId": "bff48d63-5dba-4376-abd3-00a4e4315b4c",
      "id": "bff48d63-5dba-4376-abd3-00a4e4315b4c",
      "@id": "bff48d63-5dba-4376-abd3-00a4e4315b4c"
    }
  ]

  peopleNearYou: any[] = [
    {
      professionalDetails: [
        {
          "name": "BIHAR",
          "osid": "193ed4b1-00a8-4fc2-a1e1-44e5770cb93f",
          "id": null,
          "organisationType": "Government",
          "group": "Group C"
        }
      ],
      employmentDetails: {
        "departmentName": "BIHAR",
        "departmentId": null,
      },
      personalDetails: {
        "firstname": "Ajeshck",
        "phoneVerified": true,
        "mobile": "8129324667",
        "primaryEmail": "Kannancekeey1052@gmail.com"
      },
      "userId": "5beb33ad-29c6-4425-aa3b-9afe6e395535",
      "id": "5beb33ad-29c6-4425-aa3b-9afe6e395535",
      "@id": "5beb33ad-29c6-4425-aa3b-9afe6e395535",
    },
    {
      "professionalDetails": [
        {
          "name": "BIHAR",
          "osid": "8ecddd6e-cb90-4e9f-a56e-3271071b89f7",
          "designation": "",
          "id": null,
          "organisationType": "Government",
          "group": "Group C"
        }
      ],
      "verifiedKarmayogi": false,
      "employmentDetails": {
        "departmentName": "departmentName",
        "pinCode": "",
        "departmentId": null,
        "employeeCode": ""
      },
      "personalDetails": {
        "firstname": "Akkrapalli",
        "gender": "",
        "phoneVerified": true,
        "dob": "",
        "mobile": "7799813736",
        "domicileMedium": "",
        "category": "",
        "primaryEmail": "prasanthakkarapalli123@gmail.com"
      },
      "userId": "1c8bd791-f34c-4a04-af52-f57074a726c2",
      "id": "1c8bd791-f34c-4a04-af52-f57074a726c2",
      "@id": "1c8bd791-f34c-4a04-af52-f57074a726c2"
    },
    {
      "professionalDetails": [
        {
          "name": "BIHAR",
          "osid": "66d34557-ef26-4c03-bf59-19ba03da1b68",
          "id": null,
          "organisationType": "Government",
          "group": "Group C"
        }
      ],
      "verifiedKarmayogi": false,
      "employmentDetails": {
        "departmentName": "BIHAR",
        "departmentId": null
      },
      "personalDetails": {
        "firstname": "Ajaysingh",
        "phoneVerified": true,
        "mobile": "7889476596",
        "primaryEmail": "ajju122232@gmail.com"
      },
      "userId": "d1e8fb2b-8443-490a-aa5d-394059243f93",
      "id": "d1e8fb2b-8443-490a-aa5d-394059243f93",
      "@id": "d1e8fb2b-8443-490a-aa5d-394059243f93"
    },
    {
      "professionalDetails": [
        {
          "name": "BIHAR",
          "osid": "216244cd-bb72-47e2-98ba-e641a9c526c9",
          "id": null,
          "organisationType": "Government",
          "group": "Group C"
        }
      ],
      "verifiedKarmayogi": false,
      "employmentDetails": {
        "departmentName": "BIHAR",
        "departmentId": null
      },
      "personalDetails": {
        "firstname": "Aedwardsam",
        "phoneVerified": true,
        "mobile": "9480395303",
        "primaryEmail": "edwardsam948039@gmail.com"
      },
      "userId": "c122bf31-5de6-4369-8fcb-8c5604ebbf48",
      "id": "c122bf31-5de6-4369-8fcb-8c5604ebbf48",
      "@id": "c122bf31-5de6-4369-8fcb-8c5604ebbf48"
    },
    {
      "professionalDetails": [
        {
          "name": "BIHAR",
          "osid": "8166f2b8-b975-4549-8cf4-4261755b6e48",
          "id": null,
          "organisationType": "Government",
          "group": "Group A"
        }
      ],
      "verifiedKarmayogi": false,
      "employmentDetails": {
        "departmentName": "BIHAR",
        "departmentId": null
      },
      "personalDetails": {
        "firstname": "Check Four",
        "phoneVerified": true,
        "mobile": "9654784112",
        "primaryEmail": "checkFour@yopmail.com"
      },
      "userId": "bff48d63-5dba-4376-abd3-00a4e4315b4c",
      "id": "bff48d63-5dba-4376-abd3-00a4e4315b4c",
      "@id": "bff48d63-5dba-4376-abd3-00a4e4315b4c"
    }
  ]

  peopleSharingSameIntrest: any[] = [
    {
      professionalDetails: [
        {
          "name": "BIHAR",
          "osid": "193ed4b1-00a8-4fc2-a1e1-44e5770cb93f",
          "id": null,
          "organisationType": "Government",
          "group": "Group C"
        }
      ],
      employmentDetails: {
        "departmentName": "BIHAR",
        "departmentId": null,
      },
      personalDetails: {
        "firstname": "Ajeshck",
        "phoneVerified": true,
        "mobile": "8129324667",
        "primaryEmail": "Kannancekeey1052@gmail.com"
      },
      "userId": "5beb33ad-29c6-4425-aa3b-9afe6e395535",
      "id": "5beb33ad-29c6-4425-aa3b-9afe6e395535",
      "@id": "5beb33ad-29c6-4425-aa3b-9afe6e395535",
    },
    {
      "professionalDetails": [
        {
          "name": "BIHAR",
          "osid": "8ecddd6e-cb90-4e9f-a56e-3271071b89f7",
          "designation": "",
          "id": null,
          "organisationType": "Government",
          "group": "Group C"
        }
      ],
      "verifiedKarmayogi": false,
      "employmentDetails": {
        "departmentName": "departmentName",
        "pinCode": "",
        "departmentId": null,
        "employeeCode": ""
      },
      "personalDetails": {
        "firstname": "Akkrapalli",
        "gender": "",
        "phoneVerified": true,
        "dob": "",
        "mobile": "7799813736",
        "domicileMedium": "",
        "category": "",
        "primaryEmail": "prasanthakkarapalli123@gmail.com"
      },
      "userId": "1c8bd791-f34c-4a04-af52-f57074a726c2",
      "id": "1c8bd791-f34c-4a04-af52-f57074a726c2",
      "@id": "1c8bd791-f34c-4a04-af52-f57074a726c2"
    },
    {
      "professionalDetails": [
        {
          "name": "BIHAR",
          "osid": "66d34557-ef26-4c03-bf59-19ba03da1b68",
          "id": null,
          "organisationType": "Government",
          "group": "Group C"
        }
      ],
      "verifiedKarmayogi": false,
      "employmentDetails": {
        "departmentName": "BIHAR",
        "departmentId": null
      },
      "personalDetails": {
        "firstname": "Ajaysingh",
        "phoneVerified": true,
        "mobile": "7889476596",
        "primaryEmail": "ajju122232@gmail.com"
      },
      "userId": "d1e8fb2b-8443-490a-aa5d-394059243f93",
      "id": "d1e8fb2b-8443-490a-aa5d-394059243f93",
      "@id": "d1e8fb2b-8443-490a-aa5d-394059243f93"
    },
    {
      "professionalDetails": [
        {
          "name": "BIHAR",
          "osid": "216244cd-bb72-47e2-98ba-e641a9c526c9",
          "id": null,
          "organisationType": "Government",
          "group": "Group C"
        }
      ],
      "verifiedKarmayogi": false,
      "employmentDetails": {
        "departmentName": "BIHAR",
        "departmentId": null
      },
      "personalDetails": {
        "firstname": "Aedwardsam",
        "phoneVerified": true,
        "mobile": "9480395303",
        "primaryEmail": "edwardsam948039@gmail.com"
      },
      "userId": "c122bf31-5de6-4369-8fcb-8c5604ebbf48",
      "id": "c122bf31-5de6-4369-8fcb-8c5604ebbf48",
      "@id": "c122bf31-5de6-4369-8fcb-8c5604ebbf48"
    },
    {
      "professionalDetails": [
        {
          "name": "BIHAR",
          "osid": "8166f2b8-b975-4549-8cf4-4261755b6e48",
          "id": null,
          "organisationType": "Government",
          "group": "Group A"
        }
      ],
      "verifiedKarmayogi": false,
      "employmentDetails": {
        "departmentName": "BIHAR",
        "departmentId": null
      },
      "personalDetails": {
        "firstname": "Check Four",
        "phoneVerified": true,
        "mobile": "9654784112",
        "primaryEmail": "checkFour@yopmail.com"
      },
      "userId": "bff48d63-5dba-4376-abd3-00a4e4315b4c",
      "id": "bff48d63-5dba-4376-abd3-00a4e4315b4c",
      "@id": "bff48d63-5dba-4376-abd3-00a4e4315b4c"
    }
  ]

  showAll(type: string = 'peopleYouMayKnow') {
    const queryParams = {
      type
    }
    this.router.navigate(['/app/network-v2/recommendations/all'], { queryParams })
  }    

}
