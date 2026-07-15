function setup_animationFrame() {
  window.requestAnimationFrame(animationFrame_callback);
}

function animationFrame_callback(timeStamp) {
  let timeSecs = timeStamp / 1000;
  // console.log('step_animation timeStamp', timeStamp);
  window.requestAnimationFrame(animationFrame_callback);

  // if (!my.qrcodeInited && my.qrcodeElement) {
  //   my.qrcodeInited = 1;
  //   my.qrcodeElement.addEventListener('click', qrcode_click_action);
  // }

  if (my.index_update_pending) {
    console.log('step_animation index_update_pending my.blackfacts_index', my.blackfacts_index);
    my.index_update_pending = 0;
    update_blackfacts_index(my.blackfacts_index);
  }
  //
  // attempt to start video after video cued and player.playVideo() called
  // !!@ Not working. must press play button or next
  // my.video_play_count
  //
  if (
    my.video_index_cued != null && //
    player_ready() &&
    player.getPlayerState() != YT.PlayerState.PLAYING
  ) {
    console.log('animationFrame_callback video_index_cued', my.video_index_cued);
    my.video_index_was_played = my.video_index_cued;
    my.video_index_cued = null;
    player.playVideo();
  }

  if (
    my.video_index_was_played != null && //
    player_ready() &&
    player.getPlayerState() != YT.PlayerState.PLAYING &&
    timeSecs > 5.0
  ) {
    console.log('animationFrame_callback video_index_was_played', my.video_index_was_played);
    let index = my.video_index_was_played;
    my.video_index_was_played = null;
    video_play_index(index);
    return;
  }

  if (my.video_play_index_pending != null && player_ready()) {
    console.log('animationFrame_callback video_play_index_pending', my.video_play_index_pending);
    let index = my.video_play_index_pending;
    my.video_play_index_pending = null;
    video_play_index(index);
    return;
  }
  if (my.blackfacts_player_inited) {
    record_startup_time(timeSecs);
  } else {
    // Check for player setup stall
    // !!@ my. candidate
    if (timeSecs > 5.0) {
      console.log('animationFrame_callback player startup stall');
      player_startup_stalled();
    }
  }
  if (!my.isRemote && !params.qrcode) {
    // if (my.blackfacts_qrcode) qrcode_show();
    // else qrcode_hide();
  }
  if (my.animLoop) {
    my.animLoop.step({ action: stepAction, loop: my.playClip });
    let lapse = '';
    if (my.playClip) lapse = my.animLoop.lapse() + ' ' + my.stepCount;
    id_lapse_report.innerHTML = lapse;
  }
  if (my.pingLoop) {
    my.pingLoop.step({ loop: 1 });
  }
  show_message_status(timeSecs);
}

function show_message_status(timeSecs) {
  let timeLabel = '';
  if (typeof timeSecs == 'number') {
    timeLabel = timeSecs.toFixed(2);
  }
  if (!my.blackfacts_player_inited) {
    let str = 'Waiting for video ' + timeLabel;
    if (my.stalled_report) {
      str += ' reload pending';
    }
    show_message_id(str);
  } else if (params.title) {
    let str = params.title;
    show_message_id(str);
  }
}

function record_startup_time(timeSecs) {
  if (!my.blackfacts_player_startup_time) {
    // console.log('record_startup_time timeSecs', timeSecs);
    my.blackfacts_player_startup_time = timeSecs;
    //
    // mo-blackfacts / m0-blackfacts / a_device / uid / startup_time
    //
    dbase_update_props({ startup_time: timeSecs });
  }
}

// if the video player does not startup within a few seconds
// we log a startup stall and reload the page
// hoping for player to start
//
function player_startup_stalled() {
  if (my.stalled_report) {
    return;
  }
  my.stalled_report = 1;

  let { increment } = fireb_.fbase;
  dbase_update_props({ startup_stall: increment(1) });

  setTimeout(function () {
    window.location.reload();
  }, 5.0 * 1000); // !!@ my. candidate
}
