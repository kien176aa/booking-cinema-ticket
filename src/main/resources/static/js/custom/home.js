let cachedMovies = [];
let branchesCache = [];
let branchId = -1;
let showtimesRes = [];
let seatTypes = [];
let selectShowtime = {};

$(document).ready(function () {
    fetchMovie();
    fetchBranches('');
    initDateButtons();
});

// ========== MOVIE ==========
function fetchMovie() {
    toggleLoading(true);
    $.ajax({
        url: '/home/get-top-movie',
        method: 'GET',
        success: function (data) {
            cachedMovies = data || [];
            renderMovieCarousel(cachedMovies);
        },
        complete: function () {
            toggleLoading(false);
        }
    });
}

function renderMovieCarousel(data) {
    if (!data || data.length === 0) return;

    let chunkSize = 5;
    let html = '';

    for (let i = 0; i < data.length; i += chunkSize) {
        let chunk = data.slice(i, i + chunkSize);
        html += `
            <div class="carousel-item ${i === 0 ? 'active' : ''}">
                <div class="row justify-content-center">
        `;
        chunk.forEach((movie, index) => {
            html += `
                <div class="col-md-2 movie-card position-relative" data-movie-id="${movie.movieId}">
                    <div class="movie-rank">${i + index + 1}</div>
                    <div class="image-wrapper position-relative">
                        <img class="img-fluid movie-img" src="${movie.posterUrl || commonDefaultImgUrl}" alt="${movie.title}">
                        <button data-movie-id="${movie.movieId}" class="play-icon" 
                            data-bs-toggle="modal" data-bs-target="#trailerModal" data-video="${movie.trailerUrl || ''}">
                            <i class="ri-play-circle-line"></i>
                        </button>
                    </div>
                    <h5 class="mt-2 text-white" title="${movie.title}">${truncateText(movie.title, 20)}</h5>
                    <p class="text-white" title="${movie.genre}">${truncateText(movie.genre, 15)}</p>
                    <small class="text-warning">⭐ ${movie.rating != null ? movie.rating : 0}</small>
                </div>
            `;
        });
        html += `</div></div>`;
    }

    $('#movieCarousel .carousel-inner').html(html);
}

// ========== BRANCHES ==========
function fetchBranches(query) {
    toggleLoading(true);
    $.get(`/branches/search?name=${query}`, function (branches) {
        branchesCache = branches;
        renderBranchList(branches);
        if (branches.length > 0) {
            branchId = branches[0]?.branchId;
            selectBranch();
            fetchSeatTypes();
        }
    }).always(() => toggleLoading(false));
}

function renderBranchList(branches) {
    let html = '';
    branches.forEach(branch => {
        html += `
        <li class="list-group-item d-flex justify-content-between align-items-center" data-branch-id="${branch.branchId}" style="cursor:pointer;">
            ${branch.name}
            <i class="bi bi-chevron-right"></i>
        </li>`;
    });
    $('#cinema-list').html(html);
}

// ========== SHOWTIMES ==========

function getShowtimeById(id) {
    toggleLoading(true);
    $.get(`/showtimes/${id}`, function (response) {
        selectShowtime = response;
        showSeatModal();
    }).always(() => toggleLoading(false));
}

