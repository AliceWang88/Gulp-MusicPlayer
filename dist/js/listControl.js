!function(t){function s(t){this.data=t,this.wrap=document.querySelector("#musicList"),this.songList=document.querySelector(".songList"),this.songNumber=5;var n=document.createDocumentFragment();this.data.forEach(function(t,s){var i=document.createElement("li");i.innerHTML=t.name,n.appendChild(i)}),this.wrap.appendChild(n)}s.prototype={showList:function(){this.songList.style.transform="translateY(0)"},hideList:function(){var t=this.songList.offsetHeight;this.songList.style.transform="translateY("+t+"px)"},changeActive:function(i){Array.from(this.wrap.children).forEach(function(t,s){t.className=i===s?"active":""}),this.changeScroll(i)},changeScroll:function(t){var s=this.wrap.children[0].offsetHeight,t=t*s;t<this.wrap.scrollTop?this.wrap.scrollTop=t:t>=this.wrap.scrollTop+s*this.songNumber&&(this.wrap.scrollTop=t-(this.songNumber-1)*s)}},t.MusicList=s}(window.player||(window.player={}));