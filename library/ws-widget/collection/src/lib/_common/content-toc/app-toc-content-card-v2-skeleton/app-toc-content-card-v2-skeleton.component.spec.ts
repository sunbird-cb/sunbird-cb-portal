import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AppTocContentCardV2SkeletonComponent } from './app-toc-content-card-v2-skeleton.component'

describe('AppTocContentCardV2SkeletonComponent', () => {
  let component: AppTocContentCardV2SkeletonComponent
  let fixture: ComponentFixture<AppTocContentCardV2SkeletonComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocContentCardV2SkeletonComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocContentCardV2SkeletonComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
