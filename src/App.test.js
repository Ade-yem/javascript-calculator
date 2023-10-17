import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';

describe('Calculator', () => {
  it('should render the calculator title', () => {
    render(<App/>);
    expect(screen.getByText('Calculator')).toBeInTheDocument();
  });

  it('should render the formula screen with an empty string', () => {
    render(<App/>);
    expect(screen.getByTestId('formula')).toHaveValue('');
  });

  it('should render the result screen with a zero', () => {
    render(<App/>);
    expect(screen.getByTestId('display')).toHaveValue('0');
  });

  it('should update the formula screen when a number is clicked', () => {
    render(<App/>);
    fireEvent.click(screen.getByTestId('one'));
    expect(screen.getByTestId('formula')).toHaveValue('1');
  });

  it('should update the formula screen when an operator is clicked', () => {
    render(<App/>);
    fireEvent.click(screen.getByTestId('add'));
    expect(screen.getByTestId('formula')).toHaveValue('+');
  });

  it('should update the result screen when an operator is clicked', () => {
    render(<App/>);
    fireEvent.click(screen.getByTestId('add'));
    expect(screen.getByTestId('display')).toHaveValue('0');
  });

  it('should update the formula screen when an equal sign is clicked', () => {
    render(<App/>);
    fireEvent.click(screen.getByTestId('one'));
    fireEvent.click(screen.getByTestId('add'));
    fireEvent.click(screen.getByTestId('two'));
    fireEvent.click(screen.getByTestId('equals'));
    expect(screen.getByTestId('formula')).toHaveValue('1+2=3');
  });

  it('should update the result screen when an equal sign is clicked', () => {
    render(<App/>);
    fireEvent.click(screen.getByTestId('one'));
    fireEvent.click(screen.getByTestId('add'));
    fireEvent.click(screen.getByTestId('two'));
    fireEvent.click(screen.getByTestId('equals'));
    expect(screen.getByTestId('display')).toHaveValue('3');
  });

  it('should handle decimal points', () => {
    render(<App/>);
    fireEvent.click(screen.getByTestId('one'));
    fireEvent.click(screen.getByTestId('decimal'));
    fireEvent.click(screen.getByTestId('two'));
    expect(screen.getByTestId('formula')).toHaveValue('1.');
    expect(screen.getByTestId('display')).toHaveValue('1.2');
  });

  it('should handle negative numbers', () => {
    render(<App/>);
    fireEvent.click(screen.getByTestId('subtract'));
    fireEvent.click(screen.getByTestId('one'));
    expect(screen.getByTestId('formula')).toHaveValue('-1');
    expect(screen.getByTestId('display')).toHaveValue('-1');
  });

  it('should handle consecutive operators', () => {
    render(<App/>);
    fireEvent.click(screen.getByTestId('one'));
    fireEvent.click(screen.getByTestId('add'));
    fireEvent.click(screen.getByTestId('two'));
    fireEvent.click(screen.getByTestId('add'));
    fireEvent.click(screen.getByTestId('three'));
    expect(screen.getByTestId('formula')).toHaveValue('1+2+3');
    expect(screen.getByTestId('display')).toHaveValue('6');
  });

  it('should handle leading zeros', () => {
    render(<App/>);
    fireEvent.click(screen.getByTestId('zero'));
    fireEvent.click(screen.getByTestId('zero'));
    fireEvent.click(screen.getByTestId('add'));
    fireEvent.click(screen.getByTestId('one'));
    expect(screen.getByTestId('formula')).toHaveValue('00+1');
    expect(screen.getByTestId('display')).toHaveValue('1');
  });

  it('should handle division by zero', () => {
    render(<App/>);
    fireEvent.click(screen.getByTestId('divide'));
    fireEvent.click(screen.getByTestId('one'));
    fireEvent.click(screen.getByTestId('equals'));
    expect(screen.getByTestId('formula')).toHaveValue('Error');
    expect(screen.getByTestId('display')).toHaveValue('Error');
  });
});
