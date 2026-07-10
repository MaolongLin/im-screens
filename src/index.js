//

let my = {};
let videoData = {};

// console.log('BlackFacts index.js');

document.addEventListener('DOMContentLoaded', document_loaded);
// console.log('addEventListener document_loaded');

// window.addEventListener('resize', position_bottom);

async function document_loaded() {
  // console.log('document_loaded');
  // Load series/videos data once at startup
  await load_video_json();

  my_setup();

  init_ui();

  black_setup_dbase();

  // Sometimes in non-remote description does not appear
  setTimeout(update_blackfacts_num_ui, 1000);

  my.animLoop = new Anim({ target: my, time: my.animTime });

  if (my.isRemote) {
    my.pingLoop = new Anim({ target: my, time: my.pingTime, action: pingAction });
  }

  setup_animationFrame();
}

// Fetch videos.json and populate videoData once
async function load_video_json() {
  try {
    const response = await fetch('./videos.json');
    if (!response.ok) {
      console.log('load_video_json bad response', response.status);
      videoData = {};
      return;
    }
    videoData = await response.json();
  } catch (error) {
    console.log('load_video_json error', error);
    videoData = {};
  }
}

function update_blackfacts_index_dbase(blackfacts_index) {
  console.log('update_blackfacts_index_dbase blackfacts_index', blackfacts_index, 'mo_group', my.mo_group);
  //
  // mo-blackfacts / m0-blackfacts / a_group / s0 / meta / blackfacts_index
  //
  dbase_update_item({ blackfacts_index }, 'item');
}

function pingAction() {
  let portrait = my.isRemote ? 1 : 0;
  let group = my.mo_group;
  //
  // blackfacts / a_device / uid / a_info/ { portrait, group }
  //
  // dbase_site_updates({ portrait, group });
  // --> dbase_info_update({ portrait, group } )
  //
  dbase_info_update({ portrait, group });
}

function update_blackfacts_index(newValue) {
  console.log('update_blackfacts_index newValue', newValue, my.blackfacts_index);
  my.blackfacts_index = newValue;

  update_blackfacts_num_ui();

  video_play_index(my.blackfacts_index);
}

function update_blackfacts_num_ui() {
  // url title param will be displayed in animationFrame_callback
  if (params.title) {
    return;
  }
  let index = my.blackfacts_index;
  let entry = dateFactForIndex(index);
  if (!entry) {
    console.log('update_blackfacts_num_ui no entry index', index);
    return;
  }
  let key = dateFactsKeys[index];
  // console.log('update_blackfacts_num_ui key', key);
  let ndate = '2025-' + key.substring(0, 2) + '-' + key.substring(2, 4);
  // console.log('update_blackfacts_num_ui ndate', ndate);
  id_date.value = ndate;
  //
  let description = entry.description;
  let periodIndex = description.indexOf('Narrated by BlackFacts.com');
  if (periodIndex >= 0) {
    description = description.substring(0, periodIndex);
  }
  // console.log('update_blackfacts_num_ui description', description);
  let msg = '#' + (index + 1) + ' ' + dateFactsKeys[index] + ' ' + description;
  show_message_id(msg);
}

function show_message_id(msg) {
  id_blackfacts_num.innerHTML = msg;
  id_message_text.innerHTML = id_blackfacts_num.innerHTML = msg;
}

function mo_blackfacts_qccode_value(newValue) {
  // console.log('mo_blackfacts_qccode_value newValue', newValue);
  my.blackfacts_qrcode = newValue;
}
