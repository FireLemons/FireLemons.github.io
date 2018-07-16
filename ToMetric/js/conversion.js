var convertToMetric = new Vue({
    el: '#conversionInput',
    data: {
	tolerance: 0.1,
	score: 0,
	given: Math.ceil(Math.random() * 50),
	answer: "",
	answerClass: "grey darken-3"
    },
    methods: {
	checkAnswer: function(){
	    var correct = this.given/2.54;
	    if(Math.abs(correct - this.answer)/correct <= this.tolerance) {
		this.given = Math.ceil(Math.random() * 50);
		this.score += 1;
		M.toast({html: "What a great job you did!!!"});
		this.answerClass = "grey darken-3";

	    }
	    else {
		this.answerClass = "grey darken-3 wrong";
	    }
	}
    }
});
