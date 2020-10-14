(function ($, player) {  // 面向对象

    function MusicPlayer() {
        this.dataList = [];  // 所有歌曲信息
        this.rotateTimer = null;  // 图片旋转定时器
        this.playTime = 0;  // 当前播放时间 单位秒
        this.dis = 0;  // 当前移动距离
        this.countingTimer = null;   // 计时用定时器
    }

    MusicPlayer.prototype = {
        // 初始化
        init: function () {
            this.getDom();
            this.getData('../mock/data.json');
        },
        // 获取dom元素
        getDom: function () {
            // 要旋转的图片
            this.img = document.querySelector('.pic img');
            // 控制按钮
            this.controlBtn = document.querySelectorAll('.control li');
            // 关闭音乐列表按钮
            this.close = document.querySelector('.close');
            // 已播放歌曲时间
            this.curTime = document.querySelector('.curTime');
            // 进度条
            this.frontBar = document.querySelector('.frontBg');
            this.backBar = document.querySelector('.backBg');
            this.drag = document.querySelector('.drag')
            // 进度圆点
            this.dot = document.querySelector('.dot');
        },
        // 获取、请求数据
        getData: function (url) {
            var This = this;
            $.ajax({
                url: url,
                method: 'get',
                success: function (data) {
                    This.dataList = data;
                    // 创建索引对象
                    This.indexControl = new player.Index(data.length);
                    // 创建控制列表
                    This.listControl = new player.MusicList(data);
                    // 加载当前索引的音乐
                    This.loadMusic(This.indexControl.index);
                    // 开启控制
                    This.controlMusic();
                },
                error: function (err) {
                    console.log(err)
                }
            })
        },
        // 加载某一首歌曲
        loadMusic: function (index) {
            // 渲染
            player.renderObj.render(this.dataList[index])
            // 加载音乐
            player.audio.load(this.dataList[index].audioSrc);
            // 设置音乐列表的active
            this.listControl.changeActive(index);

            // 数据重置
            this.reset();

        },

        reset: function () {
            // 当前播放时间清0
            this.playTime = 0;
            // 当前播放距离清0；
            this.dis = 0;
            // 页面显示时间设置
            this.curTime.innerHTML = '00:00';
            this.dot.style.left = 0;
            this.frontBar.style.width = 0;
        },

        // 音乐播放控制 事件
        controlMusic: function () {
            var This = this;
            // 上一首切换
            this.controlBtn[1].addEventListener('touchend', function () {
                // 上一首索引
                var i = This.indexControl.prev();

                // 加载音乐
                This.loadMusic(i);
                // 开始播放
                This.start();
            })

            // 下一首切换
            this.controlBtn[3].addEventListener('touchend', function () {
                // 加载播放下一首
                var i = This.indexControl.next();

                // 加载音乐
                This.loadMusic(i);
                // 开始播放
                This.start();
            })

            // 播放 和 暂停
            this.controlBtn[2].addEventListener('touchend', function () {
                // 判断当前播放状态，切换播放和暂停
                if (player.audio.status === 'play') {
                    This.stop();
                } else {
                    // 播放时间到了，马上切换下一首
                    if (This.playTime >= This.dataList[This.indexControl.index].duration) {
                        var event = new Event('touchend');
                        This.controlBtn[3].dispatchEvent(event);
                        return;
                    }
                    This.start();
                }
            })

            // 控制列表显示
            this.controlBtn[4].addEventListener('touchend', function () {
                // 显示列表
                This.listControl.showList();
                // 滚动条位置复位
                This.listControl.changeScroll(This.indexControl.index)
            })

            // 控制列表隐藏
            this.close.addEventListener('touchend', function () {
                This.listControl.hideList();
            })


            // 点击歌曲列表 切歌
            Array.from(This.listControl.wrap.children).forEach(function (li, index) {
                li.addEventListener('touchend', function () {

                    // 点击别的歌 直接加载播放
                    if (This.indexControl.index !== index) {
                        // 改变索引
                        This.indexControl.index = index;

                        // 加载音乐
                        This.loadMusic(index);
                        // 播放
                        This.start();

                        return;
                    }

                    // 暂停下点击，让播放
                    if (player.audio.status === 'pause') {
                        // 播放
                        This.start();
                    }
                    else {
                        // 暂停
                        This.stop();
                    }

                })
            })

            // 点击切换 喜欢与否
            this.controlBtn[0].addEventListener('touchend', function () {
                if (this.className === 'like') {
                    // 改数据
                    This.dataList[This.indexControl.index]["isLike"] = false;
                    // 当前歌曲信息 重新渲染
                    player.renderObj.renderIslike(false)
                } else {
                    // 改数据
                    This.dataList[This.indexControl.index]["isLike"] = true;
                    // 重新渲染
                    player.renderObj.renderIslike(true)
                }
            })

            // 拖动进度条
            this.drag.addEventListener('touchend', function (e) {
                var dotHalfWidth = This.dot.offsetWidth / 2;
                var totalWidth = This.backBar.offsetWidth;
                var curTimeWidth = This.curTime.offsetWidth;
                var clientX = e.changedTouches[0].clientX;

                var left = clientX - curTimeWidth - dotHalfWidth;
                // 限制范围
                if (clientX < curTimeWidth + dotHalfWidth) {
                    left = 0
                } else if (clientX > curTimeWidth + dotHalfWidth + totalWidth) {
                    left = totalWidth;
                }

                // 记录播放时间和播放距离
                This.playTime = Math.floor(left / totalWidth * This.dataList[This.indexControl.index].duration);
                This.dis = left;
                // 重新渲染控制条
                This.setControlBar(This.playTime, left);
                // 设置音乐播放时间
                player.audio.playTo(This.playTime);

            })
        },

        /**
         * 图片旋转
         * @param {*} deg 当前旋转度数
         */
        imgRotate: function (deg) {
            // 重要
            clearInterval(this.rotateTimer);

            var This = this;
            deg = deg || 0;
            this.rotateTimer = setInterval(function () {
                deg += .2;
                This.img.style.transform = "rotate(" + deg + "deg)";
                // 旋转度数保存到属性上
                This.img.dataset.rotate = deg;
            }, 1000 / 60)

        },

        //停止旋转
        stopRotate: function () {
            clearInterval(this.rotateTimer);
        },

        // 开始播放
        start: function () {
            // 开始播放
            player.audio.play();
            // 切换播放图标
            this.controlBtn[2].className = 'pause';
            // 开始旋转
            // 获取已经旋转的度数
            var deg = this.img.dataset.rotate;
            this.imgRotate(+deg);
            // 开始计时
            this.startCounting(this.dataList[this.indexControl.index].duration);
        },


        // 停止播放
        stop: function () {
            // 暂停
            player.audio.pause();
            // 播放图标
            this.controlBtn[2].className = '';
            // 停止旋转
            this.stopRotate();
            // 停止计时
            this.stopCounting();
        },

        // 开始计时
        startCounting: function (duration) {
            clearInterval(this.countingTimer);

            // 进度条长度
            var width = this.backBar.offsetWidth;
            // 每秒应该移动的宽度
            var pieceWidth = width / duration;

            var This = this;
            this.countingTimer = setInterval(function () {
                This.playTime++;
                This.dis += pieceWidth;

                // 控制条重新渲染
                This.setControlBar(This.playTime, This.dis);

                // 时间到，播放下一首
                if (This.playTime >= duration) {
                    This.loadMusic(This.indexControl.next());
                    This.start();
                }
            }, 1000)
        },

        setControlBar: function (playTime, dis) {
            // 换算分秒，并渲染
            var minutes = Math.floor(playTime / 60);
            var seconds = playTime - minutes * 60;
            this.curTime.innerHTML = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
            // 渲染距离
            this.frontBar.style.width = dis + 'px';
            // 圆点位置
            this.dot.style.left = dis + "px"
        },

        // 结束计时
        stopCounting: function () {
            clearInterval(this.countingTimer);
        }


    }

    var musicPlayer = new MusicPlayer();
    musicPlayer.init(); // 初始化

})(window.Zepto, window.player)


// 一些插件的关系，不能用到最新的语法