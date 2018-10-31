
const req = new XMLHttpRequest();
const ctrl = Object.create(null);
const vw = Object.create(null);
// Nodeオブジェクトを作成する関数
function elt(name,attributes) { 
    var node = document.createElement(name);
    if(attributes) {
        for(var attr in attributes) {
            if(attributes.hasOwnProperty(attr)) {
                node.setAttribute(attr,attributes[attr]);
            }
        }
    }
    for(var i=2; i<arguments.length; i++) {
        var child =arguments[i];
        if( typeof child == "string"){
            child = document.createTextNode(child);
        }
        node.appendChild(child);
    }
    return node;
}
// なめらかなアニメーションのための関数(ローディング画面で使用)
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

// 分析結果を保持・改変するクラス
class State {
    constructor(){
        this.tableCaption = "検索キーワード"
        this.analysisResult = [];
        this.filteredResult = [];
        this.savedTableCaption = "";
        this.savedResult = [];
        this.savedFilteredResult = [];
        this.errorMessage = ""
    }

    // エラーメッセージを格納する
    makeErrorMessage(errorMessage){ 
        this.errorMessage = errorMessage;
        vw.showErrorMessage();
    };

    // 入力されたキーワードを格納する(テーブルのタイトル）
    makeTableCaption(caption){ 
        this.tableCaption = caption;
    };

    // 分析結果を配列に格納する
    // サーバから帰ってきた分析結果をanalysisResultにpushする
    // 表示用のfilteredResultにanalysisResultをディープコピーし、表示用のメソッドを呼び出す
    makeAnalysisResult(result){ 
        this.analysisResult = [];
        for(var i in result){
            this.analysisResult.push({score:result[i],keyword:i});
        }
        this.filteredResult = JSON.parse(JSON.stringify(this.analysisResult));
        vw.showResult(this.filteredResult);
    };

    // 分析結果を複製する
    save(){ 
        this.savedResult = this.analysisResult;
        this.savedTableCaption = this.tableCaption;
        this.analysisResult = [];
        this.savedFilteredResult = JSON.parse(JSON.stringify(this.filteredResult));
        this.filteredResult = JSON.parse(JSON.stringify(this.analysisResult));
        this.tableCaption = "検索キーワード";
        vw.showResult(this.filteredResult);
        vw.updateResult2(this.savedFilteredResult);
    };

    // 結果を格納した配列の順番を逆にする
    // →表の昇降順を逆にしてブラウザに表示する
    revereseFilteredResult(){
        console.log(JSON.parse(JSON.stringify(this.filteredResult)));
        console.log(this.analysisResult);
        // this.fil1.reverse();
        this.filteredResult.reverse();
        console.log(JSON.parse(JSON.stringify(this.filteredResult)));
        console.log(this.analysisResult);

        vw.showResult(this.filteredResult);
    };

    revereseSavedFilteredResult(){
        this.savedFilteredResult.reverse();
        vw.updateResult2(this.savedFilteredResult);
    };

    // 特定のワードに部分一致するキーワードを抽出しブラウザに表示する
    makeFilteredResult(filteringKeyword){
        this.filteredResult = [];
        console.log("keyword");
        let expObj = new RegExp(filteringKeyword);
        for(let i of this.analysisResult){
            if(expObj.test(i["keyword"])){
                console.log(i["keyword"]);
                console.log(this.filteredResult);
                this.filteredResult.push(i);
            }
        }
        vw.showResult(this.filteredResult);
    };

    makeSavedFilteredResult(filteringKeyword){
        this.savedFilteredResult = [];
        let expObj = new RegExp(filteringKeyword);
        for(let i of this.savedResult){
            if(expObj.test(i["keyword"])){
                this.savedFilteredResult.push(i);
            }
        }
        vw.updateResult2(this.savedFilteredResult);
    };

    // フィルターと順番入れ替えを初期化する
    clearFilters(){
        this.makeFilteredResult("");
    }
}

const state = new State();



/*------------------------------------------------------------------
ctrl:ユーザーの入力に対応し、stateメソッドもしくはreqメソッドを呼び出す。
-------------------------------------------------------------------*/

