let searchText = '', currentPageIndex = 1, currentPageSize = 7;
let dataArr = [];
const btnCheckbox = $('#status');
const inputBId = $('#personId');
const defaultImg = $('#oldImg');
const previewImg = $("#preview");
const modalDialog = $('#largeModal');
const defaultImgUrl = '/assets/img/empty_img.jfif';
let inputName = $('#name');
let inputBirthDate = $('#birthDate');
let inputNationality = $('#nationality');
let inputBiography = $('#biography');
let inputImg = $('#imageUrl');
let acceptImg = true;
let imgPreview = $('#preview');
function fetchPersons(req) {
    toggleLoading(true);
    $.ajax({
        url: "/persons/search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ condition: req.condition, pageSize: req.pageSize, pageIndex: req.pageIndex }),
        success: function(response) {
            console.log('response: ', response);
            let tableBody = $('#custom-table tbody');
            tableBody.empty();
            dataArr = response.data;
            currentPageIndex = response.pageIndex;
            if(response.data.length === 0){
                tableBody.append(`<tr>
                                    <td colspan="6" class="text-center">Không có dữ liệu</td>
                                </tr>`);
            }else{
                response.data.forEach(item => {
                    tableBody.append(renderTableRow(item));
                });
            }
            renderPagination(response, '#persons-pagination', changePageIndex);
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching :", error);
            toggleLoading(false);
        }
    });
}

function changePageIndex(totalRecords, newPage, pageSize){
    fetchPersons({condition: searchText, pageSize: pageSize, pageIndex: newPage});
}

fetchPersons({condition: null, pageSize: currentPageSize, pageIndex: 1});
fetchCountries('#nationality');

function renderTableRow(item) {
    return `
        <tr id="food-tr-${item.personId}">
            <td>
                <img style="height: 50px; width: 50px" 
                    src="${(!item.imageUrl || item.imageUrl.trim().length === 0) ? defaultImgUrl : item.imageUrl }" alt class="w-px-50 h-auto rounded-circle" />
            </td>
            <td>${item.name}</td>
            <td>${formatDateWithoutHour(item.birthDate)}</td>
            <td>${item.nationality}</td>
            <td>
                <span class="badge rounded-pill ${item.status ? 'bg-label-primary' : 'bg-label-warning'} me-1">
                    ${item.status ? 'Hoạt động' : 'Dừng hoạt động'}
                </span>
            </td>
            <td>
                <div class="dropdown">
                    <button type="button" class="btn btn-warning" onclick="setContentModal('edit', editPerson, '${item.personId}')">
                        <i class="ri-pencil-line me-1"></i> Cập nhật
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function setContentModal(modalType, callbackFunc, id) {
    if (modalType === 'edit') {
        const item = dataArr.find(item => item.personId === Number(id));
        console.log('id', id, item);
        $('#exampleModalLabel3').text('Cập nhật thông tin diễn viên');
        btnCheckbox.prop('checked', item.status);
        btnCheckbox.prop('disabled', false);

        inputBId.val(item.personId);
        inputName.val(item.name);
        defaultImg.val(item.imageUrl ? item.imageUrl : defaultImgUrl);
        inputBiography.val(item.biography);
        inputNationality.val(item.nationality);
        inputBirthDate.val(item.birthDate);
        previewImg.attr("src", item.imageUrl ? item.imageUrl : defaultImgUrl).show();
    } else {
        $('#exampleModalLabel3').text('Tạo mới thông tin diễn viên');
        btnCheckbox.prop('checked', true);
        btnCheckbox.prop('disabled', true);
        inputBId.val('');
        inputName.val('');
        defaultImg.val(defaultImgUrl);
        inputBiography.val('');
        // inputNationality.val('');
        inputBirthDate.val('');
        previewImg.attr("src", defaultImg.val()).show();
    }
    modalDialog.find('[id*="error"]').text('');
    inputImg.val(null);
    $('#largeModal .btn-primary').off('click').on('click', function() {
        if (typeof callbackFunc === 'function') {
            callbackFunc();
        }
    });

    if (modalType === 'edit')
        modalDialog.modal('show');
}

function getPersonInfo(type){
    let isValid = hasValue('#name', 'Tên diễn viên') && checkLength('#name', 'Tên diễn viên', 0, 255);
    isValid = validateBirthDate('#birthDate', inputBirthDate.val()) && isValid;
    isValid = checkLength('#biography', 'Tiểu sử', 0, 1000) && isValid;
    if(isValid && acceptImg) {
        let fileInput = inputImg[0].files[0];
        let formData = new FormData();
        if(type === 'edit')
            formData.append("personId", inputBId.val());
        formData.append("name", inputName.val());
        formData.append("birthDate", inputBirthDate.val());
        formData.append("nationality", inputNationality.val());
        formData.append("biography", inputBiography.val());
        formData.append("status", type === 'add' ? true : btnCheckbox.prop("checked"));
        if (fileInput) {
            console.log('have image file', fileInput);
            formData.append("file", fileInput);
        }
        return formData;
    }
    return false;
}

function createPerson(){
    toggleLoading(true);
    const req = getPersonInfo('add');
    console.log('create', req);
    if(!req) {
        toggleLoading(false);
        return;
    }

    $.ajax({
        url: "/persons",
        type: "POST",
        processData: false,
        contentType: false,
        data: req,
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchPersons({ condition: searchText, pageSize: currentPageSize, pageIndex: 1 });
        },
        error: function(error) {
            console.error("Error creating food:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function editPerson(){
    toggleLoading(true);
    const req = getPersonInfo('edit');
    console.log('edit', req);
    if(!req) {
        toggleLoading(false);
        return;
    }
    console.log('id', inputBId.val());
    $.ajax({
        url: `/persons/${inputBId.val()}`,
        type: "PUT",
        processData: false,
        contentType: false,
        data: req,
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchPersons({condition: searchText, pageSize: currentPageSize, pageIndex: currentPageIndex});
        },
        error: function(error) {
            console.error("Error fetching food:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}
$(document).ready(function() {
    $('#button-addon2').on('click', function() {
        searchText = $('.form-control').val().trim();
        fetchPersons({condition: searchText, pageSize: currentPageSize, pageIndex: 1});
    });
    $('#btnCreate').on('click', function() {
        setContentModal('add', createPerson);
    });
    $("#imageUrl").change(function(event) {
        let file = event.target.files[0];

        if (file) {
            let fileType = file.type;
            let validImageTypes = ["image/jpeg", "image/png"];

            if (!validImageTypes.includes(fileType)) {
                $("#imageUrl-error").text("Chỉ chấp nhận định dạng ảnh JPG, PNG!");
                $("#preview").attr("src", defaultImg.val()).show();
                acceptImg = false;
                return;
            }

            let reader = new FileReader();
            reader.onload = function(e) {
                $("#preview").attr("src", e.target.result).show();
                $("#imageUrl-error").text("");
            };
            reader.readAsDataURL(file);
        } else {
            $("#preview").attr("src", defaultImg.val()).show();
        }
        acceptImg = true;
    });
});