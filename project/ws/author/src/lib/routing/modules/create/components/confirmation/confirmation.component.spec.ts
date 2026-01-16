import { ConfirmationComponent } from './confirmation.component';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;

  beforeAll(() => {
    component = new ConfirmationComponent();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create an instance of the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with isChecked as false', () => {
    expect(component.isChecked).toBe(false);
  });

  describe('ngOnInit', () => {
    it('ngOnInit should be called', () => {
        //arrange
        const spy = jest.spyOn(component, 'ngOnInit');
        //act
        component.ngOnInit();
        //assert
        expect(spy).toHaveBeenCalled();
      });
  })

  describe('ngOnDestroy', () => {
    it('ngOnDestroy should be called', () => {
        //arrange
        const spy = jest.spyOn(component, 'ngOnDestroy');
        //act
        component.ngOnDestroy();
        //assert
        expect(spy).toHaveBeenCalled();
      });
  })
  
describe('setAll', () => {
    it('should set isChecked to true when setAll is called with true', () => {
        //act
        component.setAll(true);
        //assert
        expect(component.isChecked).toBe(true);
      });
    
      it('should set isChecked to false when setAll is called with false', () => {
        //act
        component.setAll(false);
        //assert
        expect(component.isChecked).toBe(false);
      });
})
});
