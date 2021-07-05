import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {DOCUMENT, ViewportScroller} from "@angular/common";

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss']
})
export class ScrollToTopComponent implements OnInit {
  windowScrolled = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private scroll: ViewportScroller) {
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    }
    else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
    }
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0,0]);
  }

  ngOnInit() {}
}
