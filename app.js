const CLIENT_ID = '611465291366-4drcbtcvi06gdv242ivv3pbmqqtn338m.apps.googleusercontent.com';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
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
  if (isSignedIn) {
    // Fetch reservation data and render the calendar
  } else {
    // Show a sign-in button or prompt the user to sign in
  }
}

function handleSignInClick() {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick() {
  gapi.auth2.getAuthInstance().signOut();
}

window.addEventListener('DOMContentLoaded', handleClientLoad);
