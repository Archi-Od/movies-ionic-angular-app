import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {ApiResult, MovieResult} from './interfaces';
import {BASE_URL} from '../constants/constants';

const API_KEY  = environment.apiKey

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private http = inject(HttpClient)
  constructor() { }

  public getTopRatedMovies(page = 1): Observable<ApiResult> {
    return this.http.get<ApiResult>(`${BASE_URL}/movie/popular?page=${page}&api_key=${API_KEY}`);
  }

  public getMovieDetails(id: string): Observable<MovieResult> {
    return this.http.get<MovieResult>(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  }
}
