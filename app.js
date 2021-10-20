document.addEventListener('DOMContentLoaded',()=>{
    const grid = document.querySelector('.grid')
    const button=document.getElementById('button')
    const title=document.getElementById('title')
    let width=10
    let bombAmount=15
    let squares=[]
    let isGameOver=false
    let digMode=true
    let flags=0;
    button.addEventListener('click',function(e){
        setMode()
    })

    //create board
    function createBoard(){
        const bombArray=Array(bombAmount).fill('bomb')
        const emptyArray=Array(width*width-bombAmount).fill('valid')
        const gameArray=emptyArray.concat(bombArray)
        const shuffledArray=shuffle(gameArray)

        for(let i=0; i<width*width; i++){
            const square= document.createElement('div')
            square.setAttribute('id',i)
            square.classList.add(shuffledArray[i],'active')
            grid.appendChild(square)
            squares.push(square)
            
            square.addEventListener('click',function(e){
                    click(square)
                })
        }
        
        for (let i=0; i<squares.length; i++){
            let total=0
            //find if the square is right or left edged
            const isLeftEdge= (i %width===0)
            const isRightEdge=(i% width===width-1)
            //check the number of bombs around each square
            if (squares[i].classList.contains('valid')){
                if(i>0 && !isLeftEdge && squares[i-1].classList.contains('bomb')) total++
                if(i>9 && !isRightEdge && squares[i+1 -width].classList.contains('bomb')) total++
                if(i>10 &&squares[i-width].classList.contains('bomb')) total++
                if(i>11 && !isLeftEdge && squares[i-1-width].classList.contains('bomb')) total++
                if(i<98 && !isRightEdge && squares[i+1].classList.contains('bomb')) total++
                if(i<90 && !isLeftEdge && squares[i-1+width].classList.contains('bomb')) total++
                if(i<88 && !isRightEdge && squares[i+1+width].classList.contains('bomb')) total++
                if(i<89 && squares[i+width].classList.contains('bomb')) total++

                squares[i].setAttribute('data',total)
            }

        }
    }
    createBoard()

    //set whether the player is digging or putting flags
    function setMode(){
        if(!isGameOver){
            digMode=!digMode;
            if(digMode) {
            button.innerHTML="Dig Mode"
            }
            else{
                button.innerHTML="Flag Mode"
            }
        }
    }

    // putting flags on bombs
    function flag(square){
        if(square.classList.contains('active')){
            if(square.classList.contains('flag')){
                square.backgroundColor='#808080'
                square.innerHTML=''
                square.classList.remove('flag')
                flags-=1;
            }
            else if(flags<bombAmount){
                square.innerHTML='🏴'
                square.classList.add('flag')
                flags+=1;
                console.log(flags)
            }
            checkWin()
            
        }

    }

    //when a square is clicked
    function click(square){
        if(digMode){
            //square id
            currentId=square.id;
            //if the button hasn't been clicked before
            if(square.classList.contains('active')&&!square.classList.contains('flag')){
                //if there is a bomb, then game over!
                if(square.classList.contains('bomb')){
                    square.style.backgroundColor='#A20021'
                    square.innerHTML='💣'
                    alert('Game over! You clicked a Bomb!')
                    //game over user can't interact with the board
                    grid.style.pointerEvents='none'
                    square.classList.remove('active')
                    gameOver()
            
                }else{
                    let total=square.getAttribute('data')
                    //so we don't display zero
                    if (total!=0){
                        square.classList.remove('active')
                        square.style.backgroundColor='white'
                        square.innerHTML=square.getAttribute('data')
                        return
                    }
                    square.classList.remove('active')
                    square.style.backgroundColor='white'
                    checkSquare(square,currentId)
                }
            }

        }
        else{
            flag(square)
        }
        
    }
    //check neighboring squares
    function checkSquare(square,currentId){
        const isLeftEdge= (currentId%width===0)
        const isRightEdge=(currentId% width===width-1)

        setTimeout(()=>{
            if(currentId>0 &&!isLeftEdge){
                const newId=squares[parseInt(currentId)-1].id
                const newSquare=document.getElementById(newId)
                click(newSquare)
            }
            if(currentId>9 &&!isRightEdge){
                const newId=squares[parseInt(currentId)+1-width].id
                const newSquare=document.getElementById(newId)
                click(newSquare)
            }
            if(currentId>10){
                const newId=squares[parseInt(currentId)-width].id
                const newSquare=document.getElementById(newId)
                click(newSquare)
            }
            if(currentId>11 &&!isLeftEdge){
                const newId=squares[parseInt(currentId)-1-width].id
                const newSquare=document.getElementById(newId)
                click(newSquare)
            }
            if(currentId<98 &&!isRightEdge){
                const newId=squares[parseInt(currentId)+1].id
                const newSquare=document.getElementById(newId)
                click(newSquare)
            }
            if(currentId<90 &&!isLeftEdge){
                const newId=squares[parseInt(currentId)-1+width].id
                const newSquare=document.getElementById(newId)
                click(newSquare)
            }
            if(currentId<88 &&!isRightEdge){
                const newId=squares[parseInt(currentId)+1+width].id
                const newSquare=document.getElementById(newId)
                click(newSquare)
            }
            if(currentId<89){
                const newId=squares[parseInt(currentId)+width].id
                const newSquare=document.getElementById(newId)
                click(newSquare)
            }
            
        },10)




    }

    function shuffle(array) {
        //this function code from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }

    function gameOver(){
        isGameOver=true
        title.innerHTML='Game Over!'
        button.innerHTML="Play Again!"
        //play again button
        button.setAttribute('onClick',"location.href='index.html'")
        //show solution
        squares.forEach(square=>{
            if(square.classList.contains('bomb')){
                square.innerHTML='💣'
                square.style.backgroundColor='#A20021'
            }
        })
    }

    function checkWin(){
        let match=0
        for(let i=0; i<squares.length;i++){
            if(squares[i].classList.contains('flag')&&squares[i].classList.contains('bomb')){
                match++
            }
            if(match===bombAmount){
                title.innerText="You Have located all the bombs!"
                button.innerHTML="Play Again!"
                //play again button
                button.setAttribute('onClick',"location.href='index.html'")
                
            }
        }
    }
})
