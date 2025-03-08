let genreDatas = [];
const commonDefaultImgUrl = '/assets/img/empty_img.jfif';

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("input").forEach(input => {
        input.setAttribute("autocomplete", "off");
    });
});

function toggleLoading(isLoading) {
    if (isLoading) {
        if ($('.loading').length === 0) {
            $('body').append('<div class="loading">Loading&#8230;</div>');
        }
    } else {
        $('.loading').remove();
    }
}

function getImageUrl(url){
    if(!url || url.length === 0)
        return commonDefaultImgUrl;
    return url;
}

function hasValue(id, fieldName) {
    let value = $(id).val().trim();
    let errorSpan = $(id + '-error');

    if (!value || value.length === 0) {
        errorSpan.text(fieldName + ' không được để trống').css('color', 'red');
        return false;
    } else {
        errorSpan.text('');
        return true;
    }
}

function hasValue2(id, value, fieldName) {
    let errorSpan = $(id + '-error');

    if (!value || value.length === 0) {
        errorSpan.text(fieldName + ' không được để trống').css('color', 'red');
        return false;
    } else {
        errorSpan.text('');
        return true;
    }
}

function checkLength(id, fieldName, min, max) {
    let value = $(id).val().trim();
    let errorSpan = $(id + '-error');
    if (!value) {
        errorSpan.text('');
        return true;
    }
    if (value.length < min) {
        errorSpan.text(fieldName + ' phải có ít nhất ' + min + ' ký tự').css('color', 'red');
        return false;
    }
    if (value.length > max) {
        errorSpan.text(fieldName + ' không được vượt quá ' + max + ' ký tự').css('color', 'red');
        return false;
    }
    errorSpan.text('');
    return true;
}

function checkLength2(id, value, fieldName, min, max) {
    let errorSpan = $(id + '-error');
    if (!value) {
        errorSpan.text('');
        return true;
    }
    if (value.length < min) {
        errorSpan.text(fieldName + ' phải có ít nhất ' + min + ' ký tự').css('color', 'red');
        return false;
    }
    if (value.length > max) {
        errorSpan.text(fieldName + ' không được vượt quá ' + max + ' ký tự').css('color', 'red');
        return false;
    }
    errorSpan.text('');
    return true;
}

function isPositiveNumber(id, fieldName){
    let value = $(id).val().trim();
    value = Number(value);
    let errorSpan = $(id + '-error');

    if (!value || value <= 0) {
        errorSpan.text(fieldName + ' phải là số dương').css('color', 'red');
        return false;
    } else {
        errorSpan.text('');
        return true;
    }
}

function blockColor(id){
    let colorInput = $(id);
    let errorSpan = $(id + '-error');
    let selectedColor = colorInput.val();

    let rgb = hexToRgb(selectedColor);
    if (!rgb) return;

    let luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;

    if (luminance < 40 || luminance > 220) {
        errorSpan.text("Không được chọn màu quá đen hoặc quá trắng!").css('color', 'red');
        return false;
    } else {
        errorSpan.text("");
        return true;
    }
}

function hexToRgb(hex) {
    let match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return match ? {
        r: parseInt(match[1], 16),
        g: parseInt(match[2], 16),
        b: parseInt(match[3], 16)
    } : null;
}

function formatDate(dateString) {
    if(!dateString){
        return '';
    }
    let date = new Date(dateString);

    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
}

