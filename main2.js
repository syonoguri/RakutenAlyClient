var app = new Vue({
    el: "#app",
    data:{
        errorMessage: "",
        apiResult: {aa:"aa"},
        inputedWord: ""
    },
    computed:{
        analysisResult: function(){
            let obj = []
            let j = 1;
            for(let i in this.apiResult){
                obj.push({rank:j,score:this.apiResult[i],keyword:i})
                j++
            }
            return obj;
        }
    },
    methods:{
        submitToApi: function(){
            let data = "sentence="+this.inputedWord;
            axios
                .post("http://127.0.0.1:3000/form",data)
                .then(function(response) {
                    app.apiResult = response.data;
                    if(typeof apiResult == "string"){
                        console.log(app.apiResult);
                    } else {
                        console.log(app.apiResult);
                    }
                })}
    }

})