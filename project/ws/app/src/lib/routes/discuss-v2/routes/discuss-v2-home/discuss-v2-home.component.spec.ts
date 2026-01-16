import { DiscussV2HomeComponent } from './discuss-v2-home.component';
import { Router } from '@angular/router';

describe('DiscussV2HomeComponent', () => {
  let component: DiscussV2HomeComponent;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn(),
    } as any;

    component = new DiscussV2HomeComponent(mockRouter);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize shortCutData with correct values', () => {
    expect(component.shortCutData).toEqual([
      {
        name: 'Saved Posts',
        icon: 'bookmark_border',
        link: '/page/learn'
      },
      {
        name: 'Posts By You',
        icon: 'list_alt',
        link: ''
      },
      {
        name: 'Pending Request',
        icon: 'update',
        link: ''
      }
    ]);
  });

  describe('searchTextMethod', () => {
    it('should navigate to search with correct query params', () => {
      const searchText = ' test search ';
      component.searchTextMethod(searchText);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/discussion-forum-v2/search'],
        { queryParams: { c: 'test search' } }
      );
    });
  });

  describe('showAllCommunityByTopic', () => {
    it('should navigate to communities with correct topic', () => {
      const topic = 'technology';
      component.showAllCommunityByTopic(topic);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/discussion-forum-v2/communities/technology']
      );
    });
  });

  describe('showAllCommunityByTopicCard', () => {
    it('should navigate to communities with topic value', () => {
      const topicCard = { value: 'science' };
      component.showAllCommunityByTopicCard(topicCard);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/discussion-forum-v2/communities/science']
      );
    });
  });

  describe('communityCardClick', () => {
    it('should navigate to community with correct communityId', () => {
      const cardData = { communityId: '123' };
      component.communityCardClick(cardData);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/discussion-forum-v2/community', '123']
      );
    });
  });

  describe('showAllTopics', () => {
    it('should navigate to all topics page', () => {
      component.showAllTopics({});
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/app/discussion-forum-v2/topics/all']
      );
    });
  });
});