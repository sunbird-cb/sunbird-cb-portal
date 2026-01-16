import { RecommendationsComponent } from './recommendations.component';

describe('RecommendationsComponent', () => {
  let component: RecommendationsComponent;
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn()
    };
    component = new RecommendationsComponent(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it('should initialize with router dependency', () => {
      expect(component['router']).toBe(mockRouter);
    });
  });

  describe('peopleYouMayKnowList', () => {
    it('should be defined and contain 5 items', () => {
      expect(component.peopleYouMayKnowList).toBeDefined();
      expect(component.peopleYouMayKnowList.length).toBe(5);
    });

    it('should have correct structure for first item', () => {
      const firstItem = component.peopleYouMayKnowList[0];
      expect(firstItem).toHaveProperty('professionalDetails');
      expect(firstItem).toHaveProperty('employmentDetails');
      expect(firstItem).toHaveProperty('personalDetails');
      expect(firstItem).toHaveProperty('userId');
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('@id');
    });

    it('should have correct personal details for first item', () => {
      const firstItem = component.peopleYouMayKnowList[0];
      expect(firstItem.personalDetails.firstname).toBe('Ajeshck');
      expect(firstItem.personalDetails.mobile).toBe('8129324667');
      expect(firstItem.personalDetails.primaryEmail).toBe('Kannancekeey1052@gmail.com');
      expect(firstItem.personalDetails.phoneVerified).toBe(true);
    });

    it('should have correct professional details for first item', () => {
      const firstItem = component.peopleYouMayKnowList[0];
      const professionalDetail = firstItem.professionalDetails[0];
      expect(professionalDetail.name).toBe('BIHAR');
      expect(professionalDetail.organisationType).toBe('Government');
      expect(professionalDetail.group).toBe('Group C');
      expect(professionalDetail.osid).toBe('193ed4b1-00a8-4fc2-a1e1-44e5770cb93f');
    });

    it('should have correct employment details for first item', () => {
      const firstItem = component.peopleYouMayKnowList[0];
      expect(firstItem.employmentDetails.departmentName).toBe('BIHAR');
      expect(firstItem.employmentDetails.departmentId).toBeNull();
    });

    it('should have correct userId for each item', () => {
      const expectedUserIds = [
        '5beb33ad-29c6-4425-aa3b-9afe6e395535',
        '1c8bd791-f34c-4a04-af52-f57074a726c2',
        'd1e8fb2b-8443-490a-aa5d-394059243f93',
        'c122bf31-5de6-4369-8fcb-8c5604ebbf48',
        'bff48d63-5dba-4376-abd3-00a4e4315b4c'
      ];

      component.peopleYouMayKnowList.forEach((item: any, index: number) => {
        expect(item.userId).toBe(expectedUserIds[index]);
        expect(item.id).toBe(expectedUserIds[index]);
        expect(item['@id']).toBe(expectedUserIds[index]);
      });
    });

    it('should have Group A for last item', () => {
      const lastItem = component.peopleYouMayKnowList[4];
      expect(lastItem.professionalDetails[0].group).toBe('Group A');
      expect(lastItem.personalDetails.firstname).toBe('Check Four');
    });
  });

  describe('peopleNearYou', () => {
    it('should be defined and contain 5 items', () => {
      expect(component.peopleNearYou).toBeDefined();
      expect(component.peopleNearYou.length).toBe(5);
    });

    it('should have same structure as peopleYouMayKnowList', () => {
      component.peopleNearYou.forEach((item: any) => {
        expect(item).toHaveProperty('professionalDetails');
        expect(item).toHaveProperty('employmentDetails');
        expect(item).toHaveProperty('personalDetails');
        expect(item).toHaveProperty('userId');
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('@id');
      });
    });

    it('should have correct data for second item', () => {
      const secondItem = component.peopleNearYou[1];
      expect(secondItem.personalDetails.firstname).toBe('Akkrapalli');
      expect(secondItem.personalDetails.mobile).toBe('7799813736');
      expect(secondItem.personalDetails.primaryEmail).toBe('prasanthakkarapalli123@gmail.com');
      expect(secondItem.verifiedKarmayogi).toBe(false);
    });

    it('should have correct employment details for second item', () => {
      const secondItem = component.peopleNearYou[1];
      expect(secondItem.employmentDetails.departmentName).toBe('departmentName');
      expect(secondItem.employmentDetails.pinCode).toBe('');
      expect(secondItem.employmentDetails.employeeCode).toBe('');
    });
  });

  describe('peopleSharingSameIntrest', () => {
    it('should be defined and contain 5 items', () => {
      expect(component.peopleSharingSameIntrest).toBeDefined();
      expect(component.peopleSharingSameIntrest.length).toBe(5);
    });

    it('should have same structure as other arrays', () => {
      component.peopleSharingSameIntrest.forEach((item: any) => {
        expect(item).toHaveProperty('professionalDetails');
        expect(item).toHaveProperty('employmentDetails');
        expect(item).toHaveProperty('personalDetails');
        expect(item).toHaveProperty('userId');
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('@id');
      });
    });

    it('should have correct data for third item', () => {
      const thirdItem = component.peopleSharingSameIntrest[2];
      expect(thirdItem.personalDetails.firstname).toBe('Ajaysingh');
      expect(thirdItem.personalDetails.mobile).toBe('7889476596');
      expect(thirdItem.personalDetails.primaryEmail).toBe('ajju122232@gmail.com');
    });

    it('should have correct professional details for fourth item', () => {
      const fourthItem = component.peopleSharingSameIntrest[3];
      expect(fourthItem.professionalDetails[0].osid).toBe('216244cd-bb72-47e2-98ba-e641a9c526c9');
      expect(fourthItem.personalDetails.firstname).toBe('Aedwardsam');
      expect(fourthItem.personalDetails.primaryEmail).toBe('edwardsam948039@gmail.com');
    });
  });

  describe('showAll method', () => {
    it('should call router.navigate with default type', () => {
      component.showAll();
      
      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/network-v2/recommendations/all'],
        { queryParams: { type: 'peopleYouMayKnow' } }
      );
    });

    it('should call router.navigate with custom type', () => {
      const customType = 'peopleNearYou';
      component.showAll(customType);
      
      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/network-v2/recommendations/all'],
        { queryParams: { type: customType } }
      );
    });

    it('should call router.navigate with peopleSharingSameIntrest type', () => {
      const customType = 'peopleSharingSameIntrest';
      component.showAll(customType);
      
      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/network-v2/recommendations/all'],
        { queryParams: { type: customType } }
      );
    });

    it('should call router.navigate with empty string type', () => {
      component.showAll('');
      
      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/network-v2/recommendations/all'],
        { queryParams: { type: '' } }
      );
    });

    it('should handle multiple calls to showAll', () => {
      component.showAll('type1');
      component.showAll('type2');
      component.showAll('type3');
      
      expect(mockRouter.navigate).toHaveBeenCalledTimes(3);
      expect(mockRouter.navigate).toHaveBeenNthCalledWith(
        1,
        ['/app/network-v2/recommendations/all'],
        { queryParams: { type: 'type1' } }
      );
      expect(mockRouter.navigate).toHaveBeenNthCalledWith(
        2,
        ['/app/network-v2/recommendations/all'],
        { queryParams: { type: 'type2' } }
      );
      expect(mockRouter.navigate).toHaveBeenNthCalledWith(
        3,
        ['/app/network-v2/recommendations/all'],
        { queryParams: { type: 'type3' } }
      );
    });
  });

  describe('Data Consistency', () => {
    it('should have consistent data structure across all arrays', () => {
      const arrays = [
        component.peopleYouMayKnowList,
        component.peopleNearYou,
        component.peopleSharingSameIntrest
      ];

      arrays.forEach((array: any[]) => {
        array.forEach((item: any) => {
          expect(item.professionalDetails).toBeInstanceOf(Array);
          expect(item.professionalDetails[0]).toHaveProperty('name');
          expect(item.professionalDetails[0]).toHaveProperty('osid');
          expect(item.professionalDetails[0]).toHaveProperty('organisationType');
          expect(item.professionalDetails[0]).toHaveProperty('group');
          expect(item.employmentDetails).toHaveProperty('departmentName');
          expect(item.personalDetails).toHaveProperty('firstname');
          expect(item.personalDetails).toHaveProperty('phoneVerified');
          expect(item.personalDetails).toHaveProperty('mobile');
          expect(item.personalDetails).toHaveProperty('primaryEmail');
        });
      });
    });

    it('should have all items with phoneVerified as true', () => {
      const allItems = [
        ...component.peopleYouMayKnowList,
        ...component.peopleNearYou,
        ...component.peopleSharingSameIntrest
      ];

      allItems.forEach((item: any) => {
        expect(item.personalDetails.phoneVerified).toBe(true);
      });
    });

    it('should have all items with Government organisation type', () => {
      const allItems = [
        ...component.peopleYouMayKnowList,
        ...component.peopleNearYou,
        ...component.peopleSharingSameIntrest
      ];

      allItems.forEach((item: any) => {
        expect(item.professionalDetails[0].organisationType).toBe('Government');
      });
    });

    it('should have all items with valid mobile numbers', () => {
      const allItems = [
        ...component.peopleYouMayKnowList,
        ...component.peopleNearYou,
        ...component.peopleSharingSameIntrest
      ];

      allItems.forEach((item: any) => {
        expect(item.personalDetails.mobile).toMatch(/^\d{10}$/);
      });
    });

    it('should have all items with valid email addresses', () => {
      const allItems = [
        ...component.peopleYouMayKnowList,
        ...component.peopleNearYou,
        ...component.peopleSharingSameIntrest
      ];

      allItems.forEach((item: any) => {
        expect(item.personalDetails.primaryEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });

    it('should have all items with valid UUID format for userId', () => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const allItems = [
        ...component.peopleYouMayKnowList,
        ...component.peopleNearYou,
        ...component.peopleSharingSameIntrest
      ];

      allItems.forEach((item: any) => {
        expect(item.userId).toMatch(uuidRegex);
        expect(item.id).toMatch(uuidRegex);
        expect(item['@id']).toMatch(uuidRegex);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle showAll with null parameter', () => {
      component.showAll(null as any);
      
      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/network-v2/recommendations/all'],
        { queryParams: { type: null } }
      );
    });

    it('should handle showAll with undefined parameter', () => {
      component.showAll(undefined as any);
      
      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/network-v2/recommendations/all'],
        { queryParams: { type: 'peopleYouMayKnow' } }
      );
    });

    it('should verify router navigate is called with correct route', () => {
      component.showAll();
      
      const [route, options] = mockRouter.navigate.mock.calls[0];
      expect(route).toEqual(['/app/network-v2/recommendations/all']);
      expect(options).toHaveProperty('queryParams');
      expect(options.queryParams).toHaveProperty('type');
    });
  });
});