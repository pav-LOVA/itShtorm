import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {ArticlesType, ArticleType} from "../../../types/articles.type";
import {CategoryType} from "../../../types/categories.type";
import {ActiveParamsType} from "../../../types/active-params.type";
import {CommentsType} from "../../../types/comments.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getCategories():Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(environment.api+ 'categories');
  }

  getPopularArticles():Observable<ArticlesType[]> {
    return this.http.get<ArticlesType[]>(environment.api+ 'articles/top');
  }

  getArticles(params: ActiveParamsType):Observable<{ count: number, pages: number, items: ArticlesType[] }> {
    return this.http.get<{ count: number, pages: number, items: ArticlesType[] }> (environment.api+ 'articles', {
      params: params,
    });
  }

  getRelatedArticles(url: string):Observable<ArticlesType[]> {
    return this.http.get<ArticlesType[]> (environment.api+ 'articles/related/' + url);
  }

  getArticle(url: string):Observable<ArticleType> {
    return this.http.get<ArticleType> (environment.api+ 'articles/' + url);
  }

  getComments(limit: number = 3, article: string, offset: number = 0): Observable<CommentsType> {
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString())
      .set('article', article);

    return this.http.get<CommentsType>(environment.api + 'comments', { params });
  }

  sendComment(text:string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType> (environment.api+ 'comments', { text, article });
  }

  sendAction(commentId: string, action: 'like' | 'dislike' | 'violate'): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(`${environment.api}comments/${commentId}/apply-action`, { action });
  }

  getCommentActions(commentId: string): Observable<{ comment: string, action: 'like' | 'dislike' | null }> {
    return this.http.get<{ comment: string, action: 'like' | 'dislike' | null }>(`${environment.api}comments/${commentId}/actions`);
  }

  getUserActions(articleId: string): Observable<{ comment: string, action: 'like' | 'dislike' | null }[]> {
    return this.http.get<{ comment: string, action: 'like' | 'dislike' | null }[]>(`${environment.api}comments/article-comment-actions?articleId=${articleId}`);
  }

}
