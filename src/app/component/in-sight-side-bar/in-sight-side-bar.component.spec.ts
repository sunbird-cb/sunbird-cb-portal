import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { InsightSideBarComponent } from './in-sight-side-bar.component'

describe('IngsightSideBarComponent', () => {
  let component: InsightSideBarComponent
  let fixture: ComponentFixture<InsightSideBarComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightSideBarComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightSideBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
