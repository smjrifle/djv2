
      var lists = [];
      var songHold = 0;
      
      var socket = io.connect('127.0.0.1:3000');
      var inQue = false;

      
      socket.on('message', function(msg){
        console.log(msg);
        
        var id = ytVidId(msg.content);
        
        if(id != false)
        {
          var title = '';
          var now = new Date(Date.now());
          var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
          
          $.ajax({
            url: "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + id + "&key=AIzaSyCgmZzaMiTxHBCw_8tUs9BriUPgwdAvE2M",
            dataType: "jsonp",
            success: function(data){
               title = data.items[0].snippet.title; 
               var mySong = "<b>" + msg.userid + '</b>: ' + msg.username + " <a href="+ msg.content  + ">" + title + "</a>" + "[ <i>" + formatted + '</i> ]</br>';
            
                 $('#songlist').append(
                      mySong
                  );
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  console.log (textStatus, + ' | ' + errorThrown);
              }
            });

            inQue=true;  
            lists.push(id);
            console.log(lists);
               
          }

    });
      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: '7-qGKqveZaM',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      var currentIndex = 0;
      function onPlayerStateChange(event) {
           var state = player.getPlayerState();
           console.log(state + " event");
           setInterval(function(){
           var state = player.getPlayerState();
            if(state == 0 && inQue==true){
                player.cueVideoById(lists[currentIndex]);
                player.playVideo();
                currentIndex++;
                inQue=false;
                console.log("in here");
           }


           },500); // check in 1 second
           
    
   }
      function stopVideo() {
        player.stopVideo();
      }
 
     function ytVidId(url) {
       var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
       return (url.match(p)) ? RegExp.$1 : false;
     }

      function que(mylist){
        for (var i = 0; i < mylist.length; i++) {
          player.cueVideoById(mylist[i]);
        }
      }