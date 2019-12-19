import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators';

import { FbCreateResponse, Post } from './interfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  url = `${environment.firebaseDBUrl}/posts`;

  constructor(
    private http: HttpClient
  ) {}

  create(post: Post): Observable<Post> {
    return this.http.post(`${this.url}.json`, post).pipe(
      map((response: FbCreateResponse) => {
        return {
          ...post,
          id: response.name,
          date: new Date(post.date)
        };
      })
    )
  }

  getAll():Observable<Post[]> {
    return this.http.get(`${this.url}.json`).pipe(
      map((response: {[key: string]: any}) => {
        return Object
          .keys(response)
          .map(key => ({
            ...response[key],
            id: key,
            date: new Date(response[key].date)
          }));
      })
    );
  }

  getById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.url}/${id}.json`).pipe(
      map((post: Post) => {
        return {
          ...post,
          id,
          date: new Date(post.date)
        };
      })
    );
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}.json`);
  }

  update(post: Post): Observable<Post> {
    return this.http.patch<Post>(`${this.url}/${post.id}.json`, post);
  }
}
