// /.netlify/functions/political
let firebase = require('./firebase')

exports.handler = async function(event) {
  let db = firebase.firestore()
  let body = JSON.parse(event.body)
  let tweetId = body.tweetId
  let userId = body.userId
  
  console.log(`tweet: ${tweetId}`)
  console.log(`user: ${userId}`)

  let querySnapshot = await db.collection('political')
                              .where('tweetId', '==', tweetId)
                              .where('userId', '==', userId)
                              .get()
  let numberOfpolitical = querySnapshot.size

  if (numberOfpolitical == 0) {
    await db.collection('political').add({
      tweetId: tweetId,
      userId: userId
    })
    return { statusCode: 200 }
  } else {
    return { statusCode: 403 }
  }

}