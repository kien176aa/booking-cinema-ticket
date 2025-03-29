let actorData = {};
let movieJson = {};
let persons = [], roles = [], selectedPersons = [];
let keyWord = '', movieId = null;
const btnCheckbox = $('#status');
const inputBId = $('#personId');
const nameSelect = $('#nameSelect');
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
let actorTable = $('#actor-table');
let carouselContainer = $('#carousel-container');

function renderCarousel(roleName, actors) {
    const carouselId = `carousel-${roleName.replace(' ', '-').toLowerCase()}`;

    const carouselHTML = `
        <div class="divider text-start">
            <div class="divider-text">${roleName}</div>
        </div>
        <div id="${carouselId}" class="carousel carousel-dark slide carousel-fade" data-bs-ride="carousel">
            <div class="carousel-inner" id="carousel-inner-${carouselId}"></div>
            <a class="carousel-control-prev" href="#${carouselId}" role="button" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </a>
            <a class="carousel-control-next" href="#${carouselId}" role="button" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </a>
        </div>
    `;

    carouselContainer.append(carouselHTML);

    let currentIndex = 0;
    const chunkSize = 5;

    while (currentIndex < actors.length) {
        const chunk = actors.slice(currentIndex, currentIndex + chunkSize);
        renderCarouselItem(carouselId, chunk, currentIndex === 0);
        currentIndex += chunkSize;
    }
}

function renderCarouselItem(carouselId, actors, isActive) {
    const carouselItem = $('<div class="carousel-item"></div>');
    if (isActive) {
        carouselItem.addClass('active');
    }

    const row = $('<div class="d-flex justify-content-sm-evenly mt-3"></div>');

    actors.forEach(actor => {
        let roleIds = actor.roleArr.split(',').map(Number);
        let roleNames = roleIds.map(id => roles.find(role => role.roleId === id)?.name).filter(Boolean).join(',');
        const actorDiv = $('<div class="text-center" style="position:relative;"></div>');
        const img = $(`<img class="rounded-circle" src="${getImageUrl(actor.personImageUrl)}" 
                        type="button"
                        data-bs-toggle="popover"
                        data-bs-placement="top"
                        title="Tên: ${actor.personName}\nNhân vật: ${actor.characterName}\nVai trò: ${roleNames}"
                        alt="${actor.personName}" width="80" height="80">`);
        const name = $(`<div class="mt-2 text-truncate" style="max-width: 150px;" title="${actor.personName}">${actor.personName}</div>`);
        const character = $(`<div class="text-truncate" style="max-width: 150px;" title="${actor.characterName}">${actor.characterName}</div>`);
        const closeBtn = $('<span class="ri-information-line" style="position:absolute; top:0px; right:-5px; font-size:18px; ' +
            'cursor:pointer; color: red"></span>');

        actorDiv.append(img, name, character);
        row.append(actorDiv);

        // closeBtn.click(function() {
        //     deletePerson(actor.name);
        // });
    });

    carouselItem.append(row);
    $(`#carousel-inner-${carouselId}`).append(carouselItem);
}

function fetchMoviePersons() {
    toggleLoading(true);
    const url = window.location.pathname;
    const id = url.split('/').pop();
    movieId = Number(id);
    $.ajax({
        url: `/movies/search-movie-person`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            condition: {
                movieId: Number(id),
                keyWord: keyWord
            },
            pageIndex: 1,
            pageSize: 9999
        }),
        success: function(response) {
            console.log('response: ', response);
            actorData = response;
            carouselContainer.empty();
            let hasData = false;
            roles.forEach(function (item) {
               let arr = response[`${item.name}`];
               if(arr && arr.length > 0){
                   hasData = true;
                   renderCarousel(item.name, arr);
               }
            });
            if(!hasData){
                renderEmptyData('#carousel-container');
            }
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching :", error);
            toggleLoading(false);
        }
    });
}

function setContentModalMoviePerson(modalType, callbackFunc) {
    console.log('aa');
    $('#exampleModalLabel3').text('Cập nhật diễn viên');
    $('#selected-actors').empty();
    roles.forEach(function (item) {
        let arr = actorData[`${item.name}`];
        if(arr && arr.length > 0){
            arr.forEach(function (p) {
                selectedPersons.push({
                    personId: p.personPersonId,
                    name: p.personName,
                    imageUrl: p.personImageUrl,
                    roleArr: p.roleArr
                });
                renderCardToSelected(p);
            });
        }
    });
    console.log('aa', selectedPersons);
    renderPersonRow('');
    modalDialog.find('[id*="error"]').text('');
    inputImg.val(null);
    $('#largeModal .btn-primary').off('click').on('click', function() {
        if (typeof callbackFunc === 'function') {
            callbackFunc();
        }
    });

    modalDialog.modal('show');
}

