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
      //  let tweetRating = 0
      //  let tweetTimeStamp = firebase.firestore.FieldValue.serverTimestamp()
      //  let tweetTimeStampDatenTime = new Date() //This resolved the timestamp issue
        let response = await fetch ('/.netlify/functions/create_tweet', {
          method: 'POST',
          body: JSON.stringify({
            userId: user.uid,
            username: tweetUsername,
            content: tweetText, //replacement for imageURL
        //    tweetTimeStamp: tweetTimeStamp,
        //    tweetRating: tweetRating
          })
        })
        let tweet = await response.json()
        console.log(`New Tweet posted by ${username}`)
        console.log(`${content}`)
        document.querySelector('#content-text').value = '' //clear the tweet text entry field
        renderTweet(tweet)
      })

      let response = await fetch('/.netlify/functions/get_tweets')
      let tweets = await response.json()
      for (let i=0; i<tweets.length; i++) {
        let tweet = tweets[i]
        renderTweet(tweet)
      }

    } else {
      //Signed out
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

// given a single tweet Object, render the HTML and attach event listeners
// expects an Object that looks similar to:
// {
//   id: 'abcdefg',
//   username: 'brian',
//   tweet: 'I like GME a lot...',
//   likes: 12,
//   Misinformation ranking: 1,
//   Political Bias: 2,
//   comments: [
//     { username: 'brian', text: 'i love tacos!' },
//     { username: 'ben', text: 'fake news' }
//   ]
// }

let tweets = response.json() // Added to test if the tweet is undefined error goes away

async function renderTweet(tweet) {
  let tweetId = tweet.id 
  console.log(${tweetId})
  document.querySelector('.tweets').insertAdjacentHTML('beforeend', `
  <div class="tweet-${tweetId} md:mt-16 mt-8 space-y-8">
    <div class="md:mx-0 mx-4">
      <span class="font-bold text-xl">${tweet.username}</span>
    </div>

    <div class="comments text-sm md:mx-0 mx-4 space-y-2">
      ${renderTweet(tweet.content)}
    </div>

    <div class="text-3xl md:mx-0 mx-4">
      <button class="like-button">❤️</button>
      <span class="likes">${tweet.likes}</span>
    </div>

    <div class="text-3xl md:mx-0 mx-4">
      <button class="misinfo-button">✅</button>
      <span class="misinfo">${tweet.misinfo}</span>
    </div>

    <div class="text-3xl md:mx-0 mx-4">
      <button class="political-button">🍕</button>
      <span class="political">${tweet.political}</span>
    </div>

    <div class="comments text-sm md:mx-0 mx-4 space-y-2">
      ${renderComments(tweet.comments)}
    </div>

    <div class="w-full md:mx-0 mx-4">
      ${renderCommentForm()}
    </div>
  </div>
`)

// listen for the like button on this tweet
  let likeButton = document.querySelector(`.tweet-${tweetId} .like-button`)
  likeButton.addEventListener('click', async function(event) {
    event.preventDefault()
    console.log(`tweet ${tweetId} like button clicked!`)
    let currentUserId = firebase.auth().currentUser.uid

    let response = await fetch('/.netlify/functions/like', {
      method: 'POST',
      body: JSON.stringify({
        tweetId: tweetId,
        userId: currentUserId
      })
    })
    if (response.ok) {
      let existingNumberOfLikes = document.querySelector(`.tweet-${tweetId} .likes`).innerHTML
      let newNumberOfLikes = parseInt(existingNumberOfLikes) + 1
      document.querySelector(`.tweet-${tweetId} .likes`).innerHTML = newNumberOfLikes
    }
  })

  // listen for the misinfo button on this tweet
  let misinfoButton = document.querySelector(`.tweet-${tweetId} .misinfo-button`)
  misinfoButton.addEventListener('click', async function(event) {
    event.preventDefault()
    console.log(`tweet ${tweetId} misinfo button clicked!`)
    let currentUserId = firebase.auth().currentUser.uid

    let response = await fetch('/.netlify/functions/misinfo', {
      method: 'POST',
      body: JSON.stringify({
        tweetId: tweetId,
        userId: currentUserId
      })
    })
    if (response.ok) {
      let existingNumberOfMisinfo = document.querySelector(`.tweet-${tweetId} .misinfo`).innerHTML
      let newNumberOfMisinfo = parseInt(existingNumberOfMisinfo) + 1
      document.querySelector(`.tweet-${tweetId} .misinfo`).innerHTML = newNumberOfMisinfo
    }
  })


  // listen for the political button on this tweet
  let politicalButton = document.querySelector(`.tweet-${tweetId} .political-button`)
  politicalButton.addEventListener('click', async function(event) {
    event.preventDefault()
    console.log(`tweet ${tweetId} political button clicked!`)
    let currentUserId = firebase.auth().currentUser.uid

    let response = await fetch('/.netlify/functions/political', {
      method: 'POST',
      body: JSON.stringify({
        tweetId: tweetId,
        userId: currentUserId
      })
    })
    if (response.ok) {
      let existingNumberOfPolitical = document.querySelector(`.tweet-${tweetId} .political`).innerHTML
      let newNumberOfPolitical = parseInt(existingNumberOfPolitical) + 1
      document.querySelector(`.tweet-${tweetId} .political`).innerHTML = newNumberOfPolitical
    }
  })

  // listen for the post comment button on this tweet
  let tweetCommentButton = document.querySelector(`.tweet-${tweetId} .tweet-comment-button`)
  tweetCommentButton.addEventListener('click', async function(event) {
    event.preventDefault()
    console.log(`tweet ${tweetId} tweet comment button clicked!`)

    // get the text of the comment
    let tweetCommentInput = document.querySelector(`.tweet-${tweetId} input`)
    let newCommentText = tweetCommentInput.value
    console.log(`comment: ${newCommentText}`)

    // create a new Object to hold the comment's data
    let newComment = {
      tweetId: tweetId,
      username: firebase.auth().currentUser.displayName,
      text: newCommentText
    }

    // call our back-end lambda using the new comment's data
    await fetch('/.netlify/functions/create_comment', {
      method: 'POST',
      body: JSON.stringify(newComment)
    })

    // insert the new comment into the DOM, in the div with the class name "comments", for this tweet
    let commentsElement = document.querySelector(`.tweet-${tweetId} .comments`)
    commentsElement.insertAdjacentHTML('beforeend', renderComment(newComment))

    // clears the comment input
    tweetCommentInput.value = ''
  })
}

// given an Array of comment Objects, loop and return the HTML for the comments
function renderComments(comments) {
  if (comments) {
    let markup = ''
    for (let i = 0; i < comments.length; i++) {
      markup += renderComment(comments[i])
    }
    return markup
  } else {
    return ''
  }
}

// return the HTML for one comment, given a single comment Object
function renderComment(comment) {
  return `<div><strong>${comment.username}</strong> ${comment.text}</div>`
}

// return the HTML for the new comment form
function renderCommentForm() {
  let commentForm = ''
  commentForm = `
    <input type="text" class="mr-2 rounded-lg border px-3 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="Add a comment...">
    <button class="tweet-comment-button py-2 px-4 rounded-md shadow-sm font-medium text-white bg-purple-600 focus:outline-none">tweet</button>
  `
  return commentForm
}







//         let docRef = await db.collection('tweets').add({ 
//           userId: user.uid,
//           username: tweetUsername, 
//           tweetText: tweetText,
//           tweetTimeStamp: tweetTimeStamp,          
//           tweetRating: tweetRating
//         })
//         let tweetId = docRef.id // the newly created document's ID
//         console.log(`new tweet posted by ${tweetUsername}`)
//         console.log(`${tweetText}`)

//         document.querySelector('#tweet-text').value = '' // clear the image url field

//         renderTweet(tweetId, tweetUsername, tweetText, tweetRating, tweetTimeStampDatenTime) // , I added tweetTimeStampDatenTime and it worked
//             console.log(tweetTimeStamp)
//       })

//       //let querySnapshot = await db.collection('tweets').where('userId', '==', user.uid).get()
//       let querySnapshot = await db.collection('tweets').get()
//       console.log(`Number of tweets by user : ${querySnapshot.size}`)

//       // tried to show the tweets from the account
//       let tweets = querySnapshot.docs
//       for (let i=0; i<tweets.length; i++) {
//         let tweetId = tweets[i].id
//         let tweet = tweets[i].data()        
//         //let tweet = tweets[i]
//         //let docRef = await db.collection('tweets').doc(`${user.id}`).get()
//         let tweetText = tweet

//         console.log(`${tweetText}`)
//         // 
//         document.querySelector('.tweets').insertAdjacentHTML('beforeend', `
//         <div class="w-1/5 p-8 tweet-${tweets.id} py-4 text-xl border-b-2 border-purple-500 w-full">
//         ${tweet}, <br> ${tweetId}, <br>      
//           <a href="#" class="done p-2 text-sm bg-green-500 text-white"> ✓ </a>             
//         </div>            
//          `)       
//       }

//   } else {
//     // Signed out
//     console.log('signed out')

//     // Hide the form when signed-out
//    document.querySelector('form').classList.add('hidden')

//     // Initializes FirebaseUI Auth
//     let ui = new firebaseui.auth.AuthUI(firebase.auth())

//     // FirebaseUI configuration
//     let authUIConfig = {
//       signInOptions: [
//         firebase.auth.EmailAuthProvider.PROVIDER_ID
//       ],
//       signInSuccessUrl: 'index.html'
//     }

//     // Starts FirebaseUI Auth
//     ui.start('.sign-in-or-sign-out', authUIConfig)
//   }
// })

// async function renderTweet(tweetId, tweetUsername, tweetText, tweetRating, tweetTimeStamp) {
//     document.querySelector('.tweets').insertAdjacentHTML('beforeend', `
//       <div class="tweet-${tweetId} md:mt-16 mt-8 space-y-8" style="background-color:DeepSkyBlue;">
//         <div class="md:mx-0 mx-4">
//           <span>Tweeted by: ${tweetUsername}</span>
//         </div>
    
//         <div>
//           <h1>${tweetText}</h1>
//           <h2> <br> This tweet has a rating of: <span class ="rating">${tweetRating}</span> </h2>
//           <button class="rating-button">rate by clicking: ✅</button>
//         </div>
    
//         <div>
//           <h3>Tweet Timestamp: ${tweetTimeStamp}</h3> 
//         </div>
//       </div>
//     `)

//     // this is where our rating button should eventually go
//     document.querySelector(`.tweet-${tweetId} .rating-button`).addEventListener('click', async function(event) {
//         event.preventDefault()
//         console.log(`tweet ${tweetId} has been rated!`)
//         let currentUserId = firebase.auth().currentUser.uid
    
//         let querySnapshot = await db.collection('ratings')
//           .where('tweetId', '==', tweetId)
//           .where('userId', '==', currentUserId)
//           .where('username', '==', tweetUsername)
//           .get()
    
//         if (querySnapshot.size == 0) {
//           await db.collection('ratings').add({
//             tweetId: tweetId,
//             userId: currentUserId,
//             username: tweetUsername
//           })
//           let existingRating = document.querySelector(`.tweet-${tweetId} .rating`).innerHTML
//           let newRating = parseInt(existingRating) + 1 //this needs to change!
//           document.querySelector(`.tweet-${tweetId} .rating`).innerHTML = newRating
//         }
        
//       })
// }

// // given an Array of comment Objects, loop and return the HTML for the comments
// // function renderTweets(tweets) {
// //   if (tweets) {
// //     let markup = ''
// //     for (let i = 0; i < tweets.length; i++) {
// //       markup += renderComment(tweets[i])
// //     }
// //     return markup
// //   } else {
// //     return ''
// //   }
// // }