function loadShowtimes(date) {
    toggleLoading(true);
    $.get('/home/get-showtimes-by-date', { date: date, branchId: branchId }, function (showtimes) {
        let html = '';

        if (showtimes.length === 0) {
            html = `
            <div class="text-center text-muted py-5">
                <i class="ri-archive-2-line" style="font-size: 2rem;"></i>
                <p class="mt-2 mb-0">Không có dữ liệu</p>
            </div>`;
            showtimesRes = [];
        } else {
            let grouped = {};
            showtimesRes = showtimes;
            showtimes.forEach(s => {
                if (!grouped[s.movieTitle]) {
                    grouped[s.movieTitle] = {
                        movieTitle: s.movieTitle,
                        branchName: s.branchName,
                        roomName: s.roomName,
                        posterUrl: s.moviePosterUrl,
                        showtimes: []
                    };
                }
                grouped[s.movieTitle].showtimes.push(s);
            });

            Object.values(grouped).forEach(group => {
                html += `
    <div class="d-flex mb-4 showtime-block">
        <img src="${group.posterUrl || commonDefaultImgUrl}" 
            class="me-3 rounded" width="100" height="160" alt="Poster">
        <div>
            <h5>${group.movieTitle}</h5>`;

                // Nhóm các showtimes theo roomName
                const showtimesByRoom = {};
                group.showtimes.forEach(s => {
                    if (!showtimesByRoom[s.roomName]) {
                        showtimesByRoom[s.roomName] = [];
                    }
                    showtimesByRoom[s.roomName].push(s);
                });

                html += `<div class="d-flex flex-wrap gap-3">`;

                // Duyệt qua từng roomName và render các showtimes tương ứng
                Object.entries(showtimesByRoom).forEach(([roomName, showtimes]) => {
                    html += `
        <div>
            <span class="fw-bold px-2 py-1 mb-4">${roomName}</span>
            <div class="d-flex flex-wrap gap-2 mt-2">`;

                    showtimes.forEach(s => {
                        html += `<button data-showtime-id="${s.showtimeId}"
                        class="btn btn-outline-primary btn-sm book-seat">
                ${formatTime(s.startTime)} ~ ${formatTime(s.endTime)}
            </button>`;
                    });

                    html += `</div></div>`;
                });

                html += `</div></div></div>`;
            });

        }

        $('#showtime-container').html(html);
        $('.book-seat').off('click').on('click', function () {
            let id = $(this).data('showtime-id');
            getShowtimeById(id);
        })
    }).always(() => toggleLoading(false));
}

function fetchSeatTypes() {
    toggleLoading(true);
    $.ajax({
        url: "/seat-types/search",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ condition: {
                branchId: branchId,
                status: true
            }, pageSize: 9999, pageIndex: 1 }),
        success: function(response) {
            console.log('response: ', response);
            seatTypes = response.data;
            toggleLoading(false);
        },
        error: function(error) {
            console.error("Error fetching rooms:", error);
            showErrorToast(error.responseText);
            toggleLoading(false);
        }
    });
}

// ========== EVENTS ==========

// Play trailer
$(document).on('click', '.play-icon', function () {
    const movieId = $(this).data('movie-id');
    const movie = cachedMovies.find(m => m.movieId == movieId);
    if (movie) {
        $('#trailerModal iframe').attr('src', movie.trailerUrl || "https://www.youtube.com/embed/2LqzF5WauAw");
        $('#trailerModal img').attr('src', movie.posterUrl || commonDefaultImgUrl);
        $('#trailerModal h5').text(movie.title);
        $('#trailerModal small')
            .text(truncateText(movie.genre, 100))
            .attr('title', movie.genre)
            .tooltip({ placement: 'top' });
        $('#trailerModal .small').text(movie.description || 'Không có mô tả cho phim này.');
    }
});

// Search cinema name
$('#cinema-search').on('input', function () {
    const query = $(this).val().trim().toLowerCase();
    const filteredBranches = branchesCache.filter(b => b.name.toLowerCase().includes(query));
    renderBranchList(filteredBranches);
});

// Click branch item
$(document).on('click', '#cinema-list li[data-branch-id]', function () {
    branchId = $(this).data('branch-id');
    selectBranch();
});

// ========== UTILS ==========
function selectBranch() {
    $('#cinema-list li[data-branch-id]').removeClass('active');
    $(`#cinema-list li[data-branch-id="${branchId}"]`).addClass('active');
    const activeDate = $('.nav-link[data-date].active').data('date') || new Date().toISOString().split('T')[0];
    loadShowtimes(activeDate);
    fetchSeatTypes();
}

