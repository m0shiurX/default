import 'video.js/dist/video-js.css';
import './custom-vid.css';
import './style.css';
import videojs from 'video.js';

// Utility script for localStorage
const store = (() => {
	const hasData = (key) => !!localStorage[key] && !!localStorage[key].length;

	const get = (key) => {
		if (!hasData(key)) {
			return false;
		}
		const data = localStorage[key];
		try {
			return JSON.parse(data);
		} catch (e) {
			return data;
		}
	};

	const set = (key, value) => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (e) {
			localStorage.setItem(key, value);
		}
	};

	const extend = (key, value) => {
		const _value = hasData(key) ? [...get(key), value] : [value];
		set(key, _value);
	};

	const remove = (key) => {
		localStorage.removeItem(key);
	};

	return { hasData, get, set, extend, remove };
})();

const video_type = 'video/mp4';
const video_src = './walnut.mp4';
const vid_token = 'sales_video_played';
const vid_options = {
	autoplay: true,
	controls: true,
	children: ['bigPlayButton'],
	preload: 'auto',
	responsive: true,
	fluid: true,
};
const vid_player = videojs('videojs_player', vid_options);
vid_player.src({ type: video_type, src: video_src });

const was_video_playing = () => store.hasData(vid_token) && store.get(vid_token).ct > 1;

const last_playback_position = () => {
	const playback_info = store.get(vid_token);
	return playback_info && playback_info.ct;
};

const show_unmute_overlay = () => vid_player.addChild('unmuteButton');
const show_playback_options = () => {
	vid_player.addChild('playback_options');
	vid_player.addChild('resume_playback_btn');
	vid_player.addChild('restart_playback_btn');
};
const remove_playback_options = () => {
	vid_player.removeChild('playback_options');
	vid_player.removeChild('resume_playback_btn');
	vid_player.removeChild('restart_playback_btn');
	vid_player.bigPlayButton.show();
};
const start_playback_from = (sec = 0) => {
	vid_player.muted(false);
	vid_player.currentTime(sec);
	vid_player.play();
	// fireTrackerEvent(token_domain, 1); //event #1
};

vid_player.on('ready', () => {
	vid_player.bigPlayButton.hide();
	const playing_status = was_video_playing();
	if (playing_status === true) {
		vid_player.pause();
		show_playback_options();
	} else {
		vid_player.muted(true);
		vid_player.play();
		show_unmute_overlay();
	}
});

vid_player.on('timeupdate', () => {
	let current_time = vid_player.currentTime();
	if (!vid_player.muted() && current_time > 1) {
		store.set('vsl_video_played', { ct: current_time });
	}
	// if (current_time >= btn_show_at && !show_btn) {
	// 	show_btn = true;
	// 	$('#btn_holder').show();
	// 	$(footer).hide();
	// 	Cookies.set('show', '1', { expires: 365, path: '' });
	// }
});

vid_player.on('ended', () => {
	store.remove(vid_token);
	// vid_player.bigPlayButton.hide();
	// vid_player.dispose();
});

class UnmuteButton extends videojs.getComponent('ClickableComponent') {
	constructor(player, options) {
		super(player, options);
		this.addClass('vjs_unmute_overlay');
		this.updateContent(`
      <div class="unmute_overlay_container">
        <h3 class="unmute_overlay_heading">Your Video Is Playing</h3>
        <div class="unmute_overlay_icon"></div>
        <h3 class="unmute_overlay_heading">Click to Unmute</h3>
      </div>
    `);
	}

	createEl() {
		return videojs.dom.createEl('div', { className: 'vjs_unmute_overlay' });
	}

	updateContent(content) {
		videojs.dom.emptyEl(this.el());
		this.el().innerHTML = content;
	}

	handleClick(event) {
		start_playback_from(0);
		this.dispose();
		vid_player.bigPlayButton.show();
	}
}
videojs.registerComponent('UnmuteButton', UnmuteButton);

class PlaybackOptions extends videojs.getComponent('Component') {
	constructor(player, options) {
		super(player, options);
		this.addClass('vjs_playback_options');
		this.updateContent(`<h3 class="playback_heading">You've already started watching this video</h3>`);
	}

	createEl() {
		return videojs.dom.createEl('div', { className: 'vjs_playback_options' });
	}

	updateContent(content) {
		videojs.dom.emptyEl(this.el());
		this.el().innerHTML = content;
	}
}
videojs.registerComponent('PlaybackOptions', PlaybackOptions);

class ResumePlaybackButton extends videojs.getComponent('ClickableComponent') {
	constructor(player, options) {
		super(player, options);
		this.addClass('resume_playback_btn');
		this.updateContent(`<div data-action="continue" class="playback_btn continue">Continue watching?</div>`);
	}

	createEl() {
		return videojs.dom.createEl('div', { className: 'resume_playback_btn' });
	}

	updateContent(content) {
		videojs.dom.emptyEl(this.el());
		this.el().innerHTML = content;
	}

	handleClick(e) {
		start_playback_from(last_playback_position());
		remove_playback_options();
	}
}
videojs.registerComponent('ResumePlaybackButton', ResumePlaybackButton);

class RestartPlaybackButton extends videojs.getComponent('ClickableComponent') {
	constructor(player, options) {
		super(player, options);
		this.addClass('restart_playback_btn');
		this.updateContent(`<div data-action="restart" class="playback_btn restart">Start from beginning?</div>`);
	}

	createEl() {
		return videojs.dom.createEl('div', { className: 'restart_playback_btn' });
	}

	updateContent(content) {
		videojs.dom.emptyEl(this.el());
		this.el().innerHTML = content;
	}

	handleClick(e) {
		start_playback_from(0);
		remove_playback_options();
	}
}
videojs.registerComponent('RestartPlaybackButton', RestartPlaybackButton);

// Disable right click
const vsl_video = document.getElementById('videojs_player');
vsl_video.addEventListener('contextmenu', (e) => e.preventDefault(), false);
