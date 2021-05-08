var app = new Vue({
    el:'#app',
    data:{
        carousel: null,
        controlsHint: null
    },
    methods:{
        dismissHint: function(){
            localStorage.setItem('readControls', true);
            controlHint.dismiss();
        },
        left: function(){
            this.carousel.prev();
        },
        right: function(){
            this.carousel.next();
        }
    },
    mounted: function(){
        this.carousel = M.Carousel.init(document.querySelectorAll('.carousel'), {
            fullWidth: true,
            indicators: true
        })[0];
        
        const app = this;
        window.addEventListener("keydown", function(e) {
            switch(e.keyCode){
                case 37:
                    app.left();
                    break;
                case 39:
                    app.right();
                    break;
            }
        });
        
        if(!localStorage.getItem('readControls')){
            controlHint = M.toast({
                html: `<span>Click project titles to see more details</span>
                       <button class="btn-flat toast-action" onclick="app.dismissHint()">Got it</button>`,
                displayLength: Infinity});
            dismissHint = true;
        }
    }
});
