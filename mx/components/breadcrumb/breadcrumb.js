// Breadcrumb dropdown functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get all breadcrumb ellipsis buttons
    const ellipsisButtons = document.querySelectorAll('.breadcrumb-ellipsis');
    
    // Add click event listener to each ellipsis button
    ellipsisButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            
            // Find the closest parent breadcrumb item
            const breadcrumbItem = button.closest('.breadcrumb-item');
            if (!breadcrumbItem) return;
            
            // Find the dropdown within this breadcrumb item
            const dropdown = breadcrumbItem.querySelector('.breadcrumb-dropdown');
            if (!dropdown) return;
            
            // Toggle the 'open' class on the dropdown
            dropdown.classList.toggle('open');
            
            // Close other open dropdowns
            document.querySelectorAll('.breadcrumb-dropdown.open').forEach(openDropdown => {
                if (openDropdown !== dropdown) {
                    openDropdown.classList.remove('open');
                }
            });
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.breadcrumb-item')) {
            document.querySelectorAll('.breadcrumb-dropdown.open').forEach(dropdown => {
                dropdown.classList.remove('open');
            });
        }
    });
    
    // Close dropdown when clicking on a dropdown item
    document.querySelectorAll('.breadcrumb-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const dropdown = item.closest('.breadcrumb-dropdown');
            if (dropdown) {
                dropdown.classList.remove('open');
            }
        });
    });
});