function formatDateWithoutHour(dateString) {
    if(!dateString){
        return '';
    }
    let date = new Date(dateString);

    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function checkNeedOneOfTwo(id1, id2, fieldName1, fieldName2) {
    let value1 = $(id1).val().trim();
    let value2 = $(id2).val().trim();
    let errorSpan1 = $(id1 + '-error');
    let errorSpan2 = $(id2 + '-error');

    if (!value1 && !value2) {
        errorSpan1.text(fieldName1 + ' hoặc ' + fieldName2 + ' phải được nhập').css('color', 'red');
        errorSpan2.text(fieldName1 + ' hoặc ' + fieldName2 + ' phải được nhập').css('color', 'red');
        return false;
    }

    if (value1 && value2) {
        errorSpan1.text('Chỉ được nhập một trong ' + fieldName1 + ' hoặc ' + fieldName2).css('color', 'red');
        errorSpan2.text('Chỉ được nhập một trong ' + fieldName1 + ' hoặc ' + fieldName2).css('color', 'red');
        return false;
    }

    if ((value1 && parseFloat(value1) <= 0) || (value2 && parseFloat(value2) <= 0)) {
        if (value1) {
            errorSpan1.text(fieldName1 + ' phải lớn hơn 0').css('color', 'red');
        }
        if (value2) {
            errorSpan2.text(fieldName2 + ' phải lớn hơn 0').css('color', 'red');
        }
        return false;
    }

    errorSpan1.text('');
    errorSpan2.text('');
    return true;
}
function checkValidStartAndEndDate(startId, endId, startFieldName, endFieldName) {
    let startDateValue = $(startId).val().trim();
    let endDateValue = $(endId).val().trim();
    let startDate = new Date(startDateValue);
    let endDate = new Date(endDateValue);
    let startErrorSpan = $(startId + '-error');
    let endErrorSpan = $(endId + '-error');

    if (!startDateValue || !endDateValue) {
        startErrorSpan.text(startFieldName + ' và ' + endFieldName + ' không được để trống').css('color', 'red');
        endErrorSpan.text(startFieldName + ' và ' + endFieldName + ' không được để trống').css('color', 'red');
        return false;
    }
    if (endDate <= startDate) {
        startErrorSpan.text('');
        endErrorSpan.text(endFieldName + ' phải lớn hơn ' + startFieldName).css('color', 'red');
        return false;
    }
    startErrorSpan.text('');
    endErrorSpan.text('');
    return true;
}

function fetchCountries(id){
    $.ajax({
        url: 'https://restcountries.com/v3.1/all',
        method: 'GET',
        success: function(data) {
            console.log('countries: ', data);
            let countrySelect = $(id);
            countrySelect.empty();

            data.sort(function(a, b) {
                let nameA = a.name.common.toLowerCase();
                let nameB = b.name.common.toLowerCase();
                return nameA.localeCompare(nameB);
            });

            data.forEach(function(country) {
                let countryName = country.name.common;
                let countryOption = $('<option>', {
                    value: countryName,
                    text: countryName
                });
                countrySelect.append(countryOption);
            });
            countrySelect.find('option:first').prop('selected', true);
        },
        error: function(error) {
            console.error('Lỗi khi lấy dữ liệu quốc gia:', error);
        }
    });
}

function fetchMovieGenres(id) {
    const apiKey = "f507f686b238810028d386968a4b9b0b";
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=vi`;

    $.ajax({
        url: url,
        method: 'GET',
        success: function(response) {
            console.log('Genres:', response.genres);
            let genreSelect = $(id);
            genreSelect.empty();

            response.genres.forEach(function(genre) {
                let genreOption = $('<option>', {
                    value: genre.name,
                    text: genre.name
                });
                genreSelect.append(genreOption);
            });
            genreDatas = response.genres.map(item => ({
                value: item.name,
                label: item.name
            }));
            createDropdown(id.substring(1), 'Chọn thể loại', genreDatas);
        },
        error: function(error) {
            console.error('Error fetching genres:', error);
        }
    });
}

function fetchLanguages(id) {
    $.ajax({
        url: 'https://restcountries.com/v3.1/all',
        method: 'GET',
        success: function(data) {
            console.log('All countries and languages:', data);
            let languageSelect = $(id);
            languageSelect.empty();

            let languages = new Set();
            data.forEach(function(country) {
                if (country.languages) {
                    Object.values(country.languages).forEach(function(language) {
                        languages.add(language);
                    });
                }
            });

            const sortedLanguages = Array.from(languages).sort();

            sortedLanguages.forEach(function(language) {
                let languageOption = $('<option>', {
                    value: language,
                    text: language
                });
                languageSelect.append(languageOption);
            });
        },
        error: function(error) {
            console.error('Lỗi khi lấy danh sách ngôn ngữ:', error);
        }
    });
}

function createDropdown(id, label, options) {
    let dropdownHTML = `
        <div class="dropdown" style="width: 100%; height: 100%;">
            <button class="btn btn-outline-gray dropdown-toggle" type="button"
                    id="${id}Button" data-bs-toggle="dropdown" aria-expanded="false"
                    data-bs-auto-close="outside"
                    style="width: 100%; height: 100%; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${label}
            </button>
            <ul class="dropdown-menu" aria-labelledby="${id}Button"
                style="width: 100%; max-height: 300px; overflow-y: auto;">
                <li class="p-2" style="position: sticky; top: 0; background-color: white; z-index: 1;">
                    <input type="text" class="form-control searchBox" placeholder="Tìm kiếm...">
                </li>
                <li>
                    <div class="form-check" style="padding-left: 40px;">
                        <input class="form-check-input selectAll" type="checkbox">
                        <label class="form-check-label"><strong>Chọn tất cả</strong></label>
                    </div>
                </li>
                <div class="optionsList">
                </div>
            </ul>
        </div>
    `;

    $(`#${id}`).html(dropdownHTML);
    renderOptions(id, options);
    addEventListeners(id, label, options);
}

function renderOptions(id, options) {
    let optionsList = $(`#${id} .optionsList`);
    optionsList.empty();
    options.forEach((option, index) => {
        optionsList.append(`
            <li>
                <div class="form-check" style="padding-left: 40px;">
                    <input class="form-check-input option-checkbox" type="checkbox" id="${id}Option${index}" value="${option.value}">
                    <label class="form-check-label" for="${id}Option${index}">${option.label}</label>
                </div>
            </li>
        `);
    });
}

function updateSelectedText(id, label, options) {
    let selected = $(`#${id} .option-checkbox:checked`).map(function () {
        return $(this).val();
    }).get();

    let selectedLabels = options.filter(option => selected.includes(option.value.toString())).map(option => option.label);
    $(`#${id}Button`).text(selectedLabels.length ? selectedLabels.join(", ") : label);
    $(`#${id} .selectAll`).prop("checked", selected.length === options.length);
}

function addEventListeners(id, label, options) {
    let multipleSelect = $(`#${id}`);
    multipleSelect.on("change", ".selectAll", function () {
        $(`#${id} .option-checkbox`).prop("checked", $(this).prop("checked"));
        updateSelectedText(id, label, options);
    });

    multipleSelect.on("change", ".option-checkbox", function () {
        updateSelectedText(id, label, options);
    });

    multipleSelect.on("keyup", ".searchBox", function () {
        let value = $(this).val().toLowerCase();
        $(`#${id} .option-checkbox`).each(function () {
            let label = $(this).next("label").text().toLowerCase();
            $(this).closest("li").toggle(label.includes(value));
        });
    });
}

function getSelectedData(id) {
    return $(`#${id} .option-checkbox:checked`).map(function () {
        return $(this).val();
    }).get();
}

function updateSelectedOptions(id, label, selectedOptions, arr) {
    if(!selectedOptions || selectedOptions.length === 0){
        $(`#${id} .option-checkbox`).each(function() {
            $(this).prop("checked", false);
        });
        updateSelectedText(id, label, arr);
    } else{
        $(`#${id} .option-checkbox`).each(function() {
            let idx = selectedOptions.findIndex(o => o.value.toString() === $(this).val());
            $(this).prop("checked", idx !== -1);
        });
        updateSelectedText(id, selectedOptions.map(option => option.label).join(", "), arr);
    }
}

function validateBirthDate(id, value) {
    const errorSpan = $(id + "-error");
    const birthDatePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!value || !birthDatePattern.test(value)) {
        errorSpan.text("Ngày sinh không hợp lệ. Vui lòng nhập đúng định dạng (yyyy-mm-dd).");
        return false;
    }

    const birthDate = new Date(value);
    const currentDate = new Date();
    if (birthDate > currentDate) {
        errorSpan.text("Ngày sinh không thể trong tương lai.");
        return false;
    }

    errorSpan.text("");
    return true;
}

