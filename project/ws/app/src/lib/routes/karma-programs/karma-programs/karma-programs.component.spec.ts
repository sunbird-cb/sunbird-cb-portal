import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { KarmaProgramsComponent } from './karma-programs.component'

describe('KarmaProgramsComponent', () => {
  let component: KarmaProgramsComponent
  let fixture: ComponentFixture<KarmaProgramsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KarmaProgramsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(KarmaProgramsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