function truncateText(text, maxLength) {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

function formatTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ========== DATES ==========
function initDateButtons() {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const today = new Date();
    const $container = $('#date-container');
    $container.empty();

    // Inject CSS styles nếu chưa có
    if (!$('#date-button-styles').length) {
        const styles = `
            <style id="date-button-styles">
                #date-container {
                    display: flex;
                    gap: 8px;
                    margin: 20px 0;
                }
                #date-container .nav-link {
                    display: inline-block;
                    width: 80px;
                    text-align: center;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    text-decoration: none;
                    color: #000;
                    font-weight: bold;
                    background-color: #f9f9f9;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                #date-container .nav-link small {
                    display: block;
                    margin-top: 4px;
                    font-weight: normal;
                    color: #888;
                }
                #date-container .nav-link.active {
                    background-color: #d81b60;
                    color: #fff;
                    border-color: #d81b60;
                }
                #date-container .nav-link.active small {
                    color: #fff;
                }
                #date-container .nav-link:hover {
                    background-color: #e0e0e0;
                }
            </style>
        `;
        $('head').append(styles);
    }

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        const day = date.getDate();
        const dayOfWeek = i === 0 ? 'Hôm nay' : days[date.getDay()];
        const activeClass = i === 0 ? 'active' : '';

        $container.append(`
            <a class="nav-link ${activeClass}" data-date="${dateString}">
                ${day}<br><small>${dayOfWeek}</small>
            </a>
        `);
    }

    $('#date-container .nav-link').on('click', function (e) {
        e.preventDefault();
        $('#date-container .nav-link').removeClass('active');
        $(this).addClass('active');

        const selectedDate = $(this).data('date');
        loadShowtimes(selectedDate);
    });
}

// Hàm xử lý rạp gần bạn
function fetchNearbyBranches() {
    if (navigator.geolocation) {
        toggleLoading(true);
        navigator.geolocation.getCurrentPosition(position => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            // Sử dụng cache branches đã có tọa độ
            if (branchesCache.length > 0) {
                const updatedCinemas = branchesCache.map(cinema => {
                    // Tính khoảng cách giữa vị trí người dùng và tọa độ của rạp trong cache
                    const distance = haversineDistance(userLat, userLon, cinema.lat, cinema.lng); // Sửa lại dùng lng thay vì lon
                    return { ...cinema, distance };
                });

                // Sắp xếp các rạp theo khoảng cách gần nhất
                updatedCinemas.sort((a, b) => {
                    if (a.distance === null) return 1;
                    if (b.distance === null) return -1;
                    return a.distance - b.distance;
                });

                renderNearbyList(updatedCinemas);
                toggleLoading(false);
            } else {
                alert('Không có dữ liệu về các rạp. Vui lòng thử lại sau!');
                toggleLoading(false);
            }
        }, () => {
            toggleLoading(false);
            alert('Không thể lấy vị trí của bạn.');
        });
    } else {
        alert('Trình duyệt không hỗ trợ GPS');
    }
}

// Hàm tính khoảng cách giữa 2 điểm theo latitude và longitude (sử dụng Haversine formula)
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // bán kính trái đất (km)
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // khoảng cách km
}

// Hàm chuyển đổi độ sang radians
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Render danh sách rạp gần nhất
function renderNearbyList(cinemas) {
    let html = '';
    cinemas.forEach(c => {
        const distanceText = c.distance === null ? 'Không rõ' : `${c.distance.toFixed(2)} km`;
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center" data-branch-id="${c.branchId}">
                ${c.name}
                <small>${distanceText}</small>
            </li>`;
    });
    $('#cinema-list li[data-branch-id]').off('click').on('click', function () {
        branchId = $(this).data('branch-id');
        selectBranch();
    });
    $('#cinema-list').html(html);
}

$('#btn-nearby').on('click', function () {
    fetchNearbyBranches();
});
