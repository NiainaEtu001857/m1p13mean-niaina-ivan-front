import { Component, signal, AfterViewInit, Renderer2, RendererFactory2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommandesAjoutComponent } from './page/boutiques/commandes-boutique/commandes-ajout/commandes-ajout.component';
import { FormsModule } from '@angular/forms';
declare var initSlider: any;
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements AfterViewInit {
  protected readonly title = signal('E-commerce-front');

  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  ngAfterViewInit() {
    this.loadScript('assets/js/vendor.bundle.js');
    this.loadScript('assets/js/theme.bundle.js');
  }

  private loadScript(src: string) {
    const script = this.renderer.createElement('script');
    script.src = src;
    script.onload = () => console.log(`${src} chargé !`);
    script.onerror = () => console.error(`Erreur lors du chargement de ${src}`);
    this.renderer.appendChild(document.body, script);
  }
}

