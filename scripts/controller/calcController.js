 /*1. A função construtora inicializa várias propriedades da classe `CalcController`. Essas propriedades incluem `_audio` para reprodução de áudio, `_audioOnOff` para controlar o estado do áudio, `_lastOperator` para armazenar o último operador usado, `_lastNumber` para armazenar o último número inserido, `_operation` para armazenar a operação de cálculo atual e ` _locale` para fins de localização. Ele também inicializa vários elementos DOM e configura ouvintes de eventos */
class CalcController {
   constructor() {
       // Por convenção, _ antes do nome indica private;  
       
       this._audio = new Audio('click.mp3');
       this._audioOnOff = false;
       this._lastOperator = '';
       this._lastNumber = '';

       this._operation = [];
       this._locale = 'pt-BR';

       // Por convenção, el no final do nome indica que é uma variável de elemento;
       this._displayCalcEl = document.querySelector("#display");
       this._dateEl = document.querySelector("#data");
       this._timeEl = document.querySelector("#hora");
       this._currentDate;
       this.initialize();
       this.initButtonEvents();
       this.setLastNumberToDisplay();
       this.initKeyboard();
   }

   // No JavaScript, você pode gerenciar o DOM (Documento) e o BOM (Navegador). Todas as tags são objetos DOM;
  // O método `initialize` define a data e hora de exibição, inicializa eventos de botão, define o último número a ser exibido e inicializa eventos de teclado.
   initialize() {

       this.setDisplayDateTime();
       setInterval(() => {
           this.setDisplayDateTime();

       }, 1000);

       this.setLastNumberToDisplay(); 
      

       document.querySelectorAll('.btn-ac').forEach(btn => {

      btn.addEventListener('dblclick', e=> {


         this.toggleAudio();


      });

    });

   }
 
   //O método `toggleAudio` alterna a propriedade `_audioOnOff` para controlar a reprodução de áudio.
   toggleAudio(){

      this._audioOnOff = !this._audioOnOff;
   }

