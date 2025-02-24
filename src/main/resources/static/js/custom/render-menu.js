function renderMenu() {
    let currentUrl = window.location.pathname;
    console.log('render menu start', currentUrl);
    const $ul = $('#custom-menu-container');
    $ul.empty(); // Clear existing items

    const fragment = document.createDocumentFragment(); // Tạo fragment để tối ưu DOM

    arr.forEach(item => {
        if (item.isHeader) {
            // Render header
            const $header = $('<li>', { class: 'menu-header mt-7' });
            const $span = $('<span>', { class: 'menu-header-text', text: item.text });
            $header.append($span);
            fragment.appendChild($header[0]);
        } else {
            // Kiểm tra nếu không có subItem
            if (!item.subItem || item.subItem.length === 0) {
                const $li = $(`
                    <li class="menu-item ${currentUrl === item.href ? 'active' : ''}">
                        <a href="${item.href}" class="menu-link">
                            <i class="menu-icon tf-icons ${item.icon || 'drag-drop'}"></i>
                            <div data-i18n="${item.text}">${item.text}</div>
                        </a>
                    </li>
                `);
                fragment.appendChild($li[0]);
                return;
            }

            // Tạo menu item có submenu
            const $li = $('<li>', { class: 'menu-item' });

            const $a = $('<a>', {
                href: item.href || 'javascript:void(0);',
                class: 'menu-link menu-toggle'
            });

            if (item.icon) {
                const $icon = $('<i>', { class: `menu-icon tf-icons ri-${item.icon}-line` });
                $a.append($icon);
            }

            const $div = $('<div>', { text: item.text });
            $a.append($div);

            if (item.badge) {
                const $badge = $('<div>', { class: `badge bg-${item.badge.color} rounded-pill ms-auto`, text: item.badge.text });
                $a.append($badge);
            }

            $li.append($a);

            // Nếu có subItem, thêm danh sách con
            const $subUl = $('<ul>', { class: 'menu-sub' });
            item.subItem.forEach(sub => {
                const $subLi = $('<li>', { class: 'menu-item' });
                const $subA = $('<a>', {
                    href: sub.href || 'javascript:void(0);',
                    class: 'menu-link'
                });

                const $subDiv = $('<div>', { text: sub.text });
                $subA.append($subDiv);
                $subLi.append($subA);
                $subUl.append($subLi);
            });

            $li.append($subUl);
            fragment.appendChild($li[0]);
        }
    });

    $ul.append(fragment); // Chỉ cập nhật DOM một lần
    console.log('render menu end');
}

renderMenu();
