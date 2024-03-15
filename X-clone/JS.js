// import tweets data Object
import { tweetsData} from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


document.addEventListener('click', function(e){
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn') {
        handleTweetBtn()
    }else if(e.target.dataset.menu){
        CreateAndAppendOptionsAndSelectMenuWIthItems(e.target.dataset.menu,)
    }


    
})


function handleLikeClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}


function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render()
}

function handleReplyClick(replyId){
    document.getElementById(`${replyId}`).classList.toggle('hidden')
}



    const ArrayOptions = [ "Actions", "Delete", "Reply"]


const tweetInput = document.getElementById('tweet-input')
function CreateAndAppendOptionsAndSelectMenuWIthItems(menuId) {

    const SelectLocation = document.getElementById(`menu-${menuId}`)
    const SelectList = document.createElement("select")

    //SelectList.setAttribute("id", "mySelect")

    SelectList.id = "mySelect"
    SelectList.classList = "MenuOptions"
    SelectLocation.append(SelectList)


    ArrayOptions.forEach(function (OptionItem) {
        const option = document.createElement("option")
        //option.setAttribute("Value", OptionItem)
        option.id = menuId
        option.value = OptionItem
        option.text = OptionItem
        SelectList.append(option)

    })

    SelectList.addEventListener("change", function () {

        if (SelectList.value === 'Delete') {
            let selectedTweet = SelectList.options[SelectList.selectedIndex].id

            let index = tweetsData.findIndex(tweet => tweet.uuid === selectedTweet)

            if (index !== -1) {
                tweetsData.splice(index, 1);
                render()
            }


        } else if (SelectList.value === 'Reply' && tweetInput.value  ) {

            const ReplyObj = {
                handle: `@user`,
                profilePic: `Assets/doge_meme_PNG16.png`,
                tweetText: tweetInput.value
            }
            tweetInput.value = ''
            // Get the matching array
            const replyObj = tweetsData.filter(tweet => tweet.uuid === menuId)
            //iterate over that object to access the array
            replyObj.forEach(arrayItem => {
                arrayItem.replies.push(ReplyObj)
                render()

            })

        }
    })
}


    function handleTweetBtn() {

        if (tweetInput.value) {

            const NewTweet = {
                handle: `@user`,
                profilePic: `Assets/doge_meme_PNG16.png`,
                likes: 0,
                retweets: 0,
                tweetText: tweetInput.value,
                replies: [],
                isLiked: false,
                isRetweeted: false,
                uuid: uuidv4()
            }

            tweetsData.unshift(NewTweet)
            render()
            tweetInput.value = ''

        }
    }





    function getFeedHtml() {
        let feedHtml = ``

        tweetsData.forEach(function (tweet) {

            let likeIconClass = ''

            if (tweet.isLiked) {
                likeIconClass = 'liked'
            }

            let retweetIconClass = ''

            if (tweet.isRetweeted) {
                retweetIconClass = 'retweeted'
            }

            let repliesHtml = ''

            if (tweet.replies.length > 0) {
                tweet.replies.forEach(function (reply) {
                    repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
                })
            }


            feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <div class="Top-Items">
             <p class="handle">${tweet.handle}</p> 
             <i class="fa-solid fa-ellipsis-vertical"
             id="menu-${tweet.uuid}"
             data-menu="${tweet.uuid}"
             ></i>      
            </div>           
            <p class="tweet-text">${tweet.tweetText}</p>
            
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                     ${tweet.retweets}
               </span>
               
            </div>   
        </div>            
    </div>
    <div class="hidden" id='${tweet.uuid}'>
        ${repliesHtml}
    </div>   
</div>
`
        })
        return feedHtml
    }

    function render() {
        document.getElementById('feed').innerHTML = getFeedHtml()

    }

            render()
