'use strict';

(function () {
    let toastInstance;

    function showToast(message, type = 'success') {
        if (toastInstance) {
            toastInstance.dispose();
        }

        const toastContainer = document.createElement('div');
        toastContainer.className = 'bs-toast toast position-fixed top-0 start-50 translate-middle-x m-2';
        toastContainer.setAttribute('role', 'alert');
        toastContainer.setAttribute('aria-live', 'assertive');
        toastContainer.setAttribute('aria-atomic', 'true');
        toastContainer.setAttribute('data-bs-delay', '5000');

        let iconClass, bgColor;
        if (type === 'success') {
            iconClass = 'ri-check-line';
            bgColor = 'bg-success text-white';
        } else {
            iconClass = 'ri-close-circle-line';
            bgColor = 'bg-danger text-white';
        }

        toastContainer.innerHTML = `
            <div class="toast-header ${bgColor}">
                <i class="${iconClass} me-2"></i>
                <div class="me-auto fw-medium">Thông báo</div>
                <div type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close">
                </div>
            </div>
            <div class="toast-body">${message}</div>
        `;

        document.body.appendChild(toastContainer);

        toastInstance = new bootstrap.Toast(toastContainer);
        toastInstance.show();

        toastContainer.addEventListener('hidden.bs.toast', () => {
            toastContainer.remove();
        });
    }

    window.showSuccessToast = (message) => showToast(message, 'success');
    window.showErrorToast = (message) => showToast(message, 'error');

})();