// サーバーに分析ワードを送るボタン
ctrl.formButton = document.getElementById("button");
ctrl.formButton.addEventListener("click",function(e){
    e.preventDefault();
    let inputedWord = document.getElementById("sentence").value;
    if(inputedWord.length<128){
        state.makeTableCaption(inputedWord);
    }
    req.open("POST", "http://127.0.0.1:3000/form");
    req.setRequestHeader("content-type","application/x-www-form-urlencoded");
    req.responseType="json";
    req.send("sentence="+inputedWord);
});

// テーブルを複製するボタン
ctrl.saveButton = document.getElementById("save");
ctrl.saveButton.addEventListener("click",function(e){
    if(state.analysisResult.length == 0){
        state.makeErrorMessage("Error: 保存する結果がありません");
    } else {
        state.save();
        ctrl.addCtrlEventListener();
    }
});

// テーブルの昇降順を逆にするボタン
ctrl.reverseButton = document.getElementById("reverse1");
ctrl.reverseButton.addEventListener("click",function(e){
    state.revereseFilteredResult();
});

// 特定のワードに部分一致するキーワードを抽出するボタン
ctrl.filterButton = document.getElementById("filterButton1");
ctrl.filterButton.addEventListener("click",function(e){
    e.preventDefault();
    // 入力値は正規表現に用いられる
    let expWord = document.getElementById("filterInput1").value
    state.makeFilteredResult(expWord);
});

// フィルターと順番入れ替えを初期化するボタン
ctrl.clearFiltersButton = document.getElementById("filterClear1");
ctrl.clearFiltersButton.addEventListener("click",function(e){
    e.preventDefault();
    state.clearFilters();
})

// ２つ目のテーブルにイベントリスナを設置するメソッド
ctrl.addCtrlEventListener = function(){
    ctrl.savedReverseButton = document.getElementById("reverse2");
    ctrl.savedReverseButton.addEventListener("click",function(e){
        e.preventDefault();
        state.revereseSavedFilteredResult();
        ctrl.addCtrlEventListener();
    })
    ctrl.savedFilterButton = document.getElementById("filterButton2");
    ctrl.savedFilterButton.addEventListener("click",function(e){
        e.preventDefault();
        let expWord = document.getElementById("filterInput2").value
        state.makeSavedFilteredResult(expWord);
        ctrl.addCtrlEventListener();
    });
    ctrl.clearSavedFilterButton = document.getElementById("filterClear2");
    ctrl.clearSavedFilterButton.addEventListener("click",function(e){
        state.makeSavedFilteredResult("");
        ctrl.addCtrlEventListener();
    });
};

