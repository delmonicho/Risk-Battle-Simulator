import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {
  people$: Observable<any>;
  // static non observable array, when click on a person => push to array and display on right
  // select person, move to right list
  selectedPeople: object[] = [];
  selectedMen: object[] = [];
  selectedWomen: object[] = [];

  // make left list items of people clickable
  // on click,
    // remove person from left list and push them to local array on right list

  // use colormind api to color the template page
  // then import an svg and change the svg colors based on the returned colorMind template

  constructor( private http: HttpClient ) { }

  ngOnInit(): void {
    this.people$ = this.http.get<any>('https://randomuser.me/api/?results=500').pipe(
      filter(p => !!p),
      map((res: any) => {
        return res.results;
      }),
      map((people) => {
        return {
          men: people.filter(p => p.gender === 'male'),
          women: people.filter(p => p.gender === 'female')
        };
      }),
      tap( p => console.log(p)),
      catchError(error => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  onClick( person: object ): void {
    console.log(person);
    this.selectedPeople.push(person);
    // delete person from this.people$ here
  }

  // inject ngrx store

  // personSelected(): void {
  //   this.personWasSelected.emit(person);
  // }


}
