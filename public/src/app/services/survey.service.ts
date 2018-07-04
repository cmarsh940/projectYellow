import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { HandleError, HttpErrorHandler } from "./http-error-handler.service";
import { Survey } from '../models/survey';


@Injectable({
  providedIn: "root"
})
export class SurveyService {
  API_URL = "surveys/";
  handleError: HandleError;

  constructor(private http: HttpClient) {}

  /** GET all partners */
  getSurveys(): Observable<any> {
    return this.http.get<any>(this.API_URL).pipe(
      map(res => res),
      catchError(this.handleError("getSurveys", []))
    );
  }

  /** GET single partner */
  getSurvey(surveyId: string): Observable<any> {
    return this.http.get<any>(this.API_URL).pipe(
      map(res => res),
      catchError(this.handleError("getSurvey", []))
    );
  }

  /** POST: add a new partner to the database */
  addSurvey(data): Observable<any> {
    console.log("** HIT SERVICE: addSurvey()", data);
    return this.http
      .post<any>(this.API_URL, data)
      .pipe(catchError(this.handleError("addSurvey", data)));
  }

  updateSurvey(survey: Survey): Observable<Survey> {
    // const url = `${this.API_URL}/${_id}`;
    return this.http
      .patch<Survey>(this.API_URL, survey)
      .pipe(catchError(this.handleError("updateSurvey", survey)));
  }

  /** DELETE: delete the partner from the server */
  deleteSurvey(id: number): Observable<{}> {
    console.log("** HIT SERVICE: deleteSurvey()");
    const url = `${this.API_URL}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError(this.handleError("deletePartner")));
  }
}
