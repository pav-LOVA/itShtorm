import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticlesType} from "../../../types/articles.type";
import {ArticleService} from "../../shared/services/articles.service";
import {environment} from "../../../environments/environment";
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {CategoryType} from "../../../types/categories.type";
import { CarouselComponent } from 'ngx-owl-carousel-o';
import {ActivatedRoute} from "@angular/router";
import {ScrollService} from "../../shared/services/scroll.service";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  banners: {
    title: string,
    whiteText: string,
    blueText: string,
    sign?: string,
    text?: string,
    image: string,
    value: string,
  }[] = [
    {
      title: 'Предложение месяца',
      whiteText: 'Продвижение в Instagram для вашего бизнеса ',
      blueText: '-15%',
      sign: '!',
      image: 'banner1.jpg',
      value: 'Таргет',
    },
    {
      title: 'Акция',
      whiteText: 'Нужен грамотный ',
      blueText: 'копирайтер',
      sign: '?',
      text: 'Весь декабрь у нас действует акция на работу копирайтера.',
      image: 'banner2.jpg',
      value: 'Копирайтинг',
    },
    {
      title: 'Новость дня',
      blueText: 'в ТОП-10 SMM-агенств Москвы!',
      whiteText: '6 место ',
      text: 'Мы благодарим каждого, кто голосовал за нас!',
      image: 'banner3.jpg',
      value: 'SMM',
    },
  ]

  services = [
    {
      image: 'image1.png',
      title: 'Создание сайтов',
      text: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 'От 7 500₽',
      value: 'Фриланс',
    },
    {
      image: 'image2.png',
      title: 'Продвижение',
      text: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 'От 3 500₽',
      value: 'SMM',
    },
    {
      image: 'image3.png',
      title: 'Реклама',
      text: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 'От 1 000₽',
      value: 'Таргет',
    },
    {
      image: 'image4.png',
      title: 'Копирайтинг',
      text: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 'От 750₽',
      value: 'Копирайтинг',
    },
  ]
  info = [
    {
      number: 1,
      title: 'Мастерски вовлекаем аудиториюв процесс.',
      text: 'Мы увеличиваем процент вовлечённости за короткий промежуток времени.',
    },
    {
      number: 2,
      title: 'Разрабатываем бомбическую визуальную концепцию.',
      text: ' Наши специалисты знают как создать уникальный образ вашего проекта.',
    },
    {
      number: 3,
      title: 'Создаём мощные воронки с помощью текстов.',
      text: 'Наши копирайтеры создают не только вкусные текста, но и классные воронки.',
    },
    {
      number: 4,
      title: 'Помогаем продавать больше.',
      text: 'Мы не только помогаем разработать стратегию по продажам, но также корректируем её под нужды заказчика.',
    },
  ]
  reviews = [
    {
      name: 'Станислав',
      image: 'image1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.',
    },
    {
      name: 'Алёна',
      image: 'image2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
    },
    {
      name: 'Мария',
      image: 'image3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
    },
    {
      name: 'Дмитрий',
      image: 'image4.png',
      text: 'Долго искал команду, которая сможет грамотно выстроить продвижение в социальных сетях. АйтиШторм приятно удивил профессиональным подходом и результатами уже в первый месяц работы.',
    },
    {
      name: 'Екатерина',
      image: 'image5.png',
      text: 'Очень нравится подача материалов в блоге АйтиШторма — всё чётко, по делу и без воды. Читаю статьи регулярно и всегда нахожу что-то новое и полезное для себя.',
    },
    {
      name: 'Артём',
      image: 'image6.png',
      text: 'Начинал с нуля и совершенно не понимал, как работает SMM. Благодаря статьям и советам АйтиШторма удалось структурировать знания и начать применять их на практике.',
    },
    {
      name: 'Ольга',
      image: 'image7.png',
      text: 'Заказывали комплексное продвижение для проекта. Результат превзошёл ожидания — вырос охват, активность и доверие аудитории. Спасибо команде АйтиШторм!',
    },
  ]

  @ViewChild('carousel', { static: false })
  carousel!: CarouselComponent;

  next() {
    this.carousel.next();
  }

  prev() {
    this.carousel.prev();
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false,
    autoplay: true,
    autoplayTimeout: 5000,
  }

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false,
  }

  articles: ArticlesType[] = [];
  categories: CategoryType[] = [];

  isSubmitted: boolean = false;
  popupVisible: boolean = false;
  serverError: boolean = false;
  dropdownOpen: boolean = false;
  selectedOption: string | null = null;

  serverStaticPath = environment.serverStaticPath;

  consultationForm = this.fb.group({
    service: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', [Validators.required,]],
  });

  constructor(private articlesService: ArticleService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private scrollService: ScrollService,
              private fb: FormBuilder,) {
  }

  ngOnInit() {
    this.scrollService.scroll$.subscribe(fragment => {
      setTimeout(() => {
        const el = document.getElementById(fragment);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    });

    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const el = document.getElementById(fragment);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    });

    this.loadCategories();
    this.articlesService.getPopularArticles()
      .subscribe((data: ArticlesType[]) => {
        this.articles = data;
      })
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(value: string, event: Event) {
    event.stopPropagation();
    this.selectedOption = value;
    this.consultationForm.get('service')?.setValue(value);
    this.dropdownOpen = false;
  }

  openPopup(serviceValue?: string): void {
    this.popupVisible = true;
    this.isSubmitted = false;
    this.serverError = false;

    if (serviceValue) {
      this.consultationForm.get('service')?.setValue(serviceValue);
      this.selectedOption = serviceValue;
    } else {
      this.consultationForm.get('service')?.setValue('');
      this.selectedOption = null;
    }
  }

  closePopup() {
    this.popupVisible = false;
  }

  loadCategories(): void {
    this.articlesService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }

  submitForm(): void {
    this.serverError = false;
    if (this.consultationForm.valid) {
      const {name, phone, service} = this.consultationForm.value;
      if (name && phone && service) {
        this.userService.sendRequests(name, phone, service, 'order').subscribe({
          next: (res) => {
            this.isSubmitted = true;
          },
          error: (err) => {
            console.error(err);
            this.serverError = true;
          }
        });
      } else {
        this.consultationForm.markAllAsTouched();
      }
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select')) {
      this.dropdownOpen = false;
    }
  }

}


