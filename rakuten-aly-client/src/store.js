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
        analysisResult: [],
        savedAnalysisResult: [],
        filterWord:"",
        savedFilterWord:"",
        saved: false,
        ifReverseAnalysisResult: false,
        ifReverseSavedAnalysisResult: false
    },
    mutations: {
        updateInputedWord(state, payload){
            state.inputedWord = payload;
        },
        updateErrorMessage(state, payload){
            state.errorMessage = payload;
        },
        updateAnalysisResult(state, payload){
            state.analysisResult = payload;
        },
        updateFilterWord(state, payload){
            state.filterWord = payload;
        },
        updateSavedFilterWord(state, payload){
            state.savedFilterWord = payload;
        },
        switchSaved(state){
            state.savedAnalysisResult = JSON.parse(JSON.stringify(state.analysisResult))
            if(!state.saved){
                state.saved = true;
            }
        },
        switchReverse(state, ifSavedTable){
            console.log(state.analysisResult);
            if(!ifSavedTable) {
                if(state.ifReverseAnalysisResult){
                    state.ifReverseAnalysisResult = false;
                } else {
                    state.ifReverseAnalysisResult = true;
                }
            } else {
                if(state.ifReverseSavedAnalysisResult){
                    state.ifReverseSavedAnalysisResult = false;
                } else {
                    state.ifReverseSavedAnalysisResult = true;
                }
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
              if(state.ifReverseAnalysisResult){
                  viewResult.reverse();
              }
              return viewResult;
        },

        savedComputedAnalysisResult(state){
            let viewResult = []
              let j = 1;
              let sentence = new RegExp(state.savedFilterWord)
              for(let i in state.savedAnalysisResult){
                  if(state.savedFilterWord){
                      if(!sentence.test(i)){
                          continue;
                      }
                  }
                  viewResult.push({rank:j,score:state.savedAnalysisResult[i],keyword:i})
                  j++
              }
              if(state.ifReverseSavedAnalysisResult){
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