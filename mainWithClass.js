
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





/*------------------------------------------------------------------
ctrl:ユーザーの入力に対応し、stateメソッドもしくはreqメソッドを呼び出す。
-------------------------------------------------------------------*/
ctrl.button = document.getElementById("button");
ctrl.button.addEventListener("click",function(e){
    e.preventDefault();
    let sentence = document.getElementById("sentence").value;
    if(sentence.length<128){
        state.makeCaption1(sentence);
    }
    req.open("POST", "http://127.0.0.1:3000/form");
    req.setRequestHeader("content-type","application/x-www-form-urlencoded");
    req.responseType="json";
    req.send("sentence="+sentence);
});
ctrl.save = document.getElementById("save");
ctrl.save.addEventListener("click",function(e){
    if(state.receivedResult.length == 0){
        state.makeShortResult("Error: 保存する結果がありません");
    } else {
        state.save();
        ctrl.addCtrl();
    }
});
ctrl.reverse1 = document.getElementById("reverse1");
ctrl.reverse1.addEventListener("click",function(e){
    state.ReverseFirstResult();
});
ctrl.filterButton1 = document.getElementById("filterButton1");
ctrl.filterButton1.addEventListener("click",function(e){
    e.preventDefault();
    let filter = document.getElementById("filterInput1").value
    state.filterResult(filter);
});
ctrl.filterClear1 = document.getElementById("filterClear1");
ctrl.filterClear1.addEventListener("click",function(e){
    e.preventDefault();
    state.ClearFirstFilter();
})
// ２つ目のテーブルにイベントリスナを設置するメソッド
ctrl.addCtrl = function(){
    ctrl.reverse2 = document.getElementById("reverse2");
    ctrl.reverse2.addEventListener("click",function(e){
        e.preventDefault();
        state.ReverseCopyedResult();
        ctrl.addCtrl();
    })
    ctrl.filterButton2 = document.getElementById("filterButton2");
    ctrl.filterButton2.addEventListener("click",function(e){
        e.preventDefault();
        let filter = document.getElementById("filterInput2").value
        state.filterCopyedResult(filter);
        ctrl.addCtrl();
    });
    ctrl.filterClear2 = document.getElementById("filterClear2");
    ctrl.filterClear2.addEventListener("click",function(e){
        state.filterCopyedResult("");
        ctrl.addCtrl();
    });
};

/*------------------------------------------------------------------
vw：stateに保存された状態を、ブラウザに出力する機能を持つ
-------------------------------------------------------------------*/
vw.shortResult = document.getElementById("shortResult");
vw.resultTable = document.getElementById("resultTable");
vw.tables = document.getElementById("table");
vw.updateShortResult = function(){
    vw.shortResult.innerHTML = state.shortResult;
}
vw.updateResult1 = function(result){ // result1のtbodyを更新
    console.log(result); 
    let caption = document.getElementById("caption")
    caption.innerHTML = state.firstCaption;
    if(vw.resultTable.hasChildNodes){ // 既にある分析結果を削除
        while(resultTable.firstChild){
            resultTable.removeChild(resultTable.firstChild);
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
            vw.resultTable.appendChild(tr);
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

    let caption2 = elt("caption",{id:"caption2"},state.secondCaption); // 比較テーブルのキャプションを作成
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
        state.makeShortResult(result);
    } else {
        state.makeShortResult("");
        state.makeCaption1(document.getElementById("sentence").value);
        state.makeResult1(result);
    }
})
// 通信中に操作不能とする処理
req.onreadystatechange = function(){
    if(req.readyState == 1||2||3){
        ctrl.button.setAttribute("disabled",true);
        ctrl.save.setAttribute("disabled",true);
        vw.loading();
    }
    if(req.readyState == 0||4){
        ctrl.button.removeAttribute("disabled");
        ctrl.save.removeAttribute("disabled");
    }
}
