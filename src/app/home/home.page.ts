import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonAvatar,
  IonSkeletonText, IonAlert, IonLabel, IonBadge, IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import {MovieService} from '../services/movie.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {InfiniteScrollCustomEvent} from '@ionic/angular';
import {catchError, finalize} from 'rxjs';
import {MovieResult} from '../services/interfaces';
import {DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {IMAGE_BASE_URL} from '../constants/constants';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonSkeletonText, IonAlert, IonLabel, DatePipe, RouterLink, IonBadge, IonInfiniteScroll, IonInfiniteScrollContent],
})
export class HomePage implements OnInit {
  private movieService = inject(MovieService);
  private currentPage = 1;
  public error = null;
  public isLoading = false;
  public movies: MovieResult[] = [];
  public dummyArray = new Array(5);
  public imageBaseUrl = IMAGE_BASE_URL;

  constructor(private destroy$: DestroyRef) {
  }

  public ngOnInit(): void {
    this.loadMovies();
  }

  public loadMovies(event?: InfiniteScrollCustomEvent): void {

    if (!event) {
      this.isLoading = true;
    }

    this.movieService.getTopRatedMovies(this.currentPage).pipe(
      finalize(() => {
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      }),
      catchError((error) => {
        console.log(error);
        this.error = error.error.status_message;
        return [];
      }),
      takeUntilDestroyed(this.destroy$)
    ).subscribe((res) => {
      this.movies.push(...res.results);
      if (event) {
        event.target.disabled = res.total_pages === this.currentPage;
      }
    })
  }

  public loadMore(event: InfiniteScrollCustomEvent): void {
    this.currentPage++;
    this.loadMovies(event);
  }
}
