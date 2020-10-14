; (function (root) {

	// 渲染图片
	function renderImg(src) {
		// 小图
		var imgDom = document.querySelector('.pic img');
		imgDom.src = src;
		// 大背景图
		root.blurImg(src); // 无第2参数，代表添加到document.body上
	}
	// 渲染歌曲信息
	function renderInfo(data) {
		var title = document.querySelector('.des .title');
		title.innerHTML = data.name;
		var singer = document.querySelector('.des .singer');
		singer.innerHTML = data.singer;
		var album = document.querySelector('.des .album');
		album.innerHTML = data.album;
	}
	// 渲染是否喜欢
	function renderIslike(isLike) {
		var control = document.querySelectorAll('.control li');
		
		if(isLike){
			control[0].className = 'like';
		} else {
			control[0].className = '';
		}
	}

	// 渲染进度条
	function renderBar(duration){
		var minutes = Math.floor(duration / 60);
		var seconds = duration - minutes*60;
		var totalTime = document.querySelector('.totalTime');
		totalTime.innerHTML = minutes.toString().padStart(2,'0') + ':' + seconds.toString().padStart(2,'0');
	}

	function render (data) {
		renderImg(data.image);
		renderInfo(data);
		renderBar(data.duration);
		renderIslike(data.isLike);
	};

	root.renderObj = {
		render:render,
		renderIslike:renderIslike,
	}

})(window.player || (window.player = {}));