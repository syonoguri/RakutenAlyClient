// ユーザーの入力に対応し、keywordAnalysisStateメソッドを呼び出す。
const keywordAnalysisController = Object.create(null);

// keywordAnalysisStateに保存された状態を、ブラウザに出力する機能を持つ
const keywordAnalysisViewer = Object.create(null);

// // 分析結果を保持・更新するクラス
const keywordAnalysisState = new KeywordAnalysisState();

// Nodeオブジェクトを作成する関数
function elt(name,attributes) { 
    var node = $(`<${name}>`);
    if(attributes) {
        for(var attr in attributes) {
            if(attributes.hasOwnProperty(attr)) {
                node.attr(attr,attributes[attr]);
            }
        }
    }
    for(var i=2; i<arguments.length; i++) {
        var child =arguments[i];
        if( typeof child == "string"){
            child = document.createTextNode(child);
        }
        node.append(child);
    }
    return node;
}

// サーバーとの通信の機能を持つ
let apiRequest = {};

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

/*------------------------------------------------------------------
keywordAnalysisController:ユーザーの入力に対応し、stateメソッドを呼び出す。
-------------------------------------------------------------------*/
// サーバーに分析ワードを送るボタン
keywordAnalysisController.formButton = $("#formButton");
keywordAnalysisController.formButton.click(function(e){
    e.preventDefault();
    let inputedWord = $("#inputedWord").val();
    if(inputedWord.length<128){
        keywordAnalysisState.makeTableCaption(inputedWord);
    }
    // 通信中にボタンを押せなくする
    keywordAnalysisController.formButton.attr("disabled");
    keywordAnalysisController.saveButton.attr("disabled");
    keywordAnalysisViewer.loading();

    // サーバーに分析ワードを送信
    apiRequest.rakutenAndYahoo = $.ajax({
        url: "http://127.0.0.1:3000/form",
        type: "post",
        data:{
            "sentence":inputedWord
        }
    })
    // ボタンの機能を戻し、分析結果をstateに格納
    .done((data) => {
        let apiResult = data;
        keywordAnalysisController.formButton.removeAttr("disabled");
        keywordAnalysisController.saveButton.removeAttr("disabled");
        if(typeof apiResult == "string"){
            keywordAnalysisState.makeErrorMessage(apiResult);
        } else {
            keywordAnalysisState.makeErrorMessage("");
            keywordAnalysisState.makeTableCaption($("#inputedWord").val());
            keywordAnalysisState.makeAnalysisResult(apiResult);
        }
    });
});

// テーブルを複製するボタン
keywordAnalysisController.saveButton = $("#saveButton");
keywordAnalysisController.saveButton.click(function(e){
    e.preventDefault();
    if(keywordAnalysisState.analysisResult.length == 0){
        keywordAnalysisState.makeErrorMessage("Error: 保存する結果がありません");
    } else {
        keywordAnalysisState.save();
        keywordAnalysisController.addCtrlEventListener();
    }
});

// テーブルの昇降順を逆にするボタン
keywordAnalysisController.reverseButton = $("#reverseButton");
keywordAnalysisController.reverseButton.click(function(e){
    keywordAnalysisState.revereseFilteredResult();
});

// 特定のワードに部分一致するキーワードを抽出するボタン
keywordAnalysisController.filterButton = $("#filterButton");
keywordAnalysisController.filterButton.click(function(e){
    e.preventDefault();
    // 入力値は正規表現に用いられる
    let expWord = $("#expWord").val()
    keywordAnalysisState.makeFilteredResult(expWord);
});

// フィルターと順番入れ替えを初期化するボタン
keywordAnalysisController.clearFiltersButton = $("#clearFiltersButton");
keywordAnalysisController.clearFiltersButton.click(function(e){
    e.preventDefault();
    keywordAnalysisState.clearFilters();
})

// ２つ目のテーブルのボタン等にイベントリスナを設置するメソッド
keywordAnalysisController.addCtrlEventListener = function(){
    keywordAnalysisController.savedReverseButton = $("#savedReverseButton");
    keywordAnalysisController.savedReverseButton.click(function(e){
        e.preventDefault();
        keywordAnalysisState.revereseSavedFilteredResult();
        keywordAnalysisController.addCtrlEventListener();
    })
    keywordAnalysisController.savedFilterButton = $("#savedFilterButton");
    keywordAnalysisController.savedFilterButton.click(function(e){
        e.preventDefault();
        let expWord = $("#savedExpWord").val()
        keywordAnalysisState.makeSavedFilteredResult(expWord);
        keywordAnalysisController.addCtrlEventListener();
    });
    keywordAnalysisController.clearSavedFiltersButton = $("#clearSavedFiltersButton");
    keywordAnalysisController.clearSavedFiltersButton.click(function(e){
        keywordAnalysisState.makeSavedFilteredResult("");
        keywordAnalysisController.addCtrlEventListener();
    });
};

