

const miniResult = {
    props:["val"],
    template:`<div>
        <h2>分析結果</h2>
        <p>{{ val }}</p>
    </div>`
}

const tableFrame = {
    props:["val"],
    template:`<table>
            <caption></caption>
            <thead>
                <tr>
                    <th>RANK</th>
                    <th>SCORE</th>
                    <th>KEYWORD
                        <form class="filterForm">
                            <input type="text v-model="filterWord placeholder="フィルター">
                            <button class="smallButton" @click.prevent="reverseResult">↑↓</button>
                            <button class="smallButton" @click.prevent="saveResult">save</button>
                        </form>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="result in val" :key="result.rank">
                    <td>{{ result.rank }}</td>
                    <td>{{ result.score }}</td>
                    <td>{{ result.keyword }}</td>
                </tr>
            </tbody>
        </table>`,
    methods: {
        parentsReverseResult: function(){
            this.$emit("")
        },
        parentsSaveResult: function(){
            this.$emit("")
        },
        parentsReverseResult: function(){
            this.$emit("")
        },
        parentsReverseResult: function(){
            this.$emit("")
        }
    }
},

const mainForm = {
    template:`<div>
        <div id="topContainer">
            <h1>楽天商品タイトル重要ワード抽出</h1>
            <p>入力したキーワードにヒットする商品タイトルのうち、主要なキーワードを抽出します。</p>
            <form>
                <input id="topInput" type="text" v-model="inputedWord">
                <button id="topFormButton" @click.prevent="submitToApi">送信</button>
            </form>
        </div>
        <mini-result :val="errorMessage"></mini-result>
        <canvas v-show=canvasSwitch ref="canvas" :style="canvasObject" :width="canvasWidth" :height="canvasHeight"></canvas>
        <div id="resultContainer" ref="tables">
            <table-frame :val="computedAnalysisResult"></table-frame>
            <table-frame v-if=saved :val="savedAnalysisResult"></table-frame>
        </div>
    </div>`,
    data: function(){
        return {
            inputedWord: "",
            errorMessage: "",
            resultCaption: "検索キーワード",
            savedResultCaption: "",
            analysisResult: {},
            savedAnalysisResult: {},
            filterWord:"",
            savedFilterWord:"",
            saved: false,
            reverse: false,
            savedReverse: false,
            canvasSwitch: false,
            ctx: {},
            canvasObject: {
            },
            canvasWidth: innerWidth * devicePixelRatio +"px",
            canvasHeight: innerHeight * devicePixelRatio +"px",
        }
    },
    computed:{
        computedAnalysisResult: function(){
            let viewResult = []
            let j = 1;
            let sentence = new RegExp(this.filterWord)
            for(let i in this.analysisResult){
                if(this.filterWord){
                    if(!sentence.test(i)){
                        continue;
                    }
                }
                viewResult.push({rank:j,score:this.analysisResult[i],keyword:i})
                j++
            }
            if(this.reverse){
                viewResult.reverse();
            }
            return viewResult;
        },
    },
    mounted(){
        this.ctx = this.$refs.canvas.getContext("2d");
    },
    methods: {
        submitToApi: function(){
            let data = "sentence="+this.inputedWord;
            this.errorMessage = "";
            this.resultCaption = JSON.parse(JSON.stringify(this.inputedWord));
            axios
                .post("http://127.0.0.1:3000/form",data)
                .then((response)=> {
                    console.log(app);
                    if(typeof response.data == "string"){
                        this.errorMessage = response.data;
                    } else {
                        this.analysisResult = response.data;
                    }
                    this.canvasSwitch = false;
                })},
        saveResult: function(){
            this.savedAnalysisResult = Object.assign({},this.analysisResult);
            this.savedResultCaption = JSON.parse(JSON.stringify(this.resultCaption));
            this.resultCaption = "検索キーワード",
            this.analysisResult = {};
            this.savedFilterWord = JSON.parse(JSON.stringify(this.filterWord))
            this.filterWord = "";
            this.saved = true;
        },
        reverseResult: function(){
            if(this.reverse){
                this.reverse = false
            } else {
                this.reverse = true
            }
        },
        reverseSavedResult: function(){
            if(this.savedReverse){
                this.savedReverse = false
            } else {
                this.savedReverse = true
            }
        },
        loadingCircle: function(){
            let ctx = app.ctx;
            this.isReady = false;
            this.canvasSwitch = true;
            let tableRect = this.$refs.tables.getBoundingClientRect();
            // Canvasを画面いっぱいに表示する
            function onResize(){
                var tabley = window.pageYOffset;
                app.canvasObject.top = `${tabley}px`
                app.canvasObject.position = "absolute",
                app.canvasObject.left = "0px",
                app.canvasWidth = innerWidth * devicePixelRatio +"px",
                app.canvasHeight = innerHeight * devicePixelRatio +"px"
            }
            window.addEventListener("resize", onResize);
            onResize();

            requestAnimationFrame(function (t0) {
                render(t0);
                function render(t1){
                    requestAnimationFrame(render);
                    ctx.fillStyle = "rgba(0,0,0,0)";
                    ctx.fillRect(0,0, app.canvasObject.width, app.canvasObject.height);
                    draw(ctx, t1-t0);
                } 
            });
            function generateCubicBezier(x1, y1, x2, y2, step) {
                const table = generateTable(x1, x2, step);
                const tableSize = table.length;
                cubicBezier.getT = getT;
                cubicBezier.table = table;
                return cubicBezier;
                function cubicBezier(x) {
                    if (x <= 0) {
                        return 0;
                    }
                    if (1 <= x) {
                        return 1;
                    }
                    return getCoordinate(y1, y2, getT(x));
                }
                function getT(x) {
                    let xt1, xt0;
                    if (x < 0.5) {
                        for (let i = 1; i < tableSize; i++) {
                            xt1 = table[i];
                            if (x <= xt1[0]) {
                                xt0 = table[i - 1];
                                break;
                            }
                        }
                    } else {
                        for (let i = tableSize - 1; i--;) {
                            xt1 = table[i];
                            if (xt1[0] <= x) {
                                xt0 = table[i + 1];
                                break;
                            }
                        }
                    }
                    return xt0[1] + (x - xt0[0]) * (xt1[1] - xt0[1]) / (xt1[0] - xt0[0]);
                }
                function getCoordinate(z1, z2, t) {
                    return (3 * z1 - 3 * z2 + 1) * t * t * t + (-6 * z1 + 3 * z2) * t * t + 3 * z1 * t;
                }
                function generateTable(x1, x2, step) {
                    step = step || 1 / 30;
                    const table = [[0, 0]];
                    for (let t = step, previousX = 0; t < 1; t += step) {
                        const x = getCoordinate(x1, x2, t);
                        if (previousX < x) {
                            table.push([x, t]);
                            previousX = x;
                        }
                    }
                    table.push([1, 1]);
                    return table;
                }
            }
            const easeInOut = generateCubicBezier(0.42, 0, 0.58, 1);
            function draw(ctx, t){
                ctx.save();
                ctx.clearRect(0,0,innerWidth*devicePixelRatio,innerHeight*devicePixelRatio);
                let canvas = app.ctx.canvas;
                // Loading表示
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = devicePixelRatio*40+"px Courier,monospace";
                ctx.fillStyle = "black";
                ctx.fillText(
                    "Loading",
                    app.ctx.canvas.width / 2,
                    app.ctx.canvas.height / 2 + devicePixelRatio*20
                );
                // 円を表示
                const phase1 = (t % 2000) / 2000;
                const phase2 = 2 * Math.max(phase1 - 0.5, 0);
                const phase3 = (t % 5000) / 5000;
                const x1 = easeInOut(phase1);
                const x2 = easeInOut(phase2);
                const radius = 0.4*Math.min(canvas.width/2,canvas.height/2);
                const PI2 = Math.PI*2;
                ctx.beginPath();
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(2 * Math.PI * phase3);
                ctx.arc(0,0,radius, PI2*x2, PI2*x1);
                ctx.strokeStyle = "rgba(80,80,80,0.8)";
                ctx.lineWidth = radius / 8;
                ctx.lineCap = "round";
                ctx.stroke();
                ctx.restore();
                }
            }
        },
    components: {
        "mini-result": miniResult,
        "table-frame": tableFrame
    }
};

new Vue({
    el: "#app",
    components: {
        "main-form": mainForm,        
    }
})