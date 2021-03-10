// /.netlify/functions/misinfo
let firebase = require('./firebase')

exports.handler = async function(event) {
  let db = firebase.firestore()
  let body = JSON.parse(event.body)
  let tweetId = body.tweetId
  let userId = body.userId
  
  console.log(`tweet: ${tweetId}`)
  console.log(`user: ${userId}`)

  let querySnapshot = await db.collection('misinfo')
                              .where('tweetId', '==', tweetId)
                              .where('userId', '==', userId)
                              .get()
  let numberOfmisinfo = querySnapshot.size

  if (numberOfmisinfo == 0) {
    await db.collection('misinfo').add({
      tweetId: tweetId,
      userId: userId
    })
    return { statusCode: 200 }
  } else {
    return { statusCode: 403 }
  }

}