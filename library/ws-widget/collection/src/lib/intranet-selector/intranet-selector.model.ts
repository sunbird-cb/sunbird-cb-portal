import { NsWidgetResolver } from '@sunbird-cb/resolver'
export interface IIntranetSelector {
  url?: string
  isIntranet?: IIntranetSelectorUnit
  isNotIntranet?: IIntranetSelectorUnit
}

export interface IIntranetSelectorUnit {
  widget: NsWidgetResolver.IRenderConfigWithAnyData
}
