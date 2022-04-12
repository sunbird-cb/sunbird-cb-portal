import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { KnowledgeAllComponent } from './knowledge-all.component'

describe('KnowledgeAllComponent', () => {
  let component: KnowledgeAllComponent
  let fixture: ComponentFixture<KnowledgeAllComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KnowledgeAllComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeAllComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
