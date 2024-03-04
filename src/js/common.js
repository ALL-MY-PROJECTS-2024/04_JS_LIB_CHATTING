"use strict"
//----------------------------------------
//SOCKET
//----------------------------------------
const nickname = document.querySelector('#nickname');
const chatInput = document.querySelector('.chatting-input');
let profileImageEl=null;
let fd="null";
let conns;
const socket = io();

//서버에서 보낸 내용(서버 -> 클라이언트들)
socket.on('All',(data)=>{
    
    let arr =  data.split('|')  
    console.log("received..",arr)
    if( arr[0]!=nickname.value){
        createChatNode_You(arr[0],arr[1],arr[2],arr[3])
    }
})

//서버에서 보낸 세션정보 
socket.on('connections',(connections)=>{
    
        const connTitleEl= document.querySelector('.wrapper>header>nav>.right .connected-list>.conn-title>div');
        connTitleEl.innerHTML="접속자 총 : "+connections.length + " 명"
        //기존 자식 삭제
        const connBodyEl= document.querySelector('.wrapper>header>nav>.right .connected-list>.conn-body');
        while (connBodyEl.firstChild) {
                connBodyEl.removeChild(connBodyEl.firstChild);
        }
   
        conns = connections;
        // console.log(connections);
        connections.forEach(conn=>{
            console.log(conn)

            



            const divEl = document.createElement('div');
            divEl.setAttribute('style','width:98%;border:1px solid;margin:2px;display:flex;justify-content:left:align-items:center;padding:2px;');

            
            const leftEl = document.createElement('div');
            leftEl.setAttribute('style','margin-right:2px;width:35px;height:35px; ')
            const imgEl = document.createElement('img');
            imgEl.setAttribute('style','width:100%;height:35px;')
            if(conn.profile==null)
                imgEl.src="https://mblogthumb-phinf.pstatic.net/MjAyMDExMDFfMTgy/MDAxNjA0MjI4ODc1NDMw.Ex906Mv9nnPEZGCh4SREknadZvzMO8LyDzGOHMKPdwAg.ZAmE6pU5lhEdeOUsPdxg8-gOuZrq_ipJ5VhqaViubI4g.JPEG.gambasg/%EC%9C%A0%ED%8A%9C%EB%B8%8C_%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84_%ED%95%98%EB%8A%98%EC%83%89.jpg?type=w800";
            else
                imgEl.src=conn.profile;
            leftEl.appendChild(imgEl);

            const rightEl = document.createElement('div');
            rightEl.innerHTML=conn.nickname;
            rightEl.setAttribute('style',"font-size:.7rem;border : 1px solid;width:90%; display:flex;justify-content:center;align-items:center;");
            divEl.appendChild(leftEl)
            divEl.appendChild(rightEl)
            connBodyEl.appendChild(divEl);

        })
   
})




//----------------------------------------
// PROFILE ClICKED EVENT
//----------------------------------------
const Pimage = document.querySelector('.footer-top>.left>img');
Pimage.addEventListener('click',function(){
   console.log('clicked');
   const connBodyEl= document.querySelector('.wrapper>header>nav>.right .connected-list>.conn-body');



})

//----------------------------------------
// PROFILE DRAG_DROP EVENT
//----------------------------------------
const navLeftEl = document.querySelector('.wrapper>footer .footer-top>.left');
navLeftEl.addEventListener('dragover',function(event){
    console.log('dragover')
    event.preventDefault();

});
navLeftEl.addEventListener('dragleave',function(event){
    console.log('dragleave')
    event.preventDefault();

});
navLeftEl.addEventListener('drop',function(event){

    console.log('drop navLeftEl',event.dataTransfer.files[0]);
    const files =event.dataTransfer.files;
    if(files[0].type.startsWith("image/")){
        const imgTg = document.querySelector('.wrapper>footer .footer-top>.left>img');
        imgTg.src=URL.createObjectURL(files[0]);

       
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = function(e){
            profileImageEl =  e.target.result;
        }

        console.log("reader's result!", profileImageEl);

        

    }
    event.preventDefault();
});

