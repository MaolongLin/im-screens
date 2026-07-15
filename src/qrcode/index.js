//

let my = {};

console.log('enter blackfacts index.js');

document.addEventListener('DOMContentLoaded', document_loaded);

window.addEventListener('resize', resize_window);

id_link.addEventListener('click', link_click_action, { passive: true });
id_button_add.addEventListener('click', add_click_action);
id_button_remove.addEventListener('click', remove_click_action);
id_button_enter.addEventListener('click', enter_click_action);

function document_loaded() {
  console.log('document_loaded');

  black_my_setup();

  black_setup_dbase();

  setup_animationFrame();

  id_footer.innerHTML = my.mo_group + ' ' + id_footer.innerHTML;
}

function remove_click_action() {
  remove_action();
}

function show_comments() {
  let items = [];
  for (let prop in my.comment_store) {
    let entry = my.comment_store[prop];
    let li = document.createElement('li');
    li.textContent = entry.name + ': ' + entry.comment;
    items.push(li);
  }
  items.reverse();
  id_comments_ol.innerHTML = '';
  for (let i = 0; i < items.length; i++) {
    id_comments_ol.appendChild(items[i]);
  }
}

async function add_click_action() {
  await add_action();
  id_name.value = '';
  id_comment.value = '';
}

async function enter_click_action(event) {
  // console.log('enter_click_action event.target', event.target);
  // console.log('id_link.href', id_link.href);
  // console.log('id_name', id_name.value);
  // console.log('id_comment', id_comment.value);

  await add_click_action();

  window.location = id_link.href;
  // !!@ Fails in WebView iOS app
  // window.open(id_link.href);
}

function link_click_action(event) {
  console.log('link_click_action event.target', event.target);
}

function resize_window() {
  // console.log('resize_window');
}