   //O método `playAudio` reproduz o áudio se `_audioOnOff` for verdadeiro.
   playAudio(){

   if(this._audioOnOff){
   

      this._audio.currentTime = 0;
      this._audio.play();


      }

   }

  
   //O método `initKeyboard` configura ouvintes de evento para entrada de teclado e chama `playAudio` para reproduzir áudio ao pressionar a tecla.
   initKeyboard(){

      document.addEventListener('keyup', e=> {

      this.playAudio();

         switch (e.key) {
           
            case 'Escape':
                this.clearAll();
                break;
           
            case 'Backspace':
                this.clearEntry();
                break;

            case '+':
            case '-':
            case '*':
            case '/':
            case '%':
               this.addOperation(e.key);
               break;

            case 'Enter':
            case '=':
                this.calc();
                break;

            case '.':
            case ',':
                this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(e.key));
                break;

           

         }

      });


   }
 
   /// Vários métodos utilitários, como `addEventListenerAll`, `clearAll`, `clearEntry`, `getLastOperation`, `setLastOperation`, `isOperator`, `pushOperation`, `getResult`, `calc`, `getLastItem` e `setLastNumberToDisplay ` são implementados para lidar com as operações e exibição da calculadora.
   addEventListenerAll(element, events, fn) {
       events.split(' ').forEach(event => {
           element.addEventListener(event, fn, false);
       })
   }

   clearAll() {
       this._operation = [];
       this._lastNumber = '';
       this._lastOperator = '';



       this.setLastNumberToDisplay();
   }

   clearEntry() {
       this._operation.pop();
       this.setLastNumberToDisplay();
   }

   getLastOperation() {
       return this._operation[this._operation.length - 1];
   }

   setLastOperation(value) {
       this._operation[this._operation.length - 1] = value;
   }

   isOperator(value) {
       return (['+', '-', '*', '/', '%'].indexOf(value) > -1)
   }

   pushOperation(value) {
       this._operation.push(value);
       if (this._operation.length > 3) {
           this.calc();
       }
   }

   getResult() {

      try {
       return eval(this._operation.join(''));
      } catch(e){
         setTimeout(()=> {
            this.setError();
       }, 1);
     
      }
   }

   calc() {

       let last = '';
       this._lastOperator = this.getLastItem(true);

       if (this._operation.length < 3) {
           console.log('Lenght < 3: ' + this._operation);
           let firstItem = this._operation[0];
           this._operation = [firstItem, this._lastOperator, this._lastNumber];
       }

       if (this._operation.length > 3) {
           console.log('Lenght > 3: ' + this._operation);
           last = this._operation.pop();
           this._lastNumber = this.getResult();

       } else if (this._operation.length === 3) {
           console.log('Lenght = 3: ' + this._operation);
           this._lastNumber = this.getLastItem(false);
       }

       let result = this.getResult();

       if (last === '%') {
           result /= 100;
           this._operation = [result];
       } else {
           this._operation = [result];
           if (last) this._operation.push(last);
       }

       this.setLastNumberToDisplay();
   }

   getLastItem(isOperator = true) {
       let lastItem;
       for (let i = this._operation.length - 1; i >= 0; i--) {
           if (this.isOperator(this._operation[i]) == isOperator) {
               lastItem = this._operation[i];
               break;
           }
       }
       if (!lastItem) {
           // a = b -> if // ? -> então // : -> se não;
           lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
       }
       return lastItem;
   }

       setLastNumberToDisplay(){
       let lastNumber = this.getLastItem(false);
       if (!lastNumber) lastNumber = 0;
       this.displayCalc = lastNumber;
   }


   //O método `addOperation` lida com a adição de números e operadores à matriz de operação com base na entrada do usuário.
   addOperation(value) {
       if (isNaN(this.getLastOperation())) {
           // O último valor não é um número


           if (this.isOperator(value)) {
               // O valor digitado é um operador, deve alterar o operador
              

               this.setLastOperation(value);

           } else {
               // O valor digitado é um número
               
               this.pushOperation(value);
               this.setLastNumberToDisplay();
           }
       } else {
           // O último valor é um número
           if (this.isOperator(value)) {
               // O valor digitado é um operador
               console.log('// Typed value is operator');
               this.pushOperation(value);

           } else {
               // O valor digitado é um númeroyped value is a number');

               let newValue = this.getLastOperation().toString() + value.toString();
               this.setLastOperation(newValue);
               this.setLastNumberToDisplay();
           }
       }
   }

   setError() {
       this.displayCalc = 'Error';
   }

   addDot(){

     let lastOperation =  this.getLastOperation();

     //a operaçao lastOperation existe? e(&&) ela já possui o ponto?
     //essa variavel lastoperation , esta vindo um texto nela? Dentro desse texto split, tem um ponto? Se nao tiver ponto continua. Se  tiver um ponto para aqui e retorne.
     if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > - 1)return;



     //verificando se é um operador:
     // Se isoperator é um aperador de lastoperador ou(|| or = uma ou outra condição) ele nao existir undefined, ! ela sera true.


     if (this.isOperator(lastOperation) || !lastOperation){
      this.pushOperation('0.');

     } else {
      this.setLastOperation(lastOperation.toString() + '.');

     }

      this.setLastNumberToDisplay();


   }

   execBtn(value) {

      this.playAudio();

       switch (value) {
           // All Clear
           case 'ac':
               this.clearAll();
               break;
           // Cancel Entry
           case 'ce':
               this.clearEntry();
               break;
           case 'soma':
               this.addOperation('+');
               break;
           case 'subtracao':
               this.addOperation('-');
               break;
           case 'divisao':
               this.addOperation('/');
               break;
           case 'multiplicacao':
               this.addOperation('*');
               break;
           case 'porcento':
               this.addOperation('%');
               break;
           case 'igual':
               this.calc();
               break;
           case 'ponto':
               this.addDot();
               break;
           case '0':
           case '1':
           case '2':
           case '3':
           case '4':
           case '5':
           case '6':
           case '7':
           case '8':
           case '9':
               this.addOperation(parseInt(value));
               break;
           default:
               this.setError();
       }
       // Por precaução, mostre toda vez que um botão for clicado ou arrastado
       console.log(this._operation);
   }

   initButtonEvents() {
       // Pegue todas as TAGS g dentro dos #botões de ID, querySelectorAll();

       let buttons = document.querySelectorAll('#buttons > g, #parts > g');
       buttons.forEach((btn, index) => {


           this.addEventListenerAll(btn, 'click drag', e => {
               // é assim que você obtém a classe de uma imagem feita por um SVG;
               let textBtn = btn.className.baseVal.replace('btn-', '');
               this.execBtn(textBtn);
           });
           this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {
               // Transforme o cursor em um ponteiro;
               btn.style.cursor = 'pointer';
           })
       })
   }

   setDisplayDateTime() {
       this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
           day: '2-digit',
           month: 'long',
           year: 'numeric'
       });
       this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
   }

   // Display Time
 // Os métodos getter e setter são implementados para várias propriedades, como `displayTime`, `displayDate`, `displayCalc` e `currentDate` para atualizar os elementos DOM correspondentes.

   get displayTime() {
       return this._timeEl;
   }

   set displayTime(value) {
       this._timeEl.innerHTML = value;
   }

   // Display Date

   get displayDate() {
       return this._dateEl;
   }

   set displayDate(value) {
       this._dateEl.innerHTML = value;
   }

   // Display Calc

   get displayCalc() {
       return this._displayCalcEl.innerHTML;
   }

   set displayCalc(value) {

      if (value.toString().length > 10){
         this.setError();
         return false;
      }

       this._displayCalcEl.innerHTML = value;
   }

   // Current Date

   get currentDate() {
       return new Date();
   }

   set currentDate(value) {
       this._currentDate = value;
   }
}