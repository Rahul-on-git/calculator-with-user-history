class Calculator {
    constructor(current, previous) {
        this.current = current
        this.previous = previous
        this.clear()
    }
    clear () {
        this.currentOp = ''
        this.prevOp = ''
        this.operator = undefined
        this.current.innerText = this.currentOp
        this.previous.innerText = this.prevOp
    }

    delChar() {
        this.currentOp = this.currentOp.slice(0,-1)
        this.current.innerText = this.currentOp
    }

    appendNum(currentNum) {
        this.currentOp = this.currentOp + currentNum.toString()
        this.current.innerText = this.currentOp
    }

    appendOperator(currentOperator) {
        if(this.current.innerText === '') {
            this.showError()
            return
        }

        if(this.prevOp === '') {
            this.operator = currentOperator
            this.currentOp = this.currentOp.toString() + currentOperator.toString()
            this.prevOp = new String(this.currentOp)
            this.previous.innerText = this.prevOp
        } else {
            this.addToHistory()
            this.computePrev(currentOperator)
            this.operator = currentOperator
        }

        this.currentOp =''
        this.current.innerText = this.currentOp
    }

    computePrev(currentOperator) {

        switch (this.operator) {
            case '+':
                this.prevOp = (parseFloat(this.prevOp.slice(0,-1)) + parseFloat(this.currentOp))+currentOperator
                break;

            case '-':
                this.prevOp = (parseFloat(this.prevOp.slice(0,-1)) - parseFloat(this.currentOp))+currentOperator
                break;

            case 'x':
                this.prevOp = (parseFloat(this.prevOp.slice(0,-1)) * parseFloat(this.currentOp))+currentOperator
                break;

            case '÷':
                if(parseFloat(this.currentOp)==parseFloat(0)) {
                    this.showError();
                    break;
                }
                this.prevOp = (parseFloat(this.prevOp.slice(0,-1)) / parseFloat(this.currentOp))+currentOperator
                break;
        
            default:
                break;
        }
        this.previous.innerText= this.prevOp
    }

    computeEquals () {
        if(this.current.innerText==='') return
        this.addToHistory()

        switch (this.operator) {
            case '+':
                this.currentOp = parseFloat(this.prevOp.slice(0,-1)) + parseFloat(this.currentOp)
                break;

            case '-':
                this.currentOp = parseFloat(this.prevOp.slice(0,-1)) - parseFloat(this.currentOp)
                break;

            case 'x':
                this.currentOp = parseFloat(this.prevOp.slice(0,-1)) * parseFloat(this.currentOp)
                break;

            case '÷':
                if(parseFloat(this.currentOp)==parseFloat(0)) {
                    this.showError();
                    break;
                }
                this.currentOp = parseFloat(this.prevOp.slice(0,-1)) / parseFloat(this.currentOp)
                break;
        
            default:
                break;
        }
        this.current.innerText = this.currentOp
        this.prevOp = ''
        this.previous.innerText = this.prevOp
        this.operator = '='
        return;
    }

    addDecimal () {
        if(this.current.innerText.includes('.')) {
            this.showError();
            return
        }

        this.currentOp = this.currentOp + '.'
        this.current.innerText = this.currentOp
    }

    addToHistory () {
        if(!this.operator || this.operator==='=') return
        
        let historyElement = document.createElement('div')
        let historyItem = `${this.prevOp.slice(0,-1)} ${this.operator} ${this.currentOp}`
        historyElement.innerText = historyItem
        historyElement.classList.add('historyItem')
        historyBox.appendChild(historyElement)

        this.registerEventListenerForHistoryItem(historyElement);
    }

    registerEventListenerForHistoryItem(createdHistoryElement) {

        createdHistoryElement.addEventListener('click', () => {
            this.loadFromHistory(createdHistoryElement.innerText)
        })
    }

    loadFromHistory (historyText) {

        this.prevOp = ''
        this.previous.innerText = this.prevOp
        this.operator = ''

        if(historyText.includes('+')) {
            this.currentOp = parseFloat(historyText.split('+')[0]) + parseFloat(historyText.split('+')[1])
        } else if(historyText.includes('-')) {
            this.currentOp = parseFloat(historyText.split('-')[0]) - parseFloat(historyText.split('-')[1])
        } else if(historyText.includes('x')) {
            this.currentOp = parseFloat(historyText.split('x')[0]) * parseFloat(historyText.split('x')[1])
        } else if(historyText.includes('÷')) {
            if(parseFloat(historyText.split('÷')[1])==parseFloat(0)) {
                this.showError()
                this.clear()
                return
            }
            this.currentOp = parseFloat(historyText.split('÷')[0]) / parseFloat(historyText.split('÷')[1])
        }

        this.current.innerText = this.currentOp

    }

    showError() {
        screen.classList.add('err')
        this.clear()
        setTimeout(()=>{
            screen.classList.remove('err')
        }, 200)
    }

}

const operands = document.querySelectorAll('.operand')
const operator = document.querySelectorAll('.operator')
const del = document.querySelector('.delete')
const decimal = document.querySelector('.decimal')
const clear = document.querySelector('.clear')
const equals = document.querySelector('.equals')
const screen = document.querySelector('.screen')
const screenCurr = document.querySelector('.screen-curr')
const screenPrev = document.querySelector('.screen-prev')
const historyBox = document.querySelector('.history')
const historyItem = document.querySelectorAll('.historyItem')

const calc = new Calculator(screenCurr, screenPrev);

operands.forEach(eachOperand => {
    eachOperand.addEventListener('click', () => {
        if(calc.operator == '=') calc.clear()
        calc.appendNum(eachOperand.innerText)
    })
})

operator.forEach((eachOperator) => {
    eachOperator.addEventListener('click', () => {
        calc.appendOperator(eachOperator.innerText);
    })
})

clear.addEventListener('click', () => {
    calc.clear()
})

del.addEventListener('click', () => {
    calc.delChar()
})

equals.addEventListener('click', ()=>{
    if(calc.previous.innerText !== '' && calc.current.innerText !== '' && /[-+÷x]/.test(calc.current.innerText) && calc.this.operator==='=') {
        return;
    }
    calc.computeEquals();
})

decimal.addEventListener('click', () => {
    calc.addDecimal();
})
