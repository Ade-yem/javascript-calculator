import React from 'react';
import './App.scss';
import { evaluate } from 'mathjs';

class App extends React.Component {

render(){
  return <Calculator />;
}  
}
export default App;

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expression: "",
      result: "",
    };
    this.maxDigitWarning = this.maxDigitWarning.bind(this);
    this.initialize = this.initialize.bind(this);
    this.delete = this.delete.bind(this);
    this.getResult = this.getResult.bind(this)
    this.handleOperators = this.handleOperators.bind(this)
    this.handleEqualClick = this.handleEqualClick.bind(this)
    this.handleNumberClick = this.handleNumberClick.bind(this)
    this.handleDecimal = this.handleDecimal.bind(this)
  }

  maxDigitWarning() {
    if (this.state.expression.length > 100) {
      this.setState({
        currentVal: "Digit Limit Met",
        prevVal: this.state.currentVal,
      });
      setTimeout(() => this.setState({ currentVal: this.state.prevVal }), 1000);
    } else {
      return this.state.currentVal;
    }
  }

  initialize() {
    this.setState({
      expression: "",
      result: "0",
    });
  }

  delete () {
    var str = this.state.expression;
    var stri = str.substr(0, str.length - 1);
    this.setState({ expression: stri });
    }

  handleEqualClick (e) {
    let clicked = e.target.value
    let expression = this.state.expression
    if (expression.match('=')) {
      return;
    }
    let result = this.getResult()
    expression = expression + clicked + result
    
    this.setState({
      result: result,
      expression: expression
    })

  }

  handleNumberClick(e) {
    let clickedValue = e.target.value;
    let currentExpression = this.state.expression;
    let currentResult = this.state.result;
    let lastChar = currentExpression.slice(-1);
    if (currentExpression.match('=')) {
      currentExpression = '';
    }
    // Handle leading zeros when adding a number
    if (clickedValue.match(/[0-9]/)) {
      // Remove leading zeros from the current expression
      if (currentExpression === '0') {
        currentExpression = clickedValue;
      } else {
        // Remove leading zeros from the current expression
        currentExpression = currentExpression.replace(/^0+(?=\d)/, '');
        currentExpression += clickedValue;
      }
      if (currentResult === '0') {
        currentResult = clickedValue;
      } else {
        // Remove leading zeros from the current expression
        currentResult = currentResult.replace(/^0+(?=\d)/, '');
        currentResult += clickedValue;
      }
      if (currentResult.match(/[/*+-]/)) {
        currentResult = clickedValue;
      }
    } else {
      // Handle leading zeros after an operator (e.g., " + 0" should become " + ")
      if (lastChar.match(/[/*+-]/)) {
        // Remove leading zeros after operators
        currentExpression = currentExpression.replace(/[/*+-]0+(?=\d)/g, '');
      }
    }
    this.setState({
      expression: currentExpression,
      result: currentResult
    });
  }

  handleDecimal (e) {
    // Handle decimal point
    let clickedValue = e.target.value;
    let currentExpression = this.state.expression;
    if (currentExpression.match('=')) {
      currentExpression = '';
    }

    if (clickedValue === '.') {
      // Check if the current number already contains a dot
      const lastNumber = currentExpression.split(/[/*+-]/).slice(-1)[0];
      if (!lastNumber.includes('.')) {
        // If no dot is present, append the dot to the current number
        currentExpression += clickedValue;
      }
    } else {
      // Update the expression by appending the clicked value
      currentExpression += clickedValue;
    }
    let res = this.state.result
    this.setState({
      expression: currentExpression,
      result: res.split(/[/*+-]/).slice(-1)[0].includes('.') ? res : res + clickedValue
    });
  }

  handleOperators (e) {
    // Handle consecutive operators, excluding negative sign
    const clickedValue = e.target.value
    let currentExpression = this.state.expression
    if (currentExpression.match('=')) {
      currentExpression = this.state.result;
    }
    let lastChar = currentExpression.slice(-1);
    let secChar = currentExpression.slice(-2, -1);
    const isOperator = ['+', '-', '*', '/'].includes(clickedValue);
    const isLastCharOperator = ['+', '-', '*', '/'].includes(lastChar);
    const issecCharOperator = ['+', '-', '*', '/'].includes(secChar);

    // Handle first zero
    if (currentExpression === '0') currentExpression = clickedValue;

    // Handle negative sign separately as it can appear at the beginning of an expression
    if (isOperator && isLastCharOperator && issecCharOperator && clickedValue !== '-') {
      // Update the expression by appending the clicked value
      
      currentExpression = currentExpression.slice(0, -2);
      currentExpression += clickedValue;
    }
    else if (isOperator && isLastCharOperator && clickedValue !== '-') {
      // Replace the last operator with the clicked operator
      currentExpression = currentExpression.slice(0, -1);
      currentExpression += clickedValue;
    } 
    else if (isOperator && clickedValue === '-' && !isLastCharOperator) {
      // Handle negative sign at the beginning of an expression
      currentExpression += clickedValue;
    } else {
      // Update the expression by appending the clicked value
      currentExpression += clickedValue;
    }
    this.setState({
      expression: currentExpression,
      result: clickedValue
    });

  }
      
  getResult () {
    try {
    let result = evaluate(this.state.expression)
    // const res = result.toString().split('.');
    // if (res.length > 1 && res[1].length > 4) {
    return result.toString()
    // }
    // else return result.toString()
  } catch(err) {
    return 'Error'
  }
  }

  render() {
    return (
      <div className='calculator'>
        <CalculatorTitle value={<h1>Calculator</h1>} />
        <div>
          <FormulaScreen expression={this.state.expression} />
          <ResultScreen result={this.state.result} />
        </div>
        <Buttons
          initialize={this.initialize}
          delete={this.delete}
          handleDecimal={this.handleDecimal}
          handleNumberClick={this.handleNumberClick}
          handleOperators={this.handleOperators}
          handleEqualClick={this.handleEqualClick}
        />
      </div>
    );
  }
}

const CalculatorTitle = (props) => {
  return <div className="calculator-title">{props.value}</div>;
};


const FormulaScreen = (props) => {
  return (
    <div>
      <input
        type="text"
        className="calculator-screen"
        id="formula"
        value={props.expression}
        readOnly
      />
    </div>
  );
}



const ResultScreen = (props) => {
  return (
    <div>
      <input
        type="text"
        className="result-screen"
        id="display"
        value={props.result}
        readOnly
      />
    </div>
  );
}
class Buttons extends React.Component {
  render() {
    return (
      <div className='buttons'>
        <button
          className="jumbo"
          id="clear"
          onClick={this.props.initialize}
          value="AC"
        >
          AC
        </button>
        <button
          id="divide"
          onClick={this.props.handleOperators}
          value="/"
        >
          /
        </button>
        <button
          id="multiply"
          onClick={this.props.handleOperators}
          value="*"
        >
          x
        </button>
        <button
          id="delete"
          onClick={this.props.delete}
          value="delete"
        >
          <i className="fa fa-backward" aria-hidden="true"></i>
        </button>
        <button 
        id="seven" 
        onClick={this.props.handleNumberClick} 
        value="7">
          7
        </button>
        <button 
        id="eight" 
        onClick={this.props.handleNumberClick} 
        value="8">
          8
        </button>
        <button id="nine" 
        onClick={this.props.handleNumberClick} 
        value="9">
          9
        </button>
        <button
          id="subtract"
          onClick={this.props.handleOperators}
          value="-"
        >
          -
        </button>
        <button id="four" 
        onClick={this.props.handleNumberClick} 
        value="4">
          4
        </button>
        <button id="five" 
        onClick={this.props.handleNumberClick} 
        value="5">
          5
        </button>
        <button id="six" 
        onClick={this.props.handleNumberClick} 
        value="6">
          6
        </button>
        <button
          id="add"
          onClick={this.props.handleOperators}
          value="+"
        >
          +
        </button>
        <button id="one" 
        onClick={this.props.handleNumberClick} 
        value="1">
          1
        </button>
        <button id="two" 
        onClick={this.props.handleNumberClick} 
        value="2">
          2
        </button>
        <button id="three" 
        onClick={this.props.handleNumberClick} 
        value="3">
          3
        </button>
        <button
          className="jumbo"
          id="zero"
          onClick={this.props.handleNumberClick}
          value="0"
        >
          0
        </button>
        <button id="decimal" 
        onClick={this.props.handleDecimal} 
        value=".">
          .
        </button>
        <button
          id="equals"
          onClick={this.props.handleEqualClick}
          value="="
        >
          =
        </button>
      </div>
    );
  }
}
