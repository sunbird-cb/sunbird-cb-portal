import { Component, Input, OnInit } from '@angular/core'
// const socialLink = [
//   {
//     url: 'https://www.linkedin.com/company/karmayogi-bharat/',
//     alt: 'Linkedin',
//     icon : 'linkedin'
//   },
//   {
//     url: 'https://x.com/iGOTKarmayogi?t=OUEVuskmXbrTNdPuIBaHuw&s=09',
//     alt: 'Twitter',
//     icon : 'Combined Shape'
//   },
//   {
//     url: 'https://instagram.com/karmayogibharat?igshid=MzRlODBiNWFlZA==',
//     alt: 'Instagram',
//     icon : 'instagram'
//   },
//   {
//     url: 'https://www.facebook.com/profile.php?id=100089782863897&mibextid=ZbWKwL',
//     alt: 'Facebook',
//     icon : 'facebook'
//   },
//   {
//     url: 'https://youtube.com/@karmayogibharat?feature=shared',
//     alt: 'Youtube',
//     icon : 'youtube'
//   },
//   {
// tslint: disable
//     url: 'https://open.spotify.com/user/31cr3bizg7gpg5vytxl4bzyhw43a?si=5up31eyNSl-Y4Svr_Kfr7g&utm_source=copy-link&utm_medium=copy-link&nd=1&_branch_match_id=1242771130436995949&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXLy7IL8lMq9TLyczL1g%2BqyEsqywiKyHdJAgBCVoQFIAAAAA%3D%3D',
//     alt: 'Spotify',
//     icon : 'spotify'
//   }

// ]
@Component({
  selector: 'ws-social-link',
  templateUrl: './social-link.component.html',
  styleUrls: ['./social-link.component.scss'],
})
export class SocialLinkComponent implements OnInit {
  @Input() socialLinks: any = []
  constructor() { }

  ngOnInit() {
    // console.log('headerFooterConfigData', this.socialLinks)
   // this.socialLinks = socialLink;
  }

}
