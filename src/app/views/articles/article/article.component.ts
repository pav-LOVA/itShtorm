import { Component, OnInit } from '@angular/core';
import {ArticlesType, ArticleType} from "../../../../types/articles.type";
import {ArticleService} from "../../../shared/services/articles.service";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {CommentsType, CommentType} from "../../../../types/comments.type";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  isLogged: boolean = false;
  moreComments: boolean = false;
  commentText: string = '';
  // comments: CommentsType | null = null;
  allCommentsCount: number = 0;
  comments: CommentType[] = [];
  articles: ArticlesType[] = [];
  article: ArticleType | undefined;

  serverStaticPath = environment.serverStaticPath;

  constructor(private articlesService: ArticleService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.isLogged = this.authService.getLoggedIn();
    this.authService.isLogged$.subscribe(value => {
      this.isLogged = value;
    });

    this.activatedRoute.params.subscribe(params => {
      this.articlesService.getRelatedArticles(params['url'])
        .subscribe((data: ArticlesType[]) => {
          this.articles = data;
        })

      this.articlesService.getArticle(params['url'])
        .subscribe((data: ArticleType) => {
          if (data) {
            this.article = data;
            this.allCommentsCount = data.commentsCount;
            this.comments = data.comments;
            this.moreComments = this.allCommentsCount > this.comments.length;
            this.loadUserActions(this.article.id);
          }
        })
    })
  }

  loadMoreComments() {
    if (!this.article?.id) return;
    this.moreComments = false;

    this.articlesService.getComments(10, this.article.id, this.comments.length)
      .subscribe({
        next: (data: CommentsType) => {
          this.comments = [...this.comments, ...data.comments];
          this.moreComments = this.comments.length < data.allCount;
          this.loadUserActions(this.article!.id);
        },
        error: () => {
          this.moreComments = true;
        }
      });
  }

  sendComment(): void {
    if (!this.commentText.trim() || !this.article?.id) return;

    const userInfo = this.authService.getUserInfo();
    if (!userInfo) return;

    this.articlesService.sendComment(this.commentText, this.article.id)
      .subscribe({
        next: async (res) => {
          if (res.error) {
            this._snackBar.open(res.message || 'Ошибка при добавлении комментария', '', { duration: 2000 });
            return;
          }

          this.articlesService.getComments(1, this.article!.id, 0)
            .subscribe(latestData => {
              if (latestData.comments.length > 0) {
                this.comments.unshift(latestData.comments[0]);
                this.commentText = '';
                this.allCommentsCount++;
                this.moreComments = this.comments.length < this.allCommentsCount;
                this.loadUserActions(this.article!.id);
              }
            }, err => console.error(err));
        },
        error: (err) => console.error(err),
      });
  }

  loadUserActions(articleId: string) {
    this.articlesService.getUserActions(articleId)
      .subscribe(userActions => {
        this.comments.forEach(comment => {
          const reaction = userActions.find(a => a.comment === comment.id);
          comment.userAction = reaction ? reaction.action : null;
        });
      });
  }

  react(comment: CommentType, action: 'like' | 'dislike') {
    if (!this.isLogged) {
      this._snackBar.open(
        'Необходимо авторизоваться', '', { duration: 2000 });
      return;
    }

    this.articlesService.sendAction(comment.id, action)
      .subscribe(res => {
        if (res.error) return;

        if (comment.userAction === action) {
          comment.userAction = null;
          action === 'like' ? comment.likesCount-- : comment.dislikesCount--;
        } else {
          if (comment.userAction === 'like') comment.likesCount--;
          if (comment.userAction === 'dislike') comment.dislikesCount--;

          comment.userAction = action;
          action === 'like' ? comment.likesCount++ : comment.dislikesCount++;
        }
        this._snackBar.open('Ваш голос учтен', '', { duration: 2000 });
      });
  }

  violate(comment: CommentType) {
    if (!this.isLogged) {
      this._snackBar.open(
        'Необходимо авторизоваться', '', { duration: 2000 });
      return;
    }

    this.articlesService.sendAction(comment.id, 'violate')
      .subscribe({
        next: (res) => {
          this._snackBar.open('Жалоба отправлена', '', { duration: 2000 });
        },
        error: (err) => {
          this._snackBar.open('Жалоба уже отправлена', '', { duration: 2000 });
        }
      });
  }

}

