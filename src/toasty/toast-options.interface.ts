export interface ToastOptions {
  msg?: string;
  alert?: string;
  showClose?: boolean;
  timeout?: number;
  onAdd?: Function;
  onRemove?: Function;
}