import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IQuestionAnswer } from './IQuestionAnswer';
import { IRecord } from './IRecord';
import { IStateGame } from './IStateGame';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private _question_url: string = "./assets/data/data.json";

  constructor(private _client: HttpClient) { }

  getQuestionsAndAnswers(): Observable<IQuestionAnswer[]> {

    return this._client.get<IQuestionAnswer[]>(this._question_url);
  }

  getRecords(): Observable<IRecord[]> {
    return this._client.get<IRecord[]>("/assets/php_scripts/get_records.php");
  }

  addNewRecord(name: string, score: number): Observable<Object> {
    return this._client.post("/assets/php_scripts/add_new_records.php",
      {
        name: name,
        score: score
      }
    );
  }

  loadStateGame(): Observable<IStateGame> {

    return this._client.get<IStateGame>(
      "/assets/php_scripts/load_state_game.php",
      { withCredentials: true }
    );
  }

  saveStateGame(stateGame: IStateGame): Observable<Object> {
    return this._client.post("/assets/php_scripts/save_state_game.php",
      stateGame,
      { withCredentials: true }
    );
  }

  resetSatateGame(): Observable<Object> {
    return this._client.get(
      "/assets/php_scripts/reset_state_game.php",
      { withCredentials: true }
    );
  }
}
