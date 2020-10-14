(function (root) {

    // 索引处理
    function Index (len) {
        this.index = 0;
        this.dataLength = len;
    }

    Index.prototype = {
        prev:function () {
            return this.getIndex(-1);
        },
        next:function () {
            return this.getIndex(1);
        },
        getIndex:function (val) {
            this.index = (this.index + val + this.dataLength) % this.dataLength;
            return this.index;
        }
    }

    root.Index = Index;

})(window.player || (window.player = {}))