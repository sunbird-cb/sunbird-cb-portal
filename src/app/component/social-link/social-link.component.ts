import { Component, OnInit } from '@angular/core';
const socialLink = [
  {
    url: 'https://www.linkedin.com/company/karmayogi-bharat/',
    alt: 'Linkedin',
    icon : 'linkedin'
  },
  {
    url: 'https://x.com/iGOTKarmayogi?t=OUEVuskmXbrTNdPuIBaHuw&s=09',
    alt: 'Twitter',
    icon : 'Combined Shape'
  },
  {
    url: 'https://instagram.com/karmayogibharat?igshid=MzRlODBiNWFlZA==',
    alt: 'Instagram',
    icon : 'instagram'
  },
  {
    url: 'https://www.facebook.com/profile.php?id=100089782863897&mibextid=ZbWKwL',
    alt: 'Facebook',
    icon : 'facebook'
  },
  {
    url: 'https://youtube.com/@karmayogibharat?feature=shared',
    alt: 'Youtube',
    icon : 'youtube'
  }

]
@Component({
  selector: 'ws-social-link',
  templateUrl: './social-link.component.html',
  styleUrls: ['./social-link.component.scss']
})
export class SocialLinkComponent implements OnInit {
  socialLinks:any = [];
  constructor() { }

  ngOnInit() {
    this.socialLinks = socialLink;
  }

}