//----------------------------------------

//----------------------------------------
// MENU BTN CLICKED
//----------------------------------------
const menuEl = document.querySelector('.wrapper>header>nav>.right #menu-chk');
menuEl.addEventListener('change',function(event){
    const connectedList = document.querySelector('.wrapper>header>nav>.right .connected-list');
    if(event.target.checked){
        connectedList.classList.remove('hidden');
    }else{
        connectedList.classList.add('hidden');
    }
    
})



//----------------------------------------
// MAIN SECTION DRAG_DROP EVENT
//----------------------------------------
const mainSectionEl = document.querySelector('main>section');
mainSectionEl.addEventListener('dragover',function(event){
    console.log('dragover')
    mainSectionEl.style.backgroundColor="#E6E6E6";
    mainSectionEl.style.opacity=".5"
    event.preventDefault();
})
mainSectionEl.addEventListener('dragleave',function(event){
    console.log('dragleave')
    mainSectionEl.style.backgroundColor="white";
    mainSectionEl.style.opacity="1"
    event.preventDefault();
})
 
mainSectionEl.addEventListener('drop',function(event){
    console.log('drop ',event);
    mainSectionEl.style.backgroundColor="white";
    mainSectionEl.style.opacity="1"
    console.log('drop ',event.dataTransfer.files[0]);

    const files =event.dataTransfer.files;

    
    let i;     
    for(i=0;i<files.length;i++){
       console.log(files[i]);
        if(files[i].type.startsWith("image/")){
            console.log(files[i]);
            const imgtg = document.createElement('img');    //생성
            imgtg.src=URL.createObjectURL(files[i]);        //src경로설정
            imgtg.setAttribute("style","width:50px;height:50px;") //기본스타일지정
            createChatNode_Me(null,files[i]);

            //--------------------------------------
            //SOCKET 
            //--------------------------------------
            
           
            var reader = new FileReader();
            reader.readAsDataURL(files[i]);
           
            reader.onload = function(e){
                fd =  e.target.result;

            }
            setTimeout(()=>{
                console.log("fd",fd);
                var param = {
                    name : nickname.value,
                    msg :null,
                    files : fd,
                    profileImageEl:profileImageEl
                }
                console.log("Main File Upload param...",param);
                socket.emit("All",param)   //서버로 전달
    
            },300)
            //---------------------------------------
        }

    }


    event.preventDefault();
    
})
//----------------------------------------



const textAreaEl =  document.querySelector('.wrapper>footer .footer-input textarea');
textAreaEl.addEventListener('keydown',function(e){

    console.log(e.keyCode);
    if(e.keyCode==13){
        createChatNode_Me(textAreaEl.value,null);
        //--------------------------------------
        //SOCKET 
        //--------------------------------------
        

        const param = {
            name : nickname.value,
            msg :chatInput.value,
            files : null,
            profileImageEl : profileImageEl,
        }
        console.log(param);
        socket.emit("All",param)   //서버로 전달
        //---------------------------------------
        textAreaEl.value="";
    }
});




