declare var $: any;

/* Open tab */
export function openFirsTab() {
    $('.nav-tabs a.nav-link:first').tab('show');
}

function openLastTab() {
    $('.nav-tabs a.nav-link:last').tab('show');
}

function openTab(tabid) {
    $('.nav-tabs a.nav-link#' + tabid).tab('show');
}

/* Add tab List  */
export function addTab(tablist, title, hint, item) {
    let size = tablist.length+1;
    if (size>5){
        return;
    }
    let idtab = 'tab_' + Math.floor(Math.random() * (1000000 - 1000 + 1)) + 1000;
    tablist.push({id: idtab, title: title, item: item, hint:hint});
    scrollByTab();

    setTimeout(()=> {
        openLastTab();
        if (size == 1){
            insertTip(idtab);
        }    
    }, 100);
    setTimeout(()=> $('.nav-tabs li.nav-item#nav_' +idtab).popover("dispose"), 5000);    
}

/* Insert Tip */
function insertTip(idtab){
    let $item=$('.nav-tabs li.nav-item#nav_' +idtab);
    $item.popover({
         trigger:"focus", 
         placement: 'right', 
         html: true, 
         title: "Dica Importante (!)", 
         content: "Você pode abrir até 5 registros e visualizar nestas abas. Clique no título para selecionar e no 'X' para fechar." });    
    $item.popover('show');
}

/* scroll by */
function scrollByTab(){
    $('html, body').animate({ scrollTop: $('ul#gx-dynamic-tab').offset().top-68 }, 'low');    
}