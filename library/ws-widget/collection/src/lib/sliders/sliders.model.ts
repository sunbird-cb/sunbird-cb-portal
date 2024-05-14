export interface ICarousel {
  title?: string,
  redirectUrl?: string,
  openInNewTab?: string,
  banners: IBannerUnit,
  mailTo?: string,
  queryParams?: any,
  bannerMetaClass?: "inline", 
  bannerMetaAlign?: "right" | "left",
  navigationArrows?: "hidden"
}

interface IBannerUnit {
  xs: string,
  s: string,
  m: string,
  l: string,
  xl: string
}
