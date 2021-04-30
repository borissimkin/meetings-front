import ToastRaisedHand from '@/components/ToastRaisedHand'

export const optionsToast = {
  position: 'bottom-left',
  timeout: 5000,
  closeOnClick: true,
  maxToasts: 3,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.5,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  filterBeforeCreate: (toast, toasts) => {
    if (toasts.filter((t) => t.type === toast.type).length !== 0) {
      return false
    }
    return toast
  },
}

export const contentToastRaisedHand = (props, listeners) => {
  return {
    component: ToastRaisedHand,
    props,
    listeners,
  }
}
