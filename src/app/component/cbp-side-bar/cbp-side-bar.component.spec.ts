import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { CbpSideBarComponent } from './cbp-side-bar.component'

describe('CbpSideBarComponent', () => {
  let component: CbpSideBarComponent
  let fixture: ComponentFixture<CbpSideBarComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CbpSideBarComponent],
    })
    .compileComponents();
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CbpSideBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
