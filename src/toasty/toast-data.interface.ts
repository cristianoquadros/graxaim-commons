export interface ToastData {
  id: number;
  alert: string;
  msg: string;
  showClose: boolean;
  type: string;
  timeout: number;
  onAdd: Function;
  onRemove: Function;
  onClick: Function;
}