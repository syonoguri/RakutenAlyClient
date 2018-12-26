const req = new XMLHttpRequest();

const button = document.getElementById("loginButton");
const loginName = document.getElementById("loginName");
const loginPassword = document.getElementById("loginPassword");

button.addEventListener("click",function(e){
    e.preventDefault();

    req.open("POST", "http://127.0.0.1:3000/form");
    req.setRequestHeader("content-type","application/x-www-form-urlencoded");
    req.responseType="json";
    req.send("loginName="+loginName.value+"&loginPassword="+loginPassword.value);
});

req.addEventListener("load",function(){
    let result = req.response;
    console.log(result);
    let loginResult = document.getElementById("loginResult");
    if(result==true){
        loginResult.innerHTML="success"
    } else {
        loginResult.innerHTML="error!"
    }
})