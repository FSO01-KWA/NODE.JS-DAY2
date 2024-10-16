// 1. 할 일 추가
const inquirer = require('inquirer');
const { saveTodos, loadTodos } = require('../utils/fileHandler');
const { v4: uuidv4 } = require('uuid');
const chalk = require('chalk');

async function addTodo() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: '할 일의 제목을 입력하세요:',
      validate: input => input ? true : '제목을 입력해야 합니다.'
    },
    {
      type: 'input',
      name: 'description',
      message: '할 일의 설명을 입력하세요 (선택 사항):'
    }
  ]);

  const todos = await loadTodos();
  todos.push({
    id: uuidv4(),
    title: answers.title,
    description: answers.description || '',
    completed: false
  });

  await saveTodos(todos);
  console.log(chalk.green('할 일이 성공적으로 추가되었습니다!'));
}

module.exports = addTodo;

// 2. 할 일 목록 조회
const { loadTodos } = require('../utils/fileHandler');
const { displayTodos } = require('../utils/formatter');

async function listTodos() {
  const todos = await loadTodos();
  displayTodos(todos);
}

module.exports = listTodos;

// 3. 할 일 삭제
const inquirer = require('inquirer');
const { saveTodos, loadTodos } = require('../utils/fileHandler');
const chalk = require('chalk');

async function deleteTodo() {
  const todos = await loadTodos();

  if (todos.length === 0) {
    console.log(chalk.yellow('삭제할 할 일이 없습니다.'));
    return;
  }

  const choices = todos.map(todo => ({
    name: `${todo.title} (${todo.completed ? '완료' : '미완료'})`,
    value: todo.id
  }));

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: '삭제할 할 일을 선택하세요:',
      choices
    }
  ]);

  const updatedTodos = todos.filter(todo => todo.id !== answers.id);
  await saveTodos(updatedTodos);
  console.log(chalk.green('할 일이 성공적으로 삭제되었습니다!'));
}

module.exports = deleteTodo;

// 4. 할 일 완료 표시
const inquirer = require('inquirer');
const { saveTodos, loadTodos } = require('../utils/fileHandler');
const chalk = require('chalk');

async function completeTodo() {
  const todos = await loadTodos();

  const incompleteTodos = todos.filter(todo => !todo.completed);

  if (incompleteTodos.length === 0) {
    console.log(chalk.yellow('완료할 할 일이 없습니다.'));
    return;
  }

  const choices = incompleteTodos.map(todo => ({
    name: todo.title,
    value: todo.id
  }));

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: '완료할 할 일을 선택하세요:',
      choices
    }
  ]);

  const updatedTodos = todos.map(todo => {
    if (todo.id === answers.id) {
      return { ...todo, completed: true };
    }
    return todo;
  });

  await saveTodos(updatedTodos);
  console.log(chalk.green('할 일이 완료 상태로 표시되었습니다!'));
}

module.exports = completeTodo;

// 5. 할 일 검색
const inquirer = require('inquirer');
const { loadTodos } = require('../utils/fileHandler');
const { displayTodos } = require('../utils/formatter');
const _ = require('lodash');

async function searchTodo() {
  const todos = await loadTodos();

  if (todos.length === 0) {
    console.log(chalk.yellow('검색할 할 일이 없습니다.'));
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'keyword',
      message: '검색할 키워드를 입력하세요:',
      validate: input => input ? true : '키워드를 입력해야 합니다.'
    }
  ]);

  const keyword = answers.keyword.toLowerCase();
  const filteredTodos = _.filter(todos, todo =>
    todo.title.toLowerCase().includes(keyword) ||
    todo.description.toLowerCase().includes(keyword)
  );

  if (filteredTodos.length === 0) {
    console.log(chalk.red('일치하는 할 일을 찾을 수 없습니다.'));
  } else {
    displayTodos(filteredTodos);
  }
}

module.exports = searchTodo;