function deletePerson(actor){
    console.log(actor);
}

function getCurrentTab(){
    let activeTab = localStorage.getItem("activeTab");

    if (activeTab) {
        $('.nav-link').removeClass('active');
        $('.tab-pane').removeClass('show active');

        $(`.nav-link[data-bs-target="${activeTab}"]`).addClass('active');
        $(activeTab).addClass('show active');
    }

    $('.nav-link').on('click', function () {
        let tabId = $(this).data('bs-target');
        localStorage.setItem("activeTab", tabId);
    });
}

function fetchRoles() {
    toggleLoading(true);
    $.ajax({
        url: "/roles/get-active-role",
        type: "GET",
        contentType: "application/json",
        success: function(response) {
            console.log('response: ', response);
            roles = response;
            fetchMoviePersons();
        },
        error: function(error) {
            console.error("Error fetching rooms:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}


function fetchPersons() {
    toggleLoading(true);
    $.ajax({
        url: "/persons/search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ condition: null, pageSize: 9999, pageIndex: 1 }),
        success: function(response) {
            console.log('response person: ', response);
            persons = response.data;
            actorTable.empty();
            persons.forEach((item) => {
               actorTable.append(`<tr data-person-id="${item.personId}">
                  <td><input type="checkbox" class="actor-checkbox"></td>
                  <td><img width="50" height="50"  src="${item.imageUrl ? item.imageUrl : defaultImgUrl}" alt="Diễn viên 1" class="rounded-circle"></td>
                  <td>${item.name}</td>
                  <td>${formatDateWithoutHour(item.birthDate)}</td>
                </tr>
               `);
            });
            $('.actor-checkbox').change(handleCheckboxChange);
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching :", error);
            toggleLoading(false);
        }
    });
}

function handleCheckboxChange() {
    const actorRow = $(this).closest('tr');
    const personId = actorRow.data('person-id');
    let person = persons.find(item => item.personId === Number(personId));
    const actorName = person?.name;
    const actorImage = person?.imageUrl ? person?.imageUrl : defaultImgUrl;

    if (this.checked) {
        if (!selectedPersons.some(p => p.personId === personId)) {
            selectedPersons.push({ personId, actorName, actorImage });
        }
        addCardToSelected(actorName, actorImage, personId);
    } else {
        selectedPersons = selectedPersons.filter(p => p.personId !== personId);
        removeCardFromSelected(personId);
    }
}

function addCardToSelected(actorName, actorImage, personId) {
    if ($('#selected-actors').find(`.actor-cardd[data-person-id="${personId}"]`).length === 0) {
        const actorCard = `
            <div class="col-12 actor-cardd" data-person-id="${personId}">
                <div class="p-2 shadow-sm">
                    <div class="d-flex align-items-center">
                        <img src="${actorImage}" class="rounded-circle me-3" alt="${actorName}" width="60" height="60">
                        <div class="flex-grow-1">
                            <h6 class="fw-bold mb-1 text-truncate" title="${actorName}">${actorName}</h6>
                            <input type="text" id="characterName-${personId}" class="form-control form-control-sm mb-2"
                             placeholder="Nhập tên nhân vật">
                        </div>
                    </div>
                    <div class="mt-2" id="selectRole-${personId}">
                    </div>
                </div>
            </div>
        `;
        $('#selected-actors').append(actorCard);
        createDropdown(`selectRole-${personId}`, 'Chọn vai trò', roles.map(item => ({
            value: item.roleId,
            label: item.name
        })));
    }
}

function renderCardToSelected(p){
    const actorCard = `
            <div class="col-12 actor-cardd" data-person-id="${p.personPersonId}">
                <div class="p-2 shadow-sm">
                    <div class="d-flex align-items-center">
                        <img src="${getImageUrl(p.personImageUrl)}" class="rounded-circle me-3" alt="${p.personName}" width="60" height="60">
                        <div class="flex-grow-1">
                            <h6 class="fw-bold mb-1 text-truncate" title="${p.personName}">${p.personName}</h6>
                            <input type="text" id="characterName-${p.personPersonId}" class="form-control form-control-sm mb-2"
                             value="${p.characterName}"
                             placeholder="Nhập tên nhân vật">
                        </div>
                    </div>
                    <div class="mt-2" id="selectRole-${p.personPersonId}">
                    </div>
                </div>
            </div>
        `;
    $('#selected-actors').append(actorCard);
    createDropdown(`selectRole-${p.personPersonId}`, 'Chọn vai trò', roles.map(item => ({
        value: item.roleId,
        label: item.name
    })));
    updateSelectedOptions(`selectRole-${p.personPersonId}`, 'Chọn vai trò',
        p.roleArr.split(',').map((r) => ({
            value: r,
            label: roles.find(role => role.roleId === Number(r))?.name
        })),
        roles.map((item) => ({
            value: item.roleId,
            label: item.name
        }))
    );
}

function removeCardFromSelected(personId) {
    $('#selected-actors').find(`.actor-cardd[data-person-id="${personId}"]`).remove();
}

function getPersonMovieInfo(){
    let arr = [], isValid = true, mess = '', count = 1;
    if(!selectedPersons || selectedPersons.length === 0){
        showErrorToast('Vui lòng chọn diễn viên cho bộ phim');
        return false;
    }
    selectedPersons.forEach(function (item) {
        let characterName = $(`#characterName-${item.personId}`).val();
        let roleArr = getSelectedData(`selectRole-${item.personId}`);
        if(characterName.length === 0 || characterName.length > 255){
            isValid = false;
            mess += `<p>${count++}. Số ký tự tên nhân vật của diễn viên ${item.actorName} phải nằm trong [1, 255]</p>`;
        }
        if(!roleArr || roleArr.length === 0){
            isValid = false;
            mess += `<p>${count++}. Vui lòng chọn vai trò cho diễn viên ${item.actorName}</p>`;
        }
        console.log('a ', item, characterName, roleArr);
        arr.push({
            personPersonId: item.personId,
            roleRoleId: roleArr[0],
            roleArr: roleArr.toString(),
            characterName: characterName
        });
    });
    if(!isValid){
        showErrorToast(mess);
        return false;
    }
    return {
        movieId: movieId,
        moviePersonDTOs: arr
    };
}

function updateMoviePerson(){
    toggleLoading(true);
    let req = getPersonMovieInfo();
    if(!req) {
        toggleLoading(false);
        return false;
    }
    $.ajax({
        url: "/movies/update-person-movie",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(req),
        success: function(response) {
            console.log('response: ', response);
            modalDialog.modal('hide');
            showSuccessToast('Dữ liệu đã được lưu thành công!');
            fetchMoviePersons();
        },
        error: function(error) {
            console.error("Error fetching movie person:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

function renderPersonRow(searchText){
    actorTable.empty();
    persons.filter(item => item.name.toLowerCase().includes(searchText)).forEach((item) => {
        let isSelected = selectedPersons.findIndex(p => Number(p.personId) === Number(item.personId)) !== -1;
        let row = $(`
                <tr data-person-id="${item.personId}">
                    <td><input type="checkbox" class="actor-checkbox"></td>
                    <td><img width="50" height="50" src="${item.imageUrl ? item.imageUrl : defaultImgUrl}" alt="Diễn viên 1" class="rounded-circle"></td>
                    <td>${item.name}</td>
                    <td>${formatDateWithoutHour(item.birthDate)}</td>
                </tr>
            `);
        if (isSelected) {
            row.find('.actor-checkbox').prop('checked', true);
        }
        actorTable.append(row);
    });

    $('.actor-checkbox').change(handleCheckboxChange);
}

$(document).ready(function () {
    // getCurrentTab();
    fetchPersons();
    fetchRoles();
    $('#button-addon2').on('click', function() {
        keyWord = $('.form-control').val().trim();
        fetchMoviePersons();
    });
    $('#btnUpdateMoviePerson').on('click', function() {
        setContentModalMoviePerson('add', updateMoviePerson);
    });
    $('#nameSelect').on('change', function () {
        let selectedValue = $(this).val();
        if (selectedValue !== "-1") {
            $('#nameInput').prop('disabled', true).val('');
        } else {
            $('#nameInput').prop('disabled', false);
        }
    });

    $('#inputSearchPerson').on('change', function () {
        let searchText = $(this).val();
        searchText = searchText.trim().toLowerCase();
        renderPersonRow(searchText);
    });

});
