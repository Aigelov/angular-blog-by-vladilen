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

  url = `${environment.firebaseDBUrl}/posts.json`;

  constructor(
    private http: HttpClient
  ) {}

  create(post: Post): Observable<Post> {
    return this.http.post(this.url, post).pipe(
      map((response: FbCreateResponse) => {
        return {
          ...post,
          id: response.name,
          date: new Date(post.date)
        };
      })
    )
  }
}
