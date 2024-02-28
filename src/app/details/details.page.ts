import {Component, DestroyRef, inject, Input, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MovieService} from '../services/movie.service';
import {IMAGE_BASE_URL} from '../constants/constants';
import {MovieResult} from '../services/interfaces';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {addIcons} from 'ionicons';
import {calendarOutline, cashOutline} from 'ionicons/icons';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DetailsPage implements OnInit {

  public imageBaseUrl = IMAGE_BASE_URL;
  public movie: WritableSignal<MovieResult | null> = signal(null);

  private movieService = inject(MovieService);

  @Input() set id(movieId: string) {
    this.movieService.getMovieDetails(movieId).pipe(
      takeUntilDestroyed(this.destroy$)
    ).subscribe((movie) => {
      console.log(movie)
      this.movie.set(movie)
    })
  }


  constructor(private destroy$: DestroyRef) {
    addIcons({cashOutline, calendarOutline})
  }

  public ngOnInit(): void {

  }

}
