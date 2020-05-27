const organizations = require('../../_data/organizations.json');
const siteData = require('../../_data/site.json');

const pathPrefix = '/ajs-11ty';

/**
 * Filter date output to follow pattern MMMM D, YYYY
 *
 * @param  {object}   dateValue  Date object
 *
 * @return {string}   Formatted date string.
 */
const fullDate = (dateValue) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const newDate = new Date(dateValue);

  return `${monthNames[newDate.getMonth()]} ${newDate.getDate()}, ${newDate.getFullYear()}`;
};

/**
 * Provide template for meeting details.
 *
 * @param  {string}   meetDate   The meet date
 * @param  {string}   venue      The venue
 * @param  {string}   after      The after party gathering place
 * @param  {string}   msgHeader  The message header (optional)
 * @param  {string}   meetTitle  The meet title (optional)
 * @param  {string}   meetUrl    The meet url (optional)
 *
 * @return {string}  Completed template
 */
module.exports = function meetupDetails(meetDate, venue, after, msgHeader, meetTitle, meetUrl) {
  const header = msgHeader || 'Meetup details';

  const meetHeader = meetTitle && meetUrl
    ? `<div class="title is-size-4">
        <a href="${meetUrl}">${meetTitle}</a>
      </div>`
    : '';

  const venueOrg = venue
    ? organizations[venue]
    : {};
  const venueLocation = venueOrg.location
    ? `<em>(${venueOrg.location})</em>`
    : '';

  const afterOrg = organizations[after];
  let afterBlock = '';

  if (afterOrg) {
    const afterName = afterOrg.url
      ? `<a href="${afterOrg.url}">${afterOrg.name}</a>`
      : afterOrg.name;

    afterBlock = `<p class="has-margin-top">
      Afterwards, the discussion carries on at
      <strong>${afterName}</strong>
      (${afterOrg.location}).
    </p>`;
  }

  return `<div class="message flex-item flex-item-0">
  <div class="message-header">
    ${header}
  </div>

  <div class="message-body">
    ${meetHeader}

    <div>
      DATE
      <span class="icon has-text-grey-dark">
        <ion-icon src="${pathPrefix}/assets/ionicon/calendar.svg"></ion-icon>
      </span>
      <time class="has-text-primary has-text-weight-bold" dateTime="${meetDate.toISOString().substring(0, 10)}">${fullDate(meetDate)}</time>
    </div>

    <div>
      TIME
      <span class="icon has-text-grey-dark">
        <ion-icon src="${pathPrefix}/assets/ionicon/alarm.svg"></ion-icon>
      </span>
      <time class="has-text-primary has-text-weight-bold" dateTime="15:30">7:30PM</time> -
      <time class="has-text-primary has-text-weight-bold" dateTime="21:00">9:00PM</time>
    </div>

    <div>
      LOCATION
      <span class="icon has-text-grey-dark">
        <ion-icon src="${pathPrefix}/assets/ionicon/location-sharp.svg"></ion-icon>
      </span>
      <strong class="has-text-primary">${venueOrg.name}</strong>
      ${venueLocation}
    </div>

    ${afterBlock}

    <p class="has-margin-top">
      Check back here or <a href="https://twitter.com/${siteData.author.twitter}">@${siteData.author.twitter} on Twitter</a> for updates.
    </p>
  </div>
</div>`;
};
