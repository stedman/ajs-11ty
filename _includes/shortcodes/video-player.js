module.exports = (video, title) => {
  if (video) {
    const videoLink = `<p><a href="${video}">${title}</a></p>`;
    const reVideoParts = /https:\/\/(.*?)\/(.+)$/;
    const videoMatch = video.match(reVideoParts);

    if (videoMatch) {
      const videoId = videoMatch[2];
      let videoPlayer;

      if (videoMatch[1] === 'vimeo.com') {
        videoPlayer = `<iframe src="https://player.vimeo.com/video/${videoId}" width="560" height="315" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
      } else if (videoMatch[1] === 'youtu.be') {
        videoPlayer = `<iframe src="https://www.youtube.com/embed/${videoId}" width="560" height="315" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      } else {
        return $videoLink;
      }

      return `<div class="message is-warning flex-item">
      <h3 class="message-header">Post-meetup update</h3>
      <div class="message-body">
        ${videoPlayer}
        ${videoLink}
      </div>
      </div>`;
    }

    return $videoLink;
  }

  return '';
};
