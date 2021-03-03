import { NsWidgetResolver } from '@sunbird-cb/resolver'

export namespace NsWidgetLayoutTab {
  export interface ILayout {
    tabs: ITabDetails[]
  }
  export interface ITabDetails {
    tabKey: string
    tabTitle: string
    tabContent: NsWidgetResolver.IRenderConfigWithAnyData
  }
}
