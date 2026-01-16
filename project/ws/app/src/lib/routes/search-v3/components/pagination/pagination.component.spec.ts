import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;

  beforeEach(() => {
    component = new PaginationComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call paginationInListing', () => {
      // Arrange
      const paginationInListingSpy = jest.spyOn(component as any, 'paginationInListing');
      
      // Act
      component.ngOnInit();
      
      // Assert
      expect(paginationInListingSpy).toHaveBeenCalled();
    });
  });

  describe('currentPage setter', () => {
    it('should update _currentPage and call paginationInListing when value changes', () => {
      // Arrange
      const initialPage = component.currentPage;
      const newPage = 3;
      const paginationInListingSpy = jest.spyOn(component as any, 'paginationInListing');
      
      // Act
      component.currentPage = newPage;
      
      // Assert
      expect(component.currentPage).toBe(newPage);
      expect(component.currentPage).not.toBe(initialPage);
      expect(paginationInListingSpy).toHaveBeenCalled();
    });

    it('should not call paginationInListing when value does not change', () => {
      // Arrange
      const initialPage = component.currentPage;
      const paginationInListingSpy = jest.spyOn(component as any, 'paginationInListing');
      paginationInListingSpy.mockClear(); // Reset call count
      
      // Act
      component.currentPage = initialPage;
      
      // Assert
      expect(paginationInListingSpy).not.toHaveBeenCalled();
    });
  });

  describe('paginationInListing', () => {
    it('should calculate correct pagination values', () => {
      // Arrange
      component.totalItemsCount = 100;
      component.defaultPaginationSize = 10;
      component.currentPage = 1;
      
      // Act
      component.paginationInListing();
      
      // Assert
      expect(component.showingArray.length).toBe(10);
      expect(component.showingArray[0]).toEqual([0, 10]);
      expect(component.pagination.dividedPagination).toBe(10);
      expect(component.pagination.lower).toBe(1);
      expect(component.pagination.upper).toBe(10);
    });

    it('should handle empty data correctly', () => {
      // Arrange
      component.totalItemsCount = 0;
      component.defaultPaginationSize = 10;
      component.currentPage = 1;
      
      // Act
      component.paginationInListing();
      
      // Assert
      expect(component.showingArray.length).toBe(0);
      expect(component.pagination.dividedPagination).toBe(0);
      expect(component.pagination.lower).toBe('');
      expect(component.pagination.upper).toBe('');
    });

    it('should handle partial page correctly', () => {
      // Arrange
      component.totalItemsCount = 25;
      component.defaultPaginationSize = 10;
      component.currentPage = 3;
      
      // Act
      component.paginationInListing();
      
      // Assert
      expect(component.showingArray.length).toBe(3);
      expect(component.showingArray[2]).toEqual([20, 25]);
      expect(component.pagination.dividedPagination).toBe(3);
      expect(component.pagination.lower).toBe(21);
      expect(component.pagination.upper).toBe(25);
    });
  });

  describe('paginationDup', () => {
    it('should generate correct range with dots when needed', () => {
      // Arrange
      const currentPage = 5;
      const totalPages = 20;
      
      // Act
      const result = component.paginationDup(currentPage, totalPages);
      
      // Assert
      expect(result).toContain(1);
      expect(result).toContain('...');
      expect(result).toContain(20);
      
      // Should include current page and neighbors
      expect(result).toContain(3);
      expect(result).toContain(4);
      expect(result).toContain(5);
      expect(result).toContain(6);
      expect(result).toContain(7);
    });

    it('should not include dots when range is compact', () => {
      // Arrange
      const currentPage = 3;
      const totalPages = 5; // Small enough to not need dots with delta=5
      
      // Act
      const result = component.paginationDup(currentPage, totalPages);
      
      // Assert
      expect(result.includes(1)).toBe(true);
      expect(result.includes(5)).toBe(true);
      expect(result.includes(3)).toBe(true);
      
      // Should not have dots if all numbers fit within delta
      const hasDots = result.some((item: any) => item === '...');
      expect(hasDots).toBe(false); // With totalPages=5 and delta=5, no dots needed
    });
  });

  describe('goToPage', () => {
    it('should update current page and emit page change event', () => {
      // Arrange
      const targetPage = 3;
      const pageChangeSpy = jest.spyOn(component.pageChange, 'emit');
      const paginationInListingSpy = jest.spyOn(component as any, 'paginationInListing');
      
      // Act
      component.goToPage(targetPage);
      
      // Assert
      expect(component.currentPage).toBe(targetPage);
      expect(pageChangeSpy).toHaveBeenCalledWith({
        currentPage: targetPage,
        previousPage: 0, // Initial previousPage value
        limit: component.defaultPaginationSize
      });
      expect(paginationInListingSpy).toHaveBeenCalled();
    });
  });

  describe('navigateToNextPage', () => {
    it('should increment current page and call goToPage', () => {
      // Arrange
      component.totalItemsCount = 100;
      component.defaultPaginationSize = 10;
      component.currentPage = 5;
      component.paginationInListing(); // Initialize pagination
      
      const goToPageSpy = jest.spyOn(component, 'goToPage');
      
      // Act
      component.navigateToNextPage(5);
      
      // Assert
      expect(component.currentPage).toBe(6);
      expect(component.previousPage).toBe(5);
      expect(goToPageSpy).toHaveBeenCalledWith(6);
    });

    it('should not navigate beyond last page', () => {
      // Arrange
      component.totalItemsCount = 100;
      component.defaultPaginationSize = 10;
      component.currentPage = 10; // Last page
      component.paginationInListing(); // Initialize pagination
      
      const initialPage = component.currentPage;
      const goToPageSpy = jest.spyOn(component, 'goToPage');
      
      // Mock pagination to simulate last page
      component.pagination = {
        paginationLength: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      };
      
      // Act
      component.navigateToNextPage(11); // Try to go beyond last page
      
      // Assert
      expect(component.currentPage).toBe(initialPage);
      expect(goToPageSpy).not.toHaveBeenCalled();
    });
  });

  describe('navigateToPrevPage', () => {
    it('should decrement current page and call goToPage', () => {
      // Arrange
      component.totalItemsCount = 100;
      component.defaultPaginationSize = 10;
      component.currentPage = 5;
      component.paginationInListing(); // Initialize pagination
      
      const goToPageSpy = jest.spyOn(component, 'goToPage');
      
      // Act
      component.navigateToPrevPage(5);
      
      // Assert
      expect(component.currentPage).toBe(4);
      expect(component.previousPage).toBe(5);
      expect(goToPageSpy).toHaveBeenCalledWith(4);
    });

    it('should not navigate before the first page', () => {
      // Arrange
      component.totalItemsCount = 0; // No items
      component.defaultPaginationSize = 10;
      component.currentPage = 1; // First page
      component.paginationInListing(); // Initialize pagination

      const initialPage = component.currentPage;
      const goToPageSpy = jest.spyOn(component, 'goToPage');

      // Act
      component.navigateToPrevPage(0); // Try to go before the first page

      // Assert
      expect(component.currentPage).toBe(initialPage);
      expect(goToPageSpy).not.toHaveBeenCalled();
    });
  });

  describe('onChangePageSize', () => {
    it('should update page size, reset to first page and emit event', () => {
      // Arrange
      const newPageSize = 20;
      const event = { value: newPageSize };
      component.currentPage = 3;
      component.previousPage = 2;
      
      const pageChangeSpy = jest.spyOn(component.pageChange, 'emit');
      const paginationInListingSpy = jest.spyOn(component as any, 'paginationInListing');
      
      // Act
      component.onChangePageSize(event);
      
      // Assert
      expect(component.defaultPaginationSize).toBe(newPageSize);
      expect(component.currentPage).toBe(1);
      expect(component.previousPage).toBe(0);
      expect(paginationInListingSpy).toHaveBeenCalled();
      expect(pageChangeSpy).toHaveBeenCalledWith({
        currentPage: 1,
        previousPage: 0,
        limit: newPageSize
      });
    });
  });

  describe('navigateToFirstPage', () => {
    it('should call goToPage with the first page if current page is different', () => {
      // Arrange
      component.currentPage = 5;
      const goToPageSpy = jest.spyOn(component, 'goToPage');
      
      // Act
      component.navigateToFirstPage(1);
      
      // Assert
      expect(goToPageSpy).toHaveBeenCalledWith(1);
    });

    it('should not call goToPage if already on first page', () => {
      // Arrange
      component.currentPage = 1;
      const goToPageSpy = jest.spyOn(component, 'goToPage');
      
      // Act
      component.navigateToFirstPage(1);
      
      // Assert
      expect(goToPageSpy).not.toHaveBeenCalled();
    });
  });

  describe('navigateToLastPage', () => {
    it('should call goToPage with the last page if current page is different', () => {
      // Arrange
      component.currentPage = 5;
      const lastPage = 10;
      const goToPageSpy = jest.spyOn(component, 'goToPage');
      
      // Act
      component.navigateToLastPage(lastPage);
      
      // Assert
      expect(goToPageSpy).toHaveBeenCalledWith(lastPage);
    });

    it('should not call goToPage if already on last page', () => {
      // Arrange
      component.currentPage = 10;
      const goToPageSpy = jest.spyOn(component, 'goToPage');
      
      // Act
      component.navigateToLastPage(10);
      
      // Assert
      expect(goToPageSpy).not.toHaveBeenCalled();
    });
  });
});