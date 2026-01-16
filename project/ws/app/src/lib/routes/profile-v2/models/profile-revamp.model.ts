export interface UserStats {
  state: string
  totalPoints: string
  iconUrl: string
  vewAllUrl: string
  stateInfo?: string
  identifier?: string
}

export interface profileRoutes {
  name: string
  url: string
  icon: string
  id: string
}

export interface educationalQualifications {
  education: string,
  instituteAndLocation: string,
  period: string,
}

export interface Theme {
  name: string;
  id: number;
}

export interface Competency {
  name: string;
  themes: Theme[];
  active?: boolean;
}

export interface achievement {
  certificateName: string,
  provider: string,
  period: string,
  certificateUrl?: string
  issuedDate: string | number | Date
}

export interface Community {
  id: string;
  name: string;
  thumbnail?: string;
  memberCount: number;
  postCount: number;
  ownerName: string;
  ownerThumbnail?: string;
}

export interface state {
  stateId: string;
  stateName: string;
}

export interface organisation {
  identifier: string;
  orgName: string;
  imgUrl: string;
  isRootOrg?: boolean | null;
  rootOrgId?: string;
}

export interface designation {
  id?: string;
  name: string;
}

export const generateYears = (startYear: number = 1900): string[] => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year.toString());
  }
  return years
};

export const EMAIL_PATTERN = /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*[a-zA-Z0-9]+@[a-zA-Z0-9]+([-a-zA-Z0-9]*[a-zA-Z0-9]+)?(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,4}$/
export const MOBILE_PATTERN = /^[0]?[6789]\d{9}$/
export const PIN_CODE_PATTERN = /^[1-9][0-9]{5}$/
export const EMP_ID_PATTERN = /^[a-z0-9]+$/i
export const URL_PATRON = /^(https?|http):\/\/[^\s/$.?#].[^\s]*$/

export const IMAGE_SIZE_1MB = (1 * 1024 * 1024)
