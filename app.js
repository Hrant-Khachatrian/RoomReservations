const CLIENT_ID = '611465291366-4drcbtcvi06gdv242ivv3pbmqqtn338m.apps.googleusercontent.com';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

function handleClientLoad() {
  window.google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse,
    auto_select: false,
  });

  window.google.accounts.id.renderButton(
    document.getElementById('sign-in'),
    {
      theme: 'outline',
      size: 'large',
      width: 250,
      height: 50,
      on_click: requestPermission,
    }
  );

  gapi.load('client', initClient);
}

function requestPermission() {
  window.google.accounts.id.prompt();
}

function handleCredentialResponse(response) {
  gapi.auth.setToken({ access_token: response.credential });
  onSignIn();
}

function onSignIn(googleUser) {
  gapi.auth2.getAuthInstance().isSignedIn.set(true);
  updateSigninStatus(true);
}


function initClient() {
  gapi.client.init({
    clientId: CLIENT_ID,
    scope: SCOPE,
  }).then(() => {
    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
  });
}

function updateSigninStatus(isSignedIn) {
  const signInButton = document.getElementById('sign-in');
  const signOutButton = document.getElementById('sign-out');

  if (isSignedIn) {
    signInButton.style.display = 'none';
    signOutButton.style.display = 'block';

    getReservations().then((response) => {
      const reservations = response.result.values || [];
      renderCalendar(reservations);
    });
  } else {
    signInButton.style.display = 'block';
    signOutButton.style.display = 'none';
  }
}



function handleSignInClick() {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick() {
  gapi.auth2.getAuthInstance().signOut();
}

function getReservations() {
  return gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '16-gav0GfAirJMCCTunUNJsH-eEbUfT88amMhwPzVmjk',
    range: 'Reservations!A2:F',
  });
}

function renderCalendar(reservations) {
  const calendarElement = document.getElementById('calendar');

  // Clear the calendar element to re-render it
  calendarElement.innerHTML = '';

  // Convert the reservations array to an event array
  const events = reservations.map(reservation => ({
    title: reservation[1],
    start: reservation[2],
    end: reservation[3],
    room: reservation[4],
    user: reservation[5],
  }));

  // Initialize FullCalendar and render the calendar
  $(calendarElement).fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    defaultView: 'month',
    events: events,
  });
}

function submitReservation(event) {
  event.preventDefault();

  const room = document.getElementById('room').value;
  const eventName = document.getElementById('event-name').value;
  const startTime = document.getElementById('start-time').value;
  const endTime = document.getElementById('end-time').value;
  const userEmail = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();

  const newReservation = [room, eventName, startTime, endTime, userEmail];

  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: '16-gav0GfAirJMCCTunUNJsH-eEbUfT88amMhwPzVmjk',
    range: 'Reservations!A:F',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    values: [newReservation],
  }).then(() => {
    // Clear the form and fetch updated reservation data
    document.getElementById('reservation-form').reset();
    getReservations().then((response) => {
      const reservations = response.result.values || [];
      renderCalendar(reservations);
    });
  });
}



window.addEventListener('DOMContentLoaded', handleClientLoad);
