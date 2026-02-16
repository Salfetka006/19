document.addEventListener('DOMContentLoaded', function() {
    const previousOperandElement = document.querySelector('.previous-operand');
    const currentOperandElement = document.querySelector('.current-operand');
    const buttons = document.querySelectorAll('.btn');
    
    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let resetCurrentOperand = false;
    
    function factorial(n) {
        if (n < 0 || !Number.isInteger(n)) return 'Error';
        if (n > 170) return 'Error';
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    }
    
    function fibonacci(n) {
        if (n < 0 || !Number.isInteger(n)) return 'Error';
        if (n > 79) return 'Error';
        if (n === 0) return 0;
        if (n === 1) return 1;
        let a = 0, b = 1;
        for (let i = 2; i <= n; i++) {
            let temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }
    
    function power(base, exponent) {
        if (base === 0 && exponent === 0) return 'Error: неопределенность';
        if (base === 0 && exponent < 0) return 'Error';
        return Math.pow(base, exponent);
    }
    
    function updateDisplay() {
        currentOperandElement.textContent = currentOperand;
        
        if (operation) {
            const symbol = getOperationSymbol(operation);
            previousOperandElement.textContent = `${previousOperand} ${symbol}`;
        } else {
            previousOperandElement.textContent = previousOperand;
        }
        
        if (currentOperand === 'Error' || currentOperand.startsWith('Error:')) {
            currentOperandElement.style.color = '#ff3b30';
        } else {
            currentOperandElement.style.color = '#fff';
        }
    }
    
    function getOperationSymbol(op) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷',
            'sin': 'sin',
            'cos': 'cos',
            'tg': 'tg',
            'ctg': 'ctg',
            'sqrt': '√',
            'exp': 'eˣ',
            '^2': '²',
            '^': '^',
            '!': '!',
            'fib': 'F',
            '.': '.'
        };
        return symbols[op] || op;
    }
    
    function appendNumber(number) {
        if (currentOperand === '0' || resetCurrentOperand || currentOperand.startsWith('Error')) {
            currentOperand = number;
            resetCurrentOperand = false;
        } else {
            currentOperand += number;
        }
    }
    
    function addDecimal() {
        if (resetCurrentOperand) {
            currentOperand = '0.';
            resetCurrentOperand = false;
            return;
        }
        
        if (!currentOperand.includes('.')) {
            currentOperand += '.';
        }
    }
    
    function chooseOperation(op) {
        const unaryOperations = ['sin', 'cos', 'tg', 'ctg', 'sqrt', 'exp', '^2', '!', 'fib'];
        
        if (currentOperand.startsWith('Error')) return;
        
        if (unaryOperations.includes(op)) {
            computeUnaryOperation(op);
            return;
        }
        
        if (op === '.') {
            addDecimal();
            updateDisplay();
            return;
        }
        
        if (currentOperand === '') return;
        
        if (previousOperand !== '') {
            compute();
        }
        
        operation = op;
        previousOperand = currentOperand;
        resetCurrentOperand = true;
        updateDisplay();
    }
    
    function computeUnaryOperation(op) {
        const value = parseFloat(currentOperand);
        let result;
        
        switch(op) {
            case 'sin':
                result = Math.sin(value * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(value * Math.PI / 180);
                break;
            case 'tg':
                const tanValue = Math.tan(value * Math.PI / 180);
                if (Math.abs(Math.cos(value * Math.PI / 180)) < 1e-10) {
                    result = 'Error';
                } else {
                    result = tanValue;
                }
                break;
            case 'ctg':
                const cosValue = Math.cos(value * Math.PI / 180);
                const sinValue = Math.sin(value * Math.PI / 180);
                if (Math.abs(sinValue) < 1e-10) {
                    result = 'Error';
                } else {
                    result = cosValue / sinValue;
                }
                break;
            case 'sqrt':
                result = value >= 0 ? Math.sqrt(value) : 'Error';
                break;
            case 'exp':
                result = Math.exp(value);
                break;
            case '^2':
                result = Math.pow(value, 2);
                break;
            case '!':
                result = factorial(Math.floor(value));
                break;
            case 'fib':
                result = fibonacci(Math.floor(value));
                break;
            default:
                return;
        }
        
        if (result === 'Error') {
            currentOperand = result;
            operation = undefined;
            previousOperand = '';
            resetCurrentOperand = true;
        } else {
            if (typeof result === 'number') {
                result = Math.round(result * 10000000000) / 10000000000;
                if (Math.abs(result) < 1e-10) result = 0;
            }
            previousOperand = `${getOperationSymbol(op)}(${value})`;
            currentOperand = result.toString();
            operation = undefined;
            resetCurrentOperand = true;
        }
        
        updateDisplay();
    }
    
    function compute() {
        if (!operation || previousOperand === '') return;
        
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        let result;
        switch(operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = current !== 0 ? prev / current : 'Error';
                break;
            case '^':
                result = power(prev, current);
                break;
            default:
                return;
        }
        
        if (result === 'Error' || result === 'Error: неопределенность') {
            currentOperand = result;
        } else {
            result = Math.round(result * 10000000000) / 10000000000;
            if (Math.abs(result) < 1e-10) result = 0;
            currentOperand = result.toString();
        }
        
        operation = undefined;
        previousOperand = '';
        resetCurrentOperand = true;
        updateDisplay();
    }
    
    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
        resetCurrentOperand = false;
    }
    
    function deleteLast() {
        if (currentOperand === 'Error' || currentOperand === 'Error: неопределенная' || currentOperand.length === 1) {
            clear();
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
    }
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const btnText = button.textContent;
            
            if (button.classList.contains('number')) {
                appendNumber(btnText);
                updateDisplay();
                return;
            }
            
            if (button.classList.contains('operation')) {
                chooseOperation(button.dataset.operation);
                return;
            }
            
            if (button.classList.contains('equals')) {
                compute();
                updateDisplay();
                return;
            }
            
            if (button.classList.contains('clear')) {
                clear();
                updateDisplay();
                return;
            }
            
            if (button.classList.contains('delete')) {
                deleteLast();
                updateDisplay();
                return;
            }
        });
    });
    
    document.addEventListener('keydown', event => {
        event.preventDefault();
        const key = event.key;
        
        if (/^[0-9]$/.test(key)) {
            appendNumber(key);
            updateDisplay();
            return;
        }
        
        if (key === '.' || key === ',') {
            addDecimal();
            updateDisplay();
            return;
        }
        
        if (['+', '-', '*', '/'].includes(key)) {
            chooseOperation(key);
            return;
        }
        
        if (key === '^') {
            chooseOperation('^');
            return;
        }
        
        if (key === '=' || key === 'Enter') {
            compute();
            updateDisplay();
            return;
        }
        
        if (key === 'Escape' || key === 'Delete') {
            clear();
            updateDisplay();
            return;
        }
        
        if (key === 'Backspace') {
            deleteLast();
            updateDisplay();
            return;
        }
    });
    
    updateDisplay();
});