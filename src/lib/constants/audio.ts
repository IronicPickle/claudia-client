import { AudioSourceType } from "$shared/lib/enums/audio";

import FaYouTube from "~icons/fa-brands/youtube";
import FaSpotify from "~icons/fa-brands/spotify";
import FaSoundCloud from "~icons/fa-brands/soundcloud";
import IoSave from "~icons/ion/save";
import IoMinus from "~icons/ion/minus";

export const audioSourceIcons = {
	[AudioSourceType.YouTube]: FaYouTube,
	[AudioSourceType.Spotify]: FaSpotify,
	[AudioSourceType.SoundCloud]: FaSoundCloud,
	[AudioSourceType.File]: IoSave,
	[AudioSourceType.Unknown]: IoMinus
};
