export type GuideEpisode = {
  number: number;
  title: string | null;
  duration: string | null;
  videoId: string | null;
  thumbnailUrl: string | null;
};

export type GuideResponse = {
  title: string | null;
  description: string | null;
  playlistId: string | null;
  startVideoId: string | null;
  watchUrl: string | null;
  playlistUrl: string | null;
  embedUrl: string | null;
  episodes: GuideEpisode[] | null;
};
