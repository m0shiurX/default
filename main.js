import './style.css';
import 'video.js/dist/video-js.css';

import videojs from 'video.js';

let options = {
	height: '360',
	width: '540',
	fluid: false,
	autoplay: true,
	controls: false,
	preload: 'auto',
	controlBar: {
		volumePanel: { inline: false },
	},
};
const player = videojs('vid_player', options);
