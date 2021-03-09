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
        let tweetTimeStamp = firebase.firestore.FieldValue.serverTimestamp()
        let tweetTimeStampDatenTime = new Date() //This resolved the timestamp issue
        let docRef = await db.collection('tweets').add({ 
          userId: user.uid,
          username: tweetUsername, 
          tweetText: tweetText,
          tweetTimeStamp: tweetTimeStamp,          
          tweetRating: tweetRating
        })
        let tweetId = docRef.id // the newly created document's ID
        console.log(`new tweet posted by ${tweetUsername}`)

        document.querySelector('#tweet-text').value = '' // clear the image url field
        renderTweet(tweetId, tweetUsername, tweetText, tweetRating, tweetTimeStampDatenTime) // , I added tweetTimeStampDatenTime and it worked
            console.log(tweetTimeStamp)
      })

      //let querySnapshot = await db.collection('tweets').where('userId', '==', user.uid).get()
      let querySnapshot = await db.collection('tweets').get()
      console.log(`Number of tweets by user : ${querySnapshot.size}`)

      // tried to show the tweets from the account
      let tweets = querySnapshot.docs
      for (let i=0; i<tweets.length; i++) {
        let tweetId = tweets[i].id
        let tweet = tweets[i].data()
        let tweetText = tweet.text

        document.querySelector('.tweets').insertAdjacentHTML('beforeend', `
        <div class="todo-${tweetId} py-4 text-xl border-b-2 border-purple-500 w-full">
          <a href="#" class="done p-2 text-sm bg-green-500 text-white">✓</a>
          ${tweet}, <br> ${tweetId} 
          </div>
         `)       
      }
 

  } else {
    // Signed out
    console.log('signed out')

    // Hide the form when signed-out
   document.querySelector('form').classList.add('hidden')

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

async function renderTweet(tweetId, tweetUsername, tweetText, tweetRating, tweetTimeStamp) {
    document.querySelector('.tweets').insertAdjacentHTML('beforeend', `
      <div class="tweet-${tweetId} md:mt-16 mt-8 space-y-8" style="background-color:DeepSkyBlue;">
        <div class="md:mx-0 mx-4">
          <span>Tweeted by: ${tweetUsername}</span>
        </div>
    
        <div>
          <h1>${tweetText}</h1>
          <h2> <br> This tweet has a rating of: <span class ="rating">${tweetRating}</span> </h2>
          <button class="rating-button">rate by clicking: ✅</button>
        </div>
    
        <div>
          <h3>Tweet Timestamp: ${tweetTimeStamp}</h3> 
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