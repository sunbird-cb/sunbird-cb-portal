import { Injectable } from '@angular/core'
import { Title, Meta } from '@angular/platform-browser'
import { MetaTag } from '../models/meta-tag.model'

@Injectable({
  providedIn: 'root',
})
export class TitleTagService {

  private urlMeta = 'og:url'
  private titleMeta = 'og:title'
  private descriptionMeta = 'og:description'
  private imageMeta = 'og:image'
  private secureImageMeta = 'og:image:secure_url'
  private twitterTitleMeta = 'twitter:text:title'
  private twitterImageMeta = 'twitter:image'

  constructor(private titleService: Title, private metaService: Meta) { }

  public setTitle(title: string): void {
    this.titleService.setTitle(title)
  }

  public setSocialMediaTags(url: string, title: string, description: string, image: string): void {
    // const imageUrl = `https://mydomain.com/img/${image}`
    const imageUrl = `${image}`
    const tags = [
      new MetaTag(this.urlMeta, url, true),
      new MetaTag(this.titleMeta, title, true),
      new MetaTag(this.descriptionMeta, description, true),
      new MetaTag(this.imageMeta, imageUrl, true),
      new MetaTag(this.secureImageMeta, imageUrl, true),
      new MetaTag(this.twitterTitleMeta, title, false),
      new MetaTag(this.twitterImageMeta, imageUrl, false),
    ]
    this.setTags(tags)
  }

  private setTags(tags: MetaTag[]): void {
    tags.forEach(siteTag => {
      // const tag = siteTag.isFacebook ?
      //   this.metaService.getTag(`property='${siteTag.name}'`) : this.metaService.getTag(`name='${siteTag.name}'`)
      if (siteTag.isFacebook) {
        this.metaService.updateTag({ property: siteTag.name, content: siteTag.value })
      } else {
        this.metaService.updateTag({ name: siteTag.name, content: siteTag.value })
      }
    })
  }

  stringToColor(str: string) {
    let hash = 0
    // tslint:disable-next-line: no-increment-decrement
    for (let i = 0; i < str.length; i++) {
      // tslint:disable-next-line: no-bitwise
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = Math.abs(hash % 360)
    // tslint:disable-next-line: prefer-template
    const colour = 'hsl(' + hue + ',100%,30%)'
    return colour
  }

  /*Get text contrast by passing background hex color*/
  getContrast(_hexcolor: any) {
    return 'rgba(255, 255, 255, 80%)'
  }
}
