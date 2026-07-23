document.addEventListener('DOMContentLoaded', () => {
    const filterPills = document.querySelectorAll('.filter-pill');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    function applyFilter(filter) {
        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
            } else {
                item.style.display = 'none';
            }
        });
    }

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = pill.getAttribute('data-filter');
            applyFilter(filter);
        });
    });

    // Immediately show all items on page load without waiting for user click
    const activePill = document.querySelector('.filter-pill.active');
    const initialFilter = activePill ? activePill.getAttribute('data-filter') : 'all';
    applyFilter(initialFilter);
});
