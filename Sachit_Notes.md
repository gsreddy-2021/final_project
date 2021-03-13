# 13 March 2021

> Dashboard.html and Index.html (Sign in and Sign out)
1. When we click on https://elated-jang-b06bff.netlify.app/ it takes us to the index.html page. Here it shows the log out button, I commented it out.
2. After I login it shows me Welcome "Username" and "signout button". I had to click on "Home" button in top navbar to see the tweets. I fixed it by changing line on index.js from "signInSuccessUrl: 'index.html'" to "signInSuccessUrl: 'dashboard.html'"
3. If user was to signout, they had to click on "Log Out" on the top nav bar and then it takes them to "index.html" which shows "Welcome XXXX" with a "Sign Out" button. On Dashboard.js I added "button class="text-pink-500 underline sign-out">Sign Out< /button" to the signout button and uncommented the signout button event code. 
4. We need to fix the styling of the signout button here later.


# 9 March 2021
> I tried converting everything to the kelloggram approach to test

> Netlify functions (create_comments, create_tweet, get_tweets, like, misinfo, political) were added

> Dashboard.html
1. Commented out a significant portion of the code to recode aligning with class Kelloggram structure


# 8 March 2021
> Session xx:00 pm

> index.html
1. Changed title from "Final" to "Disrupt Twitter"

> dashboard.js
1. Fixed the Timestamp issue by using another variable "tweetTimeStampDatenTime"
2. Added a style element for ease for visibility between 2 tweets *div class="tweet-${tweetId} md:mt-16 mt-8 space-y-8" style="background-color:DeepSkyBlue;"*
3. Tried to show tweets from account after signing out and signing back in. I am able to list a few attributes but can't figure out what the issue is that is stopping me from listing the tweet content, tweet timestamp, etc.


# 6 March 2021
> Session xx:00 am
1. KIEI451 Final should be the project name on our Firebase console.
2. I created a firebase database (see Build > Cloud Firestore) in test mode and location nam5.
3. Added the following files: icons (to store our icons n images), twitter.css to store the styling, scoring.html for saying a few lines on scoring, about.html to say a few files on us.

> Firebase.js
1. Added firebase config to firebase.js.

> index.html
1. Used this (https://www.w3schools.com/howto/howto_js_topnav.asp) to build navigation bar 
2. Added div class="topnav">
3. Added link type="text/css" rel="stylesheet" href="twitter.css" /> for css tied to the topnav

> twitter.css
1. Added a twitter.css file for us to put styling elements in the page
2. TODO: Need to add styling colors from here: https://brandpalettes.com/twitter-colors/

> Scoring, About.html
1. TODO: Need to update these later

> Tips:
1. CTRL + Shift + V will show dynamic preview. Cool feature.





