import "babel-polyfill"
import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"



Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
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
    },
    mutations: {
        updateInputedWord(state, payload){
            state.inputedWord = payload;
        },
        updateErrorMessage(state, payload){
            state.errorMessage = payload;
        },
        updateAnalysisResult(state, payload){
            state.analysisResult = payload
        },
        switchSaved(state){
            state.savedAnalysisResult = JSON.parse(JSON.stringify(state.analysisResult))
            if(state.saved){
                state.saved = false;
            } else {
                state.saved = true;
            }
        }
    },
    getters:{
        computedAnalysisResult(state){
            let viewResult = []
              let j = 1;
              let sentence = new RegExp(state.filterWord)
              for(let i in state.analysisResult){
                  if(state.filterWord){
                      if(!sentence.test(i)){
                          continue;
                      }
                  }
                  viewResult.push({rank:j,score:state.analysisResult[i],keyword:i})
                  j++
              }
              if(state.reverse){
                  viewResult.reverse();
              }
              return viewResult;
            }
    },
    actions:{
        submitToApi(){
            let data = "sentence="+this.state.inputedWord;
            this.commit("updateErrorMessage","")
            this.state.resultCaption = JSON.parse(JSON.stringify(this.state.inputedWord));
            axios
                .post("http://127.0.0.1:3000/form",data)
                .then((response)=> {
                    if(typeof response.data == "string"){
                        this.commit("updateErrorMessage",response.data)
                    } else {
                        this.commit("updateAnalysisResult",response.data)
                    }
                })
        }
    }
})
export default store