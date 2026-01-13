import { Component, OnInit, HostListener } from '@angular/core';
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryType} from "../../../../types/categories.type";
import {ArticleService} from "../../../shared/services/articles.service";
import {ArticlesType} from "../../../../types/articles.type";
import {environment} from "../../../../environments/environment";
import {ActiveParamsUtil} from "../../../shared/directives/utils/active-params.util";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  serverStaticPath = environment.serverStaticPath;
  articles: ArticlesType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];
  sortingOpen: boolean = false;
  sortingOptions: CategoryType[] = [];
  pages: number[] = [];

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private articlesService: ArticleService,
  ) { }

  ngOnInit(): void {
    this.articlesService.getCategories()
      .subscribe((data: CategoryType[]) => {
        if (data) {
          this.sortingOptions = data;
          this.loadArticles();
        }
      })
  }

  loadArticles() {
    this.activatedRoute.queryParams
      .subscribe(params => {
      this.activeParams = ActiveParamsUtil.processParams(params);
      this.appliedFilters = this.activeParams.categories
        .map(url => this.sortingOptions.find(option => option.url === url))
        .map(option => ({
          name: option!.name,
          urlParam: option!.url
        }));
      this.articlesService.getArticles(this.activeParams)
        .subscribe(data => {this.pages = [];
          for (let i = 1; i <= data.pages; i++) {
            this.pages.push(i);
          }
            this.articles = data.items;
        })
    });
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.urlParam);
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  toggleSorting(event: Event) {
    event.stopPropagation();
    this.sortingOpen = !this.sortingOpen;
  }

  filter(value: string) {
    const exists = this.activeParams.categories.includes(value);
    this.activeParams.categories = exists
      ? this.activeParams.categories.filter(url => url !== value)
      : [...this.activeParams.categories, value];
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  filterActive(value: string): boolean {
    return this.activeParams.categories.includes(value);
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

  openNextPage() {
    if (!this.activeParams.page) {
      this.activeParams.page = 1;
    }

    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.sortingOpen && (event.target as HTMLElement).className.indexOf('blog-sorting') === -1) {
      this.sortingOpen = false;
    }
  }


  // @HostListener('document:click', ['$event'])
  // clickOutside(event: Event) {
  //   const target = event.target as HTMLElement;
  //   if (this.sortingOpen && !target.closest('.blog-sorting')) {
  //     this.sortingOpen = false;
  //   }
  // }

}
