//let db = firebase.firestore()


firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    // Signed in

    
    console.log('signed in')

    // Ensure the signed-in user is in the users collection
    db.collection('users').doc(user.uid).set({
      name: user.displayName,
      email: user.email
    })

        // Sign-out button
        document.querySelector('.sign-in-or-sign-out').innerHTML = `
        <button class="text-pink-500 underline sign-out">Sign Out</button>
      `
      //Sing-out button event
      document.querySelector('.sign-out').addEventListener('click', function(event) {
        console.log('sign out clicked')
        firebase.auth().signOut()
        document.location.href = 'index.html'
      })

  } else {
    // Signed out
    console.log('signed out')

    // Hide the form when signed-out
   // document.querySelector('form').classList.add('hidden')

    // Initializes FirebaseUI Auth
    let ui = new firebaseui.auth.AuthUI(firebase.auth())

    // FirebaseUI configuration
    let authUIConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: 'index.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)

 
  }
})
