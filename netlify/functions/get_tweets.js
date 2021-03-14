// /.netlify/functions/get_tweets
let firebase = require('./firebase')

exports.handler = async function(event) {
  let db = firebase.firestore()                             // define a variable so we can use Firestore
  let tweetsData = []                                       // an empty Array
  
  let tweetsQuery = await db.collection('tweets')           // tweets from Firestore
                           .orderBy('created')              // ordered by created
                           .get()
  let tweets = tweetsQuery.docs                             // the tweet documents themselves
  console.log(tweets)

  // loop through the tweet documents
  for (let i=0; i<tweets.length; i++) {
    let tweetId = tweets[i].id                               // the ID for the given tweet
    let tweetData = tweets[i].data()                         // the rest of the tweet data
    let likesQuery = await db.collection('likes')            // likes from Firestore
                             .where('tweetId', '==', tweetId) // for the given tweetId
                             .get()
    let misinfoQuery = await db.collection('misinfo')         // misinfo from Firestore
                             .where('tweetId', '==', tweetId) // for the given tweetId
                             .get()
    let leftbiasQuery = await db.collection('leftbias')       // leftbias from Firestore
                             .where('tweetId', '==', tweetId) // for the given tweetId
                             .get()
    let rightbiasQuery = await db.collection('rightbias')     // rightbias from Firestore
                             .where('tweetId', '==', tweetId) // for the given tweetId
                             .get()
    let centristQuery = await db.collection('centrist')       // centrist from Firestore
                             .where('tweetId', '==', tweetId) // for the given tweetId
                             .get()
    let biasunknownQuery = await db.collection('biasunknown') // biasunknown from Firestore
                             .where('tweetId', '==', tweetId) // for the given tweetId
                             .get()
    let commentsQuery = await db.collection('comments')       // comments from Firestore
                             .where('tweetId', '==', tweetId) // for the given tweetId
                             .get()
    let commentsData = []                                   // an empty Array
    let comments = commentsQuery.docs                       // the comments documents

    // loop through the comment documents
    for (let i=0; i<comments.length; i++) {
      let comment = comments[i].data()                      // grab the comment data
      commentsData.push({
        username: comment.username,                         // the author of the comment
        text: comment.text                                  // the comment text
      })
    }

    // add a new Object of our own creation to the tweetsData Array
    tweetsData.push({
      id: tweetId,                                            // the tweet ID
      created: tweetData.created.toDate(),                             // Timestamp
      content: tweetData.tweetText,                           // the tweet text
      username: tweetData.username,                           // the username
      likes: likesQuery.size,                                 // number of likes
      misinfo: misinfoQuery.size,                             // number of misinfo
      leftbias: leftbiasQuery.size,                           // number of leftbias
      rightbias: rightbiasQuery.size,                        // number of rightbias
      centrist: centristQuery.size,                           // number of centrist
      biasunknown: biasunknownQuery.size,                     // number of biasunknown
      comments: commentsData                                  // an Array of comments
    })
  }
  
  // return an Object in the format that a Netlify lambda function expects
  return {
    statusCode: 200,
    body: JSON.stringify(tweetsData)
  }
}