function createChangePasswordModal() {
    let modalHtml = `
            <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Thay đổi mật khẩu</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="form-floating mb-3">
                                <input type="password" id="oldPassword" value="****" class="form-control" placeholder="Nhập mật khẩu cũ" />
                                <label for="oldPassword">Mật khẩu cũ</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="password" id="newPassword" class="form-control" placeholder="Nhập mật khẩu mới" />
                                <label for="newPassword">Mật khẩu mới</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="password" id="confirmPassword" class="form-control" placeholder="Nhập mật khẩu xác nhận" />
                                <label for="confirmPassword">Mật khẩu xác nhận</label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="savePassword">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    let oldPassword = $('#oldPassword');
    if (!$('#changePasswordModal').length) {
        oldPassword.val('******');
        $('body').append(modalHtml);
    }
    oldPassword.val('');
    $('#newPassword').val('');
    $('#confirmPassword').val('');
    $('#changePasswordModal').modal('show');
}
$('#btnChangePassword').on('click', function () {
    createChangePasswordModal();
    $(document).off('click', '#savePassword').on('click', '#savePassword', function () {
        let oldPassword = $('#oldPassword').val();
        let newPassword = $('#newPassword').val();
        let confirmPassword = $('#confirmPassword').val();
        toggleLoading(true);
        $.ajax({
            url: '/accounts/change-password',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            }),
            success: function (response) {
                showSuccessToast("Thay đổi mật khẩu thành công");
                $('#changePasswordModal').modal('hide');
                toggleLoading(false);
            },
            error: function (xhr) {
                showErrorToast(xhr.responseText || "Có lỗi xảy ra, vui lòng thử lại!");
                toggleLoading(false);
            }
        });
    });
});
