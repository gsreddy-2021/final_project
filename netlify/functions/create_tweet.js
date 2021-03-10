// /.netlify/functions/create_tweet
let firebase = require('./firebase')

exports.handler = async function(event) {
  let db = firebase.firestore()
  let body = JSON.parse(event.body)
  let userId = body.userId
  let username = body.username
  let content = body.contnt
  
  console.log(`user: ${userId}`)
  console.log(`tweetText: ${content}`)

  let newPost = { 
    userId: userId,
    username: username, 
    content: tweetText, 
    created: firebase.firestore.FieldValue.serverTimestamp()
  }

  let docRef = await db.collection('tweets').add(newPost)
  newPost.id = docRef.id
  newPost.likes = 0

  return {
    statusCode: 200,
    body: JSON.stringify(newPost)
  }

}