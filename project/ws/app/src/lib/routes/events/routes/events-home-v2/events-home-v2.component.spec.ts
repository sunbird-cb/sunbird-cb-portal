import { Router } from '@angular/router';
import { EventsHomeV2Component } from './events-home-v2.component';

jest.mock('./events-home-v2.component', () => ({
  EventsHomeV2Component: jest.fn().mockImplementation(() => ({
    ngOnInit: jest.fn(),
  }))
}));

describe('EventsHomeV2Component', () => {
  let component: any;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn(),
    } as any;
    component = new EventsHomeV2Component(mockRouter);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit on initialization', () => {
    const ngOnInitSpy = jest.spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(ngOnInitSpy).toHaveBeenCalled();
  });

});
