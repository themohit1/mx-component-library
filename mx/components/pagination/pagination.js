class Pagination {
  constructor(element) {
    this.container = element;
    this.currentPage = parseInt(this.container.dataset.currentPage) || 1;
    this.totalPages = parseInt(this.container.dataset.totalPages) || 1;
    this.pageSize = 10; // Fixed page size since we're removing the selector
    this.siblingCount = parseInt(this.container.dataset.siblingCount) || 1;
    this.onPageChange = this.container.dataset.onPageChange;
    
    // Initialize
    this.init();
  }

  init() {
    // Create pagination elements
    this.createPagination();
    
    // Add event listeners
    this.addEventListeners();
    
    // Update pagination state
    this.updatePagination();
  }

  createPagination() {
    // Clear existing content
    this.container.innerHTML = '';
    
    // Create pagination content container
    this.content = document.createElement('div');
    this.content.className = 'pagination-content';
    
    // Previous button
    this.prevButton = this.createPageItem('previous', 'Previous', 'pagination-prev');
    this.prevButton.innerHTML = `
      <svg class="pagination-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m15 18-6-6 6-6"/>
      </svg>
    `;
    this.content.appendChild(this.prevButton);
    
    // Page items
    this.pagesContainer = document.createElement('div');
    this.pagesContainer.className = 'pagination-pages';
    this.content.appendChild(this.pagesContainer);
    
    // Next button
    this.nextButton = this.createPageItem('next', 'Next', 'pagination-next');
    this.nextButton.innerHTML = `
      <svg class="pagination-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    `;
    this.content.appendChild(this.nextButton);
    
    // Add content to container
    this.container.appendChild(this.content);
    
  }

  createPageItem(page, text, className = '') {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `pagination-item ${className}`.trim();
    item.dataset.page = page;
    if (text) {
      item.textContent = text;
    }
    return item;
  }


  addEventListeners() {
    // Previous button
    this.prevButton.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.setPage(this.currentPage - 1);
      }
    });
    
    // Next button
    this.nextButton.addEventListener('click', () => {
      if (this.currentPage < this.totalPages) {
        this.setPage(this.currentPage + 1);
      }
    });
    
    // Page items (delegated)
    this.content.addEventListener('click', (e) => {
      const pageItem = e.target.closest('.pagination-item');
      if (!pageItem || pageItem === this.prevButton || pageItem === this.nextButton) return;
      
      const page = pageItem.dataset.page;
      if (page === 'ellipsis') return;
      
      this.setPage(parseInt(page));
    });
  }

  setPage(page) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    
    this.currentPage = page;
    this.updatePagination();
    this.triggerPageChange();
    
    // Scroll to top of container
    this.container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  updatePagination() {
    // Update previous/next buttons
    this.prevButton.disabled = this.currentPage === 1;
    this.prevButton.classList.toggle('pagination-item-disabled', this.currentPage === 1);
    
    this.nextButton.disabled = this.currentPage === this.totalPages;
    this.nextButton.classList.toggle('pagination-item-disabled', this.currentPage === this.totalPages);
    
    // Clear existing page items
    this.pagesContainer.innerHTML = '';
    
    // Generate page items
    const pages = this.generatePageNumbers();
    
    // Add page items to container
    pages.forEach((page, index) => {
      if (page === '...') {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = page;
        ellipsis.dataset.page = 'ellipsis';
        this.pagesContainer.appendChild(ellipsis);
      } else {
        const pageItem = this.createPageItem(page, page.toString());
        if (page === this.currentPage) {
          pageItem.classList.add('pagination-item-active');
        }
        this.pagesContainer.appendChild(pageItem);
      }
    });
    
  }

  generatePageNumbers() {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const siblingCount = this.siblingCount;

    // Total page numbers to show.
    // It's 1 (current) + siblingCount * 2 + 1 (first) + 1 (last) + 2 (ellipses)
    const totalPageSlots = siblingCount * 2 + 5;

    // Case 1: If total pages is less than the number of pages we want to show.
    // We just show all the pages.
    if (totalPages <= totalPageSlots) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Determine left and right sibling indices and whether to show dots.
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: No left dots to show, but right dots are needed.
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', lastPageIndex];
    }

    // Case 3: No right dots to show, but left dots are needed.
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
      return [firstPageIndex, '...', ...rightRange];
    }

    // Case 4: Both left and right dots are needed.
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }
    
    // Fallback case, should not be reached with the above logic.
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  triggerPageChange() {
    // Dispatch custom event
    const event = new CustomEvent('pageChange', {
      detail: {
        page: this.currentPage,
        pageSize: this.pageSize,
        totalPages: this.totalPages
      }
    });
    this.container.dispatchEvent(event);
    
    // Call callback if provided
    if (this.onPageChange && typeof window[this.onPageChange] === 'function') {
      window[this.onPageChange](this.currentPage, this.pageSize, this.totalPages);
    }
  }

  // Public methods
  setTotalPages(totalPages) {
    this.totalPages = Math.max(1, parseInt(totalPages) || 1);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.updatePagination();
  }

  setCurrentPage(page) {
    this.setPage(Math.max(1, Math.min(page, this.totalPages)));
  }


}

// Auto-initialize pagination
document.addEventListener('DOMContentLoaded', () => {
  const paginationElements = document.querySelectorAll('[data-pagination]');
  paginationElements.forEach(element => {
    new Pagination(element);
  });
});
