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
       <div class="md:mx-0 mx-4"><span class="font-bold text-6xl center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Welcome ${user.displayName}!</span></div>
       `
      // document.querySelector('.topnav').insertAdjacentHTML = `
      //   
      //   `
    
    // Sign-out button event
      document.querySelector('.sign-out').addEventListener('click', function(event) {
        console.log('sign out clicked')
        firebase.auth().signOut()
        document.location.href = 'index.html'
      })

    // Listen for the form submit and create/render the new tweet
    document.querySelector('form').addEventListener('submit', async function(event) {
        event.preventDefault()
        let tweetUsername = user.displayName
        let tweetText = document.querySelector('#tweet-text').value        
        let response = await fetch ('/.netlify/functions/create_tweet', {
          method: 'POST',
          body: JSON.stringify({
            userId: user.uid,
            username: tweetUsername,
            content: tweetText, //content is replacement for imageURL       
          })
        })
        let tweet = await response.json()
        console.log(tweet)
        console.log(`New Tweet posted by ${tweet.username}`)
        // cng tweets are loading as null. changing from renderTweet to hardcoded
        document.querySelector('.tweets').insertAdjacentHTML('beforeend',`
        <div class="tweet-${tweet.id} md:mt-16 mt-8 space-y-8">
          <div class="md:mx-0 mx-4">
            <span class="font-bold text-5xl">${tweet.username}</span>
          </div>
            
                  

            <div class="border-double border-8 border-light-blue500 content text-2xl md:mx-0 mx-4 space-y-2">
              ${tweet.tweetText}
              <div class="content text-xl md:mx-0 mx-4 space-y-2">
              <br> <em> ${new Date().toLocaleDateString()} </em>          
            </div>    

            <div class="text-2xl md:mx-0 mx-4">
              <button class="like-button">❤️</button>
              <span class="likes">${tweet.likes}</span>              
            </div>
      
          <div class="text-2xl md:mx-0 mx-4">
            <br>           
            <small> <em> Flagged for Misinformation: </em> </small>
            <button class="misinfo-button"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS49nshYXDeQF7k_olZscagdY32oKdeOr80PA&usqp=CAU" width="20" height="20" border="0" alt="javascript button"></button>
            <span class="misinfo">0</span>      
          </div>
      
          <div class="text-2xl md:mx-0 mx-4">
            <br>
            <small> <em> Political Inclination: </em> </small>
            <button class="leftbias-button"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/DemocraticLogo.svg/1200px-DemocraticLogo.svg.png" width="20" height="20" border="0" alt="javascript button"></button>
            <span class="leftbias">0</span> &emsp; &emsp;
            <button class="rightbias-button"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Republicanlogo.svg/1200px-Republicanlogo.svg.png" width="20" height="20" border="0" alt="javascript button"></button>
            <span class="rightbias">0</span> &emsp; &emsp;   
            <button class="centrist-button"><img src="https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_nologo400/2185420/2185420-1596077813536-4c81345438e6f.jpg" width="20" height="20" border="0" alt="javascript button"></button>
            <span class="centrist">0 &emsp; &emsp; </span>
            <button class="biasunknown-button"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/200px-Question_mark_%28black%29.svg.png" width="20" height="20" border="0" alt="javascript button"></button>
            <span class="biasunknown">0</span>  
          </div>    
         
          <div class="COMMENTS md:mt-6 mt-6 space-y-2">
          <div class="md:mx-0 mx-6">
            <span class="font-bold text-xl">COMMENTS</span>
          </div>
      
          <div class="comments text-sm md:mx-0 mx-4 space-y-1">
            ${renderComments(tweet.comments)}
          </div>
          
          <div class="w-full md:mx-0 mx-4">
            ${renderCommentForm()}
          </div>
        </div>
      `)


        document.querySelector('#tweet-text').value = '' //clear the tweet text entry field
// BEGIN DUPLICATION OF CODE EXCEPT TWEETID == TWEET.ID
// BEGIN DUPLICATION OF CODE
// BEGIN DUPLICATION OF CODE
// BEGIN DUPLICATION OF CODE
// BEGIN DUPLICATION OF CODE
             // listen for the like button on this tweet
             let likeButton = document.querySelector(`.tweet-${tweet.id} .like-button`)
             likeButton.addEventListener('click', async function(event) {
               event.preventDefault()
               console.log(`tweet ${tweet.id} like button clicked!`)
               let currentUserId = firebase.auth().currentUser.uid
           
               let response = await fetch('/.netlify/functions/like', {
                 method: 'POST',
                 body: JSON.stringify({
                   tweetId: tweet.id,
                   userId: currentUserId
                 })
               })
               if (response.ok) {
                 let existingNumberOfLikes = document.querySelector(`.tweet-${tweet.id} .likes`).innerHTML
                 let newNumberOfLikes = parseInt(existingNumberOfLikes) + 1
                 document.querySelector(`.tweet-${tweet.id} .likes`).innerHTML = newNumberOfLikes
               }
             })

                    // listen for the misinfo button on this tweet
        let misinfoButton = document.querySelector(`.tweet-${tweet.id} .misinfo-button`)
        misinfoButton.addEventListener('click', async function(event) {
          event.preventDefault()
          console.log(`tweet ${tweet.id} misinfo button clicked!`)
          let currentUserId = firebase.auth().currentUser.uid
      
          let response = await fetch('/.netlify/functions/misinfo', {
            method: 'POST',
            body: JSON.stringify({
              tweetId: tweet.id,
              userId: currentUserId
            })
          })
      
        // add logic to delete a tweet if it gets at least 5 misinfo votes
          if (response.ok) {
            let existingNumberOfMisinfo = document.querySelector(`.tweet-${tweet.id} .misinfo`).innerHTML
            let newNumberOfMisinfo = parseInt(existingNumberOfMisinfo) + 1
            if (newNumberOfMisinfo < 5) {
              document.querySelector(`.tweet-${tweet.id} .misinfo`).innerHTML = newNumberOfMisinfo
            } else {
              // hide that bad boy
              document.querySelector(`.tweet-${tweet.id}`).innerHTML = ''
            }
            
          }
        })
      
      
        // listen for the leftbias button on this tweet
        let leftbiasButton = document.querySelector(`.tweet-${tweet.id} .leftbias-button`)
        leftbiasButton.addEventListener('click', async function(event) {
          event.preventDefault()
          console.log(`tweet ${tweet.id} leftbias button clicked!`)
          let currentUserId = firebase.auth().currentUser.uid
      
          let response = await fetch('/.netlify/functions/leftbias', {
            method: 'POST',
            body: JSON.stringify({
              tweetId: tweet.id,
              userId: currentUserId
            })
          })
          if (response.ok) {
            let existingNumberOfleftbias = document.querySelector(`.tweet-${tweet.id} .leftbias`).innerHTML
            let newNumberOfleftbias = parseInt(existingNumberOfleftbias) + 1
            document.querySelector(`.tweet-${tweet.id} .leftbias`).innerHTML = newNumberOfleftbias
          }
        })
      
        // listen for the rightbias button on this tweet
        let rightbiasButton = document.querySelector(`.tweet-${tweet.id} .rightbias-button`)
        rightbiasButton.addEventListener('click', async function(event) {
          event.preventDefault()
          console.log(`tweet ${tweet.id} rightbias button clicked!`)
          let currentUserId = firebase.auth().currentUser.uid
      
          let response = await fetch('/.netlify/functions/rightbias', {
            method: 'POST',
            body: JSON.stringify({
              tweetId: tweet.id,
              userId: currentUserId
            })
          })
          if (response.ok) {
            let existingNumberOfrightbias = document.querySelector(`.tweet-${tweet.id} .rightbias`).innerHTML
            let newNumberOfrightbias = parseInt(existingNumberOfrightbias) + 1
            document.querySelector(`.tweet-${tweet.id} .rightbias`).innerHTML = newNumberOfrightbias
          }
        })
      
        // listen for the centrist button on this tweet
        let centristButton = document.querySelector(`.tweet-${tweet.id} .centrist-button`)
        centristButton.addEventListener('click', async function(event) {
          event.preventDefault()
          console.log(`tweet ${tweet.id} centrist button clicked!`)
          let currentUserId = firebase.auth().currentUser.uid
      
          let response = await fetch('/.netlify/functions/centrist', {
            method: 'POST',
            body: JSON.stringify({
              tweetId: tweet.id,
              userId: currentUserId
            })
          })
          if (response.ok) {
            let existingNumberOfcentrist = document.querySelector(`.tweet-${tweet.id} .centrist`).innerHTML
            let newNumberOfcentrist = parseInt(existingNumberOfcentrist) + 1
            document.querySelector(`.tweet-${tweet.id} .centrist`).innerHTML = newNumberOfcentrist
          }
        })
      
        // listen for the biasunknown button on this tweet
        let biasunknownButton = document.querySelector(`.tweet-${tweet.id} .biasunknown-button`)
        biasunknownButton.addEventListener('click', async function(event) {
          event.preventDefault()
          console.log(`tweet ${tweet.id} biasunknown button clicked!`)
          let currentUserId = firebase.auth().currentUser.uid
      
          let response = await fetch('/.netlify/functions/biasunknown', {
            method: 'POST',
            body: JSON.stringify({
              tweetId: tweet.id,
              userId: currentUserId
            })
          })
          if (response.ok) {
            let existingNumberOfbiasunknown = document.querySelector(`.tweet-${tweet.id} .biasunknown`).innerHTML
            let newNumberOfbiasunknown = parseInt(existingNumberOfbiasunknown) + 1
            document.querySelector(`.tweet-${tweet.id} .biasunknown`).innerHTML = newNumberOfbiasunknown
          }
        })

                // listen for the post comment button on this tweet
                let tweetCommentButton = document.querySelector(`.tweet-${tweet.id} .tweet-comment-button`)
                tweetCommentButton.addEventListener('click', async function(event) {
                  event.preventDefault()
                  console.log(`tweet ${tweet.id} tweet comment button clicked!`)
              
                  // get the text of the comment
                  let tweetCommentInput = document.querySelector(`.tweet-${tweet.id} input`)
                  let newCommentText = tweetCommentInput.value
                  console.log(`comment: ${newCommentText}`)
              
                  // create a new Object to hold the comment's data
                  let newComment = {
                    tweetId: tweet.id,
                    username: firebase.auth().currentUser.displayName,
                    text: newCommentText
                  }
              
                  // call our back-end lambda using the new comment's data
                  await fetch('/.netlify/functions/create_comment', {
                    method: 'POST',
                    body: JSON.stringify(newComment) 
                  })
              
                  // insert the new comment into the DOM, in the div with the class name "comments", for this tweet
                  let commentsElement = document.querySelector(`.tweet-${tweet.id} .comments`)
                  commentsElement.insertAdjacentHTML('afterbegin', renderComment(newComment))
              
                  // clears the comment input
                  tweetCommentInput.value = ''
                })
             
//END DUPLICATION OF CODE
//END DUPLICATION OF CODE
//END DUPLICATION OF CODE
//END DUPLICATION OF CODE
//END DUPLICATION OF CODE
        })

      let response = await fetch('/.netlify/functions/get_tweets')
      let tweets = await response.json()
      console.log(tweets)
      for (let i=0; i<tweets.length; i++) {
        let tweet = tweets[i]
        renderTweet(tweet)
        console.log(tweet)
      }

      // render the tweets
      async function renderTweet(tweet) {
        console.log("in render tweet",tweet.content)
        let tweetId = tweet.id 
        console.log(tweet)
        // cng adding logic to check if the misinfo score is > 5
      
        if (tweet.misinfo < 5) { 
          document.querySelector('.tweets').insertAdjacentHTML('beforeend', `
          <div class="tweet-${tweetId} text-1xl md:mt-16 mt-8 space-y-8">
            <div class="md:mx-0 mx-4">
              <span class="font-bold text-2xl">${tweet.username}</span>
            </div>        
         
            <div class="border-double border-8 border-light-blue500 content text-2xl md:mx-0 mx-4 space-y-2">
              ${tweet.content}
              <div class="content text-xl md:mx-0 mx-4 space-y-2">
              <br> <em> ${new Date(tweet.created).toLocaleDateString()} </em>          
            </div>           

            <div class="text-1xl md:mx-0 mx-4">
              <button class="like-button">❤️</button>
              <span class="likes">${tweet.likes}</span>
              <br>
              <small> <em> Flagged for Misinformation: </em> </small>
              <button class="misinfo-button"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS49nshYXDeQF7k_olZscagdY32oKdeOr80PA&usqp=CAU" width="20" height="20" border="0" alt="javascript button"></button>
              <span class="misinfo">${tweet.misinfo}</span>      
              <br>
              <small> <em> Political Inclination: </em> </small>
              <button class="leftbias-button"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/DemocraticLogo.svg/1200px-DemocraticLogo.svg.png" width="20" height="20" border="0" alt="javascript button"></button>
              <span class="leftbias" style="color:blue;">${tweet.leftbias}</span> &emsp; &emsp;
              <button class="rightbias-button"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Republicanlogo.svg/1200px-Republicanlogo.svg.png" width="20" height="20" border="0" alt="javascript button"></button>
              <span class="rightbias" style="color:red;">${tweet.rightbias}</span> &emsp; &emsp; 
              <button class="centrist-button"><img src="https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_nologo400/2185420/2185420-1596077813536-4c81345438e6f.jpg" width="20" height="20" border="0" alt="javascript button"></button>
              <span class="centrist" style="color:green;">${tweet.centrist}</span> &emsp; &emsp;
              <button class="biasunknown-button"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/200px-Question_mark_%28black%29.svg.png" width="20" height="20" border="0" alt="javascript button"></button>
              <span class="biasunknown">${tweet.biasunknown}</span>  &emsp; &emsp;
            </div>    
                       
            <div class="md:mx-0 mx-6">
              <br>
              <span class="font-bold">COMMENTS</span>
            </div>
        
            <div class="comments text-sm md:mx-0 mx-4 space-y-1">
              ${renderComments(tweet.comments)}
            </div>
            
            <div class="w-full md:mx-0 mx-4">
              ${renderCommentForm()}
            </div>
          </div>
        `)
        } 
        // if we don't want to show the suspicous tweet, remove this portion and add logic to delete the tweet from firebase
        else {
          document.querySelector('.tweets').insertAdjacentHTML('beforeend', `
          <div class="tweet-${tweetId} md:mt-16 mt-8 space-y-8">
            <div class="md:mx-0 mx-4">
              <span class="font-bold text-2xl text-red-600">${tweet.username}</span>
            </div>        
     
            <div class="border-double border-8 border-light-blue500 content text-2xl md:mx-0 mx-4 space-y-2">
              ${tweet.content}
              <div class="content text-xl md:mx-0 mx-4 space-y-2">
              <br> <em> ${new Date(tweet.created).toLocaleDateString()} </em>          
            </div>  

            <div class="text-1xl md:mx-0 mx-4">
              <button class="like-button">❤️</button>
              <span class="likes">${tweet.likes}</span>
            </div>

            <div class="text-3xl md:mx-0 mx-4">
            <br>
            <button class="misinfo-button"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS49nshYXDeQF7k_olZscagdY32oKdeOr80PA&usqp=CAU" width="20" height="20" border="0" alt="javascript button"></button>
              <span class="misinfo">${tweet.misinfo}</span>
              <span>Suspicious Tweet, click to hide</span>      
            </div>

            <div class="text-1xl md:mx-0 mx-4">              
              <br>
              <small> <em> Political Inclination: </em> </small>
              <button class="leftbias-button"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/DemocraticLogo.svg/1200px-DemocraticLogo.svg.png" width="20" height="20" border="0" alt="javascript button"></button>
              <span class="leftbias" style="color:blue;">${tweet.leftbias}</span> &emsp; &emsp;
              <button class="rightbias-button"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Republicanlogo.svg/1200px-Republicanlogo.svg.png" width="20" height="20" border="0" alt="javascript button"></button>
              <span class="rightbias" style="color:red;">${tweet.rightbias}</span> &emsp; &emsp; 
              <button class="centrist-button"><img src="https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_nologo400/2185420/2185420-1596077813536-4c81345438e6f.jpg" width="20" height="20" border="0" alt="javascript button"></button>
              <span class="centrist" style="color:green;">${tweet.centrist}</span> &emsp; &emsp;
              <button class="biasunknown-button"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/200px-Question_mark_%28black%29.svg.png" width="20" height="20" border="0" alt="javascript button"></button>
              <span class="biasunknown">${tweet.biasunknown}</span>  &emsp; &emsp;
            </div>                                     
        
          
            <div class="md:mx-0 mx-6">
              <br>
              <span class="font-bold">COMMENTS</span>
            </div>
        
            <div class="comments text-sm md:mx-0 mx-4 space-y-1">
              ${renderComments(tweet.comments)}
            </div>
            
            <div class="w-full md:mx-0 mx-4">
              ${renderCommentForm()}
            </div>
          </div>
        `)
        }
      
      
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
      
        // add logic to hide a tweet if it gets at least 5 misinfo votes
          if (response.ok) {
            let existingNumberOfMisinfo = document.querySelector(`.tweet-${tweetId} .misinfo`).innerHTML
            let newNumberOfMisinfo = parseInt(existingNumberOfMisinfo) + 1
            if (newNumberOfMisinfo < 5) {
              document.querySelector(`.tweet-${tweetId} .misinfo`).innerHTML = newNumberOfMisinfo
            } else {
              // hide that bad boy
              document.querySelector(`.tweet-${tweetId}`).innerHTML = ''
            }
            
          }
        })
      
      
        // listen for the leftbias button on this tweet
        let leftbiasButton = document.querySelector(`.tweet-${tweetId} .leftbias-button`)
        leftbiasButton.addEventListener('click', async function(event) {
          event.preventDefault()
          console.log(`tweet ${tweetId} leftbias button clicked!`)
          let currentUserId = firebase.auth().currentUser.uid
      
          let response = await fetch('/.netlify/functions/leftbias', {
            method: 'POST',
            body: JSON.stringify({
              tweetId: tweetId,
              userId: currentUserId
            })
          })
          if (response.ok) {
            let existingNumberOfleftbias = document.querySelector(`.tweet-${tweetId} .leftbias`).innerHTML
            let newNumberOfleftbias = parseInt(existingNumberOfleftbias) + 1
            document.querySelector(`.tweet-${tweetId} .leftbias`).innerHTML = newNumberOfleftbias
          }
        })
      
        // listen for the rightbias button on this tweet
        let rightbiasButton = document.querySelector(`.tweet-${tweetId} .rightbias-button`)
        rightbiasButton.addEventListener('click', async function(event) {
          event.preventDefault()
          console.log(`tweet ${tweetId} rightbias button clicked!`)
          let currentUserId = firebase.auth().currentUser.uid
      
          let response = await fetch('/.netlify/functions/rightbias', {
            method: 'POST',
            body: JSON.stringify({
              tweetId: tweetId,
              userId: currentUserId
            })
          })
          if (response.ok) {
            let existingNumberOfrightbias = document.querySelector(`.tweet-${tweetId} .rightbias`).innerHTML
            let newNumberOfrightbias = parseInt(existingNumberOfrightbias) + 1
            document.querySelector(`.tweet-${tweetId} .rightbias`).innerHTML = newNumberOfrightbias
          }
        })
      
        // listen for the centrist button on this tweet
        let centristButton = document.querySelector(`.tweet-${tweetId} .centrist-button`)
        centristButton.addEventListener('click', async function(event) {
          event.preventDefault()
          console.log(`tweet ${tweetId} centrist button clicked!`)
          let currentUserId = firebase.auth().currentUser.uid
      
          let response = await fetch('/.netlify/functions/centrist', {
            method: 'POST',
            body: JSON.stringify({
              tweetId: tweetId,
              userId: currentUserId
            })
          })
          if (response.ok) {
            let existingNumberOfcentrist = document.querySelector(`.tweet-${tweetId} .centrist`).innerHTML
            let newNumberOfcentrist = parseInt(existingNumberOfcentrist) + 1
            document.querySelector(`.tweet-${tweetId} .centrist`).innerHTML = newNumberOfcentrist
          }
        })
      
        // listen for the biasunknown button on this tweet
        let biasunknownButton = document.querySelector(`.tweet-${tweetId} .biasunknown-button`)
        biasunknownButton.addEventListener('click', async function(event) {
          event.preventDefault()
          console.log(`tweet ${tweetId} biasunknown button clicked!`)
          let currentUserId = firebase.auth().currentUser.uid
      
          let response = await fetch('/.netlify/functions/biasunknown', {
            method: 'POST',
            body: JSON.stringify({
              tweetId: tweetId,
              userId: currentUserId
            })
          })
          if (response.ok) {
            let existingNumberOfbiasunknown = document.querySelector(`.tweet-${tweetId} .biasunknown`).innerHTML
            let newNumberOfbiasunknown = parseInt(existingNumberOfbiasunknown) + 1
            document.querySelector(`.tweet-${tweetId} .biasunknown`).innerHTML = newNumberOfbiasunknown
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
          commentsElement.insertAdjacentHTML('afterbegin', renderComment(newComment))
      
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
          <button class="tweet-comment-button py-2 px-4 rounded-md shadow-sm font-medium text-white bg-purple-600 focus:outline-none">Comment</button>
        `
        return commentForm
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
