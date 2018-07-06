var convertToMetric = new Vue({
    el: '#conversionInput',
    data: {
	tolerance: 0.1,
	score: 0,
	given: Math.ceil(Math.random() * 50),
	answer: "",
	answerClass: "lightGray"
    },
    watch: {
	answer: function(newAnswer, oldAnswer) {
	    this.AnswerChanged();
	}
    },
    created: function() {
	this.AnswerChanged = _.debounce(this._AnswerChanged, 500);
    },
    methods: {
	checkAnswer: function(){
	    var correct = this.given/2.54;
	    if(Math.abs(correct - this.answer)/correct <= this.tolerance) {
		this.given = Math.ceil(Math.random() * 50);
		this.score += 1;
		M.toast({html: "What a great job you did!!!"});
		this.answerClass = "lightGray";

	    }
	    else {
		this.answerClass = "lightGray wrong";
	    }
	},
	_AnswerChanged: function() {
	    M.toast({html: "You changed your answer"});
	}
    }
});
