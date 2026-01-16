import { Component } from '@angular/core';

@Component({
  selector: 'ws-app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.scss']
})
export class UpdatesComponent {

  updatesList: any[] = [
  {
    profileImage: "https://portal.dev.karmayogibharat.net/assets/public/profileImage/1748236292880_profile.png",
    firstName: "Martin Workman",
    designation: "Tech Hiring Specialist",
    updatedTime: "27s",
    description: "Martin Workman has recently joined your organisation.",
    profileLink: "View Profile >"
  },
  {
    profileImage: "", 
    firstName: "Cheyenne Bator",
    designation: "Tech Hiring Specialist",
    updatedTime: "27s",
    description: "Completed 2 years in XYZ Ministry",
    profileLink: null
  },
  {
    profileImage: "https://portal.dev.karmayogibharat.net/assets/public/profileImage/1748236292880_profile.png",
    firstName: "Marcus Dias",
    designation: "Tech Hiring Specialist",
    updatedTime: "27s",
    description: "Marcus recently joined XYZ Ministry",
    profileLink: null
  },
  {
    profileImage: "",
    firstName: "Martin Workman",
    designation: "Tech Hiring Specialist",
    updatedTime: "27s",
    description: "Martin Workman in your network has achieved 500 Karma Points milestone!!!",
    profileLink: "View Profile >"
  }
];

}
