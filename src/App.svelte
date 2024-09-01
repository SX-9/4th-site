<script>
  import { daysUntilBirthday, getTimeIn, timeAgo } from './lib/calc.js';
  import { discord, github } from './lib/fetch.js';
  import information from './lib/info.js';

  const days = daysUntilBirthday(information.birthday);
  const time = getTimeIn(information.timezone);
</script>

<main>
  <div style="grid-area:main;">
    <h1>{information.title}</h1>
    <p>{information.description}</p>
    <span class="text-subtext0 text-sm italic">
      <b>{days || 'Today'}</b> { days ? 'day' + (days === 1 ? '' : 's') + ' until my birthday.' : 'is my birthday!' }
      It's <b>{time}</b> for me.
    </span>
  </div>
  <div style="grid-area:links;">
    <ul>
      {#each Object.entries(information.links) as [name, url]}
        <li class="my-1.5">
          <a href={url} target="_blank">
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
    <hr class="mt-2">
    {#await github(7, information.github) then data}
        {#each data as repo}
          <div class="my-2 flex justify-between items-center">
            <div>
              <h3><a href={repo.url}>{repo.name}</a></h3>
              <span>{repo.desc || ''}</span>
            </div>
            <div class="text-right">
              {#if repo.stars}  
                <span class="text-yellow"><b>{repo.stars}</b> star(s)</span>
                <br>
              {/if}
              <span class="text-subtext1 italic">{repo.lang || ''}</span>
            </div>
          </div>
          <hr>
        {/each}
    {/await}
    <a href={'https://github.com/' + information.github}>More...</a>
  </div>
  <div style="grid-area:stats;">
    {#await discord(information.discord) then data}
      <span class="italic text-subtext0">{data?.username} is {data?.status} on discord</span>
      {#if data?.spotify?.song}
        <div>
          <h2>Listening to Spotify</h2>
          <div class="my-1 flex gap-2 items-center">
            <img class="size-12 rounded-md" src={data.spotify.art} alt="album art">
            <div>
              <h3><a href={data.spotify.link}>{data.spotify.song}</a></h3>
              <span>{data.spotify.artist}</span>
            </div>
          </div>
        </div>
      {/if}
      <div class="mt-4 flex flex-wrap justify-start items-start gap-4">
        {#each data?.activity || [] as activity}
          <div>
            <h3>Playing {activity.name}</h3>
            <ul>
              <li>Started {timeAgo(activity.started)}</li>
              {#if activity.state}
                <li>{activity.state}</li>
              {/if}
              {#if activity.details}
                <li>{activity.details}</li>
              {/if}
            </ul>
          </div>
        {/each}
      </div>
    {/await}
  </div>
</main>