/*------------------------------------------------------------------
keywordAnalysisViewer：stateに保存された状態を、ブラウザに出力する機能を持つ
-------------------------------------------------------------------*/
keywordAnalysisViewer.errorMessage = $("#errorMessage");
keywordAnalysisViewer.tbody = $("#tableBody");
keywordAnalysisViewer.tables = $("#tables");
keywordAnalysisViewer.showErrorMessage = function(){
    keywordAnalysisViewer.errorMessage.text(keywordAnalysisState.errorMessage);
}
// １つ目のテーブルを更新
keywordAnalysisViewer.showResult = function(result){ 
    console.log(result); 
    let tableCaption = $("#caption")
    tableCaption.text(keywordAnalysisState.tableCaption);
    if(keywordAnalysisViewer.tbody.has()){ // 既にある分析結果を削除
        this.tbody.children().remove();
    }
    if(result != []){
        let ths = {}
        let j = 1;
        for(let i of result){ 
            ths.th1=elt("th",null,`${j}`);
            ths.th2=elt("th",null,`${i["score"]}`);
            ths.th3=elt("th",null,`${i["keyword"]}`);
            let tr =elt("tr",null,ths.th1,ths.th2,ths.th3);
            keywordAnalysisViewer.tbody.append(tr);
            j++;
        }
    }
}
// ２つ目のテーブルを作成・更新
keywordAnalysisViewer.showSavedResult = function(result){ 
    let oldtable = $("#savedTable"); 
    if(oldtable.has()){ // 古い比較テーブルを削除
        oldtable.remove();
    }

    let ths = {};
    // 比較テーブルの内容部分を作成
    let tbody = elt("tbody",null); 
    let j = 1;
    for(let i of result){ 
        ths.th1 = elt("th",null,`${j}`);
        ths.th2 = elt("th",null,`${i["score"]}`);
        ths.th3 = elt("th",null,`${i["keyword"]}`);
        let tr = elt("tr",null,ths.th1,ths.th2,ths.th3);
        tbody.append(tr);
        j++;
    }
    // 比較テーブルの先頭行を作成
    ths.th4 = elt("th",null,"RANK"); 
    ths.th5 = elt("th",null,"SCORE");
    let reverseButton = elt("button",{id:"savedReverseButton"},"↑↓");
    let savedExpWord = elt("input",{class:"filterInput",id:"savedExpWord"})
    let savedFilterButton = elt("button",{id:"savedFilterButton"},"filter");
    let filterForm2 = elt("form",{class:"filterForm"},savedExpWord,savedFilterButton);
    let clearSavedFiltersButton = elt("button",{id:"clearSavedFiltersButton"},"clear");
    ths.th6 = elt("th",null,"KEYWORD",filterForm2,reverseButton,clearSavedFiltersButton);
    let tr2 = elt("tr",null,ths.th4,ths.th5,ths.th6);
    let thead = elt("thead",null,tr2);
    // 比較テーブルのキャプションを作成
    let savedTableCaption = elt("caption",{id:"savedTableCaption"},""+keywordAnalysisState.savedTableCaption); 
    let savedTable = elt("table",{id:"savedTable"},savedTableCaption,thead,tbody);
    keywordAnalysisViewer.tables.append(savedTable);
}
// ローディング画面を表示
keywordAnalysisViewer.loading = function(){
    const canvas = document.createElement("canvas");
    const table = $("#gray");
    table.append(canvas);

    // Canvasを画面いっぱいに表示する
    function onResize(){
        var tabley = table.offset().top;
        canvas.width = innerWidth * devicePixelRatio;
        canvas.height = innerHeight * devicePixelRatio;
        canvas.style = `position: absolute; top:${tabley}px;left:0px;`
    }
    $(window).resize(onResize());
    onResize();

    requestAnimationFrame(function (t0) {
        const ctx = canvas.getContext("2d");
        render(t0);
        function render(t1){
            if(apiRequest.rakutenAndYahoo.readyState == 4){
                let canvass = $("canvas");
                console.log(canvass)
                canvass.remove();
                return;
            }
            requestAnimationFrame(render);
            ctx.fillStyle = "rgba(0,0,0,0)";
            ctx.fillRect(0,0, canvas.width, canvas.height);
            draw(ctx, t1-t0);
        } 
    });

    const easeInOut = generateCubicBezier(0.42, 0, 0.58, 1);
    function draw(ctx, t){
        ctx.save();
        ctx.clearRect(0,0,innerWidth*devicePixelRatio,innerHeight*devicePixelRatio);
        const canvas = ctx.canvas;
        // Loading表示
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = devicePixelRatio*40+"px Courier,monospace";
        ctx.fillStyle = "black";
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
        ctx.strokeStyle = "rgba(80,80,80,0.8)";
        ctx.lineWidth = radius / 8;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
    }
};



