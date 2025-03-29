$(document).ready(function () {
    let role = $("#userRole").val();
    let menuItems = [
        { url: '/movie-list', label: 'Danh sách phim' },
        { url: '/showtime-list', label: 'Lịch chiếu phim' },
        { url: '/my-booking', label: 'Vé đã đặt' },
        { url: '/auth/logout', label: 'Đăng xuất' },
    ];

    if('ADMIN' === role){
        menuItems.unshift({url: '/', label: 'Quản lý hệ thống'});
    }

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
