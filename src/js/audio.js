(function (root) {

    function AudioManager ( ) {
        this.audio = new Audio();
        this.status = 'pause';
    }

    AudioManager.prototype = {

        load:function (src) {
            this.audio.src = src;
            this.audio.load();
        },
        play:function () {
            this.audio.play();
            this.status = 'play';
        },
        pause:function () {
            this.audio.pause();
            this.status = 'pause';
        },

        // 结束播放事件函数
        end:function (fn) {
            this.audio.onended = fn;
        },

        // time ： 单位秒
        playTo:function (time) {
            this.audio.currentTime = time;
        },
    }

    root.audio = new AudioManager();

})(window.player || (window.player = {}))