const $ = (selector) => document.querySelector(selector);
const clock = $('#clock');
const fullDate = $('#fullDate');
const greeting = $('#greeting');
const calendarDays = $('#calendarDays');
const monthLabel = $('#monthLabel');
let shownDate = new Date();

const history = [
  ['2008', '\u5317\u4eac\u5965\u8fd0\u4f1a\u5e55\u5728\u9e1f\u5de2\u62c9\u5f00\u3002'],
  ['1976', '\u201c\u5148\u9a71\u8005\u4e00\u53f7\u201d\u706b\u661f\u7740\u9646\u5668\u4f20\u56de\u9996\u5f20\u706b\u661f\u8868\u9762\u56fe\u50cf\u3002'],
  ['1945', '\u8054\u5408\u56fd\u5baa\u7ae0\u5728\u7f8e\u56fd\u65e7\u91d1\u5c71\u751f\u6548\u3002']
];

function updateTime() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  fullDate.textContent = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  const hour = now.getHours();
  greeting.textContent = hour < 6 ? '\u6df1\u591c\u597d' : hour < 11 ? '\u65e9\u5b89' : hour < 14 ? '\u5348\u5b89' : hour < 18 ? '\u4e0b\u5348\u597d' : '\u665a\u4e0a\u597d';
  $('#dayBadge').textContent = `${now.getMonth() + 1}.${String(now.getDate()).padStart(2, '0')}`;
  $('#lunarDate').textContent = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', { month: 'long', day: 'numeric' }).format(now);
}

function renderCalendar() {
  const year = shownDate.getFullYear(); const month = shownDate.getMonth();
  monthLabel.textContent = `${year} \u5e74 ${month + 1} \u6708`;
  const first = new Date(year, month, 1); const start = new Date(year, month, 1 - first.getDay()); const now = new Date();
  calendarDays.innerHTML = '';
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(start); date.setDate(start.getDate() + i);
    const button = document.createElement('button'); button.className = 'day'; button.textContent = date.getDate();
    if (date.getMonth() !== month) button.classList.add('muted');
    if (date.toDateString() === now.toDateString()) button.classList.add('today');
    button.addEventListener('click', () => document.querySelectorAll('.day.selected').forEach((item) => item.classList.remove('selected')) || button.classList.add('selected'));
    calendarDays.appendChild(button);
  }
}

const weatherCodes = { 0:['\u6674\u6717','\u2600'],1:['\u6674\u95f4\u591a\u4e91','\u26c5'],2:['\u591a\u4e91','\u2601'],3:['\u9634\u5929','\u2601'],45:['\u6709\u96fe','\u224b'],51:['\u5c0f\u96e8','\u2614'],61:['\u964d\u96e8','\u2614'],80:['\u9635\u96e8','\u2614'],95:['\u96f7\u96e8','\u26a1']};
function setWeather(data, city = '\u5f53\u524d\u4f4d\u7f6e') { const current = data.current; const [text, icon] = weatherCodes[current.weather_code] || ['\u5929\u6c14\u826f\u597d','\u2600']; $('#weatherCity').textContent = city; $('#temperature').textContent = `${Math.round(current.temperature_2m)}\u00b0`; $('#weatherText').textContent = text; $('#weatherMeta').textContent = `\u4f53\u611f ${Math.round(current.apparent_temperature)}\u00b0 \u00b7 \u6e7f\u5ea6 ${current.relative_humidity_2m}%`; $('#weatherIcon').textContent = icon; $('#wind').textContent = `${Math.round(current.wind_speed_10m)} km/h`; $('#weatherUpdated').textContent = new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}); }
async function loadWeather(latitude, longitude) { const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m`); if (!response.ok) throw new Error('weather'); setWeather(await response.json()); }

$('#previousMonth').addEventListener('click', () => { shownDate.setMonth(shownDate.getMonth() - 1); renderCalendar(); });
$('#nextMonth').addEventListener('click', () => { shownDate.setMonth(shownDate.getMonth() + 1); renderCalendar(); });
$('#todayButton').addEventListener('click', () => { shownDate = new Date(); renderCalendar(); });
$('#themeButton').addEventListener('click', () => { document.body.classList.toggle('light'); $('#themeButton').textContent = document.body.classList.contains('light') ? '\u2600' : '\u263e'; });
$('#weatherButton').addEventListener('click', () => navigator.geolocation?.getCurrentPosition(({ coords }) => loadWeather(coords.latitude, coords.longitude).catch(() => {}), () => {}));

$('#historyList').innerHTML = history.map(([year, text]) => `<article class="history-item"><time>${year}</time><p>${text}</p></article>`).join('');
updateTime(); renderCalendar(); setInterval(updateTime, 1000);
loadWeather(31.2304, 121.4737).catch(() => {});
