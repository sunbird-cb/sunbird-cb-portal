
import { TocComponent } from './toc.component';

describe('TocComponent', () => {
    let component: TocComponent;

    

    beforeAll(() => {
        component = new TocComponent(
            
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
});