function createChatNode_You(nickname,msg,filedata,profileimg){
    console.log("createChatNode_You profileimg ",profileimg)
    const mainSectionEl = document.querySelector('.wrapper>main>section');

    const divEl = document.createElement('div');
    
    divEl.setAttribute('style','border:1px solid;width:100%;display:flex;justify-content:left;align-items:start;padding:2px;margin-bottom:2px;');
    
    const leftChildEl = document.createElement('div');
    leftChildEl.setAttribute('style',"height:55px;width:55px;border:1px solid;text-align:center;display:flex;justify-content:center;align-item:center;flex-direction:column;text-align:center;margin-right:2px;")
    const profileImageEl = document.createElement('img');
    profileImageEl.setAttribute('style','width:35px;height:35px;margin:0 auto;');
    if(profileimg!='null'){
        profileImageEl.src = profileimg;

    }else{
        profileImageEl.src = "https://mblogthumb-phinf.pstatic.net/MjAyMDExMDFfMTgy/MDAxNjA0MjI4ODc1NDMw.Ex906Mv9nnPEZGCh4SREknadZvzMO8LyDzGOHMKPdwAg.ZAmE6pU5lhEdeOUsPdxg8-gOuZrq_ipJ5VhqaViubI4g.JPEG.gambasg/%EC%9C%A0%ED%8A%9C%EB%B8%8C_%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84_%ED%95%98%EB%8A%98%EC%83%89.jpg?type=w800";
    }

    const spanEl = document.querySelector('span')
    spanEl.innerHTML=nickname;
    spanEl.setAttribute('style','font-size:.6rem;display:block;width:100%;text-align:center;');

    const rightChildEl = document.createElement('div');
 
    rightChildEl.setAttribute('style',"width:100%;height:100%;border:1px solid;padding:2px;");
    
    if(msg!='null')
        rightChildEl.innerHTML=msg;

    if(filedata!='null'){
        const atg = document.createElement('a');  
        atg.setAttribute('href',"javascript:openWindowFunc('"+filedata+"')");
        // atg.setAttribute('target',"_blank");
   
       
        const imgtg = document.createElement('img');  
          //생성
        imgtg.src=filedata;
        imgtg.setAttribute("style","width:50px;height:50px;") //기본스타일지정
        atg.appendChild(imgtg);
        rightChildEl.appendChild(atg);
    }


    leftChildEl.appendChild(profileImageEl);
    leftChildEl.appendChild(spanEl);
    divEl.appendChild(leftChildEl);
    divEl.appendChild(rightChildEl);
    mainSectionEl.appendChild(divEl);
    //스크롤 아래로 내리기
    mainSectionEl.scrollTo(0, mainSectionEl.scrollHeight);


}


function createChatNode_Me(data,file){
    const mainSectionEl = document.querySelector('.wrapper>main>section');

    const divEl = document.createElement('div');
    //divEl.setAttribute('style','height:60px;border:1px solid;width:100%;margin:2px auto;display:flex;justify-content:right;align-items:center;padding:2px;');
    divEl.setAttribute('style','border:1px solid;width:100%;margin:2px auto;display:flex;justify-content:right;align-items:center;padding:2px;');
    
    const leftChildEl = document.createElement('div');
  
    const rightChildEl = document.createElement('div');
   
     
    
    //이미지 삽입
    if(file!=null){
        const a = document.createElement('a');    //생성
        a.href=URL.createObjectURL(file);
        a.setAttribute('target','_blank');
        const imgtg = document.createElement('img');    //생성
        imgtg.src=URL.createObjectURL(file);        //src경로설정
        imgtg.setAttribute("style","width:50px;height:50px;") //기본스타일지정
        a.appendChild(imgtg);
        rightChildEl.appendChild(a);
    }else{
        rightChildEl.innerHTML=data;
                
    }
    rightChildEl.setAttribute('style',"border:1px solid;background-color:#FAE100;text-align:right;padding:5px 10px;");

    

    divEl.appendChild(leftChildEl);
    divEl.appendChild(rightChildEl);
    mainSectionEl.appendChild(divEl);
    //스크롤 아래로 내리기
    mainSectionEl.scrollTo(0, mainSectionEl.scrollHeight);


}


function openWindowFunc(data){
    console.log('openWindowFunc',data);
    // Create a new window or open a new tab
    var newWindow = window.open();

    // Write the base64-encoded image data to the new window

    newWindow.document.write('<img src="' + data + '" />');
    const imgEl =  newWindow.document.querySelector('img');
    imgEl.setAttribute('style','position:absolute;left:0;top:0;right:0;bottom:0;margin:auto;')
    newWindow.document.body.style.backgroundColor="black";


}