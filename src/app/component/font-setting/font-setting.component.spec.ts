import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FontSettingComponent } from './font-setting.component'

describe('FontSettingComponent', () => {
  let component: FontSettingComponent
  let fixture: ComponentFixture<FontSettingComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FontSettingComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FontSettingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
