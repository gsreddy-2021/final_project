// /.netlify/functions/rightbias
let firebase = require('./firebase')

exports.handler = async function(event) {
  let db = firebase.firestore()
  let body = JSON.parse(event.body)
  let tweetId = body.tweetId
  let userId = body.userId
    
  console.log(`tweet: ${tweetId}`)
  console.log(`user: ${userId}`)
  


  let querySnapshot = await db.collection('rightbias')
                              .where('tweetId', '==', tweetId)
                              .where('userId', '==', userId)
                              .get()
  let numberOfrightbias = querySnapshot.size

  if (numberOfrightbias == 0) {
    await db.collection('rightbias').add({
      tweetId: tweetId,
      userId: userId      
    })
    return { statusCode: 200 }
  } else {
    return { statusCode: 403 }
  }

}