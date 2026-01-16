import { MyNotificationsComponent } from './my-notifications.component'

describe('MyNotificationsComponent', () => {
  let component: MyNotificationsComponent
  let translateMock: any
  let langtranslationsMock: any
  let routerMock: any

  beforeEach(() => {
    translateMock = {
      setDefaultLang: jest.fn(),
      use: jest.fn(),
    }

    langtranslationsMock = {
      languageSelectedObservable: {
        subscribe: jest.fn((cb: any) => {
          // Mock subscription callback
          cb()
        }),
      },
    }

    routerMock = {
      navigate: jest.fn(),
    }

    // Clear and set localStorage for test
    localStorage.clear()
    localStorage.setItem('websiteLanguage', 'fr')

    component = new MyNotificationsComponent(translateMock, langtranslationsMock, routerMock)
  })

  it('should set language from localStorage on init', () => {
    expect(translateMock.setDefaultLang).toHaveBeenCalledWith('en')
    expect(translateMock.use).toHaveBeenCalledWith('fr')
    expect(component.selectedLanguage).toBe('fr')
  })

  it('should update language on languageSelectedObservable emit', () => {
    // Already covered by the subscribe callback during initialization
    expect(translateMock.use).toHaveBeenCalledWith('fr')
    expect(component.selectedLanguage).toBe('fr')
  })

  it('should navigate to TOC for LEARN category', () => {
    const notification: any = {
      category: 'LEARN',
      message: {
        id: '123'
      }
    }
    component.redirectTo(notification)
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app/toc/123'])
  })

  it('should navigate to event hub for EVENT category', () => {
    const notification: any = {
      category: 'EVENT',
      message: {
        id: '456'
      }
    }
    component.redirectTo(notification)
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app/event-hub/home/456'])
  })

  it('should navigate to discussion forum for DISCUSSION category', () => {
    const notification: any = {
      category: 'DISCUSSION',
      message: {
        communityId: 'comm1',
        postId: 'post1'
      }
    }
    component.redirectTo(notification)
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app/discussion-forum-v2/community/comm1/post1'])
  })

  it('should navigate to person profile for NETWORK with ACCEPTED_CONNECTION_REQUEST sub_category', () => {
    const notification: any = {
      category: 'NETWORK',
      sub_category: 'ACCEPTED_CONNECTION_REQUEST',
      message: {
        id: 'user123'
      }
    }
    component.redirectTo(notification)
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app/person-profile/user123'])
  })

  it('should navigate to connection requests for NETWORK with SEND_CONNECTION_REQUEST sub_category', () => {
    const notification: any = {
      category: 'NETWORK',
      sub_category: 'SEND_CONNECTION_REQUEST',
      message: {}
    }
    component.redirectTo(notification)
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app/network-v2/connection-requests'])
  })
})
