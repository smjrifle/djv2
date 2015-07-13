
      var lists = [];
      var songHold = 0;

      var socket = io.connect('110.44.126.23:3000');
      var inQue = false;

      String.prototype.capitalize = function() {
         return this.charAt(0).toUpperCase() + this.slice(1);
      }
      socket.on('message', function(msg){
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
               var mySong = "<i>" + msg.userid + "</i> [ " + formatted +  ']: <b>' + msg.username.capitalize() + "</b> <a href="+ msg.content  + ">" + title + "</a>" + '</br>';

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
      var currentIndex = -1;
      function onPlayerStateChange(event) {
           setInterval(function(){
           var state = player.getPlayerState();
            if(state == 0 && inQue==true){
                nextVideo();
                inQue=false;
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

      $('#btnPrevious').click(function(){
        if(typeof lists[currentIndex-1] != 'undefined'){
        player.stopVideo();
        currentIndex--;
        player.cueVideoById(lists[currentIndex]);
        player.clearVideo();
        player.playVideo();
      }


      });

       $('#btnNext').click(function(){
         nextVideo();
      });


      $('#btnPlay').click(function(){

        if( player.getPlayerState() == 2 || player.getPlayerState() == 5 ) // paused
          player.playVideo();
        else
          player.pauseVideo();
      });

      function nextVideo(){
           if(typeof lists[currentIndex+1] != 'undefined'){
              player.stopVideo();
              currentIndex++;
              player.cueVideoById(lists[currentIndex]);
              player.clearVideo();
              player.playVideo();
            }
      }

