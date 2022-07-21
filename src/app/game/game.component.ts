import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { IQuestionAnswer } from '../IQuestionAnswer';
import { IStateGame } from '../IStateGame';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

	private questionsAndAnswers: IQuestionAnswer[] = [];

	remainingAttempts: number;
	currentIndex?: number;
	question: string;
	answer: string;
	partialAnswer: string;
	inputValue: string;
	score: number;
	isOneLetter: boolean;
	isBlockInput: boolean;
	isOnGame: boolean;

	constructor(private _dataService: DataService) {
		this.remainingAttempts = 5;
		this.currentIndex = undefined;
		this.question = "";
		this.answer = "";
		this.partialAnswer = "";
		this.inputValue = "";
		this.score = 0;
		this.isOneLetter = true;
		this.isBlockInput = false;
		this.isOnGame = false;
	}

	ngOnInit(): void {
		this._dataService.getQuestionsAndAnswers().subscribe(data => this.questionsAndAnswers = data);
		this._dataService.loadStateGame()
			.subscribe(data => {
				if (Object.keys(data as Object).length !== 0)
					this.setStateGame(data);
			});
	}

	saveStateGame(): void {
		if (this.isOnGame) {
			let gameState: IStateGame = {
				question: this.question,
				answer: this.answer,
				partialAnswer: this.partialAnswer,
				score: this.score,
				isOneLetter: this.isOneLetter,
				isBlockInput: this.isBlockInput,
				isOnGame: this.isOnGame,
				remainingAttempts: this.remainingAttempts,
				currentIndex: this.currentIndex
			};

			this._dataService.saveStateGame(gameState).subscribe();
		}


	}
	setStateGame(stateGame: IStateGame): void {


		this.remainingAttempts = stateGame.remainingAttempts;
		this.currentIndex = stateGame.currentIndex;
		this.question = stateGame.question;
		this.answer = stateGame.answer;
		this.partialAnswer = stateGame.partialAnswer;
		this.score = stateGame.score;
		this.isOneLetter = stateGame.isOneLetter;
		this.isBlockInput = stateGame.isBlockInput;
		this.isOnGame = stateGame.isOnGame;

	}

	isWordOpen = () => !this.partialAnswer.includes("-");

	startGame() {
		this.setQuestionAndAnswer();
		this.isOnGame = true;
		this.inputValue = "";
		this.score = 0;
		this.isOneLetter = true;
		this.isBlockInput = false;
		this.saveStateGame();
	}

	nextWord(): void {
		this.isBlockInput = false;
		this.isOneLetter = true;
		this.setQuestionAndAnswer();
		this.saveStateGame();
	}

	resetGame(): void {
		if (this.isOnGame) {
			this.isOnGame = false;
			this._dataService.resetSatateGame().subscribe();
		}

	}

	changeInputType(): void {
		if (this.isOneLetter) {
			this.isOneLetter = false;
		}
		else {
			if (this.inputValue !== "") {
				this.inputValue = this.inputValue[0];
			}
			this.isOneLetter = true;
		}
		this.saveStateGame();
	}

	saveRecord = () => {
		let message = `Ваш результат ${this.score} баллов. Введите имя если хотите сохранить результат в таблице рекордов`;
		let name = prompt(message, '');
		if (name !== null && name !== "") {
			this._dataService.addNewRecord(name, this.score).subscribe();
		}

		this.resetGame();
	}

	onChangeInput(event: Event): void {

		let value = (event.target as HTMLInputElement).value;

		if (this.isOneLetter) {

			if (value.length > 1) {
				(event.target as HTMLInputElement).value = this.inputValue;
				return;
			}

			this.inputValue = value;
		}
		else {
			if (value.length > this.answer.length) {
				(event.target as HTMLInputElement).value = this.inputValue;
				return;
			}

			this.inputValue = value;
		}
	}

	checkWin(): void {

		if (this.inputValue === "") {
			if (this.isOneLetter)
				alert("Введите букву!");
			else
				alert("Введите слово!");
			return;
		}

		let answer = this.answer.toLowerCase();
		let partialAnswer = this.partialAnswer.toLowerCase();
		let value = this.inputValue.toLowerCase();

		if (this.isOneLetter) {

			if (partialAnswer.includes(value)) {
				alert("Такая буква уже открыта!");
				this.inputValue = "";
				return;
			}

			if (answer.includes(value)) {

				let matchesNumber = 0;
				for (let i = 0; i < answer.length; i++) {
					const letter = answer[i];
					if (value === letter) {
						partialAnswer = this.setCharAt(partialAnswer, i, value)
						++matchesNumber;
					}
				}
				let newScore = this.score + 100 * matchesNumber;
				this.partialAnswer = partialAnswer;

				if (this.isWordOpen()) {
					alert("Поздравляем, вы отгадали слово!");
					this.inputValue = "";
					this.score = newScore;
					this.isBlockInput = true;
				}
				else {
					this.inputValue = "";
					this.score = newScore;
				}
				this.saveStateGame();
			}
			else {
				this.remainingAttempts -= 1;
				if (this.remainingAttempts === 0) {
					alert(`К сожалению такой буквы нет. Это была ваша последняя попытка. Игра окончена.`);
					this.saveRecord();
					return;
				}
				else {
					alert(`К сожалению, буква не верная! Осталось попыток ${this.remainingAttempts}.`);
					this.inputValue = "";
					this.score = this.score > 50 ? this.score - 50 : this.score;
					this.saveStateGame();
				}
			}
		}
		else {
			if (answer === value) {

				this.partialAnswer = value;

				let extraScores = this.isWordOpen() ? 3000 : 1000;
				alert(`Поздравляем, вы отгадали слово! Вы получаете ${extraScores} баллов!`);

				this.inputValue = "";
				this.score = this.score + extraScores;
				this.isBlockInput = true;
				this.saveStateGame();
			}
			else {
				alert("К сожалению, ответ не верный! Вы теряете все баллы. Игра окончена.");
				this.resetGame();
			}
		}
	}

	setQuestionAndAnswer() {

		if (this.currentIndex === undefined)
			this.currentIndex = Math.floor((Math.random() * this.questionsAndAnswers.length) + 0);
		else
			this.currentIndex = this.currentIndex === this.questionsAndAnswers.length - 1 ? 0 : this.currentIndex + 1


		this.question = this.questionsAndAnswers[this.currentIndex].question;
		this.answer = this.questionsAndAnswers[this.currentIndex].answer;
		this.partialAnswer = '-'.repeat(this.questionsAndAnswers[this.currentIndex].answer.length);

	}

	setCharAt(string: string, index: number, char: string): string {
		if (index > string.length - 1)
			return string;

		return string.substring(0, index) + char + string.substring(index + 1);
	}
}
