async function black_setup_dbase() {
  //
  my.comment_count = 0;

  await dbase_app_init(my);

  observe_meta();

  observe_comment_store();

  footer_style(); // Apply custom footer style after dbase_app_init
}

function observe_meta() {
  dbase_app_observe({ observed_item }, 'item');
  function observed_item(item) {
    console.log('observed_item item', item);
    console.log('observed_item item.blackfacts_index', item.blackfacts_index);
    if (item.blackfacts_index != undefined) {
      my.blackfacts_index = item.blackfacts_index;
    }
    if (item.comment_count != undefined) {
      my.comment_count = item.comment_count;
    }
    my.index_update_pending = 1;
  }
}

function observe_comment_store() {
  dbase_app_observe({ observed_event }, 'comment_store');
  my.comment_store = {};
  function observed_event(event, key, item) {
    console.log('observed_event ', event, key, item);
    switch (event) {
      case 'add':
      case 'change':
        my.comment_store[key] = item;
        break;
      case 'remove':
        delete my.comment_store[key];
        my.comment_prune_pending = 1;
        break;
    }
    my.comment_update_pending = 1;
  }
}

function new_entry() {
  let name = id_name.value;
  let comment = id_comment.value;
  let createdAt = new Date().toISOString();
  let index = my.comment_count + 1;
  let uid = my.uid;
  return { name, comment, createdAt, index, uid };
}

async function add_action() {
  console.log('add_action ');
  let entry = new_entry();
  console.log('add_action entry', entry);
  if (!entry.name && !entry.comment) {
    console.log('add_action empty');
    return;
  }
  let key = await dbase_add_key('comment_store', entry);
  console.log('add_action key', key);
  entry.key = key;
  try {
    dbase_update_item({ comment_count: dbase_increment(1) }, 'item');
  } catch (err) {
    console.log('take_action err', err);
  }
}

async function remove_action() {
  let response = confirm('remove my comment');
  if (response) {
    remove_action_confirmed();
  }
}

async function remove_action_confirmed() {
  //
  for (let key in my.comment_store) {
    let entry = my.comment_store[key];
    if (entry.uid != my.uid) {
      console.log('remove skipping', entry.uid);
      continue;
    }
    await dbase_remove_key('comment_store', key);
    break;
  }
}

function ui_log(...args) {
  // enter blackfacts ui_log
  console.log(...args);
}

function ui_logv(...args) {
  // enter blackfacts ui_logv
  // console.log(...args);
}

function ui_error(...args) {
  // enter blackfacts ui_error
  ui_log(...args);
  alert(...args);
}
function footer_style() {
  const t = setInterval(() => {
    if (my.footerElement) {
      clearInterval(t);
      my.footerElement.classList.add("custom-footer");
      my.footerElement.style.backgroundColor = "";
      my.footerElement.style.color = "";
    }
  }, 50);
}
