import { SeeAllComponent } from './see-all.component';
import { of } from 'rxjs';
import * as _ from 'lodash';

describe('SeeAllComponent', () => {
  let component: SeeAllComponent;
  let mockActivatedRoute: any;
  let mockTranslateService: any;
  let mockEventService: any;
  let mockLangTranslationsService: any;
  let mockLibEventService: any;

  beforeEach(() => {
    mockActivatedRoute = {
      queryParamMap: of({ params: { category: 'featuredEvents' } }),
    };
    mockTranslateService = { setDefaultLang: jest.fn(), use: jest.fn() };
    mockEventService = {
      getFeaturedEvents: jest.fn().mockReturnValue(of({ result: { events: ['id1', 'id2'] } })),
      getTrendingEvents: jest.fn().mockReturnValue(of({ result: { events: ['id3', 'id4'] } })),
      getEventsList: jest.fn().mockReturnValue(of({ result: { Event: [{ identifier: 'id1' }] } })),
    };
    mockLangTranslationsService = { translateActualLabel: jest.fn().mockReturnValue('Translated Label') };
    mockLibEventService = { raiseInteractTelemetry: jest.fn() };

    component = new SeeAllComponent(
      mockActivatedRoute,
      mockTranslateService,
      mockEventService,
      mockLangTranslationsService,
      mockLibEventService
    );
  });

  it('should create component and initialize with query params', () => {
    component.ngOnInit();
    expect(component.category).toBe('featuredEvents');
    expect(component.titles.length).toBe(2);
  });

  it('should fetch featured events data on init', () => {
    jest.spyOn(component, 'fetchData');
    component.ngOnInit();
    expect(mockEventService.getFeaturedEvents).toHaveBeenCalled();
    expect(component.fetchData).toHaveBeenCalledWith(['id1', 'id2']);
  });

  it('should correctly check if an event is live', () => {
    const event = {
      startDate: '2025-03-18',
      endDate: '2025-03-20',
      startTime: '10:00',
      endTime: '18:00',
    };
    expect(component.isLiveEvent(event)).toBeDefined();
  });

  it('should transform contents into widgets', () => {
    const contents: any = [{ identifier: 'id1', batch: 'batch1' }];
    const widgets = component.transformContentsToWidgets(contents, {});
    expect(widgets.length).toBe(1);
    expect(widgets[0].widgetData.content.identifier).toBe('id1');
  });

  it('should raise telemetry event', () => {
    const event = { identifier: 'id1' };
    component.raiseTelemetry(event);
    expect(mockLibEventService.raiseInteractTelemetry).toHaveBeenCalled();
  });
});
