// /.netlify/functions/centrist
let firebase = require('./firebase')

exports.handler = async function(event) {
  let db = firebase.firestore()
  let body = JSON.parse(event.body)
  let tweetId = body.tweetId
  let userId = body.userId
    
  console.log(`tweet: ${tweetId}`)
  console.log(`user: ${userId}`)
  
//cng adding logic to check if a user has scored the bias
  let leftSnapshot = await db.collection('leftbias')
  .where('tweetId', '==', tweetId)
  .where('userId', '==', userId)
  .get()
  let numberOfleft = leftSnapshot.size

  let rightSnapshot = await db.collection('rightbias')
  .where('tweetId', '==', tweetId)
  .where('userId', '==', userId)
  .get()
  let numberOfright = rightSnapshot.size

  let centerSnapshot = await db.collection('centrist')
                              .where('tweetId', '==', tweetId)
                              .where('userId', '==', userId)
                              .get()
  let numberOfcentrist = centerSnapshot.size

  let unknownSnapshot = await db.collection('biasunknown')
  .where('tweetId', '==', tweetId)
  .where('userId', '==', userId)
  .get()
  let numberOfbiasunknown = unknownSnapshot.size

  let politiscore = numberOfleft + numberOfright + numberOfcentrist + numberOfbiasunknown

  if (politiscore == 0) {
    await db.collection('centrist').add({
      tweetId: tweetId,
      userId: userId      
    })
    return { statusCode: 200 }
  } else {
    return { statusCode: 403 }
  }

}