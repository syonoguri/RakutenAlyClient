// 分析結果を保持・改変するクラス

class State {
    constructor(){
        this.firstCaption = "検索キーワード"
        this.receivedResult = [];
        this.filteredResult = [];
        this.secondCaption = "";
        this.copyedResult = [];
        this.filteredCopyedResult = [];
        this.shortResult = ""
    }
    // エラーメッセージを格納
    makeShortResult(message){ 
        this.shortResult = message;
        vw.updateShortResult();
    };
    // 入力されたキーワードを格納
    makeCaption1(caption){ 
        this.firstCaption = caption;
    };
    // 分析結果を格納
    makeResult1(result){ 
        this.receivedResult = [];
        for(var i in result){
            this.receivedResult.push({score:result[i],keyword:i});
        }
        this.filteredResult = JSON.parse(JSON.stringify(this.receivedResult));
        vw.updateResult1(this.filteredResult);
        console.log(this.filteredResult);
        console.log(this.receivedResult);
    };
    // 分析結果を切り取り＆ペースト
    save(){ 
        this.copyedResult = this.receivedResult;
        this.secondCaption = this.firstCaption;
        this.receivedResult = [];
        this.filteredCopyedResult = JSON.parse(JSON.stringify(this.filteredResult));
        this.filteredResult = JSON.parse(JSON.stringify(this.receivedResult));
        this.firstCaption = "検索キーワード";
        vw.updateResult1(this.filteredResult);
        vw.updateResult2(this.filteredCopyedResult);
    };
    // 結果を反転
    ReverseFirstResult(){
        console.log(JSON.parse(JSON.stringify(this.filteredResult)));
        console.log(this.receivedResult);
        // this.fil1.reverse();
        this.filteredResult.reverse();
        console.log(JSON.parse(JSON.stringify(this.filteredResult)));
        console.log(this.receivedResult);

        vw.updateResult1(this.filteredResult);
    };
    ReverseCopyedResult(){
        this.filteredCopyedResult.reverse();
        vw.updateResult2(this.filteredCopyedResult);
    };
    filterResult(filter){
        this.filteredResult = [];
        console.log("keyword");
        let sentence = new RegExp(filter);
        for(let i of this.receivedResult){
            if(sentence.test(i["keyword"])){
                console.log(i["keyword"]);
                console.log(this.filteredResult);
                this.filteredResult.push(i);
            }
        }
        vw.updateResult1(this.filteredResult);
    };
    filterCopyedResult(filter){
        this.filteredCopyedResult = [];
        let sentence = new RegExp(filter);
        for(let i of this.copyedResult){
            if(sentence.test(i["keyword"])){
                this.filteredCopyedResult.push(i);
            }
        }
        vw.updateResult2(this.filteredCopyedResult);
    };
    ClearFirstFilter(){
        this.filterResult("");
    }
}

const state = new State();