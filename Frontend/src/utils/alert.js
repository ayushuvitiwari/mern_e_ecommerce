import Swal from 'sweetalert2';

// Toast Notification (Top Right)
export const toast = (title, icon = 'success') => {
  return Swal.fire({
    title,
    icon,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: '#ffffff',
    color: '#0f172a',
    customClass: {
      popup: 'rounded-2xl shadow-xl border border-slate-100'
    }
  });
};

// Modal Success Alert
export const showSuccess = (title, text = '') => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonColor: '#4f46e5',
    confirmButtonText: 'Great!',
    customClass: {
      popup: 'rounded-3xl shadow-2xl border border-slate-100',
      confirmButton: 'px-6 py-2.5 rounded-xl font-bold text-sm shadow-md'
    }
  });
};

// Modal Error Alert
export const showError = (title, text = '') => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'OK',
    customClass: {
      popup: 'rounded-3xl shadow-2xl border border-slate-100',
      confirmButton: 'px-6 py-2.5 rounded-xl font-bold text-sm shadow-md'
    }
  });
};

// Modal Info Alert
export const showInfo = (title, text = '') => {
  return Swal.fire({
    title,
    text,
    icon: 'info',
    confirmButtonColor: '#4f46e5',
    confirmButtonText: 'Got it',
    customClass: {
      popup: 'rounded-3xl shadow-2xl border border-slate-100',
      confirmButton: 'px-6 py-2.5 rounded-xl font-bold text-sm shadow-md'
    }
  });
};

// Modal Confirmation Dialog (e.g. Logout, Delete)
export const showConfirm = async ({
  title = 'Are you sure?',
  text = '',
  confirmButtonText = 'Yes, Proceed',
  cancelButtonText = 'Cancel',
  icon = 'warning',
  confirmButtonColor = '#4f46e5'
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor: '#94a3b8',
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    customClass: {
      popup: 'rounded-3xl shadow-2xl border border-slate-100',
      confirmButton: 'px-6 py-2.5 rounded-xl font-bold text-sm shadow-md',
      cancelButton: 'px-6 py-2.5 rounded-xl font-bold text-sm'
    }
  });

  return result.isConfirmed;
};
