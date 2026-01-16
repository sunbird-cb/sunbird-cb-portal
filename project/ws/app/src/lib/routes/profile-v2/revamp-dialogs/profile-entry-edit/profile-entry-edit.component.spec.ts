import { ProfileEntryEditComponent, endDateValidator } from './profile-entry-edit.component';

describe('ProfileEntryEditComponent', () => {
  let component: any;
  let mockDialogRef: any;
  let mockProfileV2RevampService: any;
  let mockSnackBar: any;
  let mockPipeImgUrl: any;
  let mockFormBuilder: any;

  beforeEach(() => {
    mockDialogRef = { close: jest.fn() };
    mockProfileV2RevampService = {
      getOrgSearch: jest.fn().mockReturnValue({ subscribe: jest.fn((cb: any) => cb({ result: { response: { count: 1, content: [] } } })) }),
      searchIgotDesignation: jest.fn().mockReturnValue({ subscribe: jest.fn((cb: any) => cb({ result: { Term: [], count: 0 } })) }),
      getStatesList: jest.fn().mockReturnValue({ subscribe: jest.fn((cb: any) => cb({ result: { statesList: [] } })) }),
      getDistrictsList: jest.fn().mockReturnValue({ subscribe: jest.fn((cb: any) => cb({ result: { districtsList: [{ districts: [] }] } })) }),
      getDegreesList: jest.fn().mockReturnValue({ subscribe: jest.fn((cb: any) => cb({ result: { degreesList: { degrees: [] } } })) }),
      getInstitutionsList: jest.fn().mockReturnValue({ subscribe: jest.fn((cb: any) => cb({ result: { institutionList: { institutions: [] } } })) }),
      updateAchievementPic: jest.fn().mockReturnValue({ subscribe: jest.fn((cb: any) => cb({ result: { url: '/userAchievements/test.png' } })) }),
    };
    mockSnackBar = { open: jest.fn() };
    mockPipeImgUrl = { transform: jest.fn().mockReturnValue('mockedUrl') };
    mockFormBuilder = {
      group: jest.fn().mockImplementation((obj: any) => {
        const controls: any = {};
        Object.keys(obj).forEach(key => {
          controls[key] = {
            value: obj[key][0] || '',
            setValue: jest.fn(),
            patchValue: jest.fn(),
            disable: jest.fn(),
            enable: jest.fn(),
            clearValidators: jest.fn(),
            setValidators: jest.fn(),
            updateValueAndValidity: jest.fn(),
            markAsTouched: jest.fn(),
            valueChanges: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) },
            reset: jest.fn(),
            touched: false,
            hasError: jest.fn().mockReturnValue(false),
          };
        });
        return {
          controls,
          get: (name: string) => controls[name],
          patchValue: jest.fn(),
          valid: true,
          value: {},
        };
      }),
    };

    component = new ProfileEntryEditComponent(
      mockFormBuilder as any,
      mockDialogRef,
      { header: '', entryDetails: {} },
      mockProfileV2RevampService,
      mockSnackBar,
      mockPipeImgUrl
    );
    component.entryForm = mockFormBuilder.group({
      orgName: ['', []],
      searchOrgName: ['', []],
      designation: ['', []],
      searchDesignation: ['', []],
      orgState: ['', []],
      orgDistrict: ['', []],
      startDate: ['', []],
      endDate: ['', []],
      currentlyWorking: ['', []],
      description: ['', []],
      degree: ['', []],
      searchDegrees: ['', []],
      otherDegree: ['', []],
      fieldOfStudy: ['', []],
      institutionName: ['', []],
      searchInstitute: ['', []],
      otherInstituteName: ['', []],
      startYear: ['', []],
      endYear: ['', []],
      title: ['', []],
      issuedOrganisation: ['', []],
      issuedDate: ['', []],
      uploadedDocumentUrl: ['', []],
      fileName: ['', []],
      url: ['', []],
    });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call dialogRef.close on handleCancel', () => {
    component.handleCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should call dialogRef.close with form value on handleSubmit if form is valid', () => {
    component.header = '';
    component.entryForm.valid = true;
    component.entryForm.value = { test: 1 };
    component.handleSubmit();
    expect(mockDialogRef.close).toHaveBeenCalledWith({ test: 1 });
  });

  it('should call markFormGroupTouched if form is invalid on handleSubmit', () => {
    component.entryForm.valid = false;
    const spy = jest.spyOn(component, 'markFormGroupTouched');
    component.handleSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('should add org details for Service History in handleSubmit', () => {
    component.header = 'Service History';
    component.selctedOrgDetails = { orgName: 'A', orgLogo: 'B', orgId: 'C', rootOrgId: 'D' };
    component.entryForm.valid = true;
    component.entryForm.value = { orgName: 'A' };
    component.handleSubmit();
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      orgName: 'A',
      orgLogo: 'B',
      orgId: 'C',
      rootOrgId: 'D',
    });
  });

  it('should mark all controls as touched in markFormGroupTouched', () => {
    const mockControl: any = { markAsTouched: jest.fn() };
    const formGroup: any = { controls: { a: mockControl } };
    component.markFormGroupTouched(formGroup);
    expect(mockControl.markAsTouched).toHaveBeenCalled();
  });

  it('should return true if control has error and is touched in hasError', () => {
    component.entryForm.get = jest.fn().mockReturnValue({
      touched: true,
      hasError: jest.fn().mockReturnValue(true),
    });
    expect(component.hasError('test', 'required')).toBe(true);
  });

  it('should return false if control is not touched or has no error in hasError', () => {
    component.entryForm.get = jest.fn().mockReturnValue({
      touched: false,
      hasError: jest.fn().mockReturnValue(false),
    });
    expect(component.hasError('test', 'required')).toBe(false);
  });

  it('should call snackBar.open in openSnackbar', () => {
    component.openSnackbar('msg', 1000);
    expect(mockSnackBar.open).toHaveBeenCalledWith('msg', 'X', { duration: 1000 });
  });

  it('should call getOrgList, getdesignationsMeta, getStatesList, serviceHistoryValueChangeFunctions in createServiceHistoryForm', () => {
    component.entryDetails = {};
    component.getOrgList = jest.fn();
    component.getdesignationsMeta = jest.fn();
    component.getStatesList = jest.fn();
    component.serviceHistoryValueChangeFunctions = jest.fn();
    component.createServiceHistoryForm();
    expect(component.getOrgList).toHaveBeenCalled();
    expect(component.getdesignationsMeta).toHaveBeenCalled();
    expect(component.getStatesList).toHaveBeenCalled();
    expect(component.serviceHistoryValueChangeFunctions).toHaveBeenCalled();
  });

  it('should call getDegreesList, getInstitutionsList, educationFormValuChange in createEducationalQualificationsForm', () => {
    component.getDegreesList = jest.fn();
    component.getInstitutionsList = jest.fn();
    component.educationFormValuChange = jest.fn();
    component.createEducationalQualificationsForm();
    expect(component.getDegreesList).toHaveBeenCalled();
    expect(component.getInstitutionsList).toHaveBeenCalled();
    expect(component.educationFormValuChange).toHaveBeenCalled();
  });

  it('should call valueChanges in createAchievementsForm', () => {
    component.valueChanges = jest.fn();
    component.entryDetails = {};
    component.createAchievementsForm();
    expect(component.valueChanges).toHaveBeenCalled();
  });

  it('should call openSnackbar with error in getOrgList error', () => {
    mockProfileV2RevampService.getOrgSearch = jest.fn().mockReturnValue({
      subscribe: ({ error }: any) => error({}),
    });
    component.openSnackbar = jest.fn();
    component.getOrgList();
    expect(component.openSnackbar).toHaveBeenCalled();
  });

  it('should call openSnackbar with error in getdesignationsMeta error', () => {
    component.selctedOrgDetails = { rootOrgId: 'root' };
    mockProfileV2RevampService.searchIgotDesignation = jest.fn().mockReturnValue({
      subscribe: ({ error }: any) => error({}),
    });
    component.openSnackbar = jest.fn();
    component.getdesignationsMeta();
    expect(component.openSnackbar).toHaveBeenCalled();
  });

  it('should call openSnackbar with error in getStatesList error', () => {
    mockProfileV2RevampService.getStatesList = jest.fn().mockReturnValue({
      subscribe: ({ error }: any) => error({}),
    });
    component.openSnackbar = jest.fn();
    component.getStatesList();
    expect(component.openSnackbar).toHaveBeenCalled();
  });

  it('should call openSnackbar with error in getDistrictsList error', () => {
    mockProfileV2RevampService.getDistrictsList = jest.fn().mockReturnValue({
      subscribe: ({ error }: any) => error({}),
    });
    component.openSnackbar = jest.fn();
    component.entryForm.get = jest.fn().mockReturnValue({ enable: jest.fn(), disable: jest.fn() });
    component.getDistrictsList('state');
    expect(component.openSnackbar).toHaveBeenCalled();
  });

  it('should disable orgDistrictControl if state is empty in getDistrictsList', () => {
    const disable = jest.fn();
    component.entryForm.get = jest.fn().mockReturnValue({ disable });
    component.getDistrictsList('');
    expect(disable).toHaveBeenCalled();
  });

  it('should patchValue on currentlyWorkingControl and disable endDateControl on onCurrentlyWorkingChange(true)', () => {
    const patchValue = jest.fn();
    const setValue = jest.fn();
    const disable = jest.fn();
    const clearValidators = jest.fn();
    const updateValueAndValidity = jest.fn();
    component.entryForm.get = jest.fn().mockImplementation((name: string) => {
      if (name === 'currentlyWorking') return { patchValue };
      if (name === 'endDate') return { setValue, disable, clearValidators, updateValueAndValidity };
      return null;
    });
    component.onCurrentlyWorkingChange(true);
    expect(patchValue).toHaveBeenCalled();
    expect(setValue).toHaveBeenCalled();
    expect(disable).toHaveBeenCalled();
    expect(clearValidators).toHaveBeenCalled();
    expect(updateValueAndValidity).toHaveBeenCalled();
  });

  it('should enable endDateControl and setValidators on onCurrentlyWorkingChange(false)', () => {
    const enable = jest.fn();
    const setValidators = jest.fn();
    const updateValueAndValidity = jest.fn();
    component.entryForm.get = jest.fn().mockImplementation((name: string) => {
      if (name === 'currentlyWorking') return { patchValue: jest.fn() };
      if (name === 'endDate') return { enable, setValidators, updateValueAndValidity };
      return null;
    });
    component.onCurrentlyWorkingChange(false);
    expect(enable).toHaveBeenCalled();
    expect(setValidators).toHaveBeenCalled();
    expect(updateValueAndValidity).toHaveBeenCalled();
  });

  it('should set endDate to null if endDate < selectedStartDate in onStartDateChange', () => {
    const setValue = jest.fn();
    component.entryForm.get = jest.fn().mockReturnValue({ value: '2020-01-01', setValue });
    component.onStartDateChange(new Date('2022-01-01'));
    expect(setValue).toHaveBeenCalledWith(null);
  });

  it('should not set endDate to null if endDate >= selectedStartDate in onStartDateChange', () => {
    const setValue = jest.fn();
    component.entryForm.get = jest.fn().mockReturnValue({ value: '2023-01-01', setValue });
    component.onStartDateChange(new Date('2022-01-01'));
    expect(setValue).not.toHaveBeenCalled();
  });

  it('should call openSnackbar with error in getDegreesList error', () => {
    mockProfileV2RevampService.getDegreesList = jest.fn().mockReturnValue({
      subscribe: ({ error }: any) => error({}),
    });
    component.openSnackbar = jest.fn();
    component.getDegreesList();
    expect(component.openSnackbar).toHaveBeenCalled();
  });

  it('should call openSnackbar with error in getInstitutionsList error', () => {
    mockProfileV2RevampService.getInstitutionsList = jest.fn().mockReturnValue({
      subscribe: ({ error }: any) => error({}),
    });
    component.openSnackbar = jest.fn();
    component.getInstitutionsList();
    expect(component.openSnackbar).toHaveBeenCalled();
  });

  it('should call openSnackbar with error in saveImage error', () => {
    mockProfileV2RevampService.updateAchievementPic = jest.fn().mockReturnValue({
      subscribe: ({ error }: any) => error({ error: { message: 'fail' } }),
    });
    component.openSnackbar = jest.fn();
    component.entryForm.get = jest.fn().mockReturnValue({
      patchValue: jest.fn(),
      updateValueAndValidity: jest.fn(),
      disable: jest.fn(),
    });
    component.pipeImgUrl = { transform: jest.fn() };
    component.saveImage({ name: 'test.png' });
    expect(component.openSnackbar).toHaveBeenCalledWith('fail');
  });

  it('should call patchValue and updateValueAndValidity in removeFile', () => {
    const patchValue = jest.fn();
    const updateValueAndValidity = jest.fn();
    const enable = jest.fn();
    component.entryForm.get = jest.fn().mockImplementation((name: string) => {
      if (name === 'uploadedDocumentUrl' || name === 'fileName') return { patchValue, updateValueAndValidity };
      if (name === 'url') return { patchValue, enable, updateValueAndValidity };
      return null;
    });
    component.removeFile();
    expect(patchValue).toHaveBeenCalled();
    expect(updateValueAndValidity).toHaveBeenCalled();
    expect(enable).toHaveBeenCalled();
  });

  it('should call openSnackbar if file is not image in onFileSelected', () => {
    component.openSnackbar = jest.fn();
    component.onFileSelected([{ type: 'application/pdf' }]);
    expect(component.openSnackbar).toHaveBeenCalledWith('Only images are supported');
  });

  it('should call openSnackbar if image size > 500KB in onFileSelected', () => {
    component.openSnackbar = jest.fn();
    component.onFileSelected([{ type: 'image/png', size: 600 * 1024 }]);
    expect(component.openSnackbar).toHaveBeenCalledWith('Selected image size is more than 500KB.');
  });

  it('should call saveImage if file is image and size < 500KB in onFileSelected', () => {
    component.saveImage = jest.fn();
    const file = { type: 'image/png', size: 100 * 1024, name: 'test.png' };
    window.FileReader = jest.fn().mockImplementation(() => ({ readAsDataURL: jest.fn() })) as any;
    component.onFileSelected([file]);
    expect(component.saveImage).toHaveBeenCalledWith(file);
  });

  it('should call preventDefaultCDK and onFileSelected in onDrop', () => {
    component.preventDefaultCDK = jest.fn();
    component.onFileSelected = jest.fn();
    const files = { length: 1 };
    const event: any = { dataTransfer: { files }, preventDefault: jest.fn(), stopPropagation: jest.fn() };
    component.onDrop(event);
    expect(component.preventDefaultCDK).toHaveBeenCalled();
    expect(component.onFileSelected).toHaveBeenCalledWith(files);
  });

  it('should call preventDefaultCDK in preventDefaultCDK', () => {
    const event: any = { preventDefault: jest.fn(), stopPropagation: jest.fn(), target: { style: {} } };
    component.preventDefaultCDK(event, 'enter');
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.target.style.opacity).toBe('0.5');
    component.preventDefaultCDK(event, 'leave');
    expect(event.target.style.opacity).toBe('1');
  });

  it('should call patchValue and updateValueAndValidity in onDegreeChange', () => {
    const setValidators = jest.fn();
    const clearValidators = jest.fn();
    const setValue = jest.fn();
    const updateValueAndValidity = jest.fn();
    component.entryForm.get = jest.fn().mockReturnValue({ setValidators, clearValidators, setValue, updateValueAndValidity });
    component.onDegreeChange('other');
    expect(setValidators).toHaveBeenCalled();
    component.onDegreeChange('not-other');
    expect(clearValidators).toHaveBeenCalled();
    expect(setValue).toHaveBeenCalled();
    expect(updateValueAndValidity).toHaveBeenCalled();
  });

  it('should call setValidators and updateValueAndValidity in onInstituteChange', () => {
    const setValidators = jest.fn();
    const clearValidators = jest.fn();
    const setValue = jest.fn();
    const updateValueAndValidity = jest.fn();
    component.entryForm.get = jest.fn().mockReturnValue({ setValidators, clearValidators, setValue, updateValueAndValidity });
    component.onInstituteChange('Other');
    expect(setValidators).toHaveBeenCalled();
    component.onInstituteChange('not-Other');
    expect(clearValidators).toHaveBeenCalled();
    expect(setValue).toHaveBeenCalled();
    expect(updateValueAndValidity).toHaveBeenCalled();
    component.onInstituteChange('Other', true);
    expect(setValidators).toHaveBeenCalled();
  });

  it('should return true/false from isEndYearDisabled', () => {
    component.entryForm.get = jest.fn().mockReturnValue({ value: 2020 });
    expect(component.isEndYearDisabled(2019)).toBe(true);
    expect(component.isEndYearDisabled(2021)).toBe(false);
    component.entryForm.get = jest.fn().mockReturnValue({ value: undefined });
    expect(component.isEndYearDisabled(2021)).toBe(false);
  });

  it('should patchValue endYear to null in onStartYearChange', () => {
    component.entryForm.get = jest.fn().mockReturnValue({ value: 2019 });
    component.entryForm.patchValue = jest.fn();
    component.onStartYearChange(2020);
    expect(component.entryForm.patchValue).toHaveBeenCalledWith({ endYear: null });
  });

  it('should not patchValue endYear if endYear >= value in onStartYearChange', () => {
    component.entryForm.get = jest.fn().mockReturnValue({ value: 2022 });
    component.entryForm.patchValue = jest.fn();
    component.onStartYearChange(2020);
    expect(component.entryForm.patchValue).not.toHaveBeenCalled();
  });

  describe('endDateValidator', () => {
    it('should return error if endDate < startDate', () => {
      const control: any = {
        parent: {
          get: () => ({ value: '2024-01-01' }),
        },
        value: '2023-01-01',
      };
      expect(endDateValidator('startDate')(control)).toEqual({ endDateLessThanStartDate: true });
    });

    it('should return null if endDate is valid', () => {
      const control: any = {
        parent: {
          get: () => ({ value: '2022-01-01' }),
        },
        value: '2023-01-01',
      };
      expect(endDateValidator('startDate')(control)).toBeNull();
    });

    it('should return null if endDate is not set', () => {
      const control: any = { parent: { get: () => ({ value: '2022-01-01' }) }, value: null };
      expect(endDateValidator('startDate')(control)).toBeNull();
    });
  });
});

