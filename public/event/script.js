console.clear();

const team = [
{
    rank: 1,
    name: 'amoscookie',
    handle: 'amoscookie',
    img: 'members.png',
    kudos: 8.611,
    sent: 8.611 },
{
    rank: 2,
    name: 'boozzy',
    handle: 'boozzy',
    img: 'members.png',
    kudos: 7.874,
    sent: 7.874 },
{
    rank: 3,
    name: 'anz',
    handle: 'anz',
    img: 'members.png',
    kudos: 7.287,
    sent: 7.287 },
{
    rank: 4,
    name: 'minthater',
    handle: 'minthater',
    img: 'members.png',
    kudos: 6.381,
    sent: 6.381 },
{
    rank: 5,
    name: 'techmandylan',
    handle: 'techmandylan',
    img: 'members.png',
    kudos: 6.078,
    sent: 6.078 },
{
      rank: 6,
      name: '0hepha0',
      handle: '0hepha0',
      img: 'members.png',
      kudos: 5.576,
      sent: 5.576 },
{
    rank: 7,
    name: 'medabee',
    handle: 'medabee',
    img: 'members.png',
    kudos: 4.964,
    sent: 4.964 },
{
  rank: 8,
  name: 'verdant0345',
  handle: 'verdant0345',
  img: 'members.png',
  kudos: 4.606,
  sent: 4.606 },
{
  rank: 9,
  name: 'xero__crypt',
  handle: 'xero__crypt',
  img: 'members.png',
  kudos: 4.434,
  sent: 4.434 },
{
  rank: 10,
  name: 'mooroonic',
  handle: 'mooroonic',
  img: 'members.png',
  kudos: 2.241,
  sent: 2.241 }
];



const randomEmoji = () => {
  const emojis = ['💰'];
  let randomNumber = Math.floor(Math.random() * emojis.length);
  return emojis[randomNumber];
};

team.forEach(member => {
  let newRow = document.createElement('li');
  newRow.classList = 'c-list__item';
  newRow.innerHTML = `
		<div class="c-list__grid">
			<div class="c-flag c-place u-bg--transparent">${member.rank}</div>
			<div class="c-media">
				<img class="c-avatar c-media__img" src="${member.img}" />
				<div class="c-media__content">
					<div class="c-media__title">${member.name}</div>
				</div>
			</div>
			<div class="u-text--right c-kudos">
				<div class="u-mt--8">
					<strong>$${member.kudos}</strong>
				</div>
			</div>
		</div>
	`;
  if (member.rank === 1) {
    newRow.querySelector('.c-place').classList.add('u-text--dark');
    newRow.querySelector('.c-place').classList.add('u-bg--yellow');
    newRow.querySelector('.c-kudos').classList.add('u-text--yellow');
  } else if (member.rank === 2) {
    newRow.querySelector('.c-place').classList.add('u-text--dark');
    newRow.querySelector('.c-place').classList.add('u-bg--teal');
    newRow.querySelector('.c-kudos').classList.add('u-text--teal');
  } else if (member.rank === 3) {
    newRow.querySelector('.c-place').classList.add('u-text--dark');
    newRow.querySelector('.c-place').classList.add('u-bg--orange');
    newRow.querySelector('.c-kudos').classList.add('u-text--orange');
  }
  list.appendChild(newRow);
});

// Find Winner from sent kudos by sorting the drivers in the team array
let sortedTeam = team.sort((a, b) => b.sent - a.sent);
let winner = sortedTeam[0];

// Render winner card
const winnerCard = document.getElementById('winner');
winnerCard.innerHTML = `
	<div class="u-text-small u-text--medium u-mb--16">Top Sender Last Week</div>
	<img class="c-avatar c-avatar--lg" src="${winner.img}"/>
	<h3 class="u-mt--16">${winner.name}</h3>
	<span class="u-text--teal u-text--small">${winner.name}</span>
`;
