declare var $: any;

/* Open loading bar */
export function showLoadingBar() {
    let options = { show: true, backdrop: 'static', keyboard: false };
    $('div.gx-loadingbar-modal').modal(options);
}

/* Open loading bar */
export function hideLoadingBar() {
    $('div.gx-loadingbar-modal').modal('hide');
}

/* Toggle loading bar */
export function toggleLoadingBar() {
    $('div.gx-loadingbar-modal').modal('toggle');
}