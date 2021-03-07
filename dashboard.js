// CNG 10:45 am CPT this was commented out, I uncommented it because we need it for auth
let db = firebase.firestore()

firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    // Signed in

    console.log('signed in')

    console.log(firebase.firestore.FieldValue.serverTimestamp())

    // Ensure the signed-in user is in the users collection
    db.collection('users').doc(user.uid).set({
      name: user.displayName,
      email: user.email
    })

    // Sign-out button
        document.querySelector('.sign-in-or-sign-out').innerHTML = `
        <div class="md:mx-0 mx-4"><span class="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Welcome ${user.displayName}!</span></div>
        <button class="text-pink-500 underline sign-out">Sign Out</button>
      `
    // Sign-out button event
      document.querySelector('.sign-out').addEventListener('click', function(event) {
        console.log('sign out clicked')
        firebase.auth().signOut()
        document.location.href = 'dashboard.html'
      })

    // Listen for the form submit and create/render the new tweet
    document.querySelector('form').addEventListener('submit', async function(event) {
        event.preventDefault()
        let tweetUsername = user.displayName
        let tweetText = document.querySelector('#tweet-text').value
        let tweetRating = 0
        let docRef = await db.collection('tweets').add({ 
          userId: user.uid,
          username: tweetUsername, 
          tweetText: tweetText,
          tweetTimeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          tweetRating: tweetRating
        })
        let tweetId = docRef.id // the newly created document's ID
        document.querySelector('#tweet-text').value = '' // clear the image url field
        renderTweet(tweetId, tweetUsername, tweetText, tweetRating) // , tweetTimeStamp isn't working for some reason
            console.log(tweetTimeStamp)
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

async function renderTweet(tweetId, tweetUsername, tweetText, tweetRating) //, tweetTimeStamp, tweetRating
{
    document.querySelector('.tweets').insertAdjacentHTML('beforeend', `
      <div class="tweet-${tweetId} md:mt-16 mt-8 space-y-8">
        <div class="md:mx-0 mx-4">
          <span>Tweeted by: ${tweetUsername}</span>
        </div>
    
        <div>
          <h1>${tweetText}</h1>
          <h2>This tweet has a rating of: </h2>
          <span class ="rating">${tweetRating}</span>
          <button class="rating-button">rate by clicking: ✅</button>
        </div>
    
        <div>
          <h3>this is where the tweet's timestamp should go</h3> 
        </div>
      </div>
    `)

    // this is where our rating button should eventually go
    document.querySelector(`.tweet-${tweetId} .rating-button`).addEventListener('click', async function(event) {
        event.preventDefault()
        console.log(`tweet ${tweetId} has been rated!`)
        let currentUserId = firebase.auth().currentUser.uid
    
        let querySnapshot = await db.collection('ratings')
          .where('tweetId', '==', tweetId)
          .where('userId', '==', currentUserId)
          .get()
    
        if (querySnapshot.size == 0) {
          await db.collection('ratings').add({
            tweetId: tweetId,
            userId: currentUserId
          })
          let existingRating = document.querySelector(`.tweet-${tweetId} .rating`).innerHTML
          let newRating = parseInt(existingRating) + 1 //this needs to change!
          document.querySelector(`.tweet-${tweetId} .rating`).innerHTML = newRating
        }
        
      })
}