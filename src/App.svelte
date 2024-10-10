<script>
  import { daysUntilBirthday, getTimeIn, timeAgo } from './lib/calc.js';
  import { discord, github } from './lib/fetch.js';
  import information from './lib/info.js';

  let gh = new Promise(() => {});
  let dc = new Promise(() => {});
  let days = daysUntilBirthday(information.birthday);
  let time = getTimeIn(information.timezone);

  function refresh() {
    days = daysUntilBirthday(information.birthday);
    time = getTimeIn(information.timezone);
    dc = discord(information.discord);
    gh = github(7, information.github);
  }

  refresh();
  setInterval(refresh, 60000);
</script>

<main>
  <div style="grid-area:main;">
    <h1 class="my-4">{information.title}</h1>
    <p>{information.description}</p>
    <span class="text-sm italic">
      <a on:click={refresh} href="/#">refresh dynamic data</a> -
      <b>{days || 'Today'}</b> { days ? 'day' + (days === 1 ? '' : 's') + ' until my birthday.' : 'is my birthday!' }
      It's <b>{time}</b> for me.
    </span>
  </div>
  <div style="grid-area:links;">
    <ul>
      {#each Object.entries(information.links) as [name, url]}
        <li class="my-1.5">
          <a href={url}>
            {name}
          </a>
        </li>
      {/each}
    </ul>
  </div>
  <div style="grid-area:skills;">
    {#each Object.entries(information.skills) as [category, skills]}
      <h3 class="mt-1">{category}</h3><span>{skills.join(', ')}</span><br>
    {/each}
  </div>
  <div style="grid-area:repos;">
    <h2>Github Repositories</h2>
    {#await gh}
      <span class="italic my-2">loading github repositories...<br></span>
    {:then data}
        {#each data as repo}
          <div class="my-4 flex justify-between items-center gap-4">
            <div>
              <h3><a href={repo.url}>{repo.name}</a></h3>
              <span>{repo.desc || ''}</span>
            </div>
            <div class="text-right">
              {#if repo.stars}  
                <span class="text-yellow-300"><b>{repo.stars}</b> star(s)</span>
                <br>
              {/if}
              <span class="italic">{repo.lang || ''}</span>
            </div>
          </div>
        {/each}
    {/await}
    <a href={'https://github.com/' + information.github}>More...</a>
  </div>
  <div style="grid-area:stats;">
    {#await dc}
      <span class="italic">loading discord status...</span>
    {:then data}
      <div class="mt-4 flex flex-wrap justify-start items-start gap-4 mb-4">
        {#if data?.spotify?.song}
          <div>
            <h2>Listening to Spotify</h2>
            <div class="my-1 flex gap-2 items-center">
              <img class="size-12 rounded-md" src={data.spotify.art} alt="album art">
              <div>
                <h3><a href={data.spotify.link}>{data.spotify.song}</a></h3>
                <span class="italic">{data.spotify.artist}</span>
              </div>
            </div>
          </div>
        {/if}
        {#each data?.activity || [] as activity}
          <div>
            <h2>Playing {activity.name}</h2>
            <!-- <ul>
              <li>Started {timeAgo(activity.started)}</li>
              {#if activity.state}
                <span>{activity.state}</span>
              {/if}
              {#if activity.details}
                <span>{activity.details}</span>
              {/if}
            </ul> -->
            <div class="my-1 flex gap-2 items-center">
              <div class="relative">
                {#if activity.images.large}
                  <img class="size-12 rounded-md" src={activity.images.large} alt="large">
                {/if}
                {#if activity.images.small}
                  <img class="size-6 rounded-full absolute -bottom-1 -right-1" src={activity.images.small} alt="small">
                {/if}
              </div>
              <span class="italic">
                Started {timeAgo(activity.started)}
                {#if activity.state}
                  <br>{activity.state}
                {/if}
                {#if activity.details}
                  <br>{activity.details}
                {/if}
              </span>
            </div>
          </div>
        {/each}
      </div>
      <span class="italic">@<span class="underline">{data?.username}</span> is 
      {#if data?.status === 'online'}
        <span class="text-green-300">{data?.status}</span>
      {:else if data?.status === 'idle'}
        <span class="text-yellow-300">{data?.status}</span>
      {:else if data?.status === 'dnd'}
        <span class="text-red-300">{data?.status}</span>
      {:else}
        {data?.status}
      {/if}
      on discord</span>
    {/await}
  </div>
</main>