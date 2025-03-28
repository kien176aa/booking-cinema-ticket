$(document).ready(function () {
    const menuItems = [
        { url: '/movie-list', label: 'Danh sách phim' },
        { url: '/showtime-list', label: 'Lịch chiếu phim' },
        { url: '/my-booking', label: 'Vé đã đặt' },
        { url: '/auth/logout', label: 'Đăng xuất' },
    ];

    function renderNavbar(menuItems) {
        let menuHtml = '';
        $.each(menuItems, function (index, item) {
            menuHtml += `<li class="nav-item">
                            <a class="nav-link" href="${item.url}">${item.label}</a>
                         </li>`;
        });

        $("#navbarNav .navbar-nav").html(menuHtml);
    }

    renderNavbar(menuItems);
});