describe('ProfileEntryEditComponent - Additional Cases', () => {
  let component: any;
  let mockDialogRef: any;
  let mockProfileV2RevampService: any;
  let mockSnackBar: any;
  let mockPipeImgUrl: any;
  let mockFormBuilder: any;

  beforeEach(() => {
    mockDialogRef = { close: jest.fn() };
    mockProfileV2RevampService = {
      getOrgSearch: jest.fn().mockReturnValue({ subscribe: jest.fn((cb: any) => cb({ result: { response: { count: 1, content: [] } } })) }),
      searchIgotDesignation: jest.fn().mockReturnValue({ subscribe: jest.fn((cb: any) => cb({ result: { Term: [], count: 0 } })) }),
      getStatesList: jest.fn().mockReturnValue({ subscribe: jest.fn((cb: any) => cb({ result: { statesList: [] } })) }),
      getDistrictsList: jest.fn().mockReturnValue({ subscribe: jest.fn((cb: any) => cb({ result: { districtsList: [{ districts: [] }] } })) }),
      getDegreesList: jest.fn().mockReturnValue({ subscribe: jest.fn((cb: any) => cb({ result: { degreesList: { degrees: [] } } })) }),
      getInstitutionsList: jest.fn().mockReturnValue({ subscribe: jest.fn((cb: any) => cb({ result: { institutionList: { institutions: [] } } })) }),
      updateAchievementPic: jest.fn().mockReturnValue({ subscribe: jest.fn((cb: any) => cb({ result: { url: '/userAchievements/test.png' } })) }),
    };
    mockSnackBar = { open: jest.fn() };
    mockPipeImgUrl = { transform: jest.fn().mockReturnValue('mockedUrl') };
    mockFormBuilder = {
      group: jest.fn().mockImplementation((obj: any) => {
        const controls: any = {};
        Object.keys(obj).forEach(key => {
          controls[key] = {
            value: obj[key][0] || '',
            setValue: jest.fn(),
            patchValue: jest.fn(),
            disable: jest.fn(),
            enable: jest.fn(),
            clearValidators: jest.fn(),
            setValidators: jest.fn(),
            updateValueAndValidity: jest.fn(),
            markAsTouched: jest.fn(),
            valueChanges: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) },
            reset: jest.fn(),
            touched: false,
            hasError: jest.fn().mockReturnValue(false),
          };
        });
        return {
          controls,
          get: (name: string) => controls[name],
          patchValue: jest.fn(),
          valid: true,
          value: {},
        };
      }),
    };

    component = new ProfileEntryEditComponent(
      mockFormBuilder as any,
      mockDialogRef,
      { header: '', entryDetails: {} },
      mockProfileV2RevampService,
      mockSnackBar,
      mockPipeImgUrl
    );
    component.entryForm = mockFormBuilder.group({
      orgName: ['', []],
      searchOrgName: ['', []],
      designation: ['', []],
      searchDesignation: ['', []],
      orgState: ['', []],
      orgDistrict: ['', []],
      startDate: ['', []],
      endDate: ['', []],
      currentlyWorking: ['', []],
      description: ['', []],
      degree: ['', []],
      searchDegrees: ['', []],
      otherDegree: ['', []],
      fieldOfStudy: ['', []],
      institutionName: ['', []],
      searchInstitute: ['', []],
      otherInstituteName: ['', []],
      startYear: ['', []],
      endYear: ['', []],
      title: ['', []],
      issuedOrganisation: ['', []],
      issuedDate: ['', []],
      uploadedDocumentUrl: ['', []],
      fileName: ['', []],
      url: ['', []],
    });
  });

  it('should call valueChanges in serviceHistoryValueChangeFunctions', () => {
    component.entryForm.get = jest.fn().mockReturnValue({ valueChanges: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) } });
    expect(() => component.serviceHistoryValueChangeFunctions()).not.toThrow();
  });

  it('should call valueChanges in educationFormValuChange', () => {
    component.entryForm.get = jest.fn().mockReturnValue({ valueChanges: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) } });
    expect(() => component.educationFormValuChange()).not.toThrow();
  });

  it('should call valueChanges in valueChanges', () => {
    component.entryForm.get = jest.fn().mockReturnValue({ valueChanges: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) } });
    expect(() => component.valueChanges()).not.toThrow();
  });

  it('should handle saveImage success', () => {
    const patchValue = jest.fn();
    const updateValueAndValidity = jest.fn();
    const disable = jest.fn();
    component.entryForm.get = jest.fn().mockReturnValue({ patchValue, updateValueAndValidity, disable });
    component.pipeImgUrl = { transform: jest.fn().mockReturnValue('mockedUrl') };
    mockProfileV2RevampService.updateAchievementPic = jest.fn().mockReturnValue({
      subscribe: (cb: any) => cb({ result: { url: '/userAchievements/test.png' } }),
    });
    expect(() => component.saveImage({ name: 'test.png' })).not.toThrow();
    expect(patchValue).toHaveBeenCalled();
    expect(updateValueAndValidity).toHaveBeenCalled();
    expect(disable).toHaveBeenCalled();
  });

  it('should not throw error in removeFile if controls are missing', () => {
    component.entryForm.get = jest.fn().mockReturnValue(undefined);
    expect(() => component.removeFile()).not.toThrow();
  });

  it('should not throw error in onDegreeChange if control is missing', () => {
    component.entryForm.get = jest.fn().mockReturnValue(undefined);
    expect(() => component.onDegreeChange('other')).not.toThrow();
  });

  it('should not throw error in onInstituteChange if control is missing', () => {
    component.entryForm.get = jest.fn().mockReturnValue(undefined);
    expect(() => component.onInstituteChange('Other')).not.toThrow();
  });

  it('should not throw error in onStartYearChange if control is missing', () => {
    component.entryForm.get = jest.fn().mockReturnValue(undefined);
    component.entryForm.patchValue = jest.fn();
    expect(() => component.onStartYearChange(2020)).not.toThrow();
  });

  it('should not throw error in onCurrentlyWorkingChange if controls are missing', () => {
    component.entryForm.get = jest.fn().mockReturnValue(undefined);
    expect(() => component.onCurrentlyWorkingChange(true)).not.toThrow();
    expect(() => component.onCurrentlyWorkingChange(false)).not.toThrow();
  });

  it('should not throw error in onStartDateChange if control is missing', () => {
    component.entryForm.get = jest.fn().mockReturnValue(undefined);
    expect(() => component.onStartDateChange(new Date())).not.toThrow();
  });

  it('should not throw error in isEndYearDisabled if control is missing', () => {
    component.entryForm.get = jest.fn().mockReturnValue(undefined);
    expect(component.isEndYearDisabled(2021)).toBe(false);
  });

  it('should not throw error in onFileSelected if files is empty', () => {
    expect(() => component.onFileSelected([])).not.toThrow();
  });

  it('should not throw error in onDrop if files is empty', () => {
    component.preventDefaultCDK = jest.fn();
    component.onFileSelected = jest.fn();
    const event: any = { dataTransfer: { files: [] }, preventDefault: jest.fn(), stopPropagation: jest.fn() };
    expect(() => component.onDrop(event)).not.toThrow();
  });

  it('should not throw error in preventDefaultCDK if event.target is missing', () => {
    const event: any = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
    expect(() => component.preventDefaultCDK(event, 'enter')).toThrow();
    expect(() => component.preventDefaultCDK(event, 'leave')).toThrow();
  });
});