/*------------------------------------------------------------------
vw：stateに保存された状態を、ブラウザに出力する機能を持つ
-------------------------------------------------------------------*/
vw.errorMessage = document.getElementById("shortResult");
vw.tbody = document.getElementById("resultTable");
vw.tables = document.getElementById("table");
vw.showErrorMessage = function(){
    vw.errorMessage.innerHTML = state.errorMessage;
}
vw.showResult = function(result){ // result1のtbodyを更新
    console.log(result); 
    let tableCaption = document.getElementById("caption")
    tableCaption.innerHTML = state.tableCaption;
    if(vw.tbody.hasChildNodes){ // 既にある分析結果を削除
        while(this.tbody.firstChild){
            this.tbody.removeChild(this.tbody.firstChild);
        }
    }
    if(result != []){
        let ths = {}
        let j = 1;
        for(let i of result){ 
            ths.th1=elt("th",null,`${j}`);
            ths.th2=elt("th",null,`${i["score"]}`);
            ths.th3=elt("th",null,`${i["keyword"]}`);
            let tr =elt("tr",null,ths.th1,ths.th2,ths.th3);
            vw.tbody.appendChild(tr);
            j++;
        }
    }
}
vw.updateResult2 = function(result){ // result2のtableを作成
    let oldtable = document.getElementById("table2"); 
    if(oldtable != null){ // 古い比較テーブルを削除
        oldtable.parentNode.removeChild(oldtable);
    }

    let ths = {};
    let tbody = elt("tbody",null,); // 比較テーブルの内容部分を作成
    let j = 1;
    for(let i of result){ // 
        ths.th1 = elt("th",null,`${j}`);
        ths.th2 = elt("th",null,`${i["score"]}`);
        ths.th3 = elt("th",null,`${i["keyword"]}`);
        let tr = elt("tr",null,ths.th1,ths.th2,ths.th3);
        tbody.appendChild(tr);
        j++;
    }
    ths.th4 = elt("th",null,"RANK"); // 比較テーブルの先頭行を作成
    ths.th5 = elt("th",null,"SCORE");
    let reverseButton = elt("button",{id:"reverse2"},"↑↓");
    let filterInput2 = elt("input",{class:"filterInput",id:"filterInput2"})
    let filterButton2 = elt("button",{id:"filterButton2"},"filter");
    let filterForm2 = elt("form",{class:"filterForm"},filterInput2,filterButton2);
    let filterClear2 = elt("button",{id:"filterClear2"},"clear");
    ths.th6 = elt("th",null,"KEYWORD",filterForm2,reverseButton,filterClear2);
    let tr2 = elt("tr",null,ths.th4,ths.th5,ths.th6);
    let thead = elt("thead",null,tr2);

    let caption2 = elt("caption",{id:"caption2"},state.savedTableCaption); // 比較テーブルのキャプションを作成
    let table2 = elt("table",{id:"table2"},caption2,thead,tbody);
    vw.tables.appendChild(table2);
}
// ローディング画面
vw.loading = function(){
    const canvas = document.createElement("canvas");
    const table = document.getElementById("table")
    table.appendChild(canvas);
    var tableRect = table.getBoundingClientRect() ;

    // Canvasを画面いっぱいに表示する
    function onResize(){
        var tabley = window.pageYOffset + tableRect.top ;
        canvas.width = innerWidth * devicePixelRatio;
        canvas.height = innerHeight * devicePixelRatio;
        canvas.style = `position: absolute; top:${tabley}px;left:0px;`
    }
    window.addEventListener("resize", onResize);
    onResize();

    requestAnimationFrame(function (t0) {
        if(req.readyState == 4){
            let canvass = document.getElementsByTagName("canvas");
            console.log(canvass)
            canvass[0].parentNode.removeChild(canvass[0]);
            canvass[0].parentNode.removeChild(canvass[0]);
            return;
        }
        const ctx = canvas.getContext("2d");
        render(t0);
        function render(t1){
            requestAnimationFrame(render);
            ctx.fillStyle = "rgba(245,245,245,0.01)";
            ctx.fillRect(0,0, canvas.width, canvas.height);
            draw(ctx, t1-t0);
        } 
    });

    const easeInOut = generateCubicBezier(0.42, 0, 0.58, 1);
    function draw(ctx, t){
        ctx.save();
        const canvas = ctx.canvas;
        // Loading表示
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = devicePixelRatio*40+"px Courier,monospace";
        ctx.fillStyle = "rgba(239,239,239,1)";
        ctx.fillText(
            "Loading",
            canvas.width / 2,
            canvas.height / 2 + devicePixelRatio*20
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
        ctx.strokeStyle = "rgba(239,239,239,1)";
        ctx.lineWidth = radius / 8;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
    }
};


/*------------------------------------------------------------------
　req: サーバーとの通信を行う部分。サーバーからのレスポンスが来た場合は
    　 stateメソッドを呼び出しそのデータを保存する。
-------------------------------------------------------------------*/

// サーバーからデータを受け取った時の処理
// 結果をstateに格納する
req.addEventListener("load",function(){
    let result = req.response;
    if(typeof result == "string"){
        state.makeErrorMessage(result);
    } else {
        state.makeErrorMessage("");
        state.makeTableCaption(document.getElementById("sentence").value);
        state.makeAnalysisResult(result);
    }
})
// 通信中に操作不能とする処理
req.onreadystatechange = function(){
    if(req.readyState == 1||2||3){
        ctrl.formButton.setAttribute("disabled",true);
        ctrl.saveButton.setAttribute("disabled",true);
        vw.loading();
    }
    if(req.readyState == 0||4){
        ctrl.formButton.removeAttribute("disabled");
        ctrl.saveButton.removeAttribute("disabled");
    }
}
