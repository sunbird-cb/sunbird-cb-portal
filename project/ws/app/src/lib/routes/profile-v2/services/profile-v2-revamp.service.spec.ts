import { ProfileV2RevampService } from './profile-v2-revamp.service';
// import { HttpClient } from '@angular/common/http';
// import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

describe('ProfileV2RevampService', () => {
  let service: ProfileV2RevampService;
  let mockHttpClient: any;
  let mockTranslateService: any;

  const mockProfile = {
    id: 'user123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com'
  };

  const mockApiResponse = {
    result: {
      response: {
        serviceHistory: [
          {
            designation: 'Software Engineer',
            orgName: 'Tech Corp',
            orgDistrict: 'Bangalore',
            orgState: 'Karnataka'
          }
        ]
      }
    }
  };

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };

    mockTranslateService = {
      instant: jest.fn(),
      setDefaultLang: jest.fn(),
      use: jest.fn()
    };

    service = new ProfileV2RevampService(mockHttpClient, mockTranslateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Constructor', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with HttpClient and TranslateService', () => {
      expect(service['http']).toBe(mockHttpClient);
      expect(service['translateService']).toBe(mockTranslateService);
    });
  });

  describe('fetchProfile', () => {
    it('should fetch user profile successfully', (done) => {
      const userId = 'user123';
      mockHttpClient.get.mockReturnValue(of(mockProfile));

      service.fetchProfile(userId).subscribe((result: any) => {
        expect(result).toEqual(mockProfile);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/apis/proxies/v8/user/profile/v1/basic/user123');
        done();
      });
    });

    it('should handle fetch profile error', (done) => {
      const userId = 'user123';
      const error = new Error('Network error');
      mockHttpClient.get.mockReturnValue(throwError(error));

      service.fetchProfile(userId).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });

    it('should handle empty userId', (done) => {
      const userId = '';
      mockHttpClient.get.mockReturnValue(of(mockProfile));

      service.fetchProfile(userId).subscribe(() => {
        expect(mockHttpClient.get).toHaveBeenCalledWith('/apis/proxies/v8/user/profile/v1/basic/');
        done();
      });
    });
  });

  describe('updateProfileDetails', () => {
    it('should update profile details successfully', (done) => {
      const requestBody = { firstName: 'Jane', lastName: 'Smith' };
      const response = { success: true };
      mockHttpClient.post.mockReturnValue(of(response));

      service.updateProfileDetails(requestBody).subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/apis/proxies/v8/user/v1/extPatch', requestBody);
        done();
      });
    });

    it('should handle update profile details error', (done) => {
      const requestBody = { firstName: 'Jane' };
      const error = new Error('Update failed');
      mockHttpClient.post.mockReturnValue(throwError(error));

      service.updateProfileDetails(requestBody).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });

    it('should handle null request body', (done) => {
      mockHttpClient.post.mockReturnValue(of({ success: true }));

      service.updateProfileDetails(null).subscribe(() => {
        expect(mockHttpClient.post).toHaveBeenCalledWith('/apis/proxies/v8/user/v1/extPatch', null);
        done();
      });
    });
  });

  describe('updateProfilePic', () => {
    it('should update profile picture successfully', (done) => {
      const formData = new FormData();
      formData.append('file', new Blob(['test']), 'test.jpg');
      const response = { url: 'profile-pic-url' };
      mockHttpClient.post.mockReturnValue(of(response));

      service.updateProfilePic(formData).subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/apis/proxies/v8/storage/profilePhotoUpload/profileImage', formData);
        done();
      });
    });

    it('should handle update profile picture error', (done) => {
      const formData = new FormData();
      const error = new Error('Upload failed');
      mockHttpClient.post.mockReturnValue(throwError(error));

      service.updateProfilePic(formData).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('updateBannerPic', () => {
    it('should update banner picture successfully', (done) => {
      const formData = new FormData();
      formData.append('file', new Blob(['banner']), 'banner.jpg');
      const response = { url: 'banner-pic-url' };
      mockHttpClient.post.mockReturnValue(of(response));

      service.updateBannerPic(formData).subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/apis/proxies/v8/storage/profilePhotoUpload/profileBanner', formData);
        done();
      });
    });

    it('should handle update banner picture error', (done) => {
      const formData = new FormData();
      const error = new Error('Banner upload failed');
      mockHttpClient.post.mockReturnValue(throwError(error));

      service.updateBannerPic(formData).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('fetchProfileEntries', () => {
    it('should fetch profile entries with default entryType', (done) => {
      const userId = 'user123';
      mockHttpClient.get.mockReturnValue(of(mockApiResponse));

      service.fetchProfileEntries(userId).subscribe((result: any) => {
        expect(result).toEqual(mockApiResponse);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/apis/proxies/v8/user/profile/v1/extended/all/user123');
        done();
      });
    });

    it('should fetch profile entries with specific entryType', (done) => {
      const userId = 'user123';
      const entryType = 'serviceHistory';
      mockHttpClient.get.mockReturnValue(of(mockApiResponse));

      service.fetchProfileEntries(userId, entryType).subscribe((result: any) => {
        expect(result).toEqual(mockApiResponse);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/apis/proxies/v8/user/profile/v1/extended/serviceHistory/user123');
        done();
      });
    });

    it('should handle fetch profile entries error', (done) => {
      const userId = 'user123';
      const error = new Error('Fetch failed');
      mockHttpClient.get.mockReturnValue(throwError(error));

      service.fetchProfileEntries(userId).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('getRecommendedUsers', () => {
    it('should get recommended users successfully', (done) => {
      const formBody = { limit: 10, offset: 0 };
      const response = { users: [] };
      mockHttpClient.post.mockReturnValue(of(response));

      service.getRecommendedUsers(formBody).subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/apis/protected/v8/connections/v2/connections/recommended', formBody);
        done();
      });
    });

    it('should handle get recommended users error', (done) => {
      const formBody = { limit: 10 };
      const error = new Error('Recommendation failed');
      mockHttpClient.post.mockReturnValue(throwError(error));

      service.getRecommendedUsers(formBody).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('connectToNetwork', () => {
    it('should connect to network successfully', (done) => {
      const payload = { userId: 'user123', connectionType: 'follow' };
      const response = { success: true };
      mockHttpClient.post.mockReturnValue(of(response));

      service.connectToNetwork(payload).subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.post).toHaveBeenCalledWith('apis/protected/v8/connections/v2/add/connection', payload);
        done();
      });
    });

    it('should handle connect to network error', (done) => {
      const payload = { userId: 'user123' };
      const error = new Error('Connection failed');
      mockHttpClient.post.mockReturnValue(throwError(error));

      service.connectToNetwork(payload).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('getCommunities', () => {
    it('should get communities successfully', (done) => {
      const formBody = { query: 'tech' };
      const response = { communities: [] };
      mockHttpClient.post.mockReturnValue(of(response));

      service.getCommunities(formBody).subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/apis/proxies/v8/community/v1/search', formBody);
        done();
      });
    });

    it('should handle get communities error', (done) => {
      const formBody = { query: 'tech' };
      const error = new Error('Community search failed');
      mockHttpClient.post.mockReturnValue(throwError(error));

      service.getCommunities(formBody).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('fetchCourseBatches', () => {
    it('should fetch course batches successfully', (done) => {
      const req = { courseId: 'course123' };
      const mockResponse = {
        result: {
          response: {
            batches: [{ id: 'batch1', name: 'Batch 1' }]
          }
        }
      };
      mockHttpClient.post.mockReturnValue(of(mockResponse));

      service.fetchCourseBatches(req).subscribe((result: any) => {
        expect(result).toEqual(mockResponse.result.response);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/apis/proxies/v8/learner/course/v1/batch/list', req);
        done();
      });
    });

    // it('should handle fetch course batches error and retry', (done) => {
    //   const req = { courseId: 'course123' };
    //   const error = new Error('Network error');
    //   mockHttpClient.post.mockReturnValueOnce(throwError(error))
    //                     .mockReturnValueOnce(of({ result: { response: { batches: [] } } }));

    //   service.fetchCourseBatches(req).subscribe((result: any) => {
    //     expect(result).toEqual({ batches: [] });
    //     expect(mockHttpClient.post).toHaveBeenCalledTimes(2);
    //     done();
    //   });
    // });
  });

  describe('fetchCadre', () => {
    it('should fetch cadre successfully', (done) => {
      const response = { cadres: [] };
      mockHttpClient.get.mockReturnValue(of(response));

      service.fetchCadre().subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/apis/proxies/v8/data/v2/system/settings/get/cadreConfig');
        done();
      });
    });

    it('should handle fetch cadre error', (done) => {
      const error = new Error('Cadre fetch failed');
      mockHttpClient.get.mockReturnValue(throwError(error));

      service.fetchCadre().subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('getMasterLanguages', () => {
    it('should get master languages successfully', (done) => {
      const response = { languages: ['English', 'Hindi'] };
      mockHttpClient.get.mockReturnValue(of(response));

      service.getMasterLanguages().subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/apis/protected/v8/user/profileRegistry/getMasterLanguages');
        done();
      });
    });

    it('should handle get master languages error', (done) => {
      const error = new Error('Languages fetch failed');
      mockHttpClient.get.mockReturnValue(throwError(error));

      service.getMasterLanguages().subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('getOrgSearch', () => {
    it('should search organizations successfully', (done) => {
      const formBody = { query: 'tech company' };
      const response = { organizations: [] };
      mockHttpClient.post.mockReturnValue(of(response));

      service.getOrgSearch(formBody).subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/apis/proxies/v8/org/v1/search', formBody);
        done();
      });
    });

    it('should handle org search error', (done) => {
      const formBody = { query: 'tech' };
      const error = new Error('Org search failed');
      mockHttpClient.post.mockReturnValue(throwError(error));

      service.getOrgSearch(formBody).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('getMinistriesList', () => {
    it('should get ministries list successfully', (done) => {
      const response = { ministries: [] };
      mockHttpClient.get.mockReturnValue(of(response));

      service.getMinistriesList().subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/apis/public/v8/org/v1/list/ministry');
        done();
      });
    });

    it('should handle get ministries list error', (done) => {
      const error = new Error('Ministries fetch failed');
      mockHttpClient.get.mockReturnValue(throwError(error));

      service.getMinistriesList().subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('getDesignations', () => {
    it('should get designations successfully', (done) => {
      const req = { query: 'engineer' };
      const response = { designations: [] };
      mockHttpClient.get.mockReturnValue(of(response));

      service.getDesignations(req).subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/apis/proxies/v8/user/v1/positions');
        done();
      });
    });

    it('should handle get designations error', (done) => {
      const req = { query: 'manager' };
      const error = new Error('Designations fetch failed');
      mockHttpClient.get.mockReturnValue(throwError(error));

      service.getDesignations(req).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('getGroups', () => {
    it('should get groups successfully', (done) => {
      const response = { groups: [] };
      mockHttpClient.get.mockReturnValue(of(response));

      service.getGroups().subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/api/user/v1/groups');
        done();
      });
    });

    it('should handle get groups error', (done) => {
      const error = new Error('Groups fetch failed');
      mockHttpClient.get.mockReturnValue(throwError(error));

      service.getGroups().subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('getStatesList', () => {
    it('should get states list successfully', (done) => {
      const response = { states: [] };
      mockHttpClient.get.mockReturnValue(of(response));

      service.getStatesList().subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/apis/proxies/v8/extendedprofile/list/states');
        done();
      });
    });

    it('should handle get states list error', (done) => {
      const error = new Error('States fetch failed');
      mockHttpClient.get.mockReturnValue(throwError(error));

      service.getStatesList().subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('getDistrictsList', () => {
    it('should get districts list successfully', (done) => {
      const state = 'Karnataka';
      const response = { districts: [] };
      mockHttpClient.post.mockReturnValue(of(response));

      service.getDistrictsList(state).subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
          'apis/proxies/v8/extendedprofile/list/districts',
          { contextName: state }
        );
        done();
      });
    });

    it('should handle get districts list error', (done) => {
      const state = 'Karnataka';
      const error = new Error('Districts fetch failed');
      mockHttpClient.post.mockReturnValue(throwError(error));

      service.getDistrictsList(state).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });

    it('should handle empty state parameter', (done) => {
      const state = '';
      const response = { districts: [] };
      mockHttpClient.post.mockReturnValue(of(response));

      service.getDistrictsList(state).subscribe(() => {
        expect(mockHttpClient.post).toHaveBeenCalledWith(
          'apis/proxies/v8/extendedprofile/list/districts',
          { contextName: '' }
        );
        done();
      });
    });
  });

  describe('getDegreesList', () => {
    it('should get degrees list successfully', (done) => {
      const response = { degrees: [] };
      mockHttpClient.get.mockReturnValue(of(response));

      service.getDegreesList().subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.get).toHaveBeenCalledWith('apis/proxies/v8/masterdata/list/degrees');
        done();
      });
    });

    it('should handle get degrees list error', (done) => {
      const error = new Error('Degrees fetch failed');
      mockHttpClient.get.mockReturnValue(throwError(error));

      service.getDegreesList().subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('getInstitutionsList', () => {
    it('should get institutions list successfully', (done) => {
      const response = { institutions: [] };
      mockHttpClient.get.mockReturnValue(of(response));

      service.getInstitutionsList().subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.get).toHaveBeenCalledWith('apis/proxies/v8/masterdata/list/institutions');
        done();
      });
    });

    it('should handle get institutions list error', (done) => {
      const error = new Error('Institutions fetch failed');
      mockHttpClient.get.mockReturnValue(throwError(error));

      service.getInstitutionsList().subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('updateDegree', () => {
    it('should update degree successfully', (done) => {
      const requestBody = { degreeId: 'degree123', name: 'New Degree' };
      const response = { success: true };
      mockHttpClient.post.mockReturnValue(of(response));

      service.updateDegree(requestBody).subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.post).toHaveBeenCalledWith('apis/proxies/v8/masterdata/update/degree', requestBody);
        done();
      });
    });

    it('should handle update degree error', (done) => {
      const requestBody = { degreeId: 'degree123' };
      const error = new Error('Degree update failed');
      mockHttpClient.post.mockReturnValue(throwError(error));

      service.updateDegree(requestBody).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('updateInstitution', () => {
    it('should update institution successfully', (done) => {
      const requestBody = { institutionId: 'inst123', name: 'New Institution' };
      const response = { success: true };
      mockHttpClient.post.mockReturnValue(of(response));

      service.updateInstitution(requestBody).subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.post).toHaveBeenCalledWith('apis/proxies/v8/masterdata/update/institution', requestBody);
        done();
      });
    });

    it('should handle update institution error', (done) => {
      const requestBody = { institutionId: 'inst123' };
      const error = new Error('Institution update failed');
      mockHttpClient.post.mockReturnValue(throwError(error));

      service.updateInstitution(requestBody).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('updateAchievementPic', () => {
    it('should update achievement picture successfully', (done) => {
      const formData = new FormData();
      formData.append('file', new Blob(['achievement']), 'achievement.jpg');
      const response = { url: 'achievement-pic-url' };
      mockHttpClient.post.mockReturnValue(of(response));

      service.updateAchievementPic(formData).subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/apis/proxies/v8/storage/profilePhotoUpload/userAchievements', formData);
        done();
      });
    });

    it('should handle update achievement picture error', (done) => {
      const formData = new FormData();
      const error = new Error('Achievement upload failed');
      mockHttpClient.post.mockReturnValue(throwError(error));

      service.updateAchievementPic(formData).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('addEntriesToProfile', () => {
    it('should add entries to profile successfully', (done) => {
      const requestBody = { entries: [] };
      const response = { success: true };
      mockHttpClient.post.mockReturnValue(of(response));

      service.addEntriesToProfile(requestBody).subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/apis/proxies/v8/user/profile/v1/extended', requestBody);
        done();
      });
    });

    it('should handle add entries to profile error', (done) => {
      const requestBody = { entries: [] };
      const error = new Error('Add entries failed');
      mockHttpClient.post.mockReturnValue(throwError(error));

      service.addEntriesToProfile(requestBody).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('updateEntriesOfProfile', () => {
    it('should update entries of profile successfully', (done) => {
      const requestBody = { entries: [] };
      const response = { success: true };
      mockHttpClient.put.mockReturnValue(of(response));

      service.updateEntriesOfProfile(requestBody).subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.put).toHaveBeenCalledWith('/apis/proxies/v8/user/profile/v1/extended/update', requestBody);
        done();
      });
    });

    it('should handle update entries of profile error', (done) => {
      const requestBody = { entries: [] };
      const error = new Error('Update entries failed');
      mockHttpClient.put.mockReturnValue(throwError(error));

      service.updateEntriesOfProfile(requestBody).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('deleteEntriesOfProfile', () => {
    it('should delete entries of profile successfully', (done) => {
      const requestBody = { entryIds: ['entry1', 'entry2'] };
      const response = { success: true };
      mockHttpClient.delete.mockReturnValue(of(response));

      service.deleteEntriesOfProfile(requestBody).subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.delete).toHaveBeenCalledWith('/apis/proxies/v8/user/profile/v1/extended/delete', requestBody);
        done();
      });
    });

    it('should handle delete entries of profile error', (done) => {
      const requestBody = { entryIds: ['entry1'] };
      const error = new Error('Delete entries failed');
      mockHttpClient.delete.mockReturnValue(throwError(error));

      service.deleteEntriesOfProfile(requestBody).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('getWhiteListDomain', () => {
    it('should get whitelist domain successfully', (done) => {
      const response = { domains: [] };
      mockHttpClient.get.mockReturnValue(of(response));

      service.getWhiteListDomain().subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.get).toHaveBeenCalledWith('apis/proxies/v8/user/v1/email/approvedDomains');
        done();
      });
    });

    it('should handle get whitelist domain error', (done) => {
      const error = new Error('Whitelist domain fetch failed');
      mockHttpClient.get.mockReturnValue(throwError(error));

      service.getWhiteListDomain().subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('fetchApprovalDetails', () => {
    it('should fetch approval details successfully', (done) => {
      const requestBody = { userId: 'user123' };
      const response = { approvals: [] };
      mockHttpClient.post.mockReturnValue(of(response));

      service.fetchApprovalDetails(requestBody).subscribe((result: any) => {
        expect(result).toEqual(response);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/apis/proxies/v8/workflow/v2/userWFApplicationFieldsSearch', requestBody);
        done();
      });
    });

    
  });
});