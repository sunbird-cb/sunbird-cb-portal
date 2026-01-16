import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CommunityContentCardComponent } from './community-content-card.component';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';

// Create a mock pipe for numberShortener
@Pipe({ name: 'numberShortener' })
class MockNumberShortenerPipe implements PipeTransform {
  transform(value: number): string {
    // Handle null or undefined values
    if (value === null || value === undefined) {
      return '0';
    }
    return value.toString();
  }
}

// Create a mock pipe for plural
@Pipe({ name: 'plural' })
class MockPluralPipe implements PipeTransform {
  transform(value: number, singular: string, plural: string): string {
    return value === 1 ? singular : plural;
  }
}

// Create a mock pipe for translate
@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('CommunityContentCardComponent', () => {
  let component: CommunityContentCardComponent;
  let fixture: ComponentFixture<CommunityContentCardComponent>;
  let mockRouter: any;

  beforeEach(async () => {
    // Create a mock for the Router
    mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [
        CommunityContentCardComponent,
        MockNumberShortenerPipe,
        MockPluralPipe,
        MockTranslatePipe
      ],
      providers: [
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown elements and attributes
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityContentCardComponent);
    component = fixture.componentInstance;
    
    // Set default input properties
    component.community = { 
      communityId: 'test-community-id',
      name: 'Test Community'
    };
    component.orgDetails = {
      orgName: 'Test Organization'
    };
    
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default thumbnail values', () => {
    expect(component.defaultThumbnail).toBe('/assets/instances/eagle/app_logos/default.png');
    expect(component.defaultSLogo).toBe('/assets/instances/eagle/app_logos/igot-katmayogi-logo.svg');
  });

  it('should set default logo on image load error', () => {
    const mockEvent = {
      target: {
        src: 'original-src'
      }
    };
    
    component.changeToDefaultImg(mockEvent);
    
    expect(mockEvent.target.src).toBe(component.defaultSLogo);
  });

  it('should set default thumbnail on thumbnail image load error', () => {
    const mockEvent = {
      target: {
        src: 'original-thumbnail-src'
      }
    };
    
    component.changeToDefaultThumbnailImg(mockEvent);
    
    expect(mockEvent.target.src).toBe(component.defaultThumbnail);
  });

  it('should navigate to community page when communityCardClick is called', () => {
    component.community = {
      communityId: 'test-community-123'
    };
    
    component.communityCardClick();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/app/discussion-forum-v2/community',
      'test-community-123'
    ]);
  });

  // Test that the component properly receives input properties
  it('should correctly set input properties', () => {
    const testCommunity = { 
      communityId: 'new-test-id',
      name: 'New Test Community'
    };
    const testOrgDetails = {
      orgName: 'New Test Organization'
    };
    
    component.community = testCommunity;
    component.orgDetails = testOrgDetails;
    fixture.detectChanges();
    
    expect(component.community).toEqual(testCommunity);
    expect(component.orgDetails).toEqual(testOrgDetails);
  });
});