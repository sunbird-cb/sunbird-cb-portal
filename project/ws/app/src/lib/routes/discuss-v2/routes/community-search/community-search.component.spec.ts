import { CommunitySearchComponent } from './community-search.component';
import { Router } from '@angular/router';

describe('CommunitySearchComponent', () => {
  let component: CommunitySearchComponent;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn(),
    } as any;

    component = new CommunitySearchComponent(mockRouter);
  });

  describe('searchTextMethod', () => {
    it('should navigate to search page with trimmed search text', () => {
      const searchText = '  test search  ';
      
      component.searchTextMethod(searchText);

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/discussion-forum-v2/search'],
        {
          queryParams: { c: 'test search' },
          queryParamsHandling: 'merge',
        }
      );
    });
  });

  describe('cardClick', () => {
    it('should navigate to community page with communityId', () => {
      const cardData = { communityId: '123' };
      
      component.cardClick(cardData);

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/discussion-forum-v2/community', '123']
      );
    });
  });
});