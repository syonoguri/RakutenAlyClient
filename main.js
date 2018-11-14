Vue.component("analyze-form", {
    data: function(){
        return{
            apiResult: {}
        }
    },
    template: `<form>
                <input type="text">
                <button @click.prevent="submitToApi"></button>
                </form>`,
    methods: {
        submitToApi: function(){
            let data = "sentence=牛丼"
            axios
                .post("http://127.0.0.1:3000/form",data)
                .then(function(response) {
                    app.apiResult = response.data;
                    if(typeof apiResult == "string"){
                        
                    } else {
                        
                    }
                })
        }
    }
});

Vue.component("result-table", {
    props: [],
    template: `<table>
                    <custom-thead></custom-thead>
                    <custom-tbody></custom-tbody>
                </table>`
});

Vue.component("custom-thead", {
    props: [],
    template: `<thead>
                <tr>
                <custom-th></custom-th>
                </tr>
                </thead>`
});

Vue.component("custom-tbody", {
    props: {
        apiResult: Object
    },
    computed: {
        analysisResult: function(){
            let obj = []
            for(let i in this.apiResult){
                obj.push({rank:j,score:this.apiResult[i],keyword:i})
            }
            return obj;
        }
    },
    template: `<tbody>
                <custom-td v-for="result in analysisResult"></custom-td>
                </tbody>`
});

Vue.component("custom-th", {
    props: [],
    template: `<div>
                <th>a</th>
                <th>b</th>
                </div>`
})

Vue.component("custom-td",{
    props: {
        apiResult: Object,
        result: Object
    },
    template:`<tr>
                <td>{{ result.rank }}</td> 
                <td>{{ result.score }}</td> 
                <td>{{ result.keyword }}</td> 
             </tr>`
});

Vue.component("custom-button", {
    template: `<button></button>`
});

var app = new Vue({
    el: "#app",
    data: {
        errorMessage: "",
        }
})