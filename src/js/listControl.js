(function (root) {

    function MusicList(data) {
        this.data = data;
        this.wrap = document.querySelector('#musicList');
        this.songList = document.querySelector('.songList');
        this.songNumber = 5;  // 列表显示5首歌曲 需要跟css对应

        // 根据数据生成dom元素
        var crap = document.createDocumentFragment();
        this.data.forEach(function (item, i) {
            var li = document.createElement('li');
            li.innerHTML = item.name;
            crap.appendChild(li);
        })
        this.wrap.appendChild(crap);

    }

    MusicList.prototype = {
        // 显示歌曲列表
        showList: function () {
            this.songList.style.transform = 'translateY(0)';
        },

        // 隐藏歌曲列表
        hideList: function () {
            var height = this.songList.offsetHeight;
            this.songList.style.transform = 'translateY('+height+'px)'
        },

        /**
         * 歌曲列表 激活类名设置
         * @param {*} index 当前歌曲索引
         */
        changeActive: function (index) {
            Array.from(this.wrap.children).forEach(function (li, i) {
                if (index === i) {
                    li.className = 'active';
                } else {
                    li.className = '';
                }
            })

            // 滚动条位置设置
            this.changeScroll(index);
        },

        /**
         * 歌曲列表滚动条位置设置
         * @param {*} index 当前歌曲索引
         */
        changeScroll: function (index) {

            // 动态获取li的高度
            var height = this.wrap.children[0].offsetHeight;

            // 歌曲名所在位置
            var scrollNum = index * height;

            // 判断歌曲名位置是否超出显示区域，是的话，设置滚动距离。 约定显示this.songNumber首歌曲。
            if (scrollNum < this.wrap.scrollTop) {
                this.wrap.scrollTop = scrollNum;
            }
            else if(scrollNum >= (this.wrap.scrollTop + height * this.songNumber)){
                this.wrap.scrollTop = scrollNum - (this.songNumber-1)*height;
            }
        }
    }

    root.MusicList = MusicList;


})(window.player || (window.player = {}))