const clientId = 'qronm15vo9mj0kxyutyr0i8aml9eb8';

// Array of usernames to showcase
const userLogins = [
    'ianswire',
    'tadmozeltov',
    'camobear',
    'fareeha'
];

// Default user to show stream for
const defaultUser = userLogins[0];

/* Get user data by user login */
async function getUser(userLogin) {
    const response = await fetch(
        `https://api.twitch.tv/helix/users?login=${userLogin}`,
        {
            'headers': { 'Client-ID': clientId }
        }
    );

    return await response.json();
}

/* Get active streams by user login */
async function getStreams(userLogin) {
    const response = await fetch(
        `https://api.twitch.tv/helix/streams?user_login=${userLogin}`,
        {
            'headers': { 'Client-ID': clientId }
        }
    );

    return await response.json();
}

/* Get active status based on number of streams */
async function getUserActive(userLogin) {
    const data = await getStreams(userLogin);

    return await data.data.length > 0;
}

/* Get user data and active status */
async function getUserAndActive(userLogin) {
    const userData = await getUser(userLogin),
        userActive = await getUserActive(userLogin);

    return await [userData.data[0], userActive];
}

const embedId = 'stream-video';

const embed = new Twitch.Embed(embedId, {
    width: "100%",
    height: 400,
    channel: defaultUser,
    layout: 'video',
    autoplay: true
});

embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
    const player = embed.getPlayer();
    player.setVolume(0.5);
    player.play();
});

const iconContainer = document.getElementById('stream-icons');

// Get data and active status for each user listed above
Promise.all(userLogins.map(getUserAndActive))
    .then((userData) => {
        // console.log(userData);

        userData.forEach(([user, active]) => {
            // console.log(user);

            const streamIcon = document.createElement('img');

            streamIcon.src = user.profile_image_url;
            streamIcon.alt = user.display_name;

            streamIcon.classList.add('stream-icon');
            streamIcon.classList.add(active ? 'live' : 'offline');

            streamIcon.addEventListener('click', () => {
                embed.getPlayer().setChannel(user.login);
            });

            iconContainer.appendChild(streamIcon);
        });

        const activeUserData = userData.filter(([_, active]) => active);

        // If any users are active...
        if (activeUserData.length > 0) {
            [user, _] = activeUserData[0];
            // And top active user isn't the default
            if (user.login !== defaultUser) {
                embed.getPlayer().setChannel(user.login);
            }
        }
    });
