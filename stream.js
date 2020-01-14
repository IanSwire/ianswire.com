const embedName = "stream-video";

const embed = new Twitch.Embed(embedName, {
    width: 400,
    height: 300,
    channel: "ianswire",
    layout: "video",
    autoplay: true
});

embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
    const player = embed.getPlayer();
    player.SetVolume(0.5);
    player.play